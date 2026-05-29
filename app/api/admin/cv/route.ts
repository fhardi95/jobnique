import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET — generate a fresh signed URL for a CV file
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get("path");

    if (!path) {
      return NextResponse.json({ error: "Missing file path." }, { status: 400 });
    }

    // Signed URL valid for 1 hour
    const { data, error } = await supabase.storage
      .from("cvs")
      .createSignedUrl(path, 60 * 60);

    if (error) throw error;
    return NextResponse.json({ url: data.signedUrl });
  } catch (err) {
    console.error("CV signed URL error:", err);
    return NextResponse.json({ error: "Failed to generate download link." }, { status: 500 });
  }
}
