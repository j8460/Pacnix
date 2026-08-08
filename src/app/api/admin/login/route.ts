import { NextResponse } from "next/server";
import { z } from "zod";
import { setAdminSession, verifyAdminPassword } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

const loginSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rate = checkRateLimit(`admin-login:${ip}`, 10, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      { error: "Too many login attempts. Please try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Password is required" }, { status: 400 });
  }

  if (!verifyAdminPassword(parsed.data.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}
