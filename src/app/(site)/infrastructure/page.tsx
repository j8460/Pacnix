import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { getInfrastructure } from "@/lib/cms";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Infrastructure",
  description: "Manufacturing infrastructure at Pacnix India — plant, machinery, warehouse, and QA.",
};

export default async function InfrastructurePage() {
  const sections = await getInfrastructure();

  return (
    <>
      <PageHero
        eyebrow="Infrastructure"
        title="Manufacturing infrastructure"
        description="Integrated extrusion, finishing, and quality assurance under one campus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Infrastructure" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl space-y-16">
          {sections.map((section, index) => (
            <article
              key={section.id}
              className={cn(
                "grid items-center gap-8 lg:grid-cols-2",
                index % 2 === 1 && "lg:[direction:rtl] lg:*:[direction:ltr]"
              )}
            >
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div>
                <h2 className="font-heading text-2xl font-bold text-slate-900">
                  {section.title}
                </h2>
                <p className="mt-4 text-base leading-relaxed text-slate-600">
                  {section.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
