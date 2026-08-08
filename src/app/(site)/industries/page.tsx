import { PageHero } from "@/components/layout/page-hero";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { getIndustries } from "@/lib/cms";

export const metadata = {
  title: "Industries",
  description: "Industries served by Pacnix India — packaging, pharma, food, cosmetics, and more.",
};

export default async function IndustriesPage() {
  const industries = await getIndustries();

  return (
    <>
      <PageHero
        eyebrow="Industries"
        title="Industries we serve"
        description="Polymer packaging solutions tailored for regulated and high-volume sectors."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Industries" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((industry) => (
            <article
              key={industry.id}
              id={industry.slug}
              className="glass-card flex gap-4 p-6"
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <DynamicIcon name={industry.icon} className="h-6 w-6" />
              </div>
              <div>
                <h2 className="font-heading text-lg font-semibold text-slate-900">
                  {industry.name}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {industry.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
