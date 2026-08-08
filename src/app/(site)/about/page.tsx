import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/page-hero";
import { SectionHeader } from "@/components/layout/section-header";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { Button } from "@/components/ui/button";
import { getCompany } from "@/lib/cms";

export const metadata = {
  title: "About Us",
  description: "Learn about Pacnix India — our mission, values, timeline, and manufacturing expertise in polymer packaging.",
};

export default async function AboutPage() {
  const company = await getCompany();

  return (
    <>
      <PageHero
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us" },
        ]}
        eyebrow={company.about.eyebrow}
        title={company.about.title}
        description={company.tagline}
      />

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div className="space-y-4 text-base leading-relaxed text-slate-600">
              {company.about.paragraphs.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {company.stats.map((stat) => (
                <div key={stat.label} className="glass-card p-6 text-center">
                  <p className="font-heading text-3xl font-bold text-primary">
                    {stat.value}{stat.suffix}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding mesh-bg">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Our Values"
            title="What drives us"
            align="center"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.coreValues.map((value) => (
              <div key={value.title} className="glass-card p-6">
                <h3 className="font-heading font-semibold text-slate-900">{value.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader eyebrow="Our Journey" title="Company timeline" align="center" />
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/20 sm:left-1/2" aria-hidden />
            <div className="space-y-8">
              {company.timeline.map((item, i) => (
                <div
                  key={item.year}
                  className={`relative flex gap-6 sm:gap-0 ${i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"}`}
                >
                  <div className="hidden sm:block sm:w-1/2" />
                  <div className="absolute left-4 top-2 z-10 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-secondary text-xs font-bold text-white sm:left-1/2">
                    {item.year.slice(2)}
                  </div>
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                      <p className="text-sm font-semibold text-primary">{item.year}</p>
                      <h3 className="mt-1 font-heading font-semibold text-slate-900">{item.title}</h3>
                      <p className="mt-2 text-sm text-slate-600">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-dark text-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="Why Pacnix"
            title="Why partners choose us"
            align="center"
            className="[&_h2]:text-white"
          />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {company.whyChooseUs.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/20 text-secondary">
                  <DynamicIcon name={item.icon} className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/75">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding mesh-bg">
        <div className="mx-auto max-w-7xl text-center">
          <h2 className="font-heading text-2xl font-bold text-slate-900 sm:text-3xl">
            Partner with {company.brandName}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-600">
            Discuss your packaging requirements with our team and explore custom tube programmes.
          </p>
          <Button asChild variant="secondary" size="lg" className="mt-8">
            <Link href="/contact">
              Contact us
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
