// Server-only helpers for admin-protected site content mutations.
import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Validates the admin access code against the server-only secret.
 * Reads the env var at call time (edge runtimes inject env per request) and
 * trims both sides so a trailing newline in the stored secret can't lock the
 * admin out on the deployed site.
 */
export function assertAdmin(code: string) {
  const raw = process.env.ADMIN_ACCESS_CODE ?? process.env.ADMIN_CODE;
  const expected = (raw ?? "").trim();
  if (!expected) throw new Error("Admin access is not configured on the server");
  if ((code ?? "").trim() !== expected) throw new Error("Invalid Admin Code");
}


export function admin() {
  return supabaseAdmin;
}

export function sanitizeUrl(url: string) {
  const trimmed = url.trim();
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function sanitizeImage(value: string | null | undefined) {
  if (!value) return null;
  const v = value.trim();
  if (!v) return null;
  const ok = /^https?:\/\//i.test(v) || /^data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,/i.test(v);
  if (!ok) throw new Error("Image must be a valid URL or uploaded image file");
  if (v.length > 900_000) throw new Error("Image is too large (max ~600KB)");
  return v;
}
