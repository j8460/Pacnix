"use client";

import Link from "next/link";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ALL_NAV, DESKTOP_NAV, MOBILE_EXTRA_NAV } from "@/lib/types";

type NavLink = { label: string; href: string };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  links?: NavLink[];
};

export function MobileNav({ open, onOpenChange, links }: Props) {
  const items =
    links ??
    [...DESKTOP_NAV.slice(0, 4), ...MOBILE_EXTRA_NAV, ...DESKTOP_NAV.slice(4)];

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="right" title="Menu">
      <nav className="flex flex-col gap-1 p-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => onOpenChange(false)}
            className="rounded-xl px-4 py-3 text-base font-medium text-slate-700 transition hover:bg-slate-100"
          >
            {item.label}
          </Link>
        ))}
        <Button asChild variant="secondary" className="mt-4 w-full">
          <Link href="/contact" onClick={() => onOpenChange(false)}>
            Enquiry
          </Link>
        </Button>
      </nav>
    </Sheet>
  );
}
