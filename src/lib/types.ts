export type SiteSettings = {
  logo: string;
  logoDark: string;
  logoAlt: string;
  favicon: string;
  url: string;
  locale: string;
  defaultTitle: string;
  titleTemplate: string;
  defaultDescription: string;
  defaultOgImage: string;
};

export type CompanyContact = {
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapEmbedUrl: string;
};

export type CompanyStat = { label: string; value: number; suffix: string };
export type CoreValue = { title: string; description: string };
export type TimelineItem = { year: string; title: string; description: string };
export type WhyChooseItem = { title: string; description: string; icon: string };
export type SocialLink = { platform: string; url: string };

export type CompanyContent = {
  brandName: string;
  legalName: string;
  tagline: string;
  owner: string;
  hero: {
    headline: string;
    subtitle: string;
    backgroundImage: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    highlights: string[];
    mission: string;
    vision: string;
  };
  contact: CompanyContact;
  stats: CompanyStat[];
  coreValues: CoreValue[];
  timeline: TimelineItem[];
  whyChooseUs: WhyChooseItem[];
  social: SocialLink[];
  navigation: { label: string; href: string }[];
};

export type ProductCategory = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  slug: string;
  name: string;
  categoryId: string;
  featured: boolean;
  summary: string;
  description: string;
  features: string[];
  applications: string[];
  benefits: string[];
  specifications: { key: string; value: string }[];
  images: string[];
  imageAlt: string;
  cataloguePath: string;
  relatedSlugs: string[];
};

export type Industry = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
};

export type InfrastructureSection = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type QualityContent = {
  intro: string;
  pillars: { title: string; description: string; icon: string }[];
  process: { step: number; title: string; description: string }[];
  standards: string[];
};

export type GalleryItem = {
  id: string;
  category: string;
  src: string;
  alt: string;
  attribution?: string;
};

export type Certificate = {
  id: string;
  title: string;
  type: string;
  description: string;
  thumbnail: string;
  filePath: string;
  isPlaceholder: boolean;
};

export type DownloadItem = {
  id: string;
  title: string;
  category: string;
  filePath: string;
  description: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  author: string;
  readMinutes: number;
  excerpt: string;
  body: string;
  image: string;
  imageAlt: string;
};

export type Career = {
  id: string;
  title: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
};

export type Inquiry = {
  id: string;
  name: string;
  company?: string;
  phone: string;
  email: string;
  product?: string;
  message: string;
  emailSent: boolean;
  createdAt: string;
};

export type ContentCollection =
  | "site"
  | "company"
  | "products"
  | "categories"
  | "industries"
  | "infrastructure"
  | "quality"
  | "gallery"
  | "certificates"
  | "downloads"
  | "blogs"
  | "careers"
  | "testimonials"
  | "faqs";

export const DESKTOP_NAV = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Industries", href: "/industries" },
  { label: "Quality", href: "/quality" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "Contact", href: "/contact" },
];

export const MOBILE_EXTRA_NAV = [
  { label: "Infrastructure", href: "/infrastructure" },
  { label: "Downloads", href: "/downloads" },
  { label: "Certificates", href: "/certificates" },
  { label: "Career", href: "/career" },
];

export const ALL_NAV = [...DESKTOP_NAV.slice(0, 4), ...MOBILE_EXTRA_NAV, ...DESKTOP_NAV.slice(4)];

export const MEDIA_FOLDERS = [
  "images/hero",
  "images/products",
  "images/infrastructure",
  "images/gallery",
  "images/blog",
  "images/certificates",
  "images/og",
  "images/branding",
  "downloads",
] as const;

export type MediaFolder = (typeof MEDIA_FOLDERS)[number];
