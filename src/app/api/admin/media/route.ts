import { NextResponse } from "next/server";
import { getAllContentForReferenceCheck } from "@/lib/cms";
import { getMediaPublicUrl, isAllowedMediaPath, MEDIA_BUCKET } from "@/lib/media";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MEDIA_FOLDERS } from "@/lib/types";
const MAX_FILE_SIZE = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);

type MediaItem = {
  name: string;
  path: string;
  folder: string;
  size: number;
  updatedAt: string;
  publicUrl: string;
};

function getPublicUrl(path: string): string {
  return getMediaPublicUrl(path);
}

function isAllowedFolder(folder: string): boolean {
  return (MEDIA_FOLDERS as readonly string[]).includes(folder);
}

function isMediaReferenced(path: string, content: unknown[]): boolean {
  const needle = path.replace(/^\//, "");
  const json = JSON.stringify(content);
  return json.includes(needle) || json.includes(`/${needle}`);
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const folder = searchParams.get("folder") ?? "";
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";

  const folders = folder && isAllowedFolder(folder) ? [folder] : [...MEDIA_FOLDERS];
  const items: MediaItem[] = [];

  for (const dir of folders) {
    const { data, error } = await supabase.storage.from(MEDIA_BUCKET).list(dir, {
      limit: 500,
      sortBy: { column: "updated_at", order: "desc" },
    });

    if (error) {
      console.error(`Failed to list ${dir}:`, error);
      continue;
    }

    for (const file of data ?? []) {
      if (!file.name || file.id === null) continue;
      const path = `${dir}/${file.name}`;
      if (search && !file.name.toLowerCase().includes(search) && !path.toLowerCase().includes(search)) {
        continue;
      }
      items.push({
        name: file.name,
        path,
        folder: dir,
        size: file.metadata?.size ?? 0,
        updatedAt: file.updated_at ?? file.created_at ?? new Date().toISOString(),
        publicUrl: getPublicUrl(path),
      });
    }
  }

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  return NextResponse.json({ items, folders: MEDIA_FOLDERS });
}

export async function POST(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  const folder = String(formData.get("folder") ?? "");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File is required" }, { status: 400 });
  }

  if (!isAllowedFolder(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File exceeds 8MB limit" }, { status: 400 });
  }

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const path = `${folder}/${Date.now()}-${safeName}`;

  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) {
    console.error("Upload failed:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    item: {
      name: safeName,
      path,
      folder,
      size: file.size,
      updatedAt: new Date().toISOString(),
      publicUrl: getPublicUrl(path),
    } satisfies MediaItem,
  });
}

export async function DELETE(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Storage not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get("path")?.trim();

  if (!path) {
    return NextResponse.json({ error: "Path is required" }, { status: 400 });
  }

  if (!path || !isAllowedMediaPath(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const content = await getAllContentForReferenceCheck();
  if (isMediaReferenced(path, content)) {
    return NextResponse.json(
      { error: "File is referenced in site content and cannot be deleted" },
      { status: 409 }
    );
  }

  const { error } = await supabase.storage.from(MEDIA_BUCKET).remove([path]);
  if (error) {
    console.error("Delete failed:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
