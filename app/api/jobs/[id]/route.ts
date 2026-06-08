import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("ats_jobs")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  return NextResponse.json({
    id:            data.id,
    title:         data.title,
    company:       { display_name: data.company },
    location:      { display_name: data.location },
    salary_min:    data.salary_min,
    salary_max:    data.salary_max,
    description:   data.description,
    redirect_url:  data.ats_apply_url,
    ats_apply_url: data.ats_apply_url,
    source:        data.source,
    contract_time: data.contract_time,
    created:       data.posted_at,
    category:      data.category ? { label: data.category } : null,
  });
}
