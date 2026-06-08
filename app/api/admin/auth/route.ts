/**
 * app/api/admin/auth/route.ts
 *
 * POST — login: verify password, issue signed httpOnly cookie
 * DELETE — logout: clear the cookie
 *
 * Security changes vs original:
 *  - Uses timingSafeEqual to prevent timing-based password enumeration
 *  - Issues a signed server-side token (not just a boolean flag in sessionStorage)
 *  - Sets httpOnly + Secure + SameSite=Strict cookie — inaccessible to JS
 *  - Rate limit: 5 attempts per 10 minutes per IP
 */

import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";
import { setAdminCookie, clearAdminCookie } from "@/lib/admin-auth";
import { rateLimit, getIP, rateLimitResponse } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  // ── Rate limit login attempts ────────────────────────────────────────────
  const ip = getIP(req);
  const { success, resetIn } = rateLimit(ip, "admin-login", 5, 600);
  if (!success) return rateLimitResponse(resetIn);

  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: "Admin password not configured." }, { status: 500 });
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Timing-safe comparison — prevents attackers from measuring response time
    // to guess password length or characters
    let match = false;
    try {
      match = timingSafeEqual(
        Buffer.from(password.padEnd(72)),
        Buffer.from(adminPassword.padEnd(72))
      ) && password === adminPassword;
    } catch {
      match = false;
    }

    if (!match) {
      return NextResponse.json({ success: false }, { status: 401 });
    }

    // Issue signed cookie — the browser cannot read or tamper with this
    const res = NextResponse.json({ success: true });
    return setAdminCookie(res);

  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

export async function DELETE() {
  const res = NextResponse.json({ success: true });
  return clearAdminCookie(res);
}
