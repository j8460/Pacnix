"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/lib/types";

type Props = {
  products: Product[];
  categories: ProductCategory[];
  initialCategory?: string;
};

export function ProductsExplorer({ products, categories, initialCategory }: Props) {
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = products;
    if (activeCategory !== "all") {
      list = list.filter((p) => p.categoryId === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, activeCategory, search]);

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition",
              activeCategory === "all"
                ? "bg-primary text-white"
                : "bg-white text-slate-600 hover:bg-slate-100"
            )}
          >
            All Products
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition",
                activeCategory === cat.id
                  ? "bg-primary text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:max-w-xs"
          aria-label="Search products"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-slate-500">No products match your filters.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((product) => (
            <article
              key={product.slug}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
            >
              <Link href={`/products/${product.slug}`} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <Image
                    src={product.images[0] ?? "/images/placeholder-product.jpg"}
                    alt={product.imageAlt || product.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {product.featured && (
                    <span className="absolute left-3 top-3 rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-white">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-slate-900 group-hover:text-primary">
                    {product.name}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-sm text-slate-600">{product.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    View details
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Button asChild variant="outline">
          <Link href="/contact">Request a custom quote</Link>
        </Button>
      </div>
    </div>
  );
}
