"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { FileIcon, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/input";
import { MEDIA_FOLDERS, type MediaFolder } from "@/lib/types";

type MediaItem = {
  name: string;
  path: string;
  folder: string;
  size: number;
  updatedAt: string;
  publicUrl: string;
};

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminMediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [folder, setFolder] = useState<MediaFolder | "">("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadFolder, setUploadFolder] = useState<MediaFolder>(MEDIA_FOLDERS[0]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchMedia = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (folder) params.set("folder", folder);
      if (query) params.set("search", query);
      const res = await fetch(`/api/admin/media?${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load media");
      setItems(data.items);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  }, [folder, query]);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", uploadFolder);
      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      toast.success("File uploaded");
      await fetchMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(path: string) {
    if (!confirm(`Delete ${path}?`)) return;
    try {
      const res = await fetch(`/api/admin/media?path=${encodeURIComponent(path)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Delete failed");
      toast.success("File deleted");
      setItems((prev) => prev.filter((item) => item.path !== path));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Media library</h1>
        <p className="mt-2 text-slate-500">Upload, browse, and manage site assets.</p>
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1fr_auto]">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Upload folder</Label>
              <select
                value={uploadFolder}
                onChange={(e) => setUploadFolder(e.target.value as MediaFolder)}
                className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
              >
                {MEDIA_FOLDERS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>File</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,application/pdf"
                onChange={handleUpload}
                className="block w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <select
          value={folder}
          onChange={(e) => setFolder(e.target.value as MediaFolder | "")}
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option value="">All folders</option>
          {MEDIA_FOLDERS.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>
        <form
          className="flex flex-1 gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setQuery(search);
          }}
        >
          <div className="relative min-w-[200px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by filename..."
              className="pl-10"
            />
          </div>
          <Button type="submit">Filter</Button>
        </form>
      </div>

      {loading ? (
        <p className="text-sm text-slate-500">Loading media...</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
          No files found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => {
            const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(item.name);
            return (
              <div
                key={item.path}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                <div className="flex aspect-video items-center justify-center bg-slate-50">
                  {isImage ? (
                    <Image
                      src={item.publicUrl}
                      alt={item.name}
                      width={400}
                      height={225}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <FileIcon className="h-12 w-12 text-slate-300" />
                  )}
                </div>
                <div className="space-y-2 p-4">
                  <p className="truncate font-medium text-slate-900">{item.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.folder} · {formatSize(item.size)}
                  </p>
                  <p className="truncate text-xs text-slate-400">{item.path}</p>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="w-full"
                    onClick={() => handleDelete(item.path)}
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
