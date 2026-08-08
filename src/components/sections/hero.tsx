"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { GridBackground } from "@/components/ui/grid-background";
import { fadeUp, springTransition, staggerContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";
import type { CompanyContent } from "@/lib/types";

type HeroProps = {
  hero: CompanyContent["hero"];
  brandName: string;
  tagline: string;
};

export function Hero({ hero, brandName, tagline }: HeroProps) {
  return (
    <section className="relative flex min-h-[100svh] items-end overflow-hidden bg-primary-dark pb-20 pt-28 md:items-center md:pb-0">
      <Image
        src={hero.backgroundImage}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/55 to-primary-dark/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-primary-dark/40 to-transparent" />
      <div
        className="absolute inset-0 opacity-50 mix-blend-multiply"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(56, 189, 248, 0.35), transparent 70%), linear-gradient(135deg, #0b5cad 0%, #063d73 55%, #0b5cad 100%)",
        }}
      />
      <GridBackground className="opacity-30" />

      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="absolute size-2 animate-[float_6s_ease-in-out_infinite] rounded-full bg-accent/40"
            style={{
              left: `${12 + i * 11}%`,
              top: `${20 + (i % 4) * 15}%`,
              animationDelay: `${i * 0.4}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-3xl"
        >
          <motion.p
            variants={fadeUp}
            transition={springTransition}
            className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-accent"
          >
            {tagline || brandName}
          </motion.p>
          <motion.h1
            variants={fadeUp}
            transition={springTransition}
            className="font-heading text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl"
          >
            {hero.headline}
          </motion.h1>
          <motion.p
            variants={fadeUp}
            transition={springTransition}
            className="mt-5 max-w-xl text-base text-white/80 md:text-lg"
          >
            {hero.subtitle}
          </motion.p>
          <motion.div
            variants={fadeUp}
            transition={springTransition}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/products"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary px-6 text-white glow-cta hover:bg-secondary/90"
              )}
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-white/40 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/20 hover:text-white"
              )}
            >
              {hero.ctaSecondary}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <a
        href="#about"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/70 transition hover:text-white"
        aria-label="Scroll to about section"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <ChevronDown className="size-5 animate-bounce" />
      </a>
    </section>
  );
}
