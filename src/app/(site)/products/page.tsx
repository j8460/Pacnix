import { PageHero } from "@/components/layout/page-hero";
import { ProductsExplorer } from "@/components/products/products-explorer";
import { getProductCategories, getProducts } from "@/lib/cms";

export const metadata = {
  title: "Products",
  description: "Browse Pacnix India packaging tubes, poly tubes, HDPE/LDPE tubes, and industrial polymer products.",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(),
    getProductCategories(),
  ]);

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products" },
        ]}
        eyebrow="Product Catalogue"
        title="Packaging tubes & polymer solutions"
        description="Explore our full range of packaging tubes, industrial poly tubes, and custom polymer packaging components."
      />

      <section className="section-padding mesh-bg">
        <div className="mx-auto max-w-7xl">
          <ProductsExplorer
            products={products}
            categories={categories}
            initialCategory={category}
          />
        </div>
      </section>
    </>
  );
}
