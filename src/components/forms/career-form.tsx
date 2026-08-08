"use client";

import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import type { Career } from "@/lib/types";

const careerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .regex(/^[+\d\s\-()]{10,15}$/, "Enter a valid phone number"),
  position: z.string().trim().min(1, "Select a position"),
  message: z
    .string()
    .trim()
    .min(10, "Cover letter must be at least 10 characters")
    .max(3000),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof careerSchema>, string>>;

type Props = {
  careers: Career[];
  defaultPosition?: string;
};

export function CareerForm({ careers, defaultPosition }: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: defaultPosition ?? careers[0]?.id ?? "",
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

    const parsed = careerSchema.safeParse(form);
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
      const res = await fetch("/api/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        toast.error(data.error ?? "Failed to submit application.");
        return;
      }

      toast.success("Application submitted! We'll review your profile.");
      setForm({
        name: "",
        email: "",
        phone: "",
        position: careers[0]?.id ?? "",
        message: "",
      });
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
          <Label htmlFor="career-name">Full name *</Label>
          <Input
            id="career-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your name"
            aria-invalid={!!errors.name}
          />
          {errors.name && <p className="text-xs text-red-600">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="career-email">Email *</Label>
          <Input
            id="career-email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@email.com"
            aria-invalid={!!errors.email}
          />
          {errors.email && <p className="text-xs text-red-600">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="career-phone">Phone *</Label>
          <Input
            id="career-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 XXXXX XXXXX"
            aria-invalid={!!errors.phone}
          />
          {errors.phone && <p className="text-xs text-red-600">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="career-position">Position *</Label>
          <select
            id="career-position"
            value={form.position}
            onChange={(e) => update("position", e.target.value)}
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            aria-invalid={!!errors.position}
          >
            {careers.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
          {errors.position && <p className="text-xs text-red-600">{errors.position}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="career-message">Cover letter *</Label>
        <Textarea
          id="career-message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your experience and why you'd be a great fit…"
          rows={6}
          aria-invalid={!!errors.message}
        />
        {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="career-resume">Resume (optional)</Label>
        <Input id="career-resume" type="file" accept=".pdf,.doc,.docx" disabled className="text-sm" />
        <p className="text-xs text-slate-500">File upload coming soon — include links in your cover letter for now.</p>
      </div>

      <Button type="submit" variant="secondary" disabled={submitting}>
        {submitting ? "Submitting…" : "Submit Application"}
      </Button>
    </form>
  );
}
