"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  testimonials: Testimonial[];
};

export function TestimonialsCarousel({ testimonials }: Props) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelected(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  return (
    <div className="relative">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_calc(50%-12px)] lg:flex-[0_0_calc(33.333%-16px)]"
            >
              <blockquote className="glass-card flex h-full flex-col p-6">
                <Quote className="h-8 w-8 text-secondary" aria-hidden />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-700">{item.quote}</p>
                <footer className="mt-6 border-t border-slate-200 pt-4">
                  <p className="font-heading font-semibold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {item.role}, {item.company}
                  </p>
                </footer>
              </blockquote>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2">
          {testimonials.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === selected ? "w-6 bg-primary" : "w-2 bg-slate-300"
              )}
              aria-label={`Go to testimonial ${i + 1}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={scrollPrev}
            className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={scrollNext}
            className="rounded-full border border-slate-200 p-2 transition hover:bg-slate-100"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
