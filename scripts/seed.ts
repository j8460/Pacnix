import { readFileSync, existsSync, copyFileSync, mkdirSync } from "fs";
import { resolve, join, dirname } from "path";
import { seedAllTables } from "@/lib/db";
import { getSupabaseAdmin, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase";
import { ensureStorageBucket, uploadSeedMediaToCloud } from "./upload-media";

function loadEnvFile(filename: string) {
  const filePath = resolve(process.cwd(), filename);
  if (!existsSync(filePath)) return;
  const content = readFileSync(filePath, "utf8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const TABLES = [
  "site_settings",
  "company",
  "quality",
  "product_categories",
  "products",
  "industries",
  "infrastructure_sections",
  "gallery_items",
  "certificates",
  "downloads",
  "blog_posts",
  "careers",
  "testimonials",
  "faqs",
];

function projectSqlEditorUrl(): string {
  const url = getSupabaseUrl() ?? "";
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  const ref = match?.[1] ?? "_";
  return `https://supabase.com/dashboard/project/${ref}/sql/new`;
}

function isMissingTableError(message: string): boolean {
  return (
    message.includes("Could not find the table") ||
    message.includes("PGRST205") ||
    message.includes("relation") && message.includes("does not exist")
  );
}

async function verifySchema(): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from("site_settings").select("id").limit(1);

  if (error && isMissingTableError(error.message)) {
    console.error("\n❌ Database tables not found.\n");
    console.error("Run the schema SQL in Supabase before seeding:\n");
    console.error(`  1. Open: ${projectSqlEditorUrl()}`);
    console.error("  2. Paste the contents of: supabase/schema.sql");
    console.error('  3. Click "Run"');
    console.error("  4. Re-run: npm run db:seed\n");
    process.exit(1);
  }

  if (error) {
    throw new Error(error.message);
  }
}

async function copyPacknixDownloads() {
  const src = resolve("D:/zeel/proj/packnix/seeds/media/downloads");
  const dest = resolve("scripts/.media-cache/downloads");
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  const { readdirSync } = await import("fs");
  for (const file of readdirSync(src)) {
    if (file.endsWith(".pdf")) {
      copyFileSync(join(src, file), join(dest, file));
    }
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  if (!isSupabaseConfigured()) {
    console.error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY."
    );
    process.exit(1);
  }

  console.log("Checking database schema...");
  await verifySchema();

  await copyPacknixDownloads();
  await ensureStorageBucket();

  console.log("Uploading media to Supabase Storage...");
  const count = await uploadSeedMediaToCloud();
  console.log(`  ${count} file(s) in cloud storage\n`);

  console.log(`Seeding ${TABLES.length} tables from seed.json...\n`);

  try {
    await seedAllTables();
    for (const table of TABLES) {
      console.log(`  ✓ ${table}`);
    }
    console.log("\nSeed completed successfully.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);

    if (isMissingTableError(message)) {
      console.error("\n❌ Database tables not found.\n");
      console.error(`Run supabase/schema.sql in: ${projectSqlEditorUrl()}\n`);
    } else {
      console.error(`\nSeed failed: ${message}`);
    }
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
