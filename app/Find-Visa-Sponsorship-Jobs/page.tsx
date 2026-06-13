// FILE: app/Find-Visa-Sponsorship-Jobs/page.tsx
// Deploy at: jobnique.com/Find-Visa-Sponsorship-Jobs

import { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_US_CITIES } from "@/app/jobs/cities/page";

const BASE_URL = "https://www.jobnique.com";

export const metadata: Metadata = {
  title: "Visa Sponsorship Jobs USA 2026 – Apply Now | Jobnique",
  description: "Visa Sponsorship jobs available across the USA. Browse roles in 100+ cities and all 50 states from employers offering visa sponsorship in healthcare, IT, engineering, hospitality & skilled trades. Updated daily.",
  alternates: { canonical: `${BASE_URL}/Find-Visa-Sponsorship-Jobs` },
  openGraph: {
    title: "Visa Sponsorship Jobs USA 2026 – Entry Level Hiring Now",
    description: "Find visa-sponsorship jobs across 100+ US cities and all 50 states. Updated daily.",
    url: `${BASE_URL}/Find-Visa-Sponsorship-Jobs`,
    siteName: "Jobnique",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Visa Sponsorship Jobs", item: `${BASE_URL}/Find-Visa-Sponsorship-Jobs` },
  ],
};

// Top cities ordered by search volume
const featuredCitySlugs = [
  "new-york", "los-angeles", "chicago", "houston", "phoenix",
  "philadelphia", "san-antonio", "dallas", "miami", "atlanta",
  "seattle", "boston", "denver", "las-vegas", "austin",
];

// All 50 states with min wage
const US_STATES = [
  { slug: "alabama",        label: "Alabama",        abbr: "AL", minWage: "$7.25"  },
  { slug: "alaska",         label: "Alaska",         abbr: "AK", minWage: "$11.73" },
  { slug: "arizona",        label: "Arizona",        abbr: "AZ", minWage: "$14.35" },
  { slug: "arkansas",       label: "Arkansas",       abbr: "AR", minWage: "$11.00" },
  { slug: "california",     label: "California",     abbr: "CA", minWage: "$17.28" },
  { slug: "colorado",       label: "Colorado",       abbr: "CO", minWage: "$14.42" },
  { slug: "connecticut",    label: "Connecticut",    abbr: "CT", minWage: "$15.69" },
  { slug: "delaware",       label: "Delaware",       abbr: "DE", minWage: "$13.25" },
  { slug: "florida",        label: "Florida",        abbr: "FL", minWage: "$13.00" },
  { slug: "georgia",        label: "Georgia",        abbr: "GA", minWage: "$7.25"  },
  { slug: "hawaii",         label: "Hawaii",         abbr: "HI", minWage: "$14.00" },
  { slug: "idaho",          label: "Idaho",          abbr: "ID", minWage: "$7.25"  },
  { slug: "illinois",       label: "Illinois",       abbr: "IL", minWage: "$15.00" },
  { slug: "indiana",        label: "Indiana",        abbr: "IN", minWage: "$7.25"  },
  { slug: "iowa",           label: "Iowa",           abbr: "IA", minWage: "$7.25"  },
  { slug: "kansas",         label: "Kansas",         abbr: "KS", minWage: "$7.25"  },
  { slug: "kentucky",       label: "Kentucky",       abbr: "KY", minWage: "$7.25"  },
  { slug: "louisiana",      label: "Louisiana",      abbr: "LA", minWage: "$7.25"  },
  { slug: "maine",          label: "Maine",          abbr: "ME", minWage: "$14.15" },
  { slug: "maryland",       label: "Maryland",       abbr: "MD", minWage: "$15.00" },
  { slug: "massachusetts",  label: "Massachusetts",  abbr: "MA", minWage: "$15.00" },
  { slug: "michigan",       label: "Michigan",       abbr: "MI", minWage: "$10.33" },
  { slug: "minnesota",      label: "Minnesota",      abbr: "MN", minWage: "$10.85" },
  { slug: "mississippi",    label: "Mississippi",    abbr: "MS", minWage: "$7.25"  },
  { slug: "missouri",       label: "Missouri",       abbr: "MO", minWage: "$12.30" },
  { slug: "montana",        label: "Montana",        abbr: "MT", minWage: "$10.30" },
  { slug: "nebraska",       label: "Nebraska",       abbr: "NE", minWage: "$12.00" },
  { slug: "nevada",         label: "Nevada",         abbr: "NV", minWage: "$12.00" },
  { slug: "new-hampshire",  label: "New Hampshire",  abbr: "NH", minWage: "$7.25"  },
  { slug: "new-jersey",     label: "New Jersey",     abbr: "NJ", minWage: "$15.49" },
  { slug: "new-mexico",     label: "New Mexico",     abbr: "NM", minWage: "$12.00" },
  { slug: "new-york",       label: "New York",       abbr: "NY", minWage: "$16.50" },
  { slug: "north-carolina", label: "North Carolina", abbr: "NC", minWage: "$7.25"  },
  { slug: "north-dakota",   label: "North Dakota",   abbr: "ND", minWage: "$7.25"  },
  { slug: "ohio",           label: "Ohio",           abbr: "OH", minWage: "$10.45" },
  { slug: "oklahoma",       label: "Oklahoma",       abbr: "OK", minWage: "$7.25"  },
  { slug: "oregon",         label: "Oregon",         abbr: "OR", minWage: "$15.45" },
  { slug: "pennsylvania",   label: "Pennsylvania",   abbr: "PA", minWage: "$7.25"  },
  { slug: "rhode-island",   label: "Rhode Island",   abbr: "RI", minWage: "$14.00" },
  { slug: "south-carolina", label: "South Carolina", abbr: "SC", minWage: "$7.25"  },
  { slug: "south-dakota",   label: "South Dakota",   abbr: "SD", minWage: "$11.20" },
  { slug: "tennessee",      label: "Tennessee",      abbr: "TN", minWage: "$7.25"  },
  { slug: "texas",          label: "Texas",          abbr: "TX", minWage: "$7.25"  },
  { slug: "utah",           label: "Utah",           abbr: "UT", minWage: "$7.25"  },
  { slug: "vermont",        label: "Vermont",        abbr: "VT", minWage: "$13.67" },
  { slug: "virginia",       label: "Virginia",       abbr: "VA", minWage: "$12.00" },
  { slug: "washington",     label: "Washington",     abbr: "WA", minWage: "$16.28" },
  { slug: "west-virginia",  label: "West Virginia",  abbr: "WV", minWage: "$8.75"  },
  { slug: "wisconsin",      label: "Wisconsin",      abbr: "WI", minWage: "$7.25"  },
  { slug: "wyoming",        label: "Wyoming",        abbr: "WY", minWage: "$7.25"  },
];

// Extra cities not in ALL_US_CITIES
const EXTRA_CITIES = [
  { slug: "bakersfield",      label: "Bakersfield, CA"      },
  { slug: "mesa",             label: "Mesa, AZ"             },
  { slug: "virginia-beach",   label: "Virginia Beach, VA"   },
  { slug: "colorado-springs", label: "Colorado Springs, CO" },
  { slug: "wichita",          label: "Wichita, KS"          },
  { slug: "arlington",        label: "Arlington, TX"        },
  { slug: "long-beach",       label: "Long Beach, CA"       },
  { slug: "riverside",        label: "Riverside, CA"        },
  { slug: "corpus-christi",   label: "Corpus Christi, TX"   },
  { slug: "lexington",        label: "Lexington, KY"        },
  { slug: "henderson",        label: "Henderson, NV"        },
  { slug: "stockton",         label: "Stockton, CA"         },
  { slug: "saint-paul",       label: "Saint Paul, MN"       },
  { slug: "st-petersburg",    label: "St. Petersburg, FL"   },
  { slug: "greensboro",       label: "Greensboro, NC"       },
  { slug: "plano",            label: "Plano, TX"            },
  { slug: "lincoln",          label: "Lincoln, NE"          },
  { slug: "durham",           label: "Durham, NC"           },
  { slug: "jersey-city",      label: "Jersey City, NJ"      },
  { slug: "chandler",         label: "Chandler, AZ"         },
  { slug: "laredo",           label: "Laredo, TX"           },
  { slug: "madison",          label: "Madison, WI"          },
  { slug: "lubbock",          label: "Lubbock, TX"          },
  { slug: "scottsdale",       label: "Scottsdale, AZ"       },
  { slug: "garland",          label: "Garland, TX"          },
  { slug: "norfolk",          label: "Norfolk, VA"          },
  { slug: "aurora",           label: "Aurora, CO"           },
  { slug: "irving",           label: "Irving, TX"           },
  { slug: "shreveport",       label: "Shreveport, LA"       },
  { slug: "tempe",            label: "Tempe, AZ"            },
  { slug: "akron",            label: "Akron, OH"            },
  { slug: "montgomery",       label: "Montgomery, AL"       },
  { slug: "little-rock",      label: "Little Rock, AR"      },
  { slug: "worcester",        label: "Worcester, MA"        },
  { slug: "knoxville",        label: "Knoxville, TN"        },
  { slug: "grand-rapids",     label: "Grand Rapids, MI"     },
  { slug: "tacoma",           label: "Tacoma, WA"           },
  { slug: "oxnard",           label: "Oxnard, CA"           },
  { slug: "huntsville",       label: "Huntsville, AL"       },
  { slug: "newark-nj",        label: "Newark, NJ"           },
];

export default function NoExperienceJobsHub() {
  const featured = ALL_US_CITIES.filter((c) => featuredCitySlugs.includes(c.slug));
  const allCities = [
    ...ALL_US_CITIES.filter((c) => !featuredCitySlugs.includes(c.slug)),
    ...EXTRA_CITIES,
  ].sort((a, b) => a.label.localeCompare(b.label));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <style>{`
        .city-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px 20px;text-decoration:none;display:block;transition:all .15s}
        .city-card:hover{border-color:#93c5fd;box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .city-pill{background:#f1f5f9;color:#374151;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;display:inline-block;transition:all .15s;text-decoration:none}
        .city-pill:hover{background:#dbeafe;color:#1d4ed8}
        .state-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px 18px;text-decoration:none;display:block;transition:all .15s}
        .state-card:hover{border-color:#93c5fd;box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .tool-link{display:block;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:14px 16px;font-size:14px;font-weight:500;color:#111827;text-decoration:none;transition:all .15s}
        .tool-link:hover{background:#1a56db;color:#fff;border-color:#1a56db}
        .tab-btn{padding:10px 24px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;border:2px solid #1a56db;transition:all .15s;text-decoration:none;display:inline-block}
        .tab-btn-active{background:#1a56db;color:#fff}
        .tab-btn-inactive{background:#fff;color:#1a56db}
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "10px 20px" }}>
        <nav style={{ maxWidth: 1200, margin: "0 auto", fontSize: 13, color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>Visa Sponsorship Jobs</span>
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e40af 100%)", padding: "52px 20px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 14, fontFamily: "'DM Serif Display', serif" }}>
            Visa Sponsorship Jobs USA
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 28 }}>
            Entry-level jobs across the US — visa sponsorship. Browse by city or state and start applying today.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            <span>✅ 100+ US cities</span>
            <span>✅ All 50 states</span>
            <span>✅ 10,000+ live listings</span>
            <span>✅ Updated daily</span>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 20px 80px" }}>

        {/* Featured cities */}
        <section style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Top Cities</h2>
            <Link href="#all-cities" style={{ fontSize: 13, color: "#1a56db", fontWeight: 600 }}>View all cities →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
            {featured.map((city) => (
              <Link key={city.slug} href={`/Find-Visa-Sponsorship-Jobs/${city.slug}`} className="city-card">
                <p style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 4 }}>{city.label}</p>
                <p style={{ fontSize: 13, color: "#6b7280" }}>Visa sponsorship jobs →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* Browse by State */}
        <section style={{ marginBottom: 52 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a" }}>Browse by State</h2>
            <span style={{ fontSize: 13, color: "#6b7280" }}>All 50 states</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {US_STATES.map((state) => (
              <Link key={state.slug} href={`/Find-Visa-Sponsorship-Jobs/states/${state.slug}`} className="state-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: "#0f172a", marginBottom: 3 }}>{state.label}</p>
                    <p style={{ fontSize: 12, color: "#6b7280" }}>Min wage: {state.minWage}/hr</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#1a56db", background: "#eff6ff", padding: "2px 8px", borderRadius: 6 }}>{state.abbr}</span>
                </div>
                <p style={{ fontSize: 12, color: "#1a56db", marginTop: 8, fontWeight: 600 }}>View jobs →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* All cities */}
        <section id="all-cities" style={{ marginBottom: 52 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>All US Cities</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {allCities.map((city) => (
              <Link key={city.slug} href={`/Find-Visa-Sponsorship-Jobs/${city.slug}`} className="city-pill">
                {city.label}
              </Link>
            ))}
          </div>
        </section>

        {/* SEO content */}
        <section style={{ maxWidth: 760, marginBottom: 48, borderTop: "1px solid #e5e7eb", paddingTop: 48 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>What Are Visa Sponsorship Jobs?</h2>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
            Visa sponsorship jobs — also called visa-sponsorship jobs — are positions that don&apos;t require any prior professional work history. They&apos;re ideal for students, recent graduates, career changers, or anyone entering the workforce for the first time. Most employers offer paid on-the-job training so you can learn the role from scratch.
          </p>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
            Common visa-sponsorship roles include retail associate, customer service representative, warehouse picker, food service worker, home health aide, delivery driver, and administrative assistant. These positions exist in virtually every US city and state and are posted and filled daily.
          </p>
          <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
            To land your first role, focus on your soft skills — reliability, communication, and a willingness to learn matter more than experience at this stage. Use our free{" "}
            <Link href="/ai-cover-letter" style={{ color: "#1a56db" }}>AI Cover Letter Generator</Link> and{" "}
            <Link href="/career-advice/how-to-write-cv-with-visa-sponsorship-2026-guide" style={{ color: "#1a56db" }}>CV writing guide</Link>{" "}
            to put your best foot forward.
          </p>
        </section>

        {/* Tools CTA */}
        <section>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Free Tools to Help You Get Hired</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
            {[
              { label: "✉️ AI Cover Letter", href: "/ai-cover-letter" },
              { label: "📄 CV Guide – No Experience", href: "/career-advice/how-to-write-cv-with-visa-sponsorship-2026-guide" },
              { label: "📝 Resume Builder", href: "/resume-builder" },
              { label: "💰 Paycheck Calculator", href: "/paycheck-calculator" },
              { label: "🎯 Interview Generator", href: "/interview-question-generator" },
              { label: "🏙️ Salary by City", href: "/salary-by-city" },
            ].map((t) => (
              <Link key={t.href} href={t.href} className="tool-link">{t.label}</Link>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </>
  );
}
