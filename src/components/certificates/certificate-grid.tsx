"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Dialog } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { Certificate } from "@/lib/types";

export function CertificateGrid({ certificates }: { certificates: Certificate[] }) {
  const [open, setOpen] = useState<Certificate | null>(null);

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {certificates.map((cert) => (
          <button
            key={cert.id}
            type="button"
            onClick={() => setOpen(cert)}
            className="glass-card overflow-hidden text-left transition hover:shadow-lg"
          >
            <div className="relative aspect-[3/4] bg-slate-100">
              <Image src={cert.thumbnail} alt={cert.title} fill className="object-cover" />
            </div>
            <div className="p-4">
              <p className="text-xs font-semibold uppercase text-primary">{cert.type}</p>
              <h3 className="mt-1 font-heading font-semibold">{cert.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-slate-600">{cert.description}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={!!open} onOpenChange={() => setOpen(null)} title={open?.title}>
        {open && (
          <div className="space-y-4">
            <div className="relative aspect-video overflow-hidden rounded-xl bg-slate-100">
              <Image src={open.thumbnail} alt={open.title} fill className="object-cover" />
            </div>
            <p className="text-sm text-slate-600">{open.description}</p>
            {open.isPlaceholder && (
              <p className="text-xs text-amber-700">Sample / placeholder certificate</p>
            )}
            <Button asChild>
              <Link href={open.filePath} target="_blank" rel="noopener noreferrer">
                Open PDF preview
              </Link>
            </Button>
          </div>
        )}
      </Dialog>
    </>
  );
}
