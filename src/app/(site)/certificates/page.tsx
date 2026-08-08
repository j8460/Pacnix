import { PageHero } from "@/components/layout/page-hero";
import { CertificateGrid } from "@/components/certificates/certificate-grid";
import { getCertificates } from "@/lib/cms";

export const metadata = {
  title: "Certificates",
  description: "Certificates and compliance credentials for Pacnix India.",
};

export default async function CertificatesPage() {
  const certificates = await getCertificates();

  return (
    <>
      <PageHero
        eyebrow="Compliance"
        title="Certificates & compliance"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Certificates" },
        ]}
      />
      <section className="section-padding bg-white">
        <div className="mx-auto max-w-7xl">
          <CertificateGrid certificates={certificates} />
        </div>
      </section>
    </>
  );
}
