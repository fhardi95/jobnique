import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_US_CITIES } from "@/app/jobs/cities/page";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jobnique.com";

// Lookup with region data preserved
function slugToCity(slug: string) {
  return (
    ALL_US_CITIES.find(c => c.slug === slug) ?? {
      slug,
      label: slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      state: "",
      region: "West" as const,
    }
  );
}

async function getJobsByLocation(cityLabel: string) {
  const city = cityLabel.split(",")[0];
  const { data } = await supabase
    .from("ats_jobs")
    .select("id, title, company, location, salary_min, salary_max, contract_time, remote, posted_at, category")
    .eq("expired", false)
    .ilike("location", `%${city}%`)
    .order("posted_at", { ascending: false })
    .limit(50);
  return data || [];
}

// ── ALL 55 cities prerendered at build time ───────────────────────────────────
export async function generateStaticParams() {
  return ALL_US_CITIES.map(c => ({ location: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ location: string }>;
}): Promise<Metadata> {
  const { location } = await params;
  const city = slugToCity(location);
  const year = new Date().getFullYear();

  const title = `Jobs in ${city.label} – ${year} Openings | Jobnique`;
  const description = `Browse the latest job openings in ${city.label}. Full-time, part-time and remote roles across every industry. Apply in minutes on Jobnique — updated daily.`;
  const canonical = `${BASE_URL}/jobs/location/${location}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, siteName: "Jobnique", type: "website" },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
    keywords: `jobs in ${city.label}, ${city.label.split(",")[0]} jobs, ${city.state} jobs, hiring in ${city.label.split(",")[0]}, ${city.label.split(",")[0]} employment opportunities`,
  };
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

const timeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

export default async function LocationJobsPage({
  params,
}: {
  params: Promise<{ location: string }>;
}) {
  const { location } = await params;
  const city = slugToCity(location);
  const jobs = await getJobsByLocation(city.label);

  // ── Schema 1: BreadcrumbList ──────────────────────────────────────────────
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",             item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Jobs",             item: `${BASE_URL}/jobs` },
      { "@type": "ListItem", position: 3, name: "Jobs by City",     item: `${BASE_URL}/jobs/cities` },
      { "@type": "ListItem", position: 4, name: `Jobs in ${city.label}`, item: `${BASE_URL}/jobs/location/${location}` },
    ],
  };

  // ── Schema 2: ItemList (top jobs on this page) ────────────────────────────
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Jobs in ${city.label}`,
    description: `Latest job listings in ${city.label} on Jobnique`,
    url: `${BASE_URL}/jobs/location/${location}`,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/jobs/${job.id}`,
      name: `${job.title} at ${job.company}`,
    })),
  };

  // Nearby cities (same region, excluding self)
  const nearby = ALL_US_CITIES.filter(c => c.region === city.region && c.slug !== location).slice(0, 12);
  // Other regions sample
  const others = ALL_US_CITIES.filter(c => c.region !== city.region && c.slug !== location).slice(0, 8);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <style>{`
        .job-card-hover { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:20px 24px; cursor:pointer; transition:box-shadow 0.15s; }
        .job-card-hover:hover { box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .city-pill { background:#f1f5f9; color:#374151; font-size:13px; font-weight:500; padding:6px 14px; border-radius:20px; text-decoration:none; display:inline-block; transition:all 0.15s; }
        .city-pill:hover { background:#dbeafe; color:#1d4ed8; }
      `}</style>

      <Navbar />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e40af 100%)", padding: "48px 20px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>

          {/* 4-level breadcrumb including "Jobs by City" hub */}
          <nav aria-label="breadcrumb" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 14 }}>
            <Link href="/"             style={{ color: "rgba(255,255,255,0.65)" }}>Home</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href="/jobs"         style={{ color: "rgba(255,255,255,0.65)" }}>Jobs</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href="/jobs/cities"  style={{ color: "rgba(255,255,255,0.65)" }}>Jobs by City</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#fff" }} aria-current="page">{city.label}</span>
          </nav>

          <h1 style={{ fontSize: "clamp(24px,4vw,38px)", fontWeight: 800, color: "#fff", marginBottom: 12, fontFamily: "'DM Serif Display', serif" }}>
            Jobs in {city.label}
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)" }}>
            {jobs.length > 0
              ? `${jobs.length} live job${jobs.length !== 1 ? "s" : ""} found`
              : "Browsing all locations"
            } · Updated daily
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px 64px" }}>

        {/* Job listings */}
        {jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>No jobs found in {city.label} right now</h2>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>Try browsing all jobs or explore another city.</p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/jobs" style={{ background: "#1a56db", color: "#fff", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600 }}>Browse all jobs →</Link>
              <Link href="/jobs/cities" style={{ background: "#f1f5f9", color: "#374151", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600 }}>All cities</Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
                <div className="job-card-hover">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{job.title}</h2>
                      <div style={{ fontSize: 14, color: "#374151", fontWeight: 500, marginBottom: 8 }}>{job.company}</div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 13, color: "#6b7280" }}>📍 {job.location}</span>
                        {job.contract_time && (
                          <span style={{ fontSize: 13, color: "#6b7280" }}>· {job.contract_time === "full_time" ? "Full-time" : "Part-time"}</span>
                        )}
                        {job.remote && <span style={{ fontSize: 13, color: "#7c3aed" }}>· 🌐 Remote</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {formatSalary(job.salary_min, job.salary_max) && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#1d4ed8", marginBottom: 4 }}>
                          💰 {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{timeAgo(job.posted_at)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Nearby cities (same region) */}
        {nearby.length > 0 && (
          <div style={{ marginTop: 52 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
              More {city.region} US cities
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {nearby.map(c => (
                <Link key={c.slug} href={`/jobs/location/${c.slug}`} className="city-pill">{c.label}</Link>
              ))}
            </div>
          </div>
        )}

        {/* Other regions + link back to hub */}
        <div style={{ marginTop: 32 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>Jobs in other US cities</h2>
            <Link href="/jobs/cities" style={{ fontSize: 13, fontWeight: 600, color: "#1a56db" }}>
              View all {ALL_US_CITIES.length} cities →
            </Link>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {others.map(c => (
              <Link key={c.slug} href={`/jobs/location/${c.slug}`} className="city-pill">{c.label}</Link>
            ))}
          </div>
        </div>

      </div>

      <Footer />
    </>
  );
}
