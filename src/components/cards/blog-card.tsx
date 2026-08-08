import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { BlogPost } from "@/lib/types";
import { cn } from "@/lib/utils";

type BlogCardProps = {
  post: BlogPost;
  className?: string;
};

export function BlogCard({ post, className }: BlogCardProps) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className={cn(
        "group glass-card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          alt={post.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug group-hover:text-primary">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{post.excerpt}</p>
        <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden />
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden />
            {post.readMinutes} min
          </span>
        </div>
      </div>
    </Link>
  );
}
