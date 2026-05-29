import type { AtsJob } from "./types";

interface LeverList {
  id: string;
  text: string;
  content: string;
}

interface LeverPosting {
  id: string;
  text: string;
  createdAt: number;
  applyUrl: string;
  hostedUrl: string;
  categories: {
    commitment?: string;
    location?: string;
    team?: string;
    department?: string;
  };
  description: string;
  descriptionPlain: string;
  lists: LeverList[];
  additionalPlain?: string;
}

function decodeEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
}

function buildDescription(p: LeverPosting): string {
  const parts: string[] = [];
  if (p.descriptionPlain) parts.push(decodeEntities(p.descriptionPlain.slice(0, 2000)));
  p.lists?.forEach(l => {
    if (l.content) {
      const clean = decodeEntities(l.content.replace(/<[^>]+>/g, " "));
      parts.push(`${l.text}:\n${clean}`);
    }
  });
  if (p.additionalPlain) parts.push(decodeEntities(p.additionalPlain.slice(0, 500)));
  return parts.join("\n\n").trim();
}

export async function fetchLeverJobs(siteSlug: string): Promise<AtsJob[]> {
  const url = `https://api.lever.co/v0/postings/${siteSlug}?mode=json&limit=250`;
  try {
    const res = await fetch(url, {
      next: { revalidate: 1800 },
      headers: { "User-Agent": "Jobnique/1.0 (jobnique.com)" },
    });
    if (!res.ok) {
      console.warn(`[Lever] ${siteSlug} returned ${res.status}`);
      return [];
    }
    const data: LeverPosting[] = await res.json();
    const companyName = siteSlug.charAt(0).toUpperCase() + siteSlug.slice(1);
    return (data || []).map((posting): AtsJob => {
      const commitment = posting.categories?.commitment?.toLowerCase() || "";
      const isPartTime = /part/i.test(commitment);
      const location   = posting.categories?.location || "Remote";
      const dept       = posting.categories?.department || posting.categories?.team;
      return {
        id:            `lever-${siteSlug}-${posting.id}`,
        source:        "lever",
        ats_apply_url: posting.hostedUrl || posting.applyUrl,
        title:         posting.text,
        company:       { display_name: companyName },
        location:      { display_name: location },
        description:   buildDescription(posting),
        contract_time: isPartTime ? "part_time" : "full_time",
        created:       new Date(posting.createdAt).toISOString(),
        department:    dept,
        remote:        /remote/i.test(location),
        category:      dept ? { label: dept } : undefined,
      };
    });
  } catch (err) {
    console.error(`[Lever] Failed to fetch ${siteSlug}:`, err);
    return [];
  }
}

export async function fetchAllLeverJobs(): Promise<AtsJob[]> {
  const slugs = (process.env.LEVER_SITE_SLUGS || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
  if (slugs.length === 0) return [];
  const results = await Promise.allSettled(slugs.map(fetchLeverJobs));
  return results.flatMap(r => (r.status === "fulfilled" ? r.value : []));
}
