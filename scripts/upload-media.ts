import { readFileSync, readdirSync, statSync, existsSync } from "fs";
import { join, relative, resolve } from "path";
import { MEDIA_BUCKET, getMimeType } from "@/lib/media";
import { getSupabaseAdmin, getSupabaseUrl, isSupabaseConfigured } from "@/lib/supabase";

const MEDIA_EXT = /\.(jpe?g|png|webp|gif|avif|pdf)$/i;

function walkFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkFiles(full));
    } else if (MEDIA_EXT.test(entry)) {
      files.push(full);
    }
  }
  return files;
}

/**
 * Upload local seed media to Supabase Storage bucket `media`.
 * Sources (in order):
 *   1. scripts/.media-cache/images/** and downloads/**
 *   2. D:/zeel/proj/packnix/seeds/media/**
 *   3. public/images/** and public/downloads/** (legacy, if present)
 */
export async function uploadSeedMediaToCloud(): Promise<number> {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    throw new Error("Supabase not configured — cannot upload media");
  }

  const root = process.cwd();
  const sources = [
    join(root, "scripts", ".media-cache"),
    join(root, "..", "packnix", "seeds", "media"),
    join(root, "public"),
  ];

  const seen = new Set<string>();
  const toUpload: { localPath: string; storagePath: string }[] = [];

  for (const source of sources) {
    if (!existsSync(source)) continue;
    for (const file of walkFiles(source)) {
      const rel = relative(source, file).replace(/\\/g, "/");
      let storagePath = rel;

      // public/images/x → images/x ; public/downloads/x → downloads/x
      if (storagePath.startsWith("images/") || storagePath.startsWith("downloads/")) {
        // already correct under .media-cache or packnix seeds/media
      } else if (rel.startsWith("images/") || rel.startsWith("downloads/")) {
        storagePath = rel;
      } else {
        continue;
      }

      if (seen.has(storagePath)) continue;
      seen.add(storagePath);
      toUpload.push({ localPath: file, storagePath });
    }
  }

  if (toUpload.length === 0) {
    console.warn("No media files found. Run: npm run media:download");
    return 0;
  }

  let uploaded = 0;
  for (const { localPath, storagePath } of toUpload) {
    const buffer = readFileSync(localPath);
    const mime = getMimeType(localPath);
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(storagePath, buffer, {
      contentType: mime,
      upsert: true,
    });
    if (error) {
      throw new Error(`Upload failed for ${storagePath}: ${error.message}`);
    }
    uploaded++;
    console.log(`  ✓ ${storagePath}`);
  }

  return uploaded;
}

export function getStorageSetupHint(): string {
  const ref = getSupabaseUrl()?.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] ?? "_";
  return `https://supabase.com/dashboard/project/${ref}/storage/buckets`;
}

export async function ensureStorageBucket(): Promise<void> {
  if (!isSupabaseConfigured()) return;
  const supabase = getSupabaseAdmin()!;
  const { error } = await supabase.storage.getBucket(MEDIA_BUCKET);
  if (!error) return;

  console.error("\n❌ Supabase Storage bucket 'media' not found.\n");
  console.error(`Create a public bucket named "media" in: ${getStorageSetupHint()}`);
  console.error("Or run supabase/storage.sql in the SQL editor.\n");
  process.exit(1);
}
