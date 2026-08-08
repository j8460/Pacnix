import {
  dbGetBlogs,
  dbGetCareers,
  dbGetCertificates,
  dbGetCompany,
  dbGetDownloads,
  dbGetFaqs,
  dbGetGallery,
  dbGetIndustries,
  dbGetInfrastructure,
  dbGetProductCategories,
  dbGetProducts,
  dbGetQuality,
  dbGetSiteSettings,
  dbGetTestimonials,
  dbSaveBlogs,
  dbSaveCareers,
  dbSaveCertificates,
  dbSaveCompany,
  dbSaveDownloads,
  dbSaveFaqs,
  dbSaveGallery,
  dbSaveIndustries,
  dbSaveInfrastructure,
  dbSaveProductCategories,
  dbSaveProducts,
  dbSaveQuality,
  dbSaveSiteSettings,
  dbSaveTestimonials,
  seedGet,
} from "./db";
import { normalizeMediaInObject, resolveMediaInObject } from "./media";
import { isSupabaseConfigured } from "./supabase";
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
} from "./types";

function withMedia<T>(data: T): T {
  return isSupabaseConfigured() ? resolveMediaInObject(data) : data;
}

function forSave<T>(data: T): T {
  return normalizeMediaInObject(data);
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSupabaseConfigured()) {
    const row = await dbGetSiteSettings();
    if (row) return withMedia(row);
  }
  return withMedia(seedGet<SiteSettings>("site"));
}

export async function getCompany(): Promise<CompanyContent> {
  if (isSupabaseConfigured()) {
    const row = await dbGetCompany();
    if (row) return withMedia(row);
  }
  return withMedia(seedGet<CompanyContent>("company"));
}

export async function getProducts(): Promise<Product[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetProducts();
    if (rows.length) return withMedia(rows);
  }
  return withMedia(seedGet<Product[]>("products"));
}

export async function getProductCategories(): Promise<ProductCategory[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetProductCategories();
    if (rows.length) return rows;
  }
  return seedGet<ProductCategory[]>("categories");
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((p) => p.slug === slug);
}

export async function getIndustries(): Promise<Industry[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetIndustries();
    if (rows.length) return rows;
  }
  return seedGet<Industry[]>("industries");
}

export async function getInfrastructure(): Promise<InfrastructureSection[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetInfrastructure();
    if (rows.length) return withMedia(rows);
  }
  return withMedia(seedGet<InfrastructureSection[]>("infrastructure"));
}

export async function getQuality(): Promise<QualityContent> {
  if (isSupabaseConfigured()) {
    const row = await dbGetQuality();
    if (row) return row;
  }
  return seedGet<QualityContent>("quality");
}

export async function getGallery(): Promise<GalleryItem[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetGallery();
    if (rows.length) return withMedia(rows);
  }
  return withMedia(seedGet<GalleryItem[]>("gallery"));
}

export async function getCertificates(): Promise<Certificate[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetCertificates();
    if (rows.length) return withMedia(rows);
  }
  return withMedia(seedGet<Certificate[]>("certificates"));
}

export async function getDownloads(): Promise<DownloadItem[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetDownloads();
    if (rows.length) return withMedia(rows);
  }
  return withMedia(seedGet<DownloadItem[]>("downloads"));
}

export async function getBlogs(): Promise<BlogPost[]> {
  let blogs: BlogPost[];
  if (isSupabaseConfigured()) {
    const rows = await dbGetBlogs();
    blogs = rows.length ? rows : seedGet<BlogPost[]>("blogs");
  } else {
    blogs = seedGet<BlogPost[]>("blogs");
  }
  return withMedia(
    [...blogs].sort(
      (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
  );
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | undefined> {
  const blogs = await getBlogs();
  return blogs.find((b) => b.slug === slug);
}

export async function getCareers(): Promise<Career[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetCareers();
    if (rows.length) return rows;
  }
  return seedGet<Career[]>("careers");
}

export async function getTestimonials(): Promise<Testimonial[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetTestimonials();
    if (rows.length) return rows;
  }
  return seedGet<Testimonial[]>("testimonials");
}

export async function getFaqs(): Promise<FAQ[]> {
  if (isSupabaseConfigured()) {
    const rows = await dbGetFaqs();
    if (rows.length) return rows;
  }
  return seedGet<FAQ[]>("faqs");
}

export async function saveSiteSettings(data: SiteSettings) {
  return dbSaveSiteSettings(forSave(data));
}

export async function saveCompany(data: CompanyContent) {
  return dbSaveCompany(forSave(data));
}

export async function saveProducts(data: Product[]) {
  return dbSaveProducts(forSave(data));
}

export async function saveCategories(data: ProductCategory[]) {
  return dbSaveProductCategories(data);
}

export async function saveIndustries(data: Industry[]) {
  return dbSaveIndustries(data);
}

export async function saveInfrastructure(data: InfrastructureSection[]) {
  return dbSaveInfrastructure(forSave(data));
}

export async function saveQuality(data: QualityContent) {
  return dbSaveQuality(data);
}

export async function saveGallery(data: GalleryItem[]) {
  return dbSaveGallery(forSave(data));
}

export async function saveCertificates(data: Certificate[]) {
  return dbSaveCertificates(forSave(data));
}

export async function saveDownloads(data: DownloadItem[]) {
  return dbSaveDownloads(forSave(data));
}

export async function saveBlogs(data: BlogPost[]) {
  return dbSaveBlogs(forSave(data));
}

export async function saveCareers(data: Career[]) {
  return dbSaveCareers(data);
}

export async function saveTestimonials(data: Testimonial[]) {
  return dbSaveTestimonials(data);
}

export async function saveFaqs(data: FAQ[]) {
  return dbSaveFaqs(data);
}

export const collectionSavers = {
  site: saveSiteSettings,
  company: saveCompany,
  products: saveProducts,
  categories: saveCategories,
  industries: saveIndustries,
  infrastructure: saveInfrastructure,
  quality: saveQuality,
  gallery: saveGallery,
  certificates: saveCertificates,
  downloads: saveDownloads,
  blogs: saveBlogs,
  careers: saveCareers,
  testimonials: saveTestimonials,
  faqs: saveFaqs,
} as const;

/** Raw DB content for media reference checks (storage paths, not resolved URLs) */
export async function getAllContentForReferenceCheck(): Promise<unknown[]> {
  if (isSupabaseConfigured()) {
    const [
      site,
      company,
      products,
      categories,
      industries,
      infrastructure,
      quality,
      gallery,
      certificates,
      downloads,
      blogs,
      careers,
      testimonials,
      faqs,
    ] = await Promise.all([
      dbGetSiteSettings(),
      dbGetCompany(),
      dbGetProducts(),
      dbGetProductCategories(),
      dbGetIndustries(),
      dbGetInfrastructure(),
      dbGetQuality(),
      dbGetGallery(),
      dbGetCertificates(),
      dbGetDownloads(),
      dbGetBlogs(),
      dbGetCareers(),
      dbGetTestimonials(),
      dbGetFaqs(),
    ]);

    return [
      site ?? seedGet("site"),
      company ?? seedGet("company"),
      products.length ? products : seedGet("products"),
      categories.length ? categories : seedGet("categories"),
      industries.length ? industries : seedGet("industries"),
      infrastructure.length ? infrastructure : seedGet("infrastructure"),
      quality ?? seedGet("quality"),
      gallery.length ? gallery : seedGet("gallery"),
      certificates.length ? certificates : seedGet("certificates"),
      downloads.length ? downloads : seedGet("downloads"),
      blogs.length ? blogs : seedGet("blogs"),
      careers.length ? careers : seedGet("careers"),
      testimonials.length ? testimonials : seedGet("testimonials"),
      faqs.length ? faqs : seedGet("faqs"),
    ];
  }

  return [
    seedGet("site"),
    seedGet("company"),
    seedGet("products"),
    seedGet("categories"),
    seedGet("industries"),
    seedGet("infrastructure"),
    seedGet("quality"),
    seedGet("gallery"),
    seedGet("certificates"),
    seedGet("downloads"),
    seedGet("blogs"),
    seedGet("careers"),
    seedGet("testimonials"),
    seedGet("faqs"),
  ];
}
