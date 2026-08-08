import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone } from "lucide-react";
import type { CompanyContent, SiteSettings } from "@/lib/types";

const FALLBACK_COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Career", href: "/career" },
  { label: "Gallery", href: "/gallery" },
  { label: "Certificates", href: "/certificates" },
  { label: "Blogs", href: "/blogs" },
];

const FALLBACK_PRODUCT_LINKS = [
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Quality", href: "/quality" },
  { label: "Downloads", href: "/downloads" },
  { label: "Contact", href: "/contact" },
];

type Props = {
  company: CompanyContent;
  site: SiteSettings;
};

export function SiteFooter({ company, site }: Props) {
  const year = new Date().getFullYear();

  const productLinks =
    company.navigation.length > 0
      ? [
          ...company.navigation.filter((n) =>
            ["/products", "/industries", "/quality", "/downloads"].includes(n.href)
          ),
          { label: "Contact", href: "/contact" },
        ]
      : FALLBACK_PRODUCT_LINKS;

  const companyLinks =
    company.navigation.length > 0
      ? company.navigation.filter((n) =>
          ["/about", "/career", "/gallery", "/certificates", "/blogs"].includes(n.href)
        )
      : FALLBACK_COMPANY_LINKS;

  return (
    <footer className="relative overflow-hidden bg-primary-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(56,189,248,0.18),transparent_55%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Link href="/" className="inline-block">
            {site.logo ? (
              <Image
                src={site.logoDark || site.logo}
                alt={site.logoAlt || company.brandName}
                width={160}
                height={48}
                className="h-10 w-auto object-contain"
              />
            ) : (
              <span className="font-heading text-xl font-bold">{company.brandName}</span>
            )}
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {company.tagline}. Manufacturing excellence with innovation and quality for
            industrial and consumer brands.
          </p>
          {company.social.length > 0 ? (
            <div className="mt-4 flex flex-wrap gap-2">
              {company.social.map((item) => (
                <a
                  key={item.platform}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-white/20 px-3 py-1 text-xs transition hover:bg-white/10"
                >
                  {item.platform}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2">
            {companyLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Products
          </h3>
          <ul className="mt-4 space-y-2">
            {productLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/75 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
              <span>{company.contact.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={`tel:${company.contact.phone}`} className="hover:text-white">
                {company.contact.phone}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 shrink-0 text-accent" aria-hidden />
              <a href={`mailto:${company.contact.email}`} className="hover:text-white">
                {company.contact.email}
              </a>
            </li>
          </ul>
          <form className="mt-6" action="#" aria-label="Newsletter signup">
            <label htmlFor="newsletter-email" className="sr-only">
              Email for newsletter
            </label>
            <div className="flex gap-2">
              <input
                id="newsletter-email"
                type="email"
                name="email"
                placeholder="Newsletter email"
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-secondary px-4 text-sm font-semibold text-white"
              >
                Join
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="relative border-t border-white/10 px-4 py-6 text-center text-xs text-white/50 md:px-6">
        © {year} {company.legalName}. All rights reserved.
      </div>
    </footer>
  );
}
