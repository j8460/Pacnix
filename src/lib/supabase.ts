import { createClient, SupabaseClient } from "@supabase/supabase-js";

let supabaseAdmin: SupabaseClient | null = null;

/** Normalize URL — strip accidental /rest/v1/ suffix from dashboard copy-paste */
export function getSupabaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return undefined;
  return raw.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
}

/**
 * Server-side secret key (replaces legacy service_role JWT).
 * Accepts SUPABASE_SECRET_KEY or legacy SUPABASE_SERVICE_ROLE_KEY.
 */
export function getSecretKey(): string | undefined {
  return process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
}

/**
 * Client-side publishable key (replaces legacy anon JWT).
 * Accepts NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or legacy NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
export function getPublishableKey(): string | undefined {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(getSupabaseUrl() && getSecretKey());
}

export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (!supabaseAdmin) {
    supabaseAdmin = createClient(getSupabaseUrl()!, getSecretKey()!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return supabaseAdmin;
}

/** Browser-safe client using the publishable key (respects RLS) */
export function getSupabasePublic(): SupabaseClient | null {
  const url = getSupabaseUrl();
  const key = getPublishableKey();
  if (!url || !key) return null;
  return createClient(url, key);
}

export { getCmsStorageMode } from "./db";
