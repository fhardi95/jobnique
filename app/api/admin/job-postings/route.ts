import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET — fetch all job postings, newest first
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("job_postings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ postings: data || [] });
  } catch (err) {
    console.error("Admin job-postings GET error:", err);
    return NextResponse.json({ error: "Failed to fetch job postings." }, { status: 500 });
  }
}

// PATCH — update job posting status
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const validStatuses = ["pending", "published", "rejected", "expired"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid id or status." }, { status: 400 });
    }

    const { error } = await supabase
      .from("job_postings")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin job-postings PATCH error:", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
