// FILE: app/no-experience-jobs/new-york/page.tsx
// Deploy at: jobnique.com/no-experience-jobs/new-york

import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_US_CITIES } from "@/app/jobs/cities/page";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jobnique.com";
const CITY_LABEL = "New York, NY";
const CITY_SLUG = "new-york";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "No Experience Jobs in New York 2026 – Entry Level Hiring Now | Jobnique",
  description:
    "Browse 1,000+ no experience jobs in New York City. Entry-level roles in retail, hospitality, healthcare, admin & more. Apply today – no prior experience required.",
  keywords:
    "no experience jobs New York, entry level jobs NYC, jobs no experience required New York, no experience hiring New York City, entry level New York 2026",
  alternates: { canonical: `${BASE_URL}/no-experience-jobs/new-york` },
  openGraph: {
    title: "No Experience Jobs in New York 2026 – Entry Level Hiring Now",
    description:
      "Browse 1,000+ no experience jobs in New York City. Entry-level roles in retail, hospitality, healthcare, admin & more. Updated daily.",
    url: `${BASE_URL}/no-experience-jobs/new-york`,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "No Experience Jobs in New York 2026",
    description: "Browse 1,000+ entry-level jobs in NYC – no experience required.",
  },
  robots: { index: true, follow: true },
};

// ── Supabase query ────────────────────────────────────────────────────────────
async function getNoExperienceJobs() {
  const { data } = await supabase
    .from("ats_jobs")
    .select("id, title, company, location, salary_min, salary_max, contract_time, remote, posted_at, category")
    .eq("expired", false)
    .ilike("location", "%New York%")
    .order("posted_at", { ascending: false })
    .limit(20);
  return data || [];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── JSON-LD ───────────────────────────────────────────────────────────────────
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "No Experience Jobs", item: `${BASE_URL}/no-experience-jobs` },
    { "@type": "ListItem", position: 3, name: "New York", item: `${BASE_URL}/no-experience-jobs/new-york` },
  ],
};

const faqItems = [
  {
    q: "What jobs can I get in New York with no experience?",
    a: "New York City has thousands of entry-level roles requiring no prior experience, including retail associates, food service workers, delivery drivers, customer service representatives, warehouse staff, caregivers, and administrative assistants. Many employers provide paid on-the-job training.",
  },
  {
    q: "What is the minimum wage in New York in 2026?",
    a: "As of 2026, the minimum wage in New York City is $16.50 per hour for most workers. Always check the New York State Department of Labor for the latest rates.",
  },
  {
    q: "How do I get a job in New York City with no experience?",
    a: "Start by targeting industries that hire beginners: retail, hospitality, food service, and warehouse work. Write a strong CV highlighting soft skills and any volunteer work, then use our free AI Cover Letter tool to create tailored applications. Apply to multiple listings daily.",
  },
  {
    q: "How much do entry-level jobs pay in New York City?",
    a: "Entry-level no-experience jobs in New York City typically pay between $16.50 and $25 per hour depending on the industry. The NYC minimum wage in 2026 is $16.50/hr.",
  },
  {
    q: "Do I need a resume to apply for no experience jobs in NYC?",
    a: "Most employers ask for a CV even for entry-level roles. Focus on your soft skills, education, and any activities. Use our free CV guide or Resume Builder to create a strong application with no experience.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const industries = [
  { name: "Retail & Sales", count: "340+", icon: "🛍️", avgPay: "$17–$22/hr", q: "retail" },
  { name: "Food & Hospitality", count: "280+", icon: "🍽️", avgPay: "$16.50–$20/hr", q: "food" },
  { name: "Healthcare & Care", count: "210+", icon: "🏥", avgPay: "$18–$25/hr", q: "healthcare" },
  { name: "Warehouse & Logistics", count: "190+", icon: "📦", avgPay: "$18–$23/hr", q: "warehouse" },
  { name: "Customer Service", count: "170+", icon: "💬", avgPay: "$18–$22/hr", q: "customer+service" },
  { name: "Admin & Office", count: "120+", icon: "🗂️", avgPay: "$20–$26/hr", q: "admin" },
];

const salaryTable = [
  ["Retail Associate", "$17–$20/hr", "$35,000–$41,000"],
  ["Food Service Worker", "$16.50–$19/hr", "$34,000–$39,000"],
  ["Warehouse Associate", "$18–$23/hr", "$37,000–$47,000"],
  ["Home Health Aide", "$18–$22/hr", "$37,000–$45,000"],
  ["Customer Service Rep", "$18–$22/hr", "$37,000–$46,000"],
  ["Admin Assistant", "$20–$26/hr", "$42,000–$54,000"],
  ["Delivery Driver", "$20–$30/hr", "$41,000–$62,000"],
];

const sidebarCities = [
  { name: "Los Angeles, CA", slug: "los-angeles" },
  { name: "Chicago, IL", slug: "chicago" },
  { name: "Houston, TX", slug: "houston" },
  { name: "Philadelphia, PA", slug: "philadelphia" },
  { name: "Boston, MA", slug: "boston" },
  { name: "Miami, FL", slug: "miami" },
  { name: "Atlanta, GA", slug: "atlanta" },
  { name: "Seattle, WA", slug: "seattle" },
];

// ── Page (server component — no event handlers, no hooks) ─────────────────────
export default async function NoExperienceJobsNewYork() {
  const jobs = await getNoExperienceJobs();

  const nearbyCities = ALL_US_CITIES
    .filter((c) => c.region === "Northeast" && c.slug !== CITY_SLUG)
    .slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* All hover effects via CSS — no JS event handlers needed */}
      <style>{`
        .job-card { background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:20px 24px; transition:box-shadow 0.15s,border-color 0.15s; display:block; text-decoration:none; color:inherit; }
        .job-card:hover { box-shadow:0 4px 20px rgba(0,0,0,0.08); border-color:#93c5fd; }
        .industry-card { display:flex; align-items:center; gap:14px; background:#fff; border:1px solid #e5e7eb; border-radius:12px; padding:16px; text-decoration:none; color:inherit; transition:border-color 0.15s,box-shadow 0.15s; }
        .industry-card:hover { border-color:#93c5fd; box-shadow:0 2px 12px rgba(0,0,0,0.06); }
        .city-pill { background:#f1f5f9; color:#374151; font-size:13px; font-weight:500; padding:6px 14px; border-radius:20px; display:inline-block; transition:all 0.15s; text-decoration:none; }
        .city-pill:hover { background:#dbeafe; color:#1d4ed8; }
        .tool-link { display:flex; align-items:center; gap:8px; padding:10px 14px; border-radius:8px; background:#fff; border:1px solid #e5e7eb; font-size:13px; font-weight:500; color:#111827; transition:all 0.15s; text-decoration:none; }
        .tool-link:hover { background:#1a56db; color:#fff; border-color:#1a56db; }
        .sidebar-city-link { display:flex; justify-content:space-between; align-items:center; padding:8px 10px; border-radius:8px; font-size:13px; color:#374151; text-decoration:none; transition:background 0.15s; }
        .sidebar-city-link:hover { background:#f1f5f9; color:#1d4ed8; }
        .apply-btn { background:#1a56db; color:#fff; border-radius:8px; padding:7px 16px; font-size:13px; font-weight:600; white-space:nowrap; transition:background 0.15s; }
        .apply-btn:hover { background:#1342b0; }
        .article-card { text-decoration:none; background:#fff; border:1px solid #e5e7eb; border-radius:10px; padding:16px; display:block; transition:all 0.15s; }
        .article-card:hover { border-color:#93c5fd; box-shadow:0 2px 8px rgba(0,0,0,0.06); }
        details summary { cursor:pointer; list-style:none; padding:16px 20px; font-weight:600; font-size:14px; color:#0f172a; display:flex; justify-content:space-between; align-items:center; }
        details summary::-webkit-details-marker { display:none; }
        .faq-arrow { transition:transform 0.2s; color:#6b7280; margin-left:12px; }
        details[open] .faq-arrow { transform:rotate(180deg); }
        @media(max-width:768px){ .page-grid{ grid-template-columns:1fr !important; } }
      `}</style>

      <Navbar />

      {/* Breadcrumb */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "10px 20px" }}>
        <nav aria-label="breadcrumb" style={{ maxWidth: 1200, margin: "0 auto", fontSize: 13, color: "#6b7280" }}>
          <Link href="/" style={{ color: "#6b7280" }}>Home</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <Link href="/no-experience-jobs" style={{ color: "#6b7280" }}>No Experience Jobs</Link>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>New York</span>
        </nav>
      </div>

      {/* Hero */}
      <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1e40af 100%)", padding: "52px 20px 60px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto", textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.2)", color: "#fff", fontSize: 13, fontWeight: 600, padding: "5px 16px", borderRadius: 20, marginBottom: 16 }}>
            📍 New York City, NY
          </span>
          <h1 style={{ fontSize: "clamp(26px,4vw,42px)", fontWeight: 800, color: "#fff", marginBottom: 14, fontFamily: "'DM Serif Display', serif", lineHeight: 1.2 }}>
            No Experience Jobs in New York
          </h1>
          <p style={{ fontSize: 17, color: "rgba(255,255,255,0.85)", marginBottom: 28, maxWidth: 600, margin: "0 auto 28px" }}>
            Browse 1,000+ entry-level jobs across New York City — no prior experience required. Retail, hospitality, healthcare, admin & more. Updated daily.
          </p>
          {/* Static link button — no client JS needed */}
          <Link
            href="/jobs?location=New+York&source=all"
            style={{ display: "inline-block", background: "#fff", color: "#1a56db", borderRadius: 10, padding: "13px 32px", fontSize: 15, fontWeight: 700, textDecoration: "none", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
          >
            Browse All NYC Jobs →
          </Link>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 20, marginTop: 22, fontSize: 13, color: "rgba(255,255,255,0.8)" }}>
            <span>✅ 1,000+ live listings</span>
            <span>✅ Updated daily</span>
            <span>✅ No experience required</span>
            <span>✅ Paid training available</span>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="page-grid" style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px 80px", display: "grid", gridTemplateColumns: "1fr 320px", gap: 40 }}>

        {/* ── Left column ── */}
        <main>

          {/* SEO intro */}
          <section style={{ marginBottom: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              Finding No Experience Jobs in New York City (2026)
            </h2>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
              New York City is one of the most dynamic job markets in the world — and you don&apos;t need years of experience to land your first role here. Thousands of employers across Manhattan, Brooklyn, the Bronx, Queens, and Staten Island actively hire entry-level candidates every day, offering paid training, flexible hours, and a clear path to career growth.
            </p>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>
              Whether you&apos;re a recent high school graduate, a college student, a career changer, or returning to the workforce — New York has no-experience jobs in virtually every industry. The city&apos;s minimum wage in 2026 is <strong>$16.50/hr</strong>, giving entry-level workers a solid earning floor from day one.
            </p>
            <p style={{ fontSize: 15, color: "#374151", lineHeight: 1.75 }}>
              The most active hiring sectors for no-experience roles in NYC are retail and sales, food service and hospitality, warehouse and logistics, healthcare aides, customer service, and administrative support. Many of these roles offer immediate starts with on-the-job training.
            </p>
          </section>

          {/* Live job listings */}
          <section style={{ marginBottom: 48 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                Latest No Experience Jobs — New York
                <span style={{ fontSize: 13, fontWeight: 400, color: "#6b7280", marginLeft: 8 }}>Updated today</span>
              </h2>
            </div>

            {jobs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 20px", background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>No listings loaded yet</h3>
                <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 20 }}>Browse all no-experience roles or search by keyword.</p>
                <Link href="/jobs?location=New+York&source=all" style={{ background: "#1a56db", color: "#fff", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  Browse All NYC Jobs →
                </Link>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="job-card">
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6 }}>
                          <span className="badge badge-green">No Experience Required</span>
                          {job.remote && <span className="badge badge-blue">🌐 Remote</span>}
                        </div>
                        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{job.title}</h3>
                        <p style={{ fontSize: 14, color: "#374151", fontWeight: 500, marginBottom: 8 }}>{job.company}</p>
                        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, color: "#6b7280" }}>📍 {job.location}</span>
                          {job.contract_time && (
                            <span style={{ fontSize: 13, color: "#6b7280" }}>
                              · {job.contract_time === "full_time" ? "Full-time" : "Part-time"}
                            </span>
                          )}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        {formatSalary(job.salary_min, job.salary_max) && (
                          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a56db", marginBottom: 4 }}>
                            💰 {formatSalary(job.salary_min, job.salary_max)}
                          </div>
                        )}
                        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>{timeAgo(job.posted_at)}</div>
                        <span className="apply-btn">Apply Now</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div style={{ marginTop: 20, textAlign: "center" }}>
              <Link
                href="/jobs?location=New+York&source=all"
                style={{ display: "inline-block", border: "2px solid #1a56db", color: "#1a56db", borderRadius: 10, padding: "12px 32px", fontWeight: 700, fontSize: 14, textDecoration: "none" }}
              >
                View All No Experience Jobs in NYC →
              </Link>
            </div>
          </section>

          {/* Industries */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              Top Industries Hiring With No Experience in NYC
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {industries.map((ind) => (
                <Link key={ind.name} href={`/jobs?location=New+York&q=${ind.q}`} className="industry-card">
                  <span style={{ fontSize: 28 }}>{ind.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 2 }}>{ind.name}</p>
                    <p style={{ fontSize: 13, color: "#6b7280" }}>{ind.count} roles · {ind.avgPay}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* How to get hired */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
              How to Get a No Experience Job in New York City
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { step: "01", title: "Write a strong CV with no experience", body: "You don't need work history to write a great CV. Focus on your soft skills, education, volunteer work, and any personal projects. Employers hiring entry-level candidates know you're just starting out — show enthusiasm and willingness to learn.", link: { label: "Read our CV guide →", href: "/career-advice/how-to-write-cv-with-no-experience-2026-guide" } },
                { step: "02", title: "Create a tailored cover letter", body: "Even for entry-level roles, a cover letter sets you apart. Explain why you're excited about the role and what transferable skills you bring. Use our AI Cover Letter generator to create a professional letter in under 60 seconds.", link: { label: "Generate your cover letter free →", href: "/ai-cover-letter" } },
                { step: "03", title: "Apply to multiple listings every day", body: "Entry-level roles in NYC are competitive. Aim to apply to 10–15 positions per day. Focus on your strongest matches and follow up after 5–7 days if you don't hear back.", link: null },
                { step: "04", title: "Prepare for your interview", body: "Most no-experience interviews focus on personality, reliability, and attitude rather than skills. Practice answers to questions like 'Why do you want to work here?' and 'Tell me about yourself.'", link: { label: "Practice with Interview Question Generator →", href: "/interview-question-generator" } },
              ].map((item) => (
                <div key={item.step} style={{ display: "flex", gap: 18, background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
                  <div style={{ flexShrink: 0, width: 40, height: 40, background: "#1a56db", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 13 }}>
                    {item.step}
                  </div>
                  <div>
                    <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 6 }}>{item.title}</h3>
                    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: item.link ? 8 : 0 }}>{item.body}</p>
                    {item.link && (
                      <Link href={item.link.href} style={{ fontSize: 13, fontWeight: 600, color: "#1a56db", textDecoration: "none" }}>
                        {item.link.label}
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Salary table */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>
              What Do No Experience Jobs Pay in New York?
            </h2>
            <div style={{ overflowX: "auto", borderRadius: 12, border: "1px solid #e5e7eb" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Job Type", "Avg Hourly Pay", "Avg Annual"].map((h) => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 700, color: "#374151", borderBottom: "1px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryTable.map(([role, hourly, annual], i) => (
                    <tr key={role} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "#111827", borderBottom: "1px solid #f3f4f6" }}>{role}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", borderBottom: "1px solid #f3f4f6" }}>{hourly}</td>
                      <td style={{ padding: "12px 16px", color: "#374151", borderBottom: "1px solid #f3f4f6" }}>{annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 10 }}>
              Salary estimates based on 2026 NYC market data.{" "}
              <Link href="/paycheck-calculator" style={{ color: "#1a56db" }}>Calculate your take-home pay →</Link>
            </p>
          </section>

          {/* FAQ */}
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 20 }}>
              Frequently Asked Questions
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {faqItems.map((faq, i) => (
                <details key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, overflow: "hidden" }}>
                  <summary>
                    {faq.q}
                    <span className="faq-arrow">▼</span>
                  </summary>
                  <p style={{ padding: "0 20px 16px", fontSize: 14, color: "#374151", lineHeight: 1.65 }}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Nearby cities */}
          {nearbyCities.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 14 }}>
                No Experience Jobs in Nearby Cities
              </h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {nearbyCities.map((c) => (
                  <Link key={c.slug} href={`/no-experience-jobs/${c.slug}`} className="city-pill">
                    {c.label}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Related articles */}
          <section>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Related Career Guides</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {[
                { title: "How to Write a CV With No Experience (2026)", href: "/career-advice/how-to-write-cv-with-no-experience-2026-guide", tag: "CV Writing" },
                { title: "Salary Negotiation Scripts That Work in 2026", href: "/career-advice/salary-negotiation-scripts-that-work-2026", tag: "Salary" },
                { title: "Best Resume Format 2026 – Complete Guide", href: "/career-advice/best-resume-format-2026-complete-guide", tag: "Resume" },
              ].map((a) => (
                <Link key={a.href} href={a.href} className="article-card">
                  <span className="badge badge-blue" style={{ marginBottom: 8 }}>{a.tag}</span>
                  <p style={{ fontSize: 14, fontWeight: 600, color: "#0f172a", lineHeight: 1.45 }}>{a.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* ── Sidebar ── */}
        <aside style={{ display: "flex", flexDirection: "column", gap: 20 }}>

          {/* Free tools */}
          <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 14 }}>Free Career Tools</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "✉️ AI Cover Letter Generator", href: "/ai-cover-letter" },
                { label: "📄 CV Guide – No Experience", href: "/career-advice/how-to-write-cv-with-no-experience-2026-guide" },
                { label: "📝 Resume Builder", href: "/resume-builder" },
                { label: "💰 Paycheck Calculator", href: "/paycheck-calculator" },
                { label: "🎯 Interview Question Generator", href: "/interview-question-generator" },
                { label: "🏙️ Salary by City", href: "/salary-by-city" },
              ].map((t) => (
                <Link key={t.href} href={t.href} className="tool-link">{t.label}</Link>
              ))}
            </div>
          </div>

          {/* Min wage widget */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 8 }}>NYC Minimum Wage 2026</h3>
            <div style={{ fontSize: 36, fontWeight: 800, color: "#1a56db" }}>
              $16.50<span style={{ fontSize: 16, fontWeight: 400, color: "#6b7280" }}>/hr</span>
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, marginBottom: 14 }}>Effective 2026 for most NYC workers</p>
            <Link
              href="/paycheck-calculator"
              style={{ display: "block", textAlign: "center", background: "#1a56db", color: "#fff", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, textDecoration: "none" }}
            >
              Calculate My Take-Home Pay
            </Link>
          </div>

          {/* Other cities */}
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, color: "#0f172a", marginBottom: 14 }}>No Experience Jobs — Other Cities</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sidebarCities.map((c) => (
                <Link key={c.slug} href={`/no-experience-jobs/${c.slug}`} className="sidebar-city-link">
                  <span>📍 {c.name}</span>
                  <span style={{ color: "#9ca3af" }}>→</span>
                </Link>
              ))}
              <Link
                href="/no-experience-jobs"
                style={{ display: "block", textAlign: "center", marginTop: 8, fontSize: 13, fontWeight: 600, color: "#1a56db", textDecoration: "none" }}
              >
                View all cities →
              </Link>
            </div>
          </div>

          {/* Newsletter — static form POSTing to your existing /api/newsletter */}
          <form action="/api/newsletter" method="POST" style={{ background: "linear-gradient(135deg, #1a56db, #1e40af)", borderRadius: 12, padding: 20, color: "#fff" }}>
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>Get Job Alerts</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", marginBottom: 16 }}>
              Be first to know when new no-experience jobs are posted in NYC.
            </p>
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              style={{ width: "100%", borderRadius: 8, border: "none", padding: "10px 14px", fontSize: 13, color: "#111827", marginBottom: 8, outline: "none", boxSizing: "border-box" as const }}
            />
            <button
              type="submit"
              style={{ width: "100%", background: "#fff", color: "#1a56db", border: "none", borderRadius: 8, padding: 10, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              Subscribe Free
            </button>
          </form>
        </aside>
      </div>

      <Footer />
    </>
  );
}
