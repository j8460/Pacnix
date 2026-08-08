import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProductCardProps = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: ProductCardProps) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-3xl border border-primary/10 bg-white/80 shadow-lg shadow-primary/5 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-xl hover:shadow-primary/10",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={product.images[0] ?? "/images/placeholder-product.jpg"}
          alt={product.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-primary backdrop-blur">
          View details
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold text-slate-900 transition group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{product.summary}</p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-secondary">
          Enquire
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
