"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { Product } from "@/lib/types";

const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be under 100 characters"),
  company: z.string().trim().max(200).optional(),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15, "Phone number is too long")
    .regex(/^[+\d\s\-()]{10,15}$/, "Enter a valid phone number"),
  email: z.string().trim().email("Enter a valid email address"),
  product: z.string().trim().max(200).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must be under 2000 characters"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof contactSchema>, string>>;

type Props = {
  products?: Product[];
  defaultProduct?: string;
};

export function ContactForm({ products = [], defaultProduct }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    company: "",
    phone: "",
    email: "",
    product: defaultProduct ?? "",
    message: "",
  });

  const update = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FieldErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      ...form,
      company: form.company || undefined,
      product: form.product || undefined,
    };

    const parsed = contactSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      parsed.error.errors.forEach((err) => {
        const key = err.path[0] as keyof FieldErrors;
        if (!fieldErrors[key]) fieldErrors[key] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Failed to send enquiry. Please try again.");
        return;
      }

      toast.success("Thank you! Your enquiry has been submitted.");
      setForm({ name: "", company: "", phone: "", email: "", product: "", message: "" });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="contact-name">Full name *</Label>
          <Input
            id="contact-name"
            name="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
          />
          {errors.name && (
            <p id="contact-name-error" className="text-xs text-red-600">{errors.name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-company">Company</Label>
          <Input
            id="contact-company"
            name="company"
            value={form.company}
            onChange={(e) => update("company", e.target.value)}
            placeholder="Company name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-phone">Phone *</Label>
          <Input
            id="contact-phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "contact-phone-error" : undefined}
          />
          {errors.phone && (
            <p id="contact-phone-error" className="text-xs text-red-600">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email">Email *</Label>
          <Input
            id="contact-email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@company.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "contact-email-error" : undefined}
          />
          {errors.email && (
            <p id="contact-email-error" className="text-xs text-red-600">{errors.email}</p>
          )}
        </div>
      </div>

      {products.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="contact-product">Product interest</Label>
          <select
            id="contact-product"
            name="product"
            value={form.product}
            onChange={(e) => update("product", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <option value="">Select a product (optional)</option>
            {products.map((p) => (
              <option key={p.slug} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="contact-message">Message *</Label>
        <Textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your requirements, quantities, and timeline…"
          rows={5}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
        />
        {errors.message && (
          <p id="contact-message-error" className="text-xs text-red-600">{errors.message}</p>
        )}
      </div>

      <Button type="submit" variant="secondary" size="lg" disabled={submitting} className="w-full sm:w-auto">
        {submitting ? "Sending…" : "Send Enquiry"}
      </Button>
    </form>
  );
}
