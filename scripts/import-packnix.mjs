/**
 * Import CMS content from D:\zeel\proj\packnix\seeds\content into src/data/seed.json
 * Run: npm run import:packnix
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { resolve, join } from "path";

const PACKNIX_ROOT = resolve("D:/zeel/proj/packnix");
const CONTENT_DIR = join(PACKNIX_ROOT, "seeds", "content");
const OUT = resolve("src/data/seed.json");

function readJson(name) {
  const file = join(CONTENT_DIR, `${name}.json`);
  if (!existsSync(file)) throw new Error(`Missing ${file}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

function transformSite(raw) {
  return {
    logo: raw.logo || "",
    logoDark: raw.logoLight || raw.logo || "",
    logoAlt: raw.logoAlt || "Pacnix India",
    favicon: raw.favicon || "",
    url: raw.url || "https://www.packnix.in",
    locale: raw.locale || "en_IN",
    defaultTitle: raw.defaultTitle || "Pacnix India",
    titleTemplate: raw.titleTemplate || "%s | Pacnix India",
    defaultDescription: raw.defaultDescription || "",
    defaultOgImage: raw.defaultOgImage || "/images/og/default.jpg",
  };
}

function transformCompany(raw) {
  return {
    brandName: raw.name || raw.brandName || "Pacnix India",
    legalName: raw.legalName || raw.name || "Pacnix India",
    tagline: raw.tagline || "",
    owner: raw.owner || "",
    hero: {
      headline: raw.hero?.title || raw.hero?.headline || "",
      subtitle: raw.hero?.subtitle || "",
      backgroundImage: raw.hero?.image || raw.hero?.backgroundImage || "/images/hero/manufacturing.jpg",
      ctaPrimary: raw.hero?.primaryCta?.label || raw.hero?.ctaPrimary || "Explore Products",
      ctaSecondary: raw.hero?.secondaryCta?.label || raw.hero?.ctaSecondary || "Contact Us",
    },
    about: {
      eyebrow: "About Company",
      title: raw.about?.title || "",
      paragraphs: raw.about?.paragraphs || [],
      highlights: raw.about?.highlights || [],
      mission: raw.mission || "",
      vision: raw.vision || "",
    },
    contact: {
      address: raw.contact?.address || "",
      phone: raw.contact?.phoneDisplay || raw.contact?.phone || "",
      email: raw.contact?.email || "",
      whatsapp: String(raw.contact?.whatsapp || raw.contact?.whatsappDisplay || "").replace(/\D/g, ""),
      mapEmbedUrl: raw.contact?.mapEmbedUrl || "",
    },
    stats: raw.stats || [],
    coreValues: raw.coreValues || [],
    timeline: raw.timeline || [],
    whyChooseUs: raw.whyChooseUs || [],
    social: (raw.social || []).map((s) => ({
      platform: s.label || s.platform || "",
      url: s.href || s.url || "",
    })),
    navigation: raw.navigation || [],
  };
}

function transformProducts(raw) {
  const categories = (raw.categories || []).map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description || "",
  }));

  const products = (raw.products || []).map((p) => ({
    slug: p.slug,
    name: p.name,
    categoryId: p.categoryId,
    featured: Boolean(p.featured),
    summary: p.shortDescription || p.summary || "",
    description: p.description || "",
    features: p.features || [],
    applications: p.applications || [],
    benefits: p.benefits || [],
    specifications: p.specifications || [],
    images: p.images || [],
    imageAlt: p.imageAlt || "",
    cataloguePath: p.cataloguePath || "/downloads/packnix-catalogue.pdf",
    relatedSlugs: p.relatedSlugs || [],
  }));

  return { categories, products };
}

function transformIndustries(raw) {
  return raw.map((item) => ({
    id: item.id || item.slug,
    slug: item.slug,
    name: item.name,
    icon: item.icon || "Package",
    description: item.description || "",
  }));
}

function transformGallery(raw) {
  return raw.map((item) => ({
    id: item.id,
    category: item.category,
    src: item.src,
    alt: item.alt || "",
    ...(item.attribution ? { attribution: JSON.stringify(item.attribution) } : {}),
  }));
}

function main() {
  const site = readJson("site");
  const company = readJson("company");
  const productsRaw = readJson("products");
  const { categories, products } = transformProducts(productsRaw);

  const seed = {
    site: transformSite(site),
    company: transformCompany(company),
    categories,
    products,
    industries: transformIndustries(readJson("industries")),
    infrastructure: readJson("infrastructure"),
    quality: readJson("quality"),
    gallery: transformGallery(readJson("gallery")),
    certificates: readJson("certificates"),
    downloads: readJson("downloads"),
    blogs: readJson("blogs"),
    careers: readJson("careers"),
    testimonials: readJson("testimonials"),
    faqs: readJson("faqs"),
  };

  writeFileSync(OUT, JSON.stringify(seed, null, 2) + "\n", "utf8");
  console.log(`✓ Wrote ${OUT}`);
  console.log(`  ${products.length} products, ${categories.length} categories`);
  console.log(`  ${seed.gallery.length} gallery items, ${seed.blogs.length} blog posts`);
}

main();
