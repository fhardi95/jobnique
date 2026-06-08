/**
 * app/api/admin/ats-sync/route.ts
 * Security: requireAdminAuth guard added.
 */

import { NextRequest, NextResponse } from "next/server";
import { requireAdminAuth } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/ats-sync`, {
      method: "POST",
      headers: { "x-cron-secret": process.env.CRON_SECRET || "" },
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[Admin Sync] Error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}
