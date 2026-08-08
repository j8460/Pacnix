import seedData from "@/data/seed.json";
import { normalizeMediaInObject } from "../media";
import { getSupabaseAdmin, isSupabaseConfigured } from "../supabase";
import type { ContentCollection } from "../types";
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
import {
  blogToRow,
  careerToRow,
  categoryToRow,
  certificateToRow,
  companyToRow,
  downloadToRow,
  faqToRow,
  galleryToRow,
  industryToRow,
  infrastructureToRow,
  productToRow,
  qualityToRow,
  rowToBlog,
  rowToCareer,
  rowToCategory,
  rowToCertificate,
  rowToCompany,
  rowToDownload,
  rowToFaq,
  rowToGallery,
  rowToIndustry,
  rowToInfrastructure,
  rowToProduct,
  rowToQuality,
  rowToSiteSettings,
  rowToTestimonial,
  siteSettingsToRow,
  testimonialToRow,
  type BlogRow,
  type CareerRow,
  type CertificateRow,
  type CompanyRow,
  type DownloadRow,
  type FaqRow,
  type GalleryRow,
  type IndustryRow,
  type InfrastructureRow,
  type ProductCategoryRow,
  type ProductRow,
  type QualityRow,
  type SiteSettingsRow,
  type TestimonialRow,
} from "./mappers";

const seed = seedData as Record<string, unknown>;

function requireSupabase() {
  const supabase = getSupabaseAdmin();
  if (!supabase) throw new Error("CMS not configured — set Supabase environment variables");
  return supabase;
}

/** Replace all rows in a table: delete missing IDs, upsert new set */
async function syncTable<T extends { id?: string; slug?: string }>(
  table: string,
  items: T[],
  toRow: (item: T, index: number) => Record<string, unknown>,
  idField: "id" | "slug"
): Promise<void> {
  const supabase = requireSupabase();
  const rows = items.map((item, i) => toRow(item, i));
  const ids = items.map((item) => item[idField] as string);

  const { data: existing } = await supabase.from(table).select(idField);
  const existingIds = (existing ?? []).map((r) => (r as Record<string, string>)[idField]);
  const toDelete = existingIds.filter((id) => !ids.includes(id));

  if (toDelete.length > 0) {
    const { error: delError } = await supabase.from(table).delete().in(idField, toDelete);
    if (delError) throw new Error(delError.message);
  }

  if (rows.length > 0) {
    const { error } = await supabase.from(table).upsert(rows);
    if (error) throw new Error(error.message);
  }
}

// ─── Read ──────────────────────────────────────────────────────────────────────

export async function dbGetSiteSettings(): Promise<SiteSettings | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from("site_settings").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return rowToSiteSettings(data as SiteSettingsRow);
}

export async function dbGetCompany(): Promise<CompanyContent | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from("company").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return rowToCompany(data as CompanyRow);
}

export async function dbGetQuality(): Promise<QualityContent | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { data, error } = await supabase.from("quality").select("*").eq("id", 1).maybeSingle();
  if (error || !data) return null;
  return rowToQuality(data as QualityRow);
}

export async function dbGetProductCategories(): Promise<ProductCategory[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("product_categories")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as ProductCategoryRow[]).map(rowToCategory);
}

export async function dbGetProducts(): Promise<Product[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("products").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as ProductRow[]).map(rowToProduct);
}

export async function dbGetIndustries(): Promise<Industry[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("industries").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as IndustryRow[]).map(rowToIndustry);
}

export async function dbGetInfrastructure(): Promise<InfrastructureSection[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("infrastructure_sections")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as InfrastructureRow[]).map(rowToInfrastructure);
}

export async function dbGetGallery(): Promise<GalleryItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as GalleryRow[]).map(rowToGallery);
}

export async function dbGetCertificates(): Promise<Certificate[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("certificates").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as CertificateRow[]).map(rowToCertificate);
}

export async function dbGetDownloads(): Promise<DownloadItem[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("downloads").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as DownloadRow[]).map(rowToDownload);
}

export async function dbGetBlogs(): Promise<BlogPost[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false, nullsFirst: false });
  if (error || !data) return [];
  return (data as BlogRow[]).map(rowToBlog);
}

export async function dbGetCareers(): Promise<Career[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("careers").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as CareerRow[]).map(rowToCareer);
}

export async function dbGetTestimonials(): Promise<Testimonial[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("testimonials").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as TestimonialRow[]).map(rowToTestimonial);
}

export async function dbGetFaqs(): Promise<FAQ[]> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return [];
  const { data, error } = await supabase.from("faqs").select("*").order("sort_order", { ascending: true });
  if (error || !data) return [];
  return (data as FaqRow[]).map(rowToFaq);
}

export async function dbHasData(): Promise<boolean> {
  const site = await dbGetSiteSettings();
  return site !== null;
}

// ─── Write ─────────────────────────────────────────────────────────────────────

export async function dbSaveSiteSettings(data: SiteSettings): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("site_settings").upsert(siteSettingsToRow(data));
  if (error) throw new Error(error.message);
}

export async function dbSaveCompany(data: CompanyContent): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("company").upsert(companyToRow(data));
  if (error) throw new Error(error.message);
}

export async function dbSaveQuality(data: QualityContent): Promise<void> {
  const supabase = requireSupabase();
  const { error } = await supabase.from("quality").upsert(qualityToRow(data));
  if (error) throw new Error(error.message);
}

export async function dbSaveProductCategories(data: ProductCategory[]): Promise<void> {
  await syncTable("product_categories", data, categoryToRow, "id");
}

export async function dbSaveProducts(data: Product[]): Promise<void> {
  await syncTable("products", data, productToRow, "slug");
}

export async function dbSaveIndustries(data: Industry[]): Promise<void> {
  await syncTable("industries", data, industryToRow, "id");
}

export async function dbSaveInfrastructure(data: InfrastructureSection[]): Promise<void> {
  await syncTable("infrastructure_sections", data, infrastructureToRow, "id");
}

export async function dbSaveGallery(data: GalleryItem[]): Promise<void> {
  await syncTable("gallery_items", data, galleryToRow, "id");
}

export async function dbSaveCertificates(data: Certificate[]): Promise<void> {
  await syncTable("certificates", data, certificateToRow, "id");
}

export async function dbSaveDownloads(data: DownloadItem[]): Promise<void> {
  await syncTable("downloads", data, downloadToRow, "id");
}

export async function dbSaveBlogs(data: BlogPost[]): Promise<void> {
  await syncTable("blog_posts", data, (item) => blogToRow(item), "slug");
}

export async function dbSaveCareers(data: Career[]): Promise<void> {
  await syncTable("careers", data, careerToRow, "id");
}

export async function dbSaveTestimonials(data: Testimonial[]): Promise<void> {
  await syncTable("testimonials", data, testimonialToRow, "id");
}

export async function dbSaveFaqs(data: FAQ[]): Promise<void> {
  await syncTable("faqs", data, faqToRow, "id");
}

// ─── Seed fallback helpers ─────────────────────────────────────────────────────

export function seedGet<T>(collection: ContentCollection): T {
  return (seed[collection] ?? (collection.endsWith("s") ? [] : {})) as T;
}

export async function getCmsStorageMode(): Promise<"supabase" | "seed"> {
  if (!isSupabaseConfigured()) return "seed";
  const hasData = await dbHasData();
  return hasData ? "supabase" : "seed";
}

// ─── Admin API: get/save by collection name ────────────────────────────────────

export async function getCollectionData(collection: ContentCollection): Promise<unknown> {
  switch (collection) {
    case "site":
      return (await dbGetSiteSettings()) ?? seedGet<SiteSettings>("site");
    case "company":
      return (await dbGetCompany()) ?? seedGet<CompanyContent>("company");
    case "quality":
      return (await dbGetQuality()) ?? seedGet<QualityContent>("quality");
    case "categories": {
      const rows = await dbGetProductCategories();
      return rows.length ? rows : seedGet<ProductCategory[]>("categories");
    }
    case "products": {
      const rows = await dbGetProducts();
      return rows.length ? rows : seedGet<Product[]>("products");
    }
    case "industries": {
      const rows = await dbGetIndustries();
      return rows.length ? rows : seedGet<Industry[]>("industries");
    }
    case "infrastructure": {
      const rows = await dbGetInfrastructure();
      return rows.length ? rows : seedGet<InfrastructureSection[]>("infrastructure");
    }
    case "gallery": {
      const rows = await dbGetGallery();
      return rows.length ? rows : seedGet<GalleryItem[]>("gallery");
    }
    case "certificates": {
      const rows = await dbGetCertificates();
      return rows.length ? rows : seedGet<Certificate[]>("certificates");
    }
    case "downloads": {
      const rows = await dbGetDownloads();
      return rows.length ? rows : seedGet<DownloadItem[]>("downloads");
    }
    case "blogs": {
      const rows = await dbGetBlogs();
      return rows.length ? rows : seedGet<BlogPost[]>("blogs");
    }
    case "careers": {
      const rows = await dbGetCareers();
      return rows.length ? rows : seedGet<Career[]>("careers");
    }
    case "testimonials": {
      const rows = await dbGetTestimonials();
      return rows.length ? rows : seedGet<Testimonial[]>("testimonials");
    }
    case "faqs": {
      const rows = await dbGetFaqs();
      return rows.length ? rows : seedGet<FAQ[]>("faqs");
    }
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
}

export async function saveCollectionData(collection: ContentCollection, data: unknown): Promise<void> {
  switch (collection) {
    case "site":
      return dbSaveSiteSettings(data as SiteSettings);
    case "company":
      return dbSaveCompany(data as CompanyContent);
    case "quality":
      return dbSaveQuality(data as QualityContent);
    case "categories":
      return dbSaveProductCategories(data as ProductCategory[]);
    case "products":
      return dbSaveProducts(data as Product[]);
    case "industries":
      return dbSaveIndustries(data as Industry[]);
    case "infrastructure":
      return dbSaveInfrastructure(data as InfrastructureSection[]);
    case "gallery":
      return dbSaveGallery(data as GalleryItem[]);
    case "certificates":
      return dbSaveCertificates(data as Certificate[]);
    case "downloads":
      return dbSaveDownloads(data as DownloadItem[]);
    case "blogs":
      return dbSaveBlogs(data as BlogPost[]);
    case "careers":
      return dbSaveCareers(data as Career[]);
    case "testimonials":
      return dbSaveTestimonials(data as Testimonial[]);
    case "faqs":
      return dbSaveFaqs(data as FAQ[]);
    default:
      throw new Error(`Unknown collection: ${collection}`);
  }
}

/** Seed all tables from seed.json (media paths normalized for cloud storage) */
export async function seedAllTables(): Promise<void> {
  await dbSaveSiteSettings(normalizeMediaInObject(seedGet<SiteSettings>("site")));
  await dbSaveCompany(normalizeMediaInObject(seedGet<CompanyContent>("company")));
  await dbSaveQuality(seedGet<QualityContent>("quality"));
  await dbSaveProductCategories(seedGet<ProductCategory[]>("categories"));
  await dbSaveProducts(normalizeMediaInObject(seedGet<Product[]>("products")));
  await dbSaveIndustries(seedGet<Industry[]>("industries"));
  await dbSaveInfrastructure(normalizeMediaInObject(seedGet<InfrastructureSection[]>("infrastructure")));
  await dbSaveGallery(normalizeMediaInObject(seedGet<GalleryItem[]>("gallery")));
  await dbSaveCertificates(normalizeMediaInObject(seedGet<Certificate[]>("certificates")));
  await dbSaveDownloads(normalizeMediaInObject(seedGet<DownloadItem[]>("downloads")));
  await dbSaveBlogs(normalizeMediaInObject(seedGet<BlogPost[]>("blogs")));
  await dbSaveCareers(seedGet<Career[]>("careers"));
  await dbSaveTestimonials(seedGet<Testimonial[]>("testimonials"));
  await dbSaveFaqs(seedGet<FAQ[]>("faqs"));
}
