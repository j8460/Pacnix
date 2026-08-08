/** Upload local seed media cache to Supabase Storage */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { uploadSeedMediaToCloud, ensureStorageBucket } from "./upload-media";

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
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvFile(".env.local");
  loadEnvFile(".env");

  await ensureStorageBucket();
  console.log("Uploading to Supabase Storage bucket 'media'...\n");
  const count = await uploadSeedMediaToCloud();
  console.log(`\nDone — ${count} file(s) uploaded.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
