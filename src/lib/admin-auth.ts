import { NextRequest, NextResponse } from "next/server";

/**
 * Shared admin auth.
 *
 * The token is read either from the `admin-token` cookie OR the
 * `x-admin-token` header. Both are compared (timing-insensitive) to
 * ADMIN_TOKEN, which itself falls back to a dev default.
 *
 * Use `requireAdmin(req)` to short-circuit an unauthenticated request — it
 * returns the 401 response for you. Use `isAdminRequest(req)` if you just
 * need the boolean.
 */
export const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "aramsan-admin-2026";

export const ADMIN_COOKIE = "admin-token";

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function readAdminToken(req: NextRequest): string | null {
  const cookieToken = req.cookies.get(ADMIN_COOKIE)?.value;
  if (cookieToken) return cookieToken;
  const headerToken = req.headers.get("x-admin-token");
  if (headerToken) return headerToken;
  return null;
}

export function isAdminRequest(req: NextRequest): boolean {
  const token = readAdminToken(req);
  if (!token) return false;
  return safeEqual(token, ADMIN_TOKEN);
}

export function unauthorized(): NextResponse {
  return NextResponse.json(
    { ok: false, error: "احراز هویت ناموفق" },
    { status: 401 }
  );
}

/** Returns true if authed, otherwise sends a 401 response through `out`. */
export function requireAdmin(
  req: NextRequest,
  out: (resp: NextResponse) => boolean
): boolean {
  if (isAdminRequest(req)) return true;
  out(unauthorized());
  return false;
}
