import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jobnique.com";

// ── Single source of truth for all 55 cities ──────────────────────────────────
export const ALL_US_CITIES = [
  // Northeast
  { slug: "new-york",       label: "New York, NY",       state: "NY", region: "Northeast" },
  { slug: "philadelphia",   label: "Philadelphia, PA",   state: "PA", region: "Northeast" },
  { slug: "boston",         label: "Boston, MA",         state: "MA", region: "Northeast" },
  { slug: "baltimore",      label: "Baltimore, MD",      state: "MD", region: "Northeast" },
  { slug: "pittsburgh",     label: "Pittsburgh, PA",     state: "PA", region: "Northeast" },
  { slug: "providence",     label: "Providence, RI",     state: "RI", region: "Northeast" },
  { slug: "hartford",       label: "Hartford, CT",       state: "CT", region: "Northeast" },
  { slug: "buffalo",        label: "Buffalo, NY",        state: "NY", region: "Northeast" },
  { slug: "albany",         label: "Albany, NY",         state: "NY", region: "Northeast" },
  { slug: "newark",         label: "Newark, NJ",         state: "NJ", region: "Northeast" },
  // Southeast
  { slug: "miami",          label: "Miami, FL",          state: "FL", region: "Southeast" },
  { slug: "atlanta",        label: "Atlanta, GA",        state: "GA", region: "Southeast" },
  { slug: "charlotte",      label: "Charlotte, NC",      state: "NC", region: "Southeast" },
  { slug: "jacksonville",   label: "Jacksonville, FL",   state: "FL", region: "Southeast" },
  { slug: "nashville",      label: "Nashville, TN",      state: "TN", region: "Southeast" },
  { slug: "orlando",        label: "Orlando, FL",        state: "FL", region: "Southeast" },
  { slug: "tampa",          label: "Tampa, FL",          state: "FL", region: "Southeast" },
  { slug: "raleigh",        label: "Raleigh, NC",        state: "NC", region: "Southeast" },
  { slug: "richmond",       label: "Richmond, VA",       state: "VA", region: "Southeast" },
  { slug: "memphis",        label: "Memphis, TN",        state: "TN", region: "Southeast" },
  { slug: "louisville",     label: "Louisville, KY",     state: "KY", region: "Southeast" },
  { slug: "new-orleans",    label: "New Orleans, LA",    state: "LA", region: "Southeast" },
  { slug: "birmingham",     label: "Birmingham, AL",     state: "AL", region: "Southeast" },
  // Midwest
  { slug: "chicago",        label: "Chicago, IL",        state: "IL", region: "Midwest"   },
  { slug: "columbus",       label: "Columbus, OH",       state: "OH", region: "Midwest"   },
  { slug: "indianapolis",   label: "Indianapolis, IN",   state: "IN", region: "Midwest"   },
  { slug: "detroit",        label: "Detroit, MI",        state: "MI", region: "Midwest"   },
  { slug: "milwaukee",      label: "Milwaukee, WI",      state: "WI", region: "Midwest"   },
  { slug: "minneapolis",    label: "Minneapolis, MN",    state: "MN", region: "Midwest"   },
  { slug: "kansas-city",    label: "Kansas City, MO",    state: "MO", region: "Midwest"   },
  { slug: "st-louis",       label: "St. Louis, MO",      state: "MO", region: "Midwest"   },
  { slug: "cleveland",      label: "Cleveland, OH",      state: "OH", region: "Midwest"   },
  { slug: "cincinnati",     label: "Cincinnati, OH",     state: "OH", region: "Midwest"   },
  { slug: "omaha",          label: "Omaha, NE",          state: "NE", region: "Midwest"   },
  { slug: "des-moines",     label: "Des Moines, IA",     state: "IA", region: "Midwest"   },
  // South / Southwest
  { slug: "houston",        label: "Houston, TX",        state: "TX", region: "South"     },
  { slug: "dallas",         label: "Dallas, TX",         state: "TX", region: "South"     },
  { slug: "san-antonio",    label: "San Antonio, TX",    state: "TX", region: "South"     },
  { slug: "austin",         label: "Austin, TX",         state: "TX", region: "South"     },
  { slug: "fort-worth",     label: "Fort Worth, TX",     state: "TX", region: "South"     },
  { slug: "phoenix",        label: "Phoenix, AZ",        state: "AZ", region: "South"     },
  { slug: "tucson",         label: "Tucson, AZ",         state: "AZ", region: "South"     },
  { slug: "albuquerque",    label: "Albuquerque, NM",    state: "NM", region: "South"     },
  { slug: "el-paso",        label: "El Paso, TX",        state: "TX", region: "South"     },
  { slug: "oklahoma-city",  label: "Oklahoma City, OK",  state: "OK", region: "South"     },
  { slug: "tulsa",          label: "Tulsa, OK",          state: "OK", region: "South"     },
  // West
  { slug: "los-angeles",    label: "Los Angeles, CA",    state: "CA", region: "West"      },
  { slug: "san-francisco",  label: "San Francisco, CA",  state: "CA", region: "West"      },
  { slug: "san-diego",      label: "San Diego, CA",      state: "CA", region: "West"      },
  { slug: "san-jose",       label: "San Jose, CA",       state: "CA", region: "West"      },
  { slug: "seattle",        label: "Seattle, WA",        state: "WA", region: "West"      },
  { slug: "portland",       label: "Portland, OR",       state: "OR", region: "West"      },
  { slug: "denver",         label: "Denver, CO",         state: "CO", region: "West"      },
  { slug: "las-vegas",      label: "Las Vegas, NV",      state: "NV", region: "West"      },
  { slug: "sacramento",     label: "Sacramento, CA",     state: "CA", region: "West"      },
  { slug: "fresno",         label: "Fresno, CA",         state: "CA", region: "West"      },
  { slug: "salt-lake-city", label: "Salt Lake City, UT", state: "UT", region: "West"      },
  { slug: "boise",          label: "Boise, ID",          state: "ID", region: "West"      },
  { slug: "spokane",        label: "Spokane, WA",        state: "WA", region: "West"      },
  { slug: "honolulu",       label: "Honolulu, HI",       state: "HI", region: "West"      },
  { slug: "anchorage",      label: "Anchorage, AK",      state: "AK", region: "West"      },
];

const REGIONS = ["Northeast", "Southeast", "Midwest", "South", "West"] as const;

const REGION_COLORS: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  Northeast: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", icon: "🗽" },
  Southeast: { bg: "#fdf4ff", text: "#7e22ce", border: "#e9d5ff", icon: "🌴" },
  Midwest:   { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", icon: "🌾" },
  South:     { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa", icon: "🤠" },
  West:      { bg: "#fef2f2", text: "#b91c1c", border: "#fecaca", icon: "🌉" },
};

const TOP_SLUGS = [
  "new-york","los-angeles","chicago","houston","san-francisco",
  "seattle","austin","miami","boston","dallas","atlanta","denver",
];

async function getCityCounts(): Promise<Record<string, number>> {
  try {
    const { data } = await supabase.from("ats_jobs").select("location").eq("expired", false);
    if (!data) return {};
    const counts: Record<string, number> = {};
    for (const city of ALL_US_CITIES) {
      const name = city.label.split(",")[0].toLowerCase();
      counts[city.slug] = data.filter(j => j.location?.toLowerCase().includes(name)).length;
    }
    return counts;
  } catch { return {}; }
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Jobs by City – Find Jobs Near You in Every US City | Jobnique",
  description:
    "Search job listings in 55+ US cities. Browse full-time, part-time and remote jobs in New York, Los Angeles, Chicago, Houston, San Francisco and every major US city — updated daily.",
  alternates: { canonical: `${BASE_URL}/jobs/cities` },
  openGraph: {
    title: "Jobs by City – Find Jobs Near You in Every US City | Jobnique",
    description: "Browse job listings across 55+ US cities. Find your next opportunity near you — updated daily on Jobnique.",
    url: `${BASE_URL}/jobs/cities`,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jobs by City | Jobnique",
    description: "Find jobs in 55+ US cities — updated daily on Jobnique.",
  },
  robots: { index: true, follow: true },
  keywords: "jobs by city, jobs near me, local jobs USA, city jobs, find jobs in my city, job search by location, jobs in new york, jobs in los angeles, jobs in chicago, jobs in houston, jobs in miami",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function JobsByCityPage() {
  const counts = await getCityCounts();
  const totalJobs = Object.values(counts).reduce((a, b) => a + b, 0);

  // Schema 1: BreadcrumbList — tells Google the page hierarchy
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",         item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Jobs",         item: `${BASE_URL}/jobs` },
      { "@type": "ListItem", position: 3, name: "Jobs by City", item: `${BASE_URL}/jobs/cities` },
    ],
  };

  // Schema 2: ItemList — links Google to all 55 city pages from one hub
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Job Search by City – Jobnique",
    description: "Browse job listings across all major US cities on Jobnique",
    url: `${BASE_URL}/jobs/cities`,
    numberOfItems: ALL_US_CITIES.length,
    itemListElement: ALL_US_CITIES.map((city, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Jobs in ${city.label}`,
      url: `${BASE_URL}/jobs/location/${city.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />

      <Navbar />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e40af 50%, #1e3a8a 100%)", padding: "56px 20px 64px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, right: -60, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 900, margin: "0 auto", position: "relative" }}>
          {/* Semantic breadcrumb — visible to users AND crawlers */}
          <nav aria-label="breadcrumb" style={{ fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 16 }}>
            <Link href="/"    style={{ color: "rgba(255,255,255,0.65)" }}>Home</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <Link href="/jobs" style={{ color: "rgba(255,255,255,0.65)" }}>Jobs</Link>
            <span style={{ margin: "0 6px" }}>›</span>
            <span style={{ color: "#fff" }} aria-current="page">Jobs by City</span>
          </nav>

          <h1 style={{ fontSize: "clamp(28px,5vw,44px)", fontWeight: 800, color: "#fff", marginBottom: 14, lineHeight: 1.15, fontFamily: "'DM Serif Display', serif" }}>
            Find Jobs in Your City
          </h1>
          <p style={{ fontSize: "clamp(15px,2vw,18px)", color: "rgba(255,255,255,0.85)", marginBottom: 28, maxWidth: 560 }}>
            Browse thousands of live job listings across {ALL_US_CITIES.length} US cities — sourced directly from top employers and updated every day.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { value: `${ALL_US_CITIES.length}`, label: "Cities covered" },
              { value: totalJobs > 0 ? `${totalJobs.toLocaleString()}+` : "1,000s", label: "Live jobs" },
              { value: "Daily", label: "Updated" },
              { value: "Free",  label: "Always free" },
            ].map(s => (
              <div key={s.label} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 10, padding: "10px 20px", textAlign: "center", minWidth: 100 }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "44px 20px 80px" }}>

        {/* Most popular cities */}
        <div style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: 14, padding: "24px 28px", marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#1d4ed8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
            🔥 Most Popular Cities
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {ALL_US_CITIES.filter(c => TOP_SLUGS.includes(c.slug)).map(city => (
              <Link key={city.slug} href={`/jobs/location/${city.slug}`} style={{ textDecoration: "none" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#fff", border: "1.5px solid #bfdbfe", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "7px 16px", borderRadius: 24 }}>
                  📍 {city.label}
                  {(counts[city.slug] ?? 0) > 0 && (
                    <span style={{ background: "#dbeafe", color: "#1d4ed8", fontSize: 11, fontWeight: 700, padding: "1px 7px", borderRadius: 10 }}>
                      {counts[city.slug]}
                    </span>
                  )}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Cities by region */}
        {REGIONS.map(region => {
          const cities = ALL_US_CITIES.filter(c => c.region === region);
          const col = REGION_COLORS[region];
          return (
            <section key={region} aria-label={`${region} US jobs`} style={{ marginBottom: 52 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: col.bg, border: `1px solid ${col.border}`, borderRadius: 10, padding: "6px 16px" }}>
                  <span style={{ fontSize: 18 }}>{col.icon}</span>
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: col.text, margin: 0 }}>{region} US</h2>
                </div>
                <span style={{ fontSize: 13, color: "#9ca3af" }}>{cities.length} cities</span>
                <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
                {cities.map(city => {
                  const count = counts[city.slug] ?? 0;
                  return (
                    <Link key={city.slug} href={`/jobs/location/${city.slug}`} style={{ textDecoration: "none" }}>
                      <div className="city-card" style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: "#111827", marginBottom: 2 }}>{city.label.split(",")[0]}</div>
                          <div style={{ fontSize: 12, color: "#9ca3af" }}>{city.state}</div>
                        </div>
                        <div>
                          {count > 0 ? (
                            <span style={{ background: col.bg, color: col.text, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 8 }}>{count} jobs</span>
                          ) : (
                            <span style={{ fontSize: 12, color: "#d1d5db", fontWeight: 500 }}>View →</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* Bottom CTA */}
        <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e3a8a 100%)", borderRadius: 16, padding: "36px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20, marginTop: 16 }}>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", marginBottom: 6 }}>Can&apos;t find your city?</h3>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.8)" }}>Search all jobs and filter by your location — we cover the whole US.</p>
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/jobs/remote" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 600 }}>🌐 Remote Jobs</Link>
            <Link href="/jobs" style={{ background: "#fff", color: "#1a56db", borderRadius: 8, padding: "11px 22px", fontSize: 14, fontWeight: 700 }}>Search All Jobs →</Link>
          </div>
        </div>
      </div>

      <style>{`
        .city-card { transition: all 0.15s; }
        .city-card:hover { border-color: #bfdbfe; box-shadow: 0 2px 12px rgba(26,86,219,0.08); transform: translateY(-1px); }
      `}</style>

      <Footer />
    </>
  );
}
