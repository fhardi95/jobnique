/**
 * ATS aggregator
 * Fetches from Greenhouse + Lever + Workday in parallel and returns
 * a merged, deduplicated, sorted list.
 */

import { fetchAllGreenhouseJobs } from "./greenhouse";
import { fetchAllLeverJobs }      from "./lever";
import { fetchAllWorkdayJobs }    from "./workday";
import type { AtsJob }            from "./types";

export type { AtsJob };

export interface AtsJobsResult {
  jobs:    AtsJob[];
  total:   number;
  sources: { greenhouse: number; lever: number; workday: number };
}

/**
 * Fetch all ATS jobs from every configured source in parallel.
 * Results are deduplicated by ID and sorted newest-first.
 */
export async function fetchAllAtsJobs(): Promise<AtsJobsResult> {
  const [greenhouse, lever, workday] = await Promise.all([
    fetchAllGreenhouseJobs(),
    fetchAllLeverJobs(),
    fetchAllWorkdayJobs(),
  ]);

  // Deduplicate by id (shouldn't happen, but be safe)
  const seen = new Set<string>();
  const all  = [...greenhouse, ...lever, ...workday].filter(j => {
    if (seen.has(j.id)) return false;
    seen.add(j.id);
    return true;
  });

  // Sort newest-first
  all.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime());

  return {
    jobs:    all,
    total:   all.length,
    sources: {
      greenhouse: greenhouse.length,
      lever:      lever.length,
      workday:    workday.length,
    },
  };
}

/**
 * Filter + paginate ATS jobs (mirrors what Adzuna does server-side).
 */
export function filterAtsJobs(
  jobs:      AtsJob[],
  query?:    string,
  location?: string,
  page  = 1,
  limit = 20,
): { results: AtsJob[]; count: number } {
  let filtered = jobs;

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(j =>
      j.title.toLowerCase().includes(q) ||
      j.company.display_name.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.department?.toLowerCase().includes(q)
    );
  }

  if (location) {
    const l = location.toLowerCase();
    filtered = filtered.filter(j =>
      j.location.display_name.toLowerCase().includes(l) ||
      (l === "remote" && j.remote)
    );
  }

  const count   = filtered.length;
  const results = filtered.slice((page - 1) * limit, page * limit).map(j => {
    // Strip raw payload before sending to client
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _raw, ...clean } = j;
    return clean;
  });

  return { results, count };
}
