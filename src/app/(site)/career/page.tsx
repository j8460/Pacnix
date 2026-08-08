import { PageHero } from "@/components/layout/page-hero";
import { CareerForm } from "@/components/forms/career-form";
import { getCareers } from "@/lib/cms";

export const metadata = {
  title: "Career",
  description: "Career opportunities at Pacnix India — join our manufacturing and QA teams.",
};

export default async function CareerPage() {
  const careers = await getCareers();

  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Build with Pacnix India"
        description="Join our team manufacturing precision polymer packaging for brands across India and export markets."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Career" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2">
          <div className="space-y-6">
            <h2 className="font-heading text-2xl font-bold text-slate-900">Current openings</h2>
            {careers.map((job) => (
              <article key={job.id} className="glass-card p-6">
                <h3 className="font-heading text-lg font-semibold text-slate-900">{job.title}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {job.location} · {job.type}
                </p>
                <p className="mt-3 text-sm text-slate-600">{job.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
                  {job.requirements.map((req) => (
                    <li key={req}>{req}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <div>
            <h2 className="font-heading text-2xl font-bold text-slate-900">Apply now</h2>
            <div className="mt-6">
              <CareerForm careers={careers} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
