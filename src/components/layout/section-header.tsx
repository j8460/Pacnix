import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  align?: "left" | "center";
  gradientTitle?: boolean;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  className,
  align = "left",
  gradientTitle = false,
}: Props) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4 sm:mb-12",
        centered && "items-center text-center",
        actionLabel && actionHref && !centered && "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn(centered && "max-w-2xl")}>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "font-heading text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl",
            !gradientTitle && "text-slate-900"
          )}
        >
          {gradientTitle ? <span className="gradient-text">{title}</span> : title}
        </h2>
        {description && (
          <p className="mt-3 text-base leading-relaxed text-slate-600">{description}</p>
        )}
      </div>

      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="group inline-flex items-center gap-1 text-sm font-semibold text-primary transition hover:text-primary-dark"
        >
          {actionLabel}
          <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
