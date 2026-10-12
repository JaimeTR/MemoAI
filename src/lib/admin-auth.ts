import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const ADMIN_COOKIE = "memoai_admin";

// Session token = HMAC of a fixed label keyed by ADMIN_PASSWORD, so rotating the password revokes every session.
// ponytail: single shared admin password, no per-user accounts or expiry list; add Supabase roles if more admins join.
function token(password: string) {
  return createHmac("sha256", password).update("memoai-admin-session").digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return !!expected && safeEqual(token(input), token(expected));
}

export function sessionToken() {
  return token(process.env.ADMIN_PASSWORD || "");
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false; // fail closed when the env var is missing
  const value = (await cookies()).get(ADMIN_COOKIE)?.value;
  return !!value && safeEqual(value, token(expected));
}

/** Returns a 401 response when the caller is not the admin, otherwise null. */
export async function requireAdmin() {
  return (await isAdmin()) ? null : NextResponse.json({ error: "No autorizado" }, { status: 401 });
}
