/**
 * Canonical job shape used everywhere in Jobnique.
 * All ATS adapters normalise their API responses into this.
 */
export interface AtsJob {
  id: string;                    // "greenhouse-{boardToken}-{jobId}"
  source: "greenhouse" | "lever" | "workday" | "adzuna";
  ats_apply_url: string;         // External ATS apply link
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  description: string;
  contract_time?: "full_time" | "part_time";
  created: string;               // ISO-8601
  category?: { label: string };
  department?: string;
  remote?: boolean;
  // Raw source payload kept for debugging — stripped before sending to client
  _raw?: unknown;
}
