"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteSearch } from "@/components/search/site-search";
import { MobileNav } from "@/components/layout/mobile-nav";
import type { CompanyContent, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";

const PRIMARY_HREFS = [
  "/",
  "/about",
  "/products",
  "/industries",
  "/quality",
  "/gallery",
  "/blogs",
  "/contact",
];

type Props = {
  company: CompanyContent;
  site: SiteSettings;
};

export function SiteHeader({ company, site }: Props) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isHeroPage = pathname === "/";
  const solidHeader = !isHeroPage || scrolled;
  const lightNav = isHeroPage;

  const navLinks =
    company.navigation.length > 0
      ? company.navigation.filter((l) => PRIMARY_HREFS.includes(l.href))
      : PRIMARY_HREFS.map((href) => ({
          label: href === "/" ? "Home" : href.slice(1).replace(/-/g, " "),
          href,
        }));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const whatsapp = company.contact.whatsapp.replace(/\D/g, "");
  const whatsappUrl = `https://wa.me/${whatsapp}`;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-300",
          solidHeader
            ? lightNav
              ? "border-b border-white/10 bg-primary-dark/95 py-2 shadow-lg backdrop-blur-md"
              : "border-b border-slate-200 bg-white/95 py-2 shadow-sm backdrop-blur-md"
            : "bg-transparent py-3"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3">
            {site.logo ? (
              <Image
                src={lightNav ? site.logoDark || site.logo : site.logo}
                alt={site.logoAlt || company.brandName}
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            ) : (
              <span
                className={cn(
                  "font-heading text-lg font-bold",
                  lightNav ? "text-white" : "text-primary-dark"
                )}
              >
                {company.brandName}
              </span>
            )}
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
            {navLinks.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-2 text-sm font-medium transition",
                    lightNav
                      ? active
                        ? "bg-white/15 text-accent"
                        : "text-white/85 hover:bg-white/10 hover:text-white"
                      : active
                        ? "bg-primary/10 text-primary"
                        : "text-slate-600 hover:bg-slate-100 hover:text-primary-dark"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="icon"
              className={cn(lightNav ? "text-white hover:bg-white/10" : "text-slate-700")}
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </Button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "hidden rounded-full p-2 sm:inline-flex",
                lightNav
                  ? "text-white/90 hover:bg-white/10"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              aria-label="WhatsApp"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>
            <a
              href={`tel:${company.contact.phone}`}
              className={cn(
                "hidden rounded-full p-2 sm:inline-flex",
                lightNav
                  ? "text-white/90 hover:bg-white/10"
                  : "text-slate-600 hover:bg-slate-100"
              )}
              aria-label="Call"
            >
              <Phone className="h-5 w-5" />
            </a>
            <Button
              asChild
              variant={lightNav ? "secondary" : "default"}
              size="sm"
              className="hidden md:inline-flex"
            >
              <Link href="/contact">Enquiry</Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn("lg:hidden", lightNav ? "text-white" : "text-slate-700")}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <SiteSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <MobileNav
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        links={company.navigation.length > 0 ? company.navigation : undefined}
      />
    </>
  );
}
