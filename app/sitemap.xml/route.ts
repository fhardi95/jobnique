import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type SitemapEntry = {
  url: string;
  priority: string;
  changefreq: string;
  lastmod?: string;
};

// ── No-experience city slugs ────────────────────────────────────────────────
const NO_EXP_CITIES = [
  "akron","albany","albuquerque","anchorage","arlington","atlanta","aurora",
  "austin","bakersfield","baltimore","birmingham","boise","boston","buffalo",
  "chandler","charlotte","chicago","cincinnati","cleveland","colorado-springs",
  "columbus","corpus-christi","dallas","denver","des-moines","detroit","durham",
  "el-paso","fort-worth","fresno","garland","grand-rapids","greensboro",
  "hartford","henderson","honolulu","houston","huntsville","indianapolis",
  "irving","jacksonville","jersey-city","kansas-city","knoxville","laredo",
  "las-vegas","lexington","lincoln","little-rock","long-beach","los-angeles",
  "louisville","lubbock","madison","memphis","mesa","miami","milwaukee",
  "minneapolis","montgomery","nashville","new-orleans","new-york","newark",
  "newark-nj","norfolk","oklahoma-city","omaha","orlando","oxnard",
  "philadelphia","phoenix","pittsburgh","plano","portland","providence",
  "raleigh","richmond","riverside","sacramento","saint-paul","salt-lake-city",
  "san-antonio","san-diego","san-francisco","san-jose","scottsdale","seattle",
  "shreveport","spokane","st-louis","st-petersburg","stockton","tacoma","tampa",
  "tempe","tucson","tulsa","virginia-beach","wichita","worcester",
];

// ── No-experience state slugs ───────────────────────────────────────────────
const NO_EXP_STATES = [
  "alabama","alaska","arizona","arkansas","california","colorado","connecticut",
  "delaware","florida","georgia","hawaii","idaho","illinois","indiana","iowa",
  "kansas","kentucky","louisiana","maine","maryland","massachusetts","michigan",
  "minnesota","mississippi","missouri","montana","nebraska","nevada",
  "new-hampshire","new-jersey","new-mexico","new-york","north-carolina",
  "north-dakota","ohio","oklahoma","oregon","pennsylvania","rhode-island",
  "south-carolina","south-dakota","tennessee","texas","utah","vermont",
  "virginia","washington","west-virginia","wisconsin","wyoming",
];

export async function GET() {
  const base = "https://www.jobnique.com";
  const today = new Date().toISOString();

  // ── Fetch active ATS jobs ─────────────────────────────────────────────────
  const { data: jobs } = await supabase
    .from("ats_jobs")
    .select("id, posted_at")
    .eq("expired", false);

  // ── Static core routes ────────────────────────────────────────────────────
  const staticRoutes: SitemapEntry[] = [
    { url: base,                               priority: "1.0", changefreq: "daily"   },
    { url: `${base}/jobs`,                     priority: "0.9", changefreq: "hourly"  },
    { url: `${base}/jobs/cities`,              priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/no-experience-jobs`,       priority: "0.9", changefreq: "daily"   },
    { url: `${base}/entry-level-jobs`,         priority: "0.9", changefreq: "daily"   },
    { url: `${base}/Find-Visa-Sponsorship-Jobs`, priority: "0.9", changefreq: "daily" },
    { url: `${base}/career-advice`,            priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/interview-tips`,           priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/cv-templates`,             priority: "0.8", changefreq: "monthly" },
    { url: `${base}/cover-letters`,            priority: "0.7", changefreq: "monthly" },
    { url: `${base}/salaries`,                 priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/salary-by-city`,           priority: "0.7", changefreq: "weekly"  },
    { url: `${base}/paycheck-calculator`,      priority: "0.7", changefreq: "monthly" },
    { url: `${base}/resume-builder`,           priority: "0.8", changefreq: "monthly" },
    { url: `${base}/resume-builder/builder`,   priority: "0.8", changefreq: "monthly" },
    { url: `${base}/ai-cover-letter`,          priority: "0.8", changefreq: "monthly" },
    { url: `${base}/ats-resume-checker`,       priority: "0.8", changefreq: "monthly" },
    { url: `${base}/interview-question-generator`, priority: "0.8", changefreq: "monthly" },
    { url: `${base}/job-description-generator`,    priority: "0.8", changefreq: "monthly" },
    { url: `${base}/popularjobs`,              priority: "0.7", changefreq: "weekly"  },
    { url: `${base}/post-a-job`,               priority: "0.7", changefreq: "monthly" },
    { url: `${base}/about`,                    priority: "0.5", changefreq: "monthly" },
    { url: `${base}/contact`,                  priority: "0.5", changefreq: "monthly" },
    { url: `${base}/advertise`,                priority: "0.4", changefreq: "monthly" },
    { url: `${base}/privacy-policy`,           priority: "0.3", changefreq: "yearly"  },
    { url: `${base}/terms-of-use`,             priority: "0.3", changefreq: "yearly"  },
  ];

  // ── Career advice articles ────────────────────────────────────────────────
  const careerAdviceSlugs = [
    "how-to-negotiate-salary-job-offer",
    "salary-negotiation-scripts-that-work-2026",
    "free-resume-builder-online-better-than-chatgpt",
    "salary-negotiation-scripts-2026",
    "best-resume-format-2026-complete-guide",
    "how-to-write-cv-with-no-experience-2026-guide",
    "how-to-write-a-cv",
    "50-common-interview-questions",
    "how-to-negotiate-salary",
    "how-to-negotiate-salary-offer-proven-strategies",
    "what-to-include-in-personal-statement",
    "explain-gaps-in-employment",
    "should-you-include-photo-cv",
    "how-to-answer-tell-me-about-yourself",
    "10-questions-to-ask-at-interview",
    "how-to-handle-panel-interview",
    "when-to-ask-for-pay-rise",
    "average-salaries-us",
    "how-to-change-careers",
    "career-change-cover-letter",
    "find-job-no-experience",
    "cold-email-to-get-a-job",
  ];

  // ── Interview tips articles ───────────────────────────────────────────────
  const interviewTipsSlugs = [
    "behavioral-interview-questions-answers-guide",
    "how-to-prepare-for-interview",
    "interview-questions-answers",
    "interview-body-language",
    "how-to-answer-tell-me-about-yourself-interview-question",
    "interview-research-checklist",
    "how-to-handle-nerves-interview",
    "star-method-examples",
    "salary-negotiation-at-interview",
    "virtual-interview-tips",
  ];

  // ── No-experience city pages ──────────────────────────────────────────────
  const noExpCityEntries: SitemapEntry[] = NO_EXP_CITIES.map((city) => ({
    url: `${base}/no-experience-jobs/${city}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── No-experience state pages ─────────────────────────────────────────────
  const noExpStateEntries: SitemapEntry[] = NO_EXP_STATES.map((state) => ({
    url: `${base}/no-experience-jobs/states/${state}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── Entry-level city pages ────────────────────────────────────────────────
  const entryLevelCityEntries: SitemapEntry[] = NO_EXP_CITIES.map((city) => ({
    url: `${base}/entry-level-jobs/${city}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── Entry-level state pages ───────────────────────────────────────────────
  const entryLevelStateEntries: SitemapEntry[] = NO_EXP_STATES.map((state) => ({
    url: `${base}/entry-level-jobs/states/${state}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── Visa sponsorship city pages ───────────────────────────────────────────
  const visaCityEntries: SitemapEntry[] = NO_EXP_CITIES.map((city) => ({
    url: `${base}/Find-Visa-Sponsorship-Jobs/${city}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── Visa sponsorship state pages ──────────────────────────────────────────
  const visaStateEntries: SitemapEntry[] = NO_EXP_STATES.map((state) => ({
    url: `${base}/Find-Visa-Sponsorship-Jobs/states/${state}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: today,
  }));

  // ── ATS job detail pages ──────────────────────────────────────────────────
  const jobEntries: SitemapEntry[] = (jobs ?? []).map((job) => ({
    url: `${base}/jobs/${job.id}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: new Date(job.posted_at).toISOString(),
  }));

  // ── Assemble all URLs ─────────────────────────────────────────────────────
  const allUrls: SitemapEntry[] = [
    ...staticRoutes,
    ...careerAdviceSlugs.map((s) => ({
      url: `${base}/career-advice/${s}`,
      priority: "0.6",
      changefreq: "weekly" as const,
    })),
    ...interviewTipsSlugs.map((s) => ({
      url: `${base}/interview-tips/${s}`,
      priority: "0.6",
      changefreq: "weekly" as const,
    })),
    ...noExpCityEntries,
    ...noExpStateEntries,
    ...entryLevelCityEntries,
    ...entryLevelStateEntries,
    ...visaCityEntries,
    ...visaStateEntries,
    ...jobEntries,
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (entry) => `  <url>
    <loc>${entry.url}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ""}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "CDN-Cache-Control": "no-store",
      "Vercel-CDN-Cache-Control": "no-store",
    },
  });
}
