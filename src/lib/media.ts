import { MEDIA_FOLDERS, type MediaFolder } from "@/lib/types";
import { getSupabaseUrl } from "./supabase";

export const MEDIA_BUCKET = "media";

/** Public URL for a file in Supabase Storage (e.g. `images/hero/manufacturing.jpg`) */
export function getMediaPublicUrl(storagePath: string): string {
  const path = storagePath.replace(/^\//, "");
  const base = getSupabaseUrl();
  if (!base) return `/${path}`;
  return `${base}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`;
}

/** Normalize `/images/x` or `images/x` → `images/x` */
export function toStoragePath(value: string): string {
  return value.replace(/^\//, "");
}

export function isMediaPath(value: string): boolean {
  const p = toStoragePath(value);
  return p.startsWith("images/") || p.startsWith("downloads/");
}

/** Validate a storage object path against configured media folders */
export function isAllowedMediaPath(path: string): boolean {
  const normalized = toStoragePath(path);
  if (!normalized || normalized.includes("..")) return false;
  return (MEDIA_FOLDERS as readonly string[]).some(
    (folder) => normalized === folder || normalized.startsWith(`${folder}/`)
  );
}

export function getMediaFolderFromPath(path: string): MediaFolder | null {
  const normalized = toStoragePath(path);
  for (const folder of MEDIA_FOLDERS) {
    if (normalized === folder || normalized.startsWith(`${folder}/`)) {
      return folder;
    }
  }
  return null;
}

/**
 * Resolve a CMS media reference to a public cloud URL.
 * Accepts storage paths, legacy `/images/...` paths, or full URLs.
 */
export function resolveMediaUrl(value: string | undefined | null): string {
  if (!value) return "";
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  if (isMediaPath(value)) return getMediaPublicUrl(value);
  return value;
}

/** Deep-resolve all media path strings inside CMS content */
export function resolveMediaInObject<T>(obj: T): T {
  if (typeof obj === "string") {
    return (isMediaPath(obj) || obj.startsWith("/images/") || obj.startsWith("/downloads/")
      ? resolveMediaUrl(obj)
      : obj) as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => resolveMediaInObject(item)) as T;
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        resolveMediaInObject(v),
      ])
    ) as T;
  }
  return obj;
}

/** Strip public URLs back to storage paths before saving to DB */
export function normalizeMediaUrl(value: string): string {
  if (!value) return value;
  const base = getSupabaseUrl();
  if (base) {
    const prefix = `${base}/storage/v1/object/public/${MEDIA_BUCKET}/`;
    if (value.startsWith(prefix)) return value.slice(prefix.length);
  }
  if (value.startsWith("/images/") || value.startsWith("/downloads/")) {
    return value.slice(1);
  }
  return value;
}

export function normalizeMediaInObject<T>(obj: T): T {
  if (typeof obj === "string") {
    if (
      isMediaPath(obj) ||
      obj.startsWith("/images/") ||
      obj.startsWith("/downloads/") ||
      (getSupabaseUrl() && obj.startsWith(getSupabaseUrl()!))
    ) {
      return normalizeMediaUrl(obj) as T;
    }
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => normalizeMediaInObject(item)) as T;
  }
  if (obj && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj as Record<string, unknown>).map(([k, v]) => [
        k,
        normalizeMediaInObject(v),
      ])
    ) as T;
  }
  return obj;
}

export function getMimeType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    case "svg":
      return "image/svg+xml";
    case "pdf":
      return "application/pdf";
    default:
      return "application/octet-stream";
  }
}
