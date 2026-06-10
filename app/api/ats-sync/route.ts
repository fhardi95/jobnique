import { NextResponse } from "next/server";
import { fetchGreenhouseJobs } from "@/lib/ats/greenhouse";
import { fetchLeverJobs }      from "@/lib/ats/lever";
import { fetchWorkdayJobs }    from "@/lib/ats/workday";
import { createClient }        from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Max duration on Vercel Pro is 300s, hobby is 60s
export const maxDuration = 300;

// How many ATS sources to hit concurrently per platform
const CONCURRENCY = 10;

async function fetchInChunks<T>(
  items: string[],
  fetcher: (token: string) => Promise<T[]>,
  chunkSize = CONCURRENCY
): Promise<T[]> {
  const results: T[] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    const chunk = items.slice(i, i + chunkSize);
    const settled = await Promise.allSettled(chunk.map(fetcher));
    for (const r of settled) {
      if (r.status === "fulfilled") results.push(...r.value);
    }
  }
  return results;
}

export async function POST(req: Request) {
  const secret = req.headers.get("x-cron-secret");
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Optional: process only one platform at a time via ?platform=greenhouse|lever|workday
  const url      = new URL(req.url);
  const platform = url.searchParams.get("platform"); // null = all

  try {
    console.log(`[ATS Sync] Starting... platform=${platform || "all"}`);

    const { data: sources, error: srcError } = await supabase
      .from("ats_sources")
      .select("*")
      .eq("active", true);

    if (srcError) throw srcError;
    if (!sources || sources.length === 0) {
      return NextResponse.json({ ok: true, upserted: 0, message: "No active sources." });
    }

    console.log(`[ATS Sync] ${sources.length} active sources`);

    // Merge DB + env var sources
    const envGreenhouse = (process.env.GREENHOUSE_BOARD_TOKENS || "").split(",").map(t => t.trim()).filter(Boolean);
    const envLever      = (process.env.LEVER_SITE_SLUGS || "").split(",").map(t => t.trim()).filter(Boolean);
    const envWorkday    = (process.env.WORKDAY_TENANTS || "").split(",").map(t => t.trim()).filter(Boolean);
    const dbTokens      = new Set(sources.map((s: { platform: string; token: string }) => `${s.platform}:${s.token}`));

    const allGreenhouse = !platform || platform === "greenhouse"
      ? [...sources.filter((s: { platform: string }) => s.platform === "greenhouse").map((s: { token: string }) => s.token),
         ...envGreenhouse.filter(t => !dbTokens.has(`greenhouse:${t}`))]
      : [];

    const allLever = !platform || platform === "lever"
      ? [...sources.filter((s: { platform: string }) => s.platform === "lever").map((s: { token: string }) => s.token),
         ...envLever.filter(t => !dbTokens.has(`lever:${t}`))]
      : [];

    const allWorkday = !platform || platform === "workday"
      ? [...sources.filter((s: { platform: string }) => s.platform === "workday").map((s: { token: string }) => s.token),
         ...envWorkday.filter(t => !dbTokens.has(`workday:${t}`))]
      : [];

    console.log(`[ATS Sync] Sources — GH:${allGreenhouse.length} Lever:${allLever.length} WD:${allWorkday.length}`);

    // Fetch in controlled chunks (10 concurrent per platform)
    const [ghJobs, lvJobs, wdJobs] = await Promise.all([
      fetchInChunks(allGreenhouse, fetchGreenhouseJobs),
      fetchInChunks(allLever, fetchLeverJobs),
      fetchInChunks(allWorkday, (t) => {
        const [tenant, site] = t.split(":");
        return fetchWorkdayJobs(tenant, site || "External_Career_Site");
      }),
    ]);

    const jobs = [...ghJobs, ...lvJobs, ...wdJobs];

    const counts = {
      greenhouse: ghJobs.length,
      lever:      lvJobs.length,
      workday:    wdJobs.length,
      total:      jobs.length,
    };

    console.log(`[ATS Sync] Fetched: GH=${counts.greenhouse} Lever=${counts.lever} WD=${counts.workday}`);

    if (jobs.length === 0) {
      return NextResponse.json({ ok: true, upserted: 0, sources: counts });
    }

    // Upsert in batches of 100
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
        expired:       false,
      }));

      const { error } = await supabase
        .from("ats_jobs")
        .upsert(batch, { onConflict: "id" });

      if (error) console.error(`[ATS Sync] Batch upsert error:`, error.message);
      else upserted += batch.length;
    }

    // Mark jobs not in this sync as expired
    if (!platform) {
      const activeIds = jobs.map(j => j.id);
      if (activeIds.length > 0) {
        await supabase
          .from("ats_jobs")
          .update({ expired: true })
          .not("id", "in", `(${activeIds.map(id => `'${id}'`).join(",")})`)
          .eq("expired", false);
      }
    }

    console.log(`[ATS Sync] Done. Upserted ${upserted} jobs.`);
    return NextResponse.json({ ok: true, upserted, sources: counts });

  } catch (err) {
    console.error("[ATS Sync] Fatal:", err);
    return NextResponse.json({ error: "Sync failed" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  return POST(req);
}
