import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  const supabase = getClient();
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select("id, title, template_id, ats_score, created_at, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ resumes: data });
}

export async function POST(req: NextRequest) {
  const supabase = getClient();
  const userId = req.headers.get("x-user-id");
  if (!userId) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const body = await req.json();
  const { id, title, templateId, data } = body;

  if (id) {
    const { data: updated, error } = await supabase
      .from("resumes")
      .update({ title, template_id: templateId, data })
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabase.from("resume_versions").insert({
      resume_id: id,
      data,
      label: `Auto-save ${new Date().toLocaleTimeString()}`,
    });

    return NextResponse.json({ resume: updated });
  }

  const { data: created, error } = await supabase
    .from("resumes")
    .insert({ user_id: userId, title: title || "My Resume", template_id: templateId, data })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ resume: created }, { status: 201 });
}
