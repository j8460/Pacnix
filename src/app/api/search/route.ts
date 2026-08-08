import { NextResponse } from "next/server";
import { getBlogs, getProducts } from "@/lib/cms";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim().toLowerCase() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ products: [], blogs: [] });
  }

  const [products, blogs] = await Promise.all([getProducts(), getBlogs()]);

  const matchedProducts = products
    .filter((p) => p.name.toLowerCase().includes(q))
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      summary: p.summary,
      image: p.images[0] ?? "",
    }));

  const matchedBlogs = blogs
    .filter((b) => b.title.toLowerCase().includes(q))
    .map((b) => ({
      slug: b.slug,
      title: b.title,
      excerpt: b.excerpt,
      image: b.image,
      publishedAt: b.publishedAt,
    }));

  return NextResponse.json({ products: matchedProducts, blogs: matchedBlogs });
}
