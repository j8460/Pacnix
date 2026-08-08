import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Inquiry } from "@/lib/types";

type InquiryRow = {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  product: string | null;
  message: string;
  email_sent: boolean;
  created_at: string;
};

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    name: row.name,
    company: row.company ?? undefined,
    phone: row.phone,
    email: row.email,
    product: row.product ?? undefined,
    message: row.message,
    emailSent: row.email_sent,
    createdAt: row.created_at,
  };
}

export async function GET(request: Request) {
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.trim() ?? "";
  const sortParam = searchParams.get("sort") ?? "created_at";
  const sortColumns = {
    created_at: "created_at",
    name: "name",
    email: "email",
    company: "company",
    product: "product",
    email_sent: "email_sent",
  } as const;
  const sort = sortParam in sortColumns ? sortColumns[sortParam as keyof typeof sortColumns] : "created_at";
  const order = searchParams.get("order") === "asc" ? "asc" : "desc";
  const page = Math.max(1, Number(searchParams.get("page") ?? "1") || 1);
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? "20") || 20));
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from("inquiries").select("*", { count: "exact" });

  if (search) {
    const term = `%${search}%`;
    query = query.or(
      `name.ilike.${term},company.ilike.${term},email.ilike.${term},phone.ilike.${term},product.ilike.${term},message.ilike.${term}`
    );
  }

  const { data, error, count } = await query
    .order(sort, { ascending: order === "asc" })
    .range(from, to);

  if (error) {
    console.error("Failed to fetch inquiries:", error);
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 });
  }

  const total = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return NextResponse.json({
    inquiries: (data as InquiryRow[]).map(mapInquiry),
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
}
