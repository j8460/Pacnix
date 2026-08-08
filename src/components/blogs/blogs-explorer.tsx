"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

export function BlogsExplorer({ posts }: { posts: BlogPost[] }) {
  const categories = useMemo(
    () => ["All", ...Array.from(new Set(posts.map((p) => p.category)))],
    [posts]
  );
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? posts : posts.filter((p) => p.category === filter);

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
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((post) => (
          <Link
            key={post.slug}
            href={`/blogs/${post.slug}`}
            className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
          >
            <div className="relative aspect-video bg-slate-100">
              <Image
                src={post.image}
                alt={post.imageAlt}
                fill
                className="object-cover transition group-hover:scale-105"
                sizes="33vw"
              />
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase text-primary">{post.category}</p>
              <h2 className="mt-2 font-heading text-lg font-semibold group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-2 line-clamp-2 text-sm text-slate-600">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
