import { PageHero } from "@/components/layout/page-hero";
import { GalleryExplorer } from "@/components/gallery/gallery-explorer";
import { getGallery } from "@/lib/cms";

export const metadata = {
  title: "Gallery",
  description: "Photo gallery — factory, products, machines, team, and warehouse at Pacnix India.",
};

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title="Inside Pacnix India"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Gallery" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <GalleryExplorer items={gallery} />
        </div>
      </section>
    </>
  );
}
