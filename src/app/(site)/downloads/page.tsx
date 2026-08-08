import Link from "next/link";
import { Download } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { Button } from "@/components/ui/button";
import { getDownloads } from "@/lib/cms";

export const metadata = {
  title: "Downloads",
  description: "Download product catalogues, brochures, and technical resources from Pacnix India.",
};

export default async function DownloadsPage() {
  const downloads = await getDownloads();

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Resources & downloads"
        description="Catalogues, brochures, and compliance samples for procurement teams."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Downloads" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2">
          {downloads.map((item) => (
            <article key={item.id} className="glass-card flex flex-col p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {item.category}
              </p>
              <h2 className="mt-2 font-heading text-xl font-semibold text-slate-900">
                {item.title}
              </h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{item.description}</p>
              <Button asChild variant="default" className="mt-6 w-fit">
                <Link href={item.filePath} target="_blank" rel="noopener noreferrer">
                  <Download className="h-4 w-4" />
                  Download PDF
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
