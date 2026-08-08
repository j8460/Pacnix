import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";
import type { Certificate } from "@/lib/types";
import { cn } from "@/lib/utils";

type CertificateCardProps = {
  certificate: Certificate;
  className?: string;
};

export function CertificateCard({ certificate, className }: CertificateCardProps) {
  return (
    <article
      className={cn(
        "glass-card group overflow-hidden transition duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <Image
          src={certificate.thumbnail}
          alt={certificate.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-primary">
            {certificate.type}
          </span>
          {certificate.isPlaceholder ? (
            <span className="rounded-full border border-slate-200 px-2.5 py-0.5 text-xs text-slate-500">
              Sample
            </span>
          ) : null}
        </div>
        <h3 className="font-heading font-bold text-slate-900">{certificate.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-slate-600">{certificate.description}</p>
        {certificate.filePath ? (
          <Link
            href={certificate.filePath}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-dark"
          >
            <FileText className="size-4" />
            View document
          </Link>
        ) : null}
      </div>
    </article>
  );
}
