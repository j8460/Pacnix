import Link from "next/link";
import type { Industry } from "@/lib/types";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { cn } from "@/lib/utils";

type IndustryCardProps = {
  industry: Industry;
  className?: string;
};

export function IndustryCard({ industry, className }: IndustryCardProps) {
  return (
    <Link
      href={`/industries#${industry.slug}`}
      className={cn(
        "group glass-card flex h-full flex-col p-6 transition duration-300 hover:-translate-y-1 hover:border-accent/50",
        className
      )}
    >
      <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white shadow-lg shadow-primary/25">
        <DynamicIcon name={industry.icon} className="size-6" />
      </span>
      <h3 className="font-heading text-lg font-bold text-slate-900">{industry.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{industry.description}</p>
    </Link>
  );
}
