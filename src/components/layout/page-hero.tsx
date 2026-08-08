import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Breadcrumb = { label: string; href?: string };

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
};

export function PageHero({ eyebrow, title, description, breadcrumbs, className }: Props) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-primary-dark via-primary to-primary/90 pt-24 text-white",
        className
      )}
    >
      <div className="absolute inset-0 mesh-bg opacity-30" aria-hidden />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4">
            <ol className="flex flex-wrap items-center gap-1 text-sm text-white/70">
              {breadcrumbs.map((crumb, i) => (
                <li key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden />}
                  {crumb.href ? (
                    <Link href={crumb.href} className="transition hover:text-white">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-white/90">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-secondary">
            {eyebrow}
          </p>
        )}

        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {title}
        </h1>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}
