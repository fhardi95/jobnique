/**
 * lib/admin-auth.ts
 *
 * Server-side admin authentication for all /api/admin/* routes.
 *
 * How it works:
 *  1. The admin login page calls POST /api/admin/auth with the password.
 *  2. On success, the server generates a signed HMAC token and sets it
 *     in a secure, httpOnly, SameSite=Strict cookie called "admin_token".
 *  3. Every /api/admin/* route calls requireAdminAuth(req) at the top.
 *     If the cookie is missing or the signature is invalid → 401.
 *  4. No token data ever touches the browser JS environment.
 *
 * Environment variables required (add to Vercel):
 *   ADMIN_PASSWORD   — the admin login password (already exists)
 *   ADMIN_TOKEN_SECRET — a long random string used to sign tokens
 *                        generate with: openssl rand -hex 32
 */

import { NextRequest, NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "admin_token";
const TOKEN_TTL_HOURS = 12; // cookie expires after 12 hours of inactivity

// ── Token generation ────────────────────────────────────────────────────────

function getSecret(): string {
  const secret = process.env.ADMIN_TOKEN_SECRET;
  if (!secret) throw new Error("ADMIN_TOKEN_SECRET env var is not set.");
  return secret;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Creates a signed token: "expiry.signature" */
export function createAdminToken(): string {
  const expiry = Date.now() + TOKEN_TTL_HOURS * 60 * 60 * 1000;
  const payload = String(expiry);
  const sig = sign(payload);
  return `${payload}.${sig}`;
}

/** Returns true if the token is valid and not expired. */
export function verifyAdminToken(token: string): boolean {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return false;

    const payload = token.slice(0, dot);
    const sig = token.slice(dot + 1);

    // Timing-safe signature check
    const expected = sign(payload);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;

    // Expiry check
    const expiry = Number(payload);
    if (isNaN(expiry) || Date.now() > expiry) return false;

    return true;
  } catch {
    return false;
  }
}

// ── Middleware helper ────────────────────────────────────────────────────────

/** Call this at the top of every /api/admin/* route handler.
 *  Returns null if the request is authorised.
 *  Returns a 401 NextResponse if not — return it immediately from the handler. */
export function requireAdminAuth(req: NextRequest | Request): NextResponse | null {
  const cookieHeader = (req.headers as Headers).get("cookie") ?? "";
  const token = parseCookie(cookieHeader, COOKIE_NAME);

  if (!token || !verifyAdminToken(token)) {
    return NextResponse.json(
      { error: "Unauthorised. Please log in to the admin dashboard." },
      { status: 401 }
    );
  }
  return null; // authorised
}

// ── Cookie helpers ───────────────────────────────────────────────────────────

function parseCookie(header: string, name: string): string | null {
  const match = header.match(new RegExp(`(?:^|;)\\s*${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Call this from POST /api/admin/auth after a successful password check.
 *  Returns a NextResponse with the Set-Cookie header already applied. */
export function setAdminCookie(response: NextResponse): NextResponse {
  const token = createAdminToken();
  const maxAge = TOKEN_TTL_HOURS * 60 * 60;
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; HttpOnly; Secure; SameSite=Strict`
  );
  return response;
}

/** Call this on logout to clear the cookie. */
export function clearAdminCookie(response: NextResponse): NextResponse {
  response.headers.set(
    "Set-Cookie",
    `${COOKIE_NAME}=; Max-Age=0; Path=/; HttpOnly; Secure; SameSite=Strict`
  );
  return response;
}
