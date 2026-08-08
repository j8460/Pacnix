"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Command } from "cmdk";
import { FileText, Package, Search } from "lucide-react";
import { Dialog } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SearchResult = {
  type: "product" | "blog";
  slug: string;
  title: string;
  excerpt?: string;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function SiteSearch({ open, onOpenChange }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data.results ?? []);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setResults([]);
      return;
    }
    const timer = setTimeout(() => search(query), 250);
    return () => clearTimeout(timer);
  }, [query, open, search]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Search" className="max-w-xl p-0">
      <Command className="rounded-2xl" shouldFilter={false}>
        <div className="flex items-center gap-2 border-b px-4">
          <Search className="h-5 w-5 shrink-0 text-slate-400" aria-hidden />
          <Command.Input
            value={query}
            onValueChange={setQuery}
            placeholder="Search products and blogs…"
            className="flex h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            autoFocus
          />
          <kbd className="hidden rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500 sm:inline">
            ESC
          </kbd>
        </div>

        <Command.List className="max-h-80 overflow-y-auto p-2">
          {loading && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">Searching…</div>
          )}

          {!loading && query && results.length === 0 && (
            <Command.Empty className="px-4 py-8 text-center text-sm text-slate-500">
              No results for &ldquo;{query}&rdquo;
            </Command.Empty>
          )}

          {!loading && !query && (
            <div className="px-4 py-8 text-center text-sm text-slate-500">
              Type to search products and blog posts
            </div>
          )}

          {results.map((item) => {
            const href =
              item.type === "product" ? `/products/${item.slug}` : `/blogs/${item.slug}`;
            const Icon = item.type === "product" ? Package : FileText;

            return (
              <Command.Item
                key={`${item.type}-${item.slug}`}
                value={`${item.type}-${item.slug}`}
                onSelect={() => onOpenChange(false)}
                asChild
              >
                <Link
                  href={href}
                  className={cn(
                    "flex items-start gap-3 rounded-xl px-3 py-3 text-left transition",
                    "aria-selected:bg-primary/5 hover:bg-slate-50"
                  )}
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <div>
                    <p className="text-sm font-medium text-slate-900">{item.title}</p>
                    {item.excerpt && (
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{item.excerpt}</p>
                    )}
                    <span className="mt-1 inline-block text-xs font-medium text-primary">
                      {item.type === "product" ? "Product" : "Blog"}
                    </span>
                  </div>
                </Link>
              </Command.Item>
            );
          })}
        </Command.List>
      </Command>
    </Dialog>
  );
}
