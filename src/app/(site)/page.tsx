import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/sections/hero";
import { SectionHeader } from "@/components/layout/section-header";
import { ProductCard } from "@/components/cards/product-card";
import { IndustryCard } from "@/components/cards/industry-card";
import { CertificateCard } from "@/components/cards/certificate-card";
import { BlogCard } from "@/components/cards/blog-card";
import { BentoGrid, BentoItem } from "@/components/layout/bento-grid";
import { FadeUp } from "@/components/motion/fade-up";
import { Counter } from "@/components/motion/counter";
import { TestimonialsCarousel } from "@/components/home/testimonials-carousel";
import { FaqAccordion } from "@/components/home/faq-accordion";
import { DynamicIcon } from "@/components/ui/dynamic-icon";
import { GridBackground } from "@/components/ui/grid-background";
import { buttonVariants } from "@/components/ui/button";
import {
  getBlogs,
  getCertificates,
  getCompany,
  getFaqs,
  getGallery,
  getIndustries,
  getInfrastructure,
  getProducts,
  getTestimonials,
} from "@/lib/cms";
import { cn } from "@/lib/utils";

const BENTO_SPANS: Record<string, "default" | "wide" | "tall"> = {
  "premium-laminate-tube-35mm": "wide",
  "standard-packaging-tube-25mm": "tall",
  "custom-shoulder-tube-program": "wide",
};

export default async function HomePage() {
  const [
    company,
    products,
    industries,
    infrastructure,
    certificates,
    gallery,
    testimonials,
    faqs,
    blogs,
  ] = await Promise.all([
    getCompany(),
    getProducts(),
    getIndustries(),
    getInfrastructure(),
    getCertificates(),
    getGallery(),
    getTestimonials(),
    getFaqs(),
    getBlogs(),
  ]);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 6);
  const homeIndustries = industries.slice(0, 6);
  const homeInfrastructure = infrastructure.slice(0, 3);
  const homeCertificates = certificates.slice(0, 4);
  const homeGallery = gallery.slice(0, 6);
  const homeBlogs = blogs.slice(0, 3);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <Hero hero={company.hero} brandName={company.brandName} tagline={company.tagline} />

      <section id="about" className="section-padding relative">
        <GridBackground className="opacity-50" />
        <div className="relative mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:items-center">
          <FadeUp>
            <SectionHeader
              align="left"
              gradientTitle
              eyebrow={company.about.eyebrow}
              title={company.about.title}
              description={company.about.paragraphs[0]}
              className="mb-0"
            />
            <ul className="mt-6 grid grid-cols-2 gap-3">
              {company.about.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary"
                >
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/about" className={cn(buttonVariants(), "mt-8 inline-flex rounded-full px-6")}>
              Learn more about us
            </Link>
          </FadeUp>
          <FadeUp delay={0.1} className="grid grid-cols-2 gap-4">
            {company.stats.map((stat) => (
              <div key={stat.label} className="glass-card p-6 text-center">
                <Counter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="font-heading text-3xl font-bold text-primary md:text-4xl"
                />
                <p className="mt-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                  {stat.label}
                </p>
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      <section className="section-padding mesh-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Products"
            title="Engineered polymer packaging"
            description="Explore our core categories — from packaging tubes to protective industrial components."
            align="center"
            className="mb-12"
          />
          <BentoGrid>
            {featuredProducts.map((product) => (
              <BentoItem key={product.slug} span={BENTO_SPANS[product.slug] ?? "default"}>
                <FadeUp className="h-full">
                  <ProductCard product={product} className="h-full" />
                </FadeUp>
              </BentoItem>
            ))}
          </BentoGrid>
          <div className="mt-10 text-center">
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
            >
              View all products
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Industries"
            title="Industries we serve"
            description="Purpose-built packaging for regulated and high-volume markets."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {homeIndustries.map((industry, i) => (
              <FadeUp key={industry.slug} delay={i * 0.04}>
                <IndustryCard industry={industry} />
              </FadeUp>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/industries"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
            >
              All industries
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding bg-primary-dark text-white">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Why Pacnix India"
            title="Why choose us"
            description="Integrated manufacturing, material expertise, and documentation ready for audits."
            align="center"
            className="mb-12 [&_p]:text-white/70"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {company.whyChooseUs.map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.05}>
                <article className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                  <span className="mb-4 flex size-11 items-center justify-center rounded-2xl bg-secondary/20 text-secondary">
                    <DynamicIcon name={item.icon} className="size-5" />
                  </span>
                  <h3 className="font-heading font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/70">{item.description}</p>
                </article>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Infrastructure"
            title="Built for precision at scale"
            description="Modern plant, extrusion lines, warehouse, and QA laboratory."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {homeInfrastructure.map((section, i) => (
              <FadeUp key={section.id} delay={i * 0.05}>
                <article className="group overflow-hidden rounded-3xl border border-primary/10">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={section.image}
                      alt={section.title}
                      fill
                      sizes="(max-width:768px) 100vw, 33vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                      <h3 className="font-heading font-bold">{section.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-white/80">
                        {section.description}
                      </p>
                    </div>
                  </div>
                </article>
              </FadeUp>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link href="/infrastructure" className={cn(buttonVariants(), "rounded-full px-6")}>
              Tour infrastructure
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding mesh-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Certificates"
            title="Compliance & credentials"
            description="Quality management and compliance documentation supporting domestic and export programmes."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {homeCertificates.map((cert, i) => (
              <FadeUp key={cert.id} delay={i * 0.04}>
                <CertificateCard certificate={cert} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Gallery"
            title="Inside Pacnix India"
            description="Factory floors, machines, teams, and warehouses."
            align="center"
            className="mb-12"
          />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
            {homeGallery.map((item) => (
              <div key={item.id} className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width:768px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/gallery"
              className={cn(buttonVariants({ variant: "outline" }), "rounded-full px-6")}
            >
              Open gallery
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding mesh-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Testimonials"
            title="Trusted by packaging partners"
            description="What procurement and quality leaders say about working with Pacnix India."
            align="center"
            className="mb-12"
          />
          <TestimonialsCarousel testimonials={testimonials} />
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="FAQs"
            title="Frequently asked questions"
            description="Quick answers on materials, lead times, and custom programs."
            align="center"
            className="mb-12"
          />
          <div className="mx-auto max-w-3xl">
            <FaqAccordion faqs={faqs} />
          </div>
        </div>
      </section>

      <section className="section-padding mesh-section">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            gradientTitle
            eyebrow="Insights"
            title="Latest from our blog"
            description="Manufacturing insights, packaging trends, and industrial news."
            align="center"
            className="mb-12"
          />
          <div className="grid gap-6 md:grid-cols-3">
            {homeBlogs.map((post, i) => (
              <FadeUp key={post.slug} delay={i * 0.05}>
                <BlogCard post={post} />
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding relative overflow-hidden bg-gradient-to-r from-primary to-primary-dark text-white">
        <GridBackground className="opacity-30" variant="grid" />
        <div className="relative mx-auto max-w-3xl text-center">
          <h2 className="font-heading text-3xl font-bold md:text-4xl">
            Ready to discuss your next packaging program?
          </h2>
          <p className="mt-4 text-white/80">
            Share your specifications — our team responds with feasibility and timelines.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full bg-secondary px-8 glow-cta hover:bg-secondary/90"
              )}
            >
              Contact us
            </Link>
            <Link
              href="/downloads"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
                "rounded-full border-white/40 bg-white/10 px-8 text-white hover:bg-white/20 hover:text-white"
              )}
            >
              Download catalogue
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
