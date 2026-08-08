import Link from "next/link";
import {
  FileText,
  ImageIcon,
  MessageSquare,
  Package,
  Database,
} from "lucide-react";
import {
  getBlogs,
  getCareers,
  getFaqs,
  getProducts,
  getTestimonials,
} from "@/lib/cms";
import { getCmsStorageMode, getSupabaseAdmin } from "@/lib/supabase";

async function getInquiryCount(): Promise<number | null> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;
  const { count, error } = await supabase
    .from("inquiries")
    .select("*", { count: "exact", head: true });
  if (error) return null;
  return count ?? 0;
}

export default async function AdminDashboardPage() {
  const [products, blogs, careers, testimonials, faqs, inquiryCount, storageMode] =
    await Promise.all([
      getProducts(),
      getBlogs(),
      getCareers(),
      getTestimonials(),
      getFaqs(),
      getInquiryCount(),
      getCmsStorageMode(),
    ]);

  const stats = [
    {
      label: "Products",
      value: products.length,
      href: "/admin/content/products",
      icon: Package,
      color: "text-primary",
    },
    {
      label: "Blog posts",
      value: blogs.length,
      href: "/admin/content/blogs",
      icon: FileText,
      color: "text-emerald-600",
    },
    {
      label: "Inquiries",
      value: inquiryCount ?? "—",
      href: "/admin/inquiries",
      icon: MessageSquare,
      color: "text-orange-600",
    },
    {
      label: "CMS storage",
      value: storageMode === "supabase" ? "Supabase" : "Seed",
      href: "/admin/content/site",
      icon: Database,
      color: "text-violet-600",
    },
  ];

  const quickLinks = [
    { label: "Manage media", href: "/admin/media", icon: ImageIcon },
    { label: "View inquiries", href: "/admin/inquiries", icon: MessageSquare },
    { label: "Edit company info", href: "/admin/content/company", icon: FileText },
    { label: "Edit products", href: "/admin/content/products", icon: Package },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">
          Overview of Pacnix India website content and enquiries.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{stat.value}</p>
              </div>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Quick links</h2>
          <ul className="mt-4 space-y-2">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <link.icon className="h-4 w-4 text-primary" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Content summary</h2>
          <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-500">Careers</dt>
              <dd className="text-xl font-semibold text-slate-900">{careers.length}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Testimonials</dt>
              <dd className="text-xl font-semibold text-slate-900">{testimonials.length}</dd>
            </div>
            <div>
              <dt className="text-slate-500">FAQs</dt>
              <dd className="text-xl font-semibold text-slate-900">{faqs.length}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Featured products</dt>
              <dd className="text-xl font-semibold text-slate-900">
                {products.filter((p) => p.featured).length}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
