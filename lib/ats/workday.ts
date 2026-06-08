/**
 * Workday ATS adapter
 *
 * Workday does NOT have a standard public API. Each company runs their
 * own Workday tenant. We use their internal JSON search endpoint which
 * most Workday career pages expose publicly.
 *
 * Pattern:
 *   https://{tenant}.wd5.myworkdayjobs.com/wday/cxs/{tenant}/{site}/jobs
 *
 * We POST a JSON search body to get structured job data.
 *
 * Env var: WORKDAY_TENANTS
 * Format:  "tenant:site,tenant:site"
 * Example: "amazon:External_Career_Site,walmart:US"
 *
 * Note: Workday tenants occasionally change their internal endpoints.
 * Test each tenant manually before adding to production.
 */

import type { AtsJob } from "./types";

interface WorkdayJobPosting {
  title: string;
  externalPath: string;       // relative path for job detail
  locationsText: string;
  postedOn: string;           // "Posted 3 Days Ago" or ISO
  bulletFields?: string[];    // sometimes contains salary info
  jobReqId?: string;
  timeType?: string;          // "Full time" / "Part time"
  workerSubType?: string;
  primaryLocation?: { descriptor: string };
  jobFamilyGroup?: { descriptor: string };
}

interface WorkdayResponse {
  jobPostings: WorkdayJobPosting[];
  total?: number;
}

function parseWorkdayDate(raw: string): string {
  // "Posted 3 Days Ago" → subtract from today
  const daysMatch = raw.match(/(\d+)\s+day/i);
  if (daysMatch) {
    const d = new Date();
    d.setDate(d.getDate() - parseInt(daysMatch[1], 10));
    return d.toISOString();
  }
  // "Posted Today"
  if (/today/i.test(raw)) return new Date().toISOString();
  // Already ISO
  if (/^\d{4}-\d{2}/.test(raw)) return raw;
  return new Date().toISOString();
}

export async function fetchWorkdayJobs(tenant: string, site: string): Promise<AtsJob[]> {
  const baseUrl = `https://${tenant}.wd5.myworkdayjobs.com`;
  const apiUrl  = `${baseUrl}/wday/cxs/${tenant}/${site}/jobs`;

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "Jobnique/1.0 (jobnique.com)",
      },
      body: JSON.stringify({
        appliedFacets: {},
        limit: 100,
        offset: 0,
        searchText: "",
      }),
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      console.warn(`[Workday] ${tenant}/${site} returned ${res.status}`);
      return [];
    }

    const data: WorkdayResponse = await res.json();
    const companyName = tenant.charAt(0).toUpperCase() + tenant.slice(1);

    return (data.jobPostings || []).map((job): AtsJob => {
      const applyUrl = `${baseUrl}/en-US/${tenant}/${site}/job/${job.externalPath}`;
      const location = job.primaryLocation?.descriptor || job.locationsText || "See posting";
      const dept     = job.jobFamilyGroup?.descriptor;
      const isPartTime = /part/i.test(job.timeType || "");

      return {
        id:            `workday-${tenant}-${encodeURIComponent(job.externalPath)}`,
        source:        "workday",
        ats_apply_url: applyUrl,
        title:         job.title,
        company:       { display_name: companyName },
        location:      { display_name: location },
        description:   job.bulletFields?.join(" ") || "",
        contract_time: isPartTime ? "part_time" : "full_time",
        created:       parseWorkdayDate(job.postedOn || ""),
        department:    dept,
        remote:        /remote/i.test(location),
        category:      dept ? { label: dept } : undefined,
      };
    });
  } catch (err) {
    console.error(`[Workday] Failed to fetch ${tenant}/${site}:`, err);
    return [];
  }
}

export async function fetchAllWorkdayJobs(): Promise<AtsJob[]> {
  const raw = (process.env.WORKDAY_TENANTS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  if (raw.length === 0) return [];

  const pairs = raw.map(entry => {
    const [tenant, site] = entry.split(":");
    return { tenant: tenant.trim(), site: (site || "External_Career_Site").trim() };
  });

  const results = await Promise.allSettled(
    pairs.map(({ tenant, site }) => fetchWorkdayJobs(tenant, site))
  );

  return results.flatMap(r => (r.status === "fulfilled" ? r.value : []));
}
