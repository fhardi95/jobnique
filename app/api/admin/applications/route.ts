import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET — fetch all applications, newest first
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ applications: data || [] });
  } catch (err) {
    console.error("Admin GET error:", err);
    return NextResponse.json({ error: "Failed to fetch applications." }, { status: 500 });
  }
}

// PATCH — update application status
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();

    const validStatuses = ["new", "reviewing", "shortlisted", "rejected"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid id or status." }, { status: 400 });
    }

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin PATCH error:", err);
    return NextResponse.json({ error: "Failed to update status." }, { status: 500 });
  }
}
