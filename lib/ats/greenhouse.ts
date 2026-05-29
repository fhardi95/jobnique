import type { AtsJob } from "./types";

interface GhJob {
  id: number;
  title: string;
  updated_at: string;
  absolute_url: string;
  location: { name: string };
  departments: { name: string }[];
  metadata?: { name: string; value: string | null }[];
  content?: string;
}

interface GhResponse {
  jobs: GhJob[];
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export async function fetchGreenhouseJobs(boardToken: string): Promise<AtsJob[]> {
  const url = `https://boards-api.greenhouse.io/v1/boards/${boardToken}/jobs?content=true`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Jobnique/1.0 (jobnique.com)" },
    });
    if (!res.ok) {
      console.warn(`[Greenhouse] ${boardToken} returned ${res.status}`);
      return [];
    }
    const data: GhResponse = await res.json();
    return (data.jobs || []).map((job): AtsJob => {
      const location = job.location?.name || "Remote";
      const isRemote = /remote/i.test(location);
      const dept = job.departments?.[0]?.name;
      return {
        id:            `greenhouse-${boardToken}-${job.id}`,
        source:        "greenhouse",
        ats_apply_url: job.absolute_url,
        title:         job.title,
        company:       { display_name: boardToken.charAt(0).toUpperCase() + boardToken.slice(1) },
        location:      { display_name: location },
        description:   job.content ? stripHtml(job.content) : "",
        contract_time: "full_time",
        created:       job.updated_at,
        department:    dept,
        remote:        isRemote,
        category:      dept ? { label: dept } : undefined,
      };
    });
  } catch (err) {
    console.error(`[Greenhouse] Failed to fetch ${boardToken}:`, err);
    return [];
  }
}

export async function fetchAllGreenhouseJobs(): Promise<AtsJob[]> {
  const tokens = (process.env.GREENHOUSE_BOARD_TOKENS || "")
    .split(",")
    .map(t => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return [];
  const results = await Promise.allSettled(tokens.map(fetchGreenhouseJobs));
  return results.flatMap(r => (r.status === "fulfilled" ? r.value : []));
}
