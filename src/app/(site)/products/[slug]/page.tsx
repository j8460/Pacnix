import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Download, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";
import {
  getProductBySlug,
  getProductCategories,
  getProducts,
} from "@/lib/cms";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.summary,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, allProducts] = await Promise.all([
    getProductCategories(),
    getProducts(),
  ]);

  const category = categories.find((c) => c.id === product.categoryId);
  const relatedProducts = allProducts.filter((p) =>
    product.relatedSlugs.includes(p.slug)
  );

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
        eyebrow={category?.name ?? "Product"}
        title={product.name}
        description={product.summary}
      />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <Image
                  src={product.images[0] ?? "/images/placeholder-product.jpg"}
                  alt={product.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {product.images.slice(1, 5).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
                      <Image src={img} alt="" fill className="object-cover" sizes="15vw" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <p className="text-base leading-relaxed text-slate-600">{product.description}</p>

              {product.cataloguePath && (
                <Button asChild variant="outline" className="mt-6">
                  <a href={product.cataloguePath} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                    Download catalogue
                  </a>
                </Button>
              )}

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="font-heading font-semibold text-slate-900">Key features</h3>
                  <ul className="mt-3 space-y-2">
                    {product.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-heading font-semibold text-slate-900">Applications</h3>
                  <ul className="mt-3 space-y-2">
                    {product.applications.map((a) => (
                      <li key={a} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {product.benefits.length > 0 && (
                <div className="mt-8">
                  <h3 className="font-heading font-semibold text-slate-900">Benefits</h3>
                  <ul className="mt-3 space-y-2">
                    {product.benefits.map((b) => (
                      <li key={b} className="text-sm text-slate-600">• {b}</li>
                    ))}
                  </ul>
                </div>
              )}

              {product.specifications.length > 0 && (
                <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200">
                  <table className="w-full text-sm">
                    <tbody>
                      {product.specifications.map((spec) => (
                        <tr key={spec.key} className="border-b border-slate-100 last:border-0">
                          <th className="bg-slate-50 px-4 py-3 font-medium text-slate-700 text-left w-2/5">
                            {spec.key}
                          </th>
                          <td className="px-4 py-3 text-slate-600">{spec.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="section-padding mesh-bg">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Related products</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.slug}
                  href={`/products/${rel.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                    <Image
                      src={rel.images[0] ?? "/images/placeholder-product.jpg"}
                      alt={rel.imageAlt}
                      fill
                      className="object-cover transition group-hover:scale-105"
                      sizes="33vw"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-slate-900 group-hover:text-primary">
                      {rel.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{rel.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-2xl">
          <h2 className="font-heading text-2xl font-bold text-slate-900">Enquire about this product</h2>
          <p className="mt-2 text-slate-600">
            Tell us your specifications and we&apos;ll respond with samples and pricing.
          </p>
          <div className="mt-8">
            <ContactForm defaultProduct={product.name} />
          </div>
        </div>
      </section>
    </>
  );
}
