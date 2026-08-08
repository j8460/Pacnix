"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryItem } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  items: GalleryItem[];
};

export function GalleryExplorer({ items }: Props) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(items.map((i) => i.category)))],
    [items]
  );
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered =
    filter === "All" ? items : items.filter((i) => i.category === filter);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setFilter(cat)}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              filter === cat
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setLightbox(index)}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover transition group-hover:scale-105"
              sizes="33vw"
            />
            <span className="absolute bottom-3 left-3 rounded-full bg-primary-dark/80 px-3 py-1 text-xs text-white">
              {item.category}
            </span>
          </button>
        ))}
      </div>

      {current && lightbox !== null && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 p-4">
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
          <button
            type="button"
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white"
            onClick={() => setLightbox((lightbox - 1 + filtered.length) % filtered.length)}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="relative h-[70vh] w-full max-w-5xl">
            <Image src={current.src} alt={current.alt} fill className="object-contain" />
          </div>
          <button
            type="button"
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white md:right-16"
            onClick={() => setLightbox((lightbox + 1) % filtered.length)}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
