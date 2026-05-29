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

export async function GET() {
  const base = "https://www.jobnique.com";

  // Fetch active (non-expired) jobs from ats_jobs
  const { data: jobs } = await supabase
    .from("ats_jobs")
    .select("id, posted_at")
    .eq("expired", false);

  const staticRoutes: SitemapEntry[] = [
    { url: base,                          priority: "1.0", changefreq: "daily"   },
    { url: `${base}/jobs`,                priority: "0.9", changefreq: "hourly"  },
    { url: `${base}/career-advice`,       priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/interview-tips`,      priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/cv-templates`,        priority: "0.8", changefreq: "monthly" },
    { url: `${base}/cover-letters`,       priority: "0.7", changefreq: "monthly" },
    { url: `${base}/salaries`,            priority: "0.8", changefreq: "weekly"  },
    { url: `${base}/paycheck-calculator`, priority: "0.7", changefreq: "monthly" },
    { url: `${base}/about`,               priority: "0.5", changefreq: "monthly" },
    { url: `${base}/contact`,             priority: "0.5", changefreq: "monthly" },
    { url: `${base}/advertise`,           priority: "0.4", changefreq: "monthly" },
    { url: `${base}/privacy-policy`,      priority: "0.3", changefreq: "yearly"  },
    { url: `${base}/terms-of-use`,        priority: "0.3", changefreq: "yearly"  },
  ];

  const jobEntries: SitemapEntry[] = (jobs ?? []).map((job) => ({
    url: `${base}/jobs/${job.id}`,
    priority: "0.7",
    changefreq: "daily",
    lastmod: new Date(job.posted_at).toISOString(),
  }));

  const allUrls: SitemapEntry[] = [
    ...staticRoutes,
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
