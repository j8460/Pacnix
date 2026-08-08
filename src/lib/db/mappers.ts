import type {
  BlogPost,
  Career,
  Certificate,
  CompanyContent,
  DownloadItem,
  FAQ,
  GalleryItem,
  Industry,
  InfrastructureSection,
  Product,
  ProductCategory,
  QualityContent,
  SiteSettings,
  Testimonial,
} from "../types";

// ─── Site settings ─────────────────────────────────────────────────────────────

export type SiteSettingsRow = {
  id: number;
  logo: string;
  logo_dark: string;
  logo_alt: string;
  favicon: string;
  url: string;
  locale: string;
  default_title: string;
  title_template: string;
  default_description: string;
  default_og_image: string;
};

export function siteSettingsToRow(data: SiteSettings) {
  return {
    id: 1,
    logo: data.logo,
    logo_dark: data.logoDark,
    logo_alt: data.logoAlt,
    favicon: data.favicon,
    url: data.url,
    locale: data.locale,
    default_title: data.defaultTitle,
    title_template: data.titleTemplate,
    default_description: data.defaultDescription,
    default_og_image: data.defaultOgImage,
    updated_at: new Date().toISOString(),
  };
}

export function rowToSiteSettings(row: SiteSettingsRow): SiteSettings {
  return {
    logo: row.logo,
    logoDark: row.logo_dark,
    logoAlt: row.logo_alt,
    favicon: row.favicon,
    url: row.url,
    locale: row.locale,
    defaultTitle: row.default_title,
    titleTemplate: row.title_template,
    defaultDescription: row.default_description,
    defaultOgImage: row.default_og_image,
  };
}

// ─── Company ───────────────────────────────────────────────────────────────────

export type CompanyRow = {
  id: number;
  brand_name: string;
  legal_name: string;
  tagline: string;
  owner: string;
  hero: CompanyContent["hero"];
  about: CompanyContent["about"];
  contact: CompanyContent["contact"];
  stats: CompanyContent["stats"];
  core_values: CompanyContent["coreValues"];
  timeline: CompanyContent["timeline"];
  why_choose_us: CompanyContent["whyChooseUs"];
  social: CompanyContent["social"];
  navigation: CompanyContent["navigation"];
};

export function companyToRow(data: CompanyContent) {
  return {
    id: 1,
    brand_name: data.brandName,
    legal_name: data.legalName,
    tagline: data.tagline,
    owner: data.owner,
    hero: data.hero,
    about: data.about,
    contact: data.contact,
    stats: data.stats,
    core_values: data.coreValues,
    timeline: data.timeline,
    why_choose_us: data.whyChooseUs,
    social: data.social,
    navigation: data.navigation,
    updated_at: new Date().toISOString(),
  };
}

export function rowToCompany(row: CompanyRow): CompanyContent {
  return {
    brandName: row.brand_name,
    legalName: row.legal_name,
    tagline: row.tagline,
    owner: row.owner,
    hero: row.hero,
    about: row.about,
    contact: row.contact,
    stats: row.stats ?? [],
    coreValues: row.core_values ?? [],
    timeline: row.timeline ?? [],
    whyChooseUs: row.why_choose_us ?? [],
    social: row.social ?? [],
    navigation: row.navigation ?? [],
  };
}

// ─── Quality ───────────────────────────────────────────────────────────────────

export type QualityRow = {
  id: number;
  intro: string;
  pillars: QualityContent["pillars"];
  process: QualityContent["process"];
  standards: QualityContent["standards"];
};

export function qualityToRow(data: QualityContent) {
  return {
    id: 1,
    intro: data.intro,
    pillars: data.pillars,
    process: data.process,
    standards: data.standards,
    updated_at: new Date().toISOString(),
  };
}

export function rowToQuality(row: QualityRow): QualityContent {
  return {
    intro: row.intro,
    pillars: row.pillars ?? [],
    process: row.process ?? [],
    standards: row.standards ?? [],
  };
}

// ─── Product categories ────────────────────────────────────────────────────────

export type ProductCategoryRow = {
  id: string;
  name: string;
  description: string;
  sort_order: number;
};

export function categoryToRow(data: ProductCategory, sortOrder: number) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToCategory(row: ProductCategoryRow): ProductCategory {
  return { id: row.id, name: row.name, description: row.description };
}

// ─── Products ──────────────────────────────────────────────────────────────────

export type ProductRow = {
  slug: string;
  name: string;
  category_id: string | null;
  featured: boolean;
  summary: string;
  description: string;
  features: string[];
  applications: string[];
  benefits: string[];
  specifications: { key: string; value: string }[];
  images: string[];
  image_alt: string;
  catalogue_path: string;
  related_slugs: string[];
  sort_order: number;
};

export function productToRow(data: Product, sortOrder: number) {
  return {
    slug: data.slug,
    name: data.name,
    category_id: data.categoryId || null,
    featured: data.featured,
    summary: data.summary,
    description: data.description,
    features: data.features,
    applications: data.applications,
    benefits: data.benefits,
    specifications: data.specifications,
    images: data.images,
    image_alt: data.imageAlt,
    catalogue_path: data.cataloguePath,
    related_slugs: data.relatedSlugs,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToProduct(row: ProductRow): Product {
  return {
    slug: row.slug,
    name: row.name,
    categoryId: row.category_id ?? "",
    featured: row.featured,
    summary: row.summary,
    description: row.description,
    features: row.features ?? [],
    applications: row.applications ?? [],
    benefits: row.benefits ?? [],
    specifications: row.specifications ?? [],
    images: row.images ?? [],
    imageAlt: row.image_alt,
    cataloguePath: row.catalogue_path,
    relatedSlugs: row.related_slugs ?? [],
  };
}

// ─── Industries ────────────────────────────────────────────────────────────────

export type IndustryRow = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  sort_order: number;
};

export function industryToRow(data: Industry, sortOrder: number) {
  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    icon: data.icon,
    description: data.description,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToIndustry(row: IndustryRow): Industry {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    icon: row.icon,
    description: row.description,
  };
}

// ─── Infrastructure ────────────────────────────────────────────────────────────

export type InfrastructureRow = {
  id: string;
  title: string;
  description: string;
  image: string;
  sort_order: number;
};

export function infrastructureToRow(data: InfrastructureSection, sortOrder: number) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    image: data.image,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToInfrastructure(row: InfrastructureRow): InfrastructureSection {
  return { id: row.id, title: row.title, description: row.description, image: row.image };
}

// ─── Gallery ───────────────────────────────────────────────────────────────────

export type GalleryRow = {
  id: string;
  category: string;
  src: string;
  alt: string;
  attribution: string | null;
  sort_order: number;
};

export function galleryToRow(data: GalleryItem, sortOrder: number) {
  return {
    id: data.id,
    category: data.category,
    src: data.src,
    alt: data.alt,
    attribution: data.attribution ?? null,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToGallery(row: GalleryRow): GalleryItem {
  return {
    id: row.id,
    category: row.category,
    src: row.src,
    alt: row.alt,
    attribution: row.attribution ?? undefined,
  };
}

// ─── Certificates ──────────────────────────────────────────────────────────────

export type CertificateRow = {
  id: string;
  title: string;
  type: string;
  description: string;
  thumbnail: string;
  file_path: string;
  is_placeholder: boolean;
  sort_order: number;
};

export function certificateToRow(data: Certificate, sortOrder: number) {
  return {
    id: data.id,
    title: data.title,
    type: data.type,
    description: data.description,
    thumbnail: data.thumbnail,
    file_path: data.filePath,
    is_placeholder: data.isPlaceholder,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToCertificate(row: CertificateRow): Certificate {
  return {
    id: row.id,
    title: row.title,
    type: row.type,
    description: row.description,
    thumbnail: row.thumbnail,
    filePath: row.file_path,
    isPlaceholder: row.is_placeholder,
  };
}

// ─── Downloads ─────────────────────────────────────────────────────────────────

export type DownloadRow = {
  id: string;
  title: string;
  category: string;
  file_path: string;
  description: string;
  sort_order: number;
};

export function downloadToRow(data: DownloadItem, sortOrder: number) {
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    file_path: data.filePath,
    description: data.description,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToDownload(row: DownloadRow): DownloadItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    filePath: row.file_path,
    description: row.description,
  };
}

// ─── Blog posts ────────────────────────────────────────────────────────────────

export type BlogRow = {
  slug: string;
  title: string;
  category: string;
  published_at: string | null;
  author: string;
  read_minutes: number;
  excerpt: string;
  body: string;
  image: string;
  image_alt: string;
};

export function blogToRow(data: BlogPost) {
  return {
    slug: data.slug,
    title: data.title,
    category: data.category,
    published_at: data.publishedAt || null,
    author: data.author,
    read_minutes: data.readMinutes,
    excerpt: data.excerpt,
    body: data.body,
    image: data.image,
    image_alt: data.imageAlt,
    updated_at: new Date().toISOString(),
  };
}

export function rowToBlog(row: BlogRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    publishedAt: row.published_at ?? "",
    author: row.author,
    readMinutes: row.read_minutes,
    excerpt: row.excerpt,
    body: row.body,
    image: row.image,
    imageAlt: row.image_alt,
  };
}

// ─── Careers ───────────────────────────────────────────────────────────────────

export type CareerRow = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  sort_order: number;
};

export function careerToRow(data: Career, sortOrder: number) {
  return {
    id: data.id,
    title: data.title,
    location: data.location,
    type: data.type,
    description: data.description,
    requirements: data.requirements,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToCareer(row: CareerRow): Career {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    type: row.type,
    description: row.description,
    requirements: row.requirements ?? [],
  };
}

// ─── Testimonials ──────────────────────────────────────────────────────────────

export type TestimonialRow = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  sort_order: number;
};

export function testimonialToRow(data: Testimonial, sortOrder: number) {
  return {
    id: data.id,
    name: data.name,
    role: data.role,
    company: data.company,
    quote: data.quote,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToTestimonial(row: TestimonialRow): Testimonial {
  return { id: row.id, name: row.name, role: row.role, company: row.company, quote: row.quote };
}

// ─── FAQs ──────────────────────────────────────────────────────────────────────

export type FaqRow = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export function faqToRow(data: FAQ, sortOrder: number) {
  return {
    id: data.id,
    question: data.question,
    answer: data.answer,
    sort_order: sortOrder,
    updated_at: new Date().toISOString(),
  };
}

export function rowToFaq(row: FaqRow): FAQ {
  return { id: row.id, question: row.question, answer: row.answer };
}
