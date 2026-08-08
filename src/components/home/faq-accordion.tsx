"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  faqs: FAQ[];
};

export function FaqAccordion({ faqs }: Props) {
  return (
    <Accordion.Root type="single" collapsible className="space-y-3">
      {faqs.map((faq) => (
        <Accordion.Item
          key={faq.id}
          value={faq.id}
          className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <Accordion.Header>
            <Accordion.Trigger
              className={cn(
                "group flex w-full items-center justify-between gap-4 px-5 py-4 text-left",
                "font-heading text-base font-semibold text-slate-900",
                "hover:bg-slate-50 transition"
              )}
            >
              {faq.question}
              <ChevronDown
                className="h-5 w-5 shrink-0 text-primary transition group-data-[state=open]:rotate-180"
                aria-hidden
              />
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content className="overflow-hidden">
            <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
}
