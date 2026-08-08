import type { ContentCollection } from "@/lib/types";

export type AdminNavItem = {
  label: string;
  href: string;
  icon?: string;
};

export const ADMIN_MAIN_NAV: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "Inquiries", href: "/admin/inquiries" },
  { label: "Media", href: "/admin/media" },
];

export const ADMIN_CONTENT_NAV: { label: string; collection: ContentCollection }[] = [
  { label: "Site Settings", collection: "site" },
  { label: "Company", collection: "company" },
  { label: "Products", collection: "products" },
  { label: "Categories", collection: "categories" },
  { label: "Industries", collection: "industries" },
  { label: "Infrastructure", collection: "infrastructure" },
  { label: "Quality", collection: "quality" },
  { label: "Gallery", collection: "gallery" },
  { label: "Certificates", collection: "certificates" },
  { label: "Downloads", collection: "downloads" },
  { label: "Blogs", collection: "blogs" },
  { label: "Careers", collection: "careers" },
  { label: "Testimonials", collection: "testimonials" },
  { label: "FAQs", collection: "faqs" },
];

export const OBJECT_COLLECTIONS = new Set<ContentCollection>(["site", "company", "quality"]);

export function getCollectionEditorType(
  collection: ContentCollection
): "object" | "array" | "products" {
  if (collection === "products") return "products";
  if (OBJECT_COLLECTIONS.has(collection)) return "object";
  return "array";
}
