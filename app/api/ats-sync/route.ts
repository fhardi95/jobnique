import { NextResponse } from "next/server";
import { fetchGreenhouseJobs } from "@/lib/ats/greenhouse";
import { fetchLeverJobs }      from "@/lib/ats/lever";
import { fetchWorkdayJobs }    from "@/lib/ats/workday";
import { createClient }        from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export const maxDuration = 60;

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    console.log("[ATS Sync] Starting...");

    // ── Read active sources from Supabase ──────────────────────────────
    const { data: sources, error: srcError } = await supabase
      .from("ats_sources")
      .select("*")
      .eq("active", true);

    if (srcError) throw srcError;
    if (!sources || sources.length === 0) {
      return NextResponse.json({ ok: true, upserted: 0, message: "No active sources configured." });
    }

    console.log(`[ATS Sync] Found ${sources.length} active sources`);

    // ── Also read env var sources as fallback ──────────────────────────
    const envGreenhouse = (process.env.GREENHOUSE_BOARD_TOKENS || "").split(",").map(t => t.trim()).filter(Boolean);
    const envLever      = (process.env.LEVER_SITE_SLUGS || "").split(",").map(t => t.trim()).filter(Boolean);
    const envWorkday    = (process.env.WORKDAY_TENANTS || "").split(",").map(t => t.trim()).filter(Boolean);

    // Merge DB sources + env var sources (deduplicated)
    const dbTokens = new Set(sources.map((s: { platform: string; token: string }) => `${s.platform}:${s.token}`));

    const allGreenhouse = [...sources.filter((s: { platform: string }) => s.platform === "greenhouse").map((s: { token: string }) => s.token),
      ...envGreenhouse.filter(t => !dbTokens.has(`greenhouse:${t}`))];
    const allLever      = [...sources.filter((s: { platform: string }) => s.platform === "lever").map((s: { token: string }) => s.token),
      ...envLever.filter(t => !dbTokens.has(`lever:${t}`))];
    const allWorkday    = [...sources.filter((s: { platform: string }) => s.platform === "workday").map((s: { token: string }) => s.token),
      ...envWorkday.filter(t => !dbTokens.has(`workday:${t}`))];

    // ── Fetch all jobs in parallel ─────────────────────────────────────
    const [ghResults, lvResults, wdResults] = await Promise.all([
      Promise.allSettled(allGreenhouse.map(fetchGreenhouseJobs)),
      Promise.allSettled(allLever.map(fetchLeverJobs)),
      Promise.allSettled(allWorkday.map(t => {
        const [tenant, site] = t.split(":");
        return fetchWorkdayJobs(tenant, site || "External_Career_Site");
      })),
    ]);

    const jobs = [
      ...ghResults.flatMap(r => r.status === "fulfilled" ? r.value : []),
      ...lvResults.flatMap(r => r.status === "fulfilled" ? r.value : []),
      ...wdResults.flatMap(r => r.status === "fulfilled" ? r.value : []),
    ];

    const counts = {
      greenhouse: ghResults.flatMap(r => r.status === "fulfilled" ? r.value : []).length,
      lever:      lvResults.flatMap(r => r.status === "fulfilled" ? r.value : []).length,
      workday:    wdResults.flatMap(r => r.status === "fulfilled" ? r.value : []).length,
    };

    console.log(`[ATS Sync] Fetched: GH=${counts.greenhouse} Lever=${counts.lever} WD=${counts.workday}`);

    if (jobs.length === 0) {
      return NextResponse.json({ ok: true, upserted: 0, sources: counts });
    }

    // ── Upsert in batches ──────────────────────────────────────────────
    const BATCH = 100;
    let upserted = 0;

    for (let i = 0; i < jobs.length; i += BATCH) {
      const batch = jobs.slice(i, i + BATCH).map(job => ({
        id:            job.id,
        source:        job.source,
        ats_apply_url: job.ats_apply_url,
        title:         job.title,
        company:       job.company.display_name,
        location:      job.location.display_name,
        salary_min:    job.salary_min ?? null,
        salary_max:    job.salary_max ?? null,
        description:   job.description,
        contract_time: job.contract_time ?? null,
        department:    job.department ?? null,
        category:      job.category?.label ?? null,
        remote:        job.remote ?? false,
        posted_at:     job.created,
        synced_at:     new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("ats_jobs")
        .upsert(batch, { onConflict: "id" });

      if (error) console.error(`[ATS Sync] Batch ${i / BATCH + 1} upsert error:`, error);
      else upserted += batch.length;
    }

    // Mark expired jobs
    const activeIds = jobs.map(j => j.id);
    await supabase
      .from("ats_jobs")
      .update({ expired: true })
      .not("id", "in", `(${activeIds.map(id => `'${id}'`).join(",")})`)
      .eq("expired", false);

    console.log(`[ATS Sync] Done. Upserted ${upserted} jobs.`);
    return NextResponse.json({ ok: true, upserted, sources: counts });

  } catch (err) {
    console.error("[ATS Sync] Fatal error:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
