import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/page-hero";
import { getBlogBySlug, getBlogs } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const blogs = await getBlogs();
  return blogs.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return { title: "Blog post" };
  return { title: post.title, description: post.excerpt };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) notFound();

  const related = (await getBlogs())
    .filter((b) => b.category === post.category && b.slug !== post.slug)
    .slice(0, 2);

  return (
    <>
      <PageHero
        eyebrow={post.category}
        title={post.title}
        description={post.excerpt}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Blogs", href: "/blogs" },
          { label: post.title },
        ]}
      />
      <article className="section-padding bg-white">
        <div className="mx-auto max-w-3xl">
          <div className="relative mb-8 aspect-video overflow-hidden rounded-2xl bg-slate-100">
            <Image src={post.image} alt={post.imageAlt} fill className="object-cover" priority />
          </div>
          <p className="text-sm text-slate-500">
            {new Date(post.publishedAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {post.author} · {post.readMinutes} min read
          </p>
          <div
            className="prose prose-slate mt-8 max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
          <Link href="/blogs" className="mt-10 inline-block text-primary hover:underline">
            ← Back to blogs
          </Link>
          {related.length > 0 && (
            <div className="mt-16 border-t border-slate-200 pt-10">
              <h2 className="font-heading text-xl font-semibold">Related posts</h2>
              <ul className="mt-4 space-y-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blogs/${r.slug}`} className="text-primary hover:underline">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </article>
    </>
  );
}
