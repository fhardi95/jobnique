/**
 * app/api/admin/cv/route.ts
 * Security: requireAdminAuth guard added. Also validates path to prevent
 * path traversal — only allows alphanumeric, hyphens, underscores, dots, slashes.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireAdminAuth } from "@/lib/admin-auth";

const SAFE_PATH = /^[\w\-./]+$/;

export async function GET(req: NextRequest) {
  const authError = requireAdminAuth(req);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing file path." }, { status: 400 });
    }

    // Prevent path traversal attacks
    if (!SAFE_PATH.test(path) || path.includes("..")) {
      return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
    }

    const { data, error } = await supabase.storage
      .from("cvs")
      .createSignedUrl(path, 60 * 60); // 1-hour signed URL

    if (error) throw error;
    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error("CV signed URL error:", err);
    return NextResponse.json({ error: "Failed to generate download link." }, { status: 500 });
  }
}
