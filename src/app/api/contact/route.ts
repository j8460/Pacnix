import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getSupabaseAdmin } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  company: z.string().trim().max(200).optional(),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  email: z.string().trim().email("Valid email is required"),
  product: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`contact:${ip}`, 5, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      {
        status: 429,
        headers: rate.retryAfterMs
          ? { "Retry-After": String(Math.ceil(rate.retryAfterMs / 1000)) }
          : undefined,
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json(
      { error: "Enquiry service is not configured" },
      { status: 503 }
    );
  }

  const { data, error } = await supabase
    .from("inquiries")
    .insert({
      name: parsed.data.name,
      company: parsed.data.company ?? null,
      phone: parsed.data.phone,
      email: parsed.data.email,
      product: parsed.data.product ?? null,
      message: parsed.data.message,
      email_sent: false,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("Failed to save inquiry:", error);
    return NextResponse.json({ error: "Failed to save enquiry" }, { status: 500 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.ENQUIRY_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    try {
      const resend = new Resend(resendKey);
      const { name, company, phone, email, product, message } = parsed.data;
      await resend.emails.send({
        from: "Pacnix Enquiries <onboarding@resend.dev>",
        to: notifyEmail,
        replyTo: email,
        subject: `New enquiry from ${name}`,
        text: [
          `Name: ${name}`,
          company ? `Company: ${company}` : null,
          `Phone: ${phone}`,
          `Email: ${email}`,
          product ? `Product: ${product}` : null,
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      });
      await supabase.from("inquiries").update({ email_sent: true }).eq("id", data.id);
    } catch (err) {
      console.error("Resend email failed:", err);
    }
  }

  return NextResponse.json({ success: true, id: data.id });
}
