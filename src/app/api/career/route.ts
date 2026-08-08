import { NextResponse } from "next/server";
import { z } from "zod";

const careerSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  email: z.string().trim().email("Valid email is required"),
  phone: z.string().trim().min(5, "Phone is required").max(30),
  position: z.string().trim().max(200).optional(),
  message: z.string().trim().min(1, "Message is required").max(5000),
  resumeUrl: z.string().url().optional(),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = careerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  console.info("[career application]", {
    ...parsed.data,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ success: true });
}
