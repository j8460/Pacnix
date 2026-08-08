import { PageHero } from "@/components/layout/page-hero";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { getQuality } from "@/lib/cms";

export const metadata = {
  title: "Quality",
  description: "Quality assurance framework, testing process, and standards at Pacnix India.",
};

export default async function QualityPage() {
  const quality = await getQuality();

  return (
    <>
      <PageHero
        eyebrow="Quality"
        title="Quality assurance"
        description={quality.intro}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Quality" },
        ]}
      />
      <section className="section-padding mesh-bg">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-2xl font-bold text-slate-900">Quality pillars</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {quality.pillars.map((pillar) => (
              <div key={pillar.title} className="glass-card p-6">
                <DynamicIcon name={pillar.icon} className="h-8 w-8 text-primary" />
                <h3 className="mt-4 font-heading font-semibold text-slate-900">{pillar.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{pillar.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-heading text-2xl font-bold text-slate-900">Testing process</h2>
          <ol className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quality.process.map((step) => (
              <li key={step.step} className="rounded-2xl border border-slate-200 p-6">
                <span className="text-sm font-bold text-secondary">Step {step.step}</span>
                <h3 className="mt-2 font-heading font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{step.description}</p>
              </li>
            ))}
          </ol>
          <h2 className="mt-16 font-heading text-2xl font-bold text-slate-900">Standards</h2>
          <ul className="mt-6 list-disc space-y-2 pl-5 text-slate-600">
            {quality.standards.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
