import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { FloatingActions } from "@/components/layout/floating-actions";
import { getCompany, getSiteSettings } from "@/lib/cms";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [company, site] = await Promise.all([getCompany(), getSiteSettings()]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:shadow-lg"
      >
        Skip to content
      </a>
      <SiteHeader company={company} site={site} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter company={company} site={site} />
      <FloatingActions phone={company.contact.phone} whatsapp={company.contact.whatsapp} />
    </div>
  );
}
