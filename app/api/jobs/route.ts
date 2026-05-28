/**
 * GET /api/jobs
 *
 * Unified jobs API — blends:
 *   1. ATS jobs from Supabase (Greenhouse / Lever / Workday) — shown FIRST
 *   2. Adzuna jobs (fallback / supplemental)
 *
 * Query params:
 *   q         — keyword / title search
 *   location  — city or state
 *   page      — 1-based
 *   source    — "ats" | "adzuna" | "all" (default: "all")
 */

import { NextResponse } from "next/server";
import { supabase }     from "@/lib/supabase";

const RESULTS_PER_PAGE = 20;

// ── Fetch ATS jobs from Supabase ─────────────────────────────────────────
async function getAtsJobs(q: string, location: string, page: number) {
  let query = supabase
    .from("ats_jobs")
    .select("*", { count: "exact" })
    .eq("expired", false)
    .order("posted_at", { ascending: false });

  if (q) {
    query = query.or(
      `title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%,department.ilike.%${q}%`
    );
  }

  if (location) {
    if (/^remote$/i.test(location)) {
      query = query.eq("remote", true);
    } else {
      query = query.ilike("location", `%${location}%`);
    }
  }

  query = query.range(
    (page - 1) * RESULTS_PER_PAGE,
    page * RESULTS_PER_PAGE - 1
  );

  const { data, count, error } = await query;

  if (error) {
    console.error("[Jobs API] Supabase ATS query error:", error);
    return { results: [], count: 0 };
  }

  // Normalise Supabase row → client job shape
  const results = (data || []).map((row) => ({
    id:             row.id,
    source:         row.source,
    title:          row.title,
    company:        { display_name: row.company },
    location:       { display_name: row.location },
    salary_min:     row.salary_min,
    salary_max:     row.salary_max,
    description:    row.description,
    redirect_url:   row.ats_apply_url,   // used by job detail "apply externally"
    ats_apply_url:  row.ats_apply_url,
    contract_time:  row.contract_time,
    created:        row.posted_at,
    category:       row.category ? { label: row.category } : undefined,
    department:     row.department,
    remote:         row.remote,
  }));

  return { results, count: count ?? 0 };
}

// ── Fetch Adzuna jobs ────────────────────────────────────────────────────
async function getAdzunaJobs(q: string, location: string, page: number) {
  const APP_ID  = process.env.ADZUNA_APP_ID  || "demo";
  const APP_KEY = process.env.ADZUNA_APP_KEY || "demo";
  const country = "us";

  let url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=${RESULTS_PER_PAGE}&content-type=application/json`;
  if (q)        url += `&what=${encodeURIComponent(q)}`;
  if (location) url += `&where=${encodeURIComponent(location)}`;

  try {
    const res = await fetch(url, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(`Adzuna ${res.status}`);
    const data = await res.json();
    return {
      results: (data.results || []).map((j: Record<string, unknown>) => ({ ...j, source: "adzuna" })),
      count:   data.count || 0,
    };
  } catch (err) {
    console.warn("[Jobs API] Adzuna fallback:", err);
    return { results: [], count: 0 };
  }
}

// ── Route handler ────────────────────────────────────────────────────────
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q        = searchParams.get("q")        || "";
  const location = searchParams.get("location") || "";
  const page     = parseInt(searchParams.get("page") || "1", 10);
  const source   = searchParams.get("source")   || "all";

  try {
    if (source === "ats") {
      const ats = await getAtsJobs(q, location, page);
      return NextResponse.json({ results: ats.results, count: ats.count, source: "ats" });
    }

    if (source === "adzuna") {
      const az = await getAdzunaJobs(q, location, page);
      return NextResponse.json({ results: az.results, count: az.count, source: "adzuna" });
    }

    // "all" mode — ATS first, then Adzuna to fill remainder
    const [ats, adzuna] = await Promise.all([
      getAtsJobs(q, location, page),
      getAdzunaJobs(q, location, page),
    ]);

    // Merge: ATS jobs first, then Adzuna (deduplicated by title+company)
    const seen = new Set(ats.results.map((j: { title: string; company: { display_name: string } }) =>
      `${j.title.toLowerCase()}|${j.company.display_name.toLowerCase()}`
    ));
    const uniqueAdzuna = adzuna.results.filter((j: { title: string; company: { display_name: string } }) =>
      !seen.has(`${j.title.toLowerCase()}|${j.company.display_name.toLowerCase()}`)
    );

    const results = [...ats.results, ...uniqueAdzuna].slice(0, RESULTS_PER_PAGE);
    const count   = ats.count + adzuna.count;

    return NextResponse.json({ results, count, source: "all" });

  } catch (err) {
    console.error("[Jobs API] Unexpected error:", err);
    return NextResponse.json({ results: [], count: 0, error: "Failed to load jobs" }, { status: 500 });
  }
}
