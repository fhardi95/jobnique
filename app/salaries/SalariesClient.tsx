"use client";

/**
 * SalariesClient.tsx
 *
 * Interactive client island for the /salaries page.
 * All static content (salary rows) is passed from the Server Component
 * so it's fully crawlable. Filtering/sorting/expand are client-only.
 */

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";

/* ── Types ─────────────────────────────────────────────────────────────── */
export interface SalaryEntry {
  role: string;
  slug: string;
  avg: number;
  min: number;
  max: number;
  sector: string;
  growth: string;
  demand: string;
  yoe: string;
  remote: boolean;
}

interface Props {
  salaries: SalaryEntry[];
}

/* ── Helpers ────────────────────────────────────────────────────────────── */
const fmt = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 0)}k`
    : `$${n}`;

const fmtFull = (n: number) =>
  `$${n.toLocaleString("en-US")}`;

const demandBadge: Record<string, { bg: string; text: string }> = {
  "Very High": { bg: "#f0fdf4", text: "#16a34a" },
  "High":      { bg: "#eff6ff", text: "#1d4ed8" },
  "Medium":    { bg: "#fff7ed", text: "#ea580c" },
};

const sectorIcons: Record<string, string> = {
  Technology:   "💻",
  Healthcare:   "🏥",
  Finance:      "💰",
  Legal:        "⚖️",
  Marketing:    "📣",
  Sales:        "🤝",
  Education:    "🎓",
  Engineering:  "⚙️",
  HR:           "👥",
  Operations:   "📦",
  Creative:     "🎨",
};

const GLOBAL_MIN = 38000;
const GLOBAL_MAX = 260000;

/* ── Component ──────────────────────────────────────────────────────────── */
export default function SalariesClient({ salaries }: Props) {
  const [query, setQuery]         = useState("");
  const [activeSector, setActiveSector] = useState("All");
  const [sortBy, setSortBy]       = useState<"avg" | "growth" | "demand">("avg");
  const [expanded, setExpanded]   = useState<string | null>(null);

  const sectors = useMemo(() => {
    const s = Array.from(new Set(salaries.map(s => s.sector))).sort();
    return ["All", ...s];
  }, [salaries]);

  const demandWeight = (d: string) =>
    d === "Very High" ? 3 : d === "High" ? 2 : 1;

  const growthNum = (g: string) =>
    parseFloat(g.replace(/[^0-9.]/g, ""));

  const filtered = useMemo(() => {
    let list = salaries.filter(s => {
      const q = query.toLowerCase();
      const matchQ =
        !q ||
        s.role.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q) ||
        s.slug.includes(q);
      const matchSector =
        activeSector === "All" || s.sector === activeSector;
      return matchQ && matchSector;
    });

    list = [...list].sort((a, b) => {
      if (sortBy === "avg")    return b.avg - a.avg;
      if (sortBy === "growth") return growthNum(b.growth) - growthNum(a.growth);
      if (sortBy === "demand") return demandWeight(b.demand) - demandWeight(a.demand);
      return 0;
    });

    return list;
  }, [salaries, query, activeSector, sortBy]);

  const topPicks = useMemo(
    () =>
      [...salaries]
        .sort((a, b) => growthNum(b.growth) - growthNum(a.growth))
        .slice(0, 3),
    [salaries]
  );

  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* ── Breadcrumb ── */}
      <nav
        aria-label="Breadcrumb"
        style={{
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          padding: "8px 20px",
        }}
      >
        <div
          className="container"
          style={{ display: "flex", gap: 6, fontSize: 13, color: "#6b7280", alignItems: "center" }}
        >
          <Link href="/" style={{ color: "#1a56db" }}>Home</Link>
          <span>/</span>
          <span aria-current="page" style={{ color: "#111827", fontWeight: 500 }}>
            Salary Guide 2026
          </span>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header
        style={{
          background: "linear-gradient(135deg, #1a56db 0%, #1342b0 60%, #0e2f7e 100%)",
          padding: "56px 20px 48px",
          color: "#fff",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* decorative circles */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        {/* SEO: keyword-rich H1 */}
        <h1
          style={{
            fontFamily: "'DM Serif Display',serif",
            fontSize: "clamp(28px,4.5vw,48px)",
            marginBottom: 12,
            lineHeight: 1.15,
          }}
        >
          US Salary Guide 2026
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 560, margin: "0 auto 10px" }}>
          Average salaries, pay ranges &amp; job outlook for{" "}
          <strong style={{ color: "#fff" }}>500+ job titles</strong> across
          technology, healthcare, finance and more.
        </p>
        <p style={{ color: "#93c5fd", fontSize: 13, marginBottom: 32 }}>
          Updated December 2026 · US national data · Sources: BLS, Glassdoor, LinkedIn
        </p>

        {/* Search */}
        <div
          role="search"
          aria-label="Salary search"
          style={{ maxWidth: 500, margin: "0 auto", display: "flex", gap: 8 }}
        >
          <label htmlFor="salary-search" style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}>
            Search by job title or sector
          </label>
          <input
            id="salary-search"
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search job title, e.g. 'Software Engineer'…"
            style={{
              flex: 1,
              border: "none",
              borderRadius: 8,
              padding: "13px 16px",
              fontSize: 14,
              outline: "none",
              boxShadow: "0 0 0 2px rgba(255,255,255,0.15)",
            }}
          />
          <button
            aria-label="Search salaries"
            style={{
              background: "#f97316",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "13px 22px",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            Search
          </button>
        </div>

        {query && (
          <p style={{ color: "#bfdbfe", fontSize: 13, marginTop: 10 }}>
            <strong style={{ color: "#fff" }}>{filtered.length}</strong> result
            {filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
          </p>
        )}
      </header>

      {/* ── Trending Picks ── */}
      {!query && (
        <section
          aria-label="Fastest growing salaries"
          style={{ background: "#f0f9ff", borderBottom: "1px solid #bae6fd", padding: "20px 0" }}
        >
          <div className="container">
            <p style={{ fontSize: 13, color: "#0369a1", fontWeight: 600, marginBottom: 10 }}>
              🔥 Fastest growing salaries in 2026
            </p>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {topPicks.map(p => (
                <a
                  key={p.slug}
                  href={`/jobs?q=${encodeURIComponent(p.role)}`}
                  style={{
                    background: "#fff",
                    border: "1px solid #bae6fd",
                    borderRadius: 8,
                    padding: "8px 14px",
                    fontSize: 13,
                    color: "#0369a1",
                    display: "flex",
                    gap: 6,
                    alignItems: "center",
                    textDecoration: "none",
                    fontWeight: 500,
                  }}
                >
                  {sectorIcons[p.sector] || "📌"} {p.role}
                  <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 20, padding: "1px 7px", fontSize: 11, fontWeight: 700 }}>
                    {p.growth}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Main Content ── */}
      <main>
        <section className="section">
          <div className="container">

            {/* ── SEO H2 ── */}
            <h2 className="section-title">
              {activeSector === "All"
                ? "Average US Salaries by Job Title"
                : `Average US Salaries – ${activeSector} Jobs`}
            </h2>
            <p className="section-sub">
              {query
                ? `Showing ${filtered.length} result${filtered.length !== 1 ? "s" : ""} matching "${query}"`
                : `Compare annual pay for ${filtered.length} job titles${activeSector !== "All" ? ` in ${activeSector}` : " across all industries"}`}
            </p>

            {/* ── Filters Row ── */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 10,
                marginBottom: 24,
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Sector tabs */}
              <div
                role="tablist"
                aria-label="Filter by sector"
                style={{ display: "flex", gap: 6, flexWrap: "wrap" }}
              >
                {sectors.map(s => (
                  <button
                    key={s}
                    role="tab"
                    aria-selected={activeSector === s}
                    onClick={() => setActiveSector(s)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: 20,
                      border: "1.5px solid",
                      borderColor: activeSector === s ? "#1a56db" : "#e5e7eb",
                      background: activeSector === s ? "#1a56db" : "#fff",
                      color: activeSector === s ? "#fff" : "#374151",
                      fontSize: 13,
                      fontWeight: 500,
                      cursor: "pointer",
                    }}
                  >
                    {s !== "All" && sectorIcons[s] ? `${sectorIcons[s]} ` : ""}
                    {s}
                  </button>
                ))}
              </div>

              {/* Sort */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label htmlFor="sort-select" style={{ fontSize: 13, color: "#6b7280", whiteSpace: "nowrap" }}>
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as "avg" | "growth" | "demand")}
                  style={{
                    border: "1.5px solid #e5e7eb",
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: 13,
                    background: "#fff",
                    color: "#111827",
                    outline: "none",
                    width: "auto",
                  }}
                >
                  <option value="avg">Highest salary</option>
                  <option value="growth">Fastest growth</option>
                  <option value="demand">Demand level</option>
                </select>
              </div>
            </div>

            {/* ── Results ── */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                <p style={{ fontSize: 16 }}>No results for &quot;{query}&quot;</p>
                <p style={{ fontSize: 14, marginTop: 6 }}>Try a different title or sector</p>
              </div>
            ) : (
              <div
                role="list"
                aria-label="Salary results"
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {filtered.map(s => {
                  const rangeSpan = GLOBAL_MAX - GLOBAL_MIN;
                  const barLeft   = ((s.min - GLOBAL_MIN) / rangeSpan) * 100;
                  const barWidth  = ((s.max - s.min) / rangeSpan) * 100;
                  const avgLeft   = ((s.avg - GLOBAL_MIN) / rangeSpan) * 100;
                  const isOpen    = expanded === s.slug;
                  const demand    = demandBadge[s.demand] || demandBadge["Medium"];

                  return (
                    <article
                      key={s.slug}
                      role="listitem"
                      aria-label={`${s.role} salary: average ${fmt(s.avg)} per year`}
                      style={{
                        background: "#fff",
                        border: "1px solid",
                        borderColor: isOpen ? "#1a56db" : "#e5e7eb",
                        borderRadius: 12,
                        overflow: "hidden",
                        boxShadow: isOpen ? "0 0 0 3px rgba(26,86,219,0.08)" : "none",
                        transition: "border-color 0.15s, box-shadow 0.15s",
                      }}
                    >
                      {/* ── Card main row ── */}
                      <div
                        style={{
                          padding: "18px 20px",
                          display: "flex",
                          alignItems: "center",
                          gap: 16,
                          flexWrap: "wrap",
                          cursor: "pointer",
                        }}
                        onClick={() => setExpanded(isOpen ? null : s.slug)}
                      >
                        {/* Sector icon */}
                        <div
                          style={{
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            background: "#f3f4f6",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 20,
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          {sectorIcons[s.sector] || "📌"}
                        </div>

                        {/* Role + sector */}
                        <div style={{ flex: "1 1 160px", minWidth: 160 }}>
                          {/* SEO: h3 with exact role keyword */}
                          <h3 style={{ fontWeight: 600, fontSize: 15, margin: 0, lineHeight: 1.3 }}>
                            {s.role}
                          </h3>
                          <p style={{ fontSize: 13, color: "#6b7280", margin: 0, marginTop: 2 }}>
                            {s.sector} · {s.yoe}
                            {s.remote && (
                              <span style={{ marginLeft: 6, color: "#1a56db" }}>• Remote eligible</span>
                            )}
                          </p>
                        </div>

                        {/* Bar */}
                        <div style={{ flex: "2 1 200px", minWidth: 180 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#9ca3af", marginBottom: 5 }}>
                            <span>{fmt(s.min)}</span>
                            <span>{fmt(s.max)}</span>
                          </div>
                          <div
                            role="img"
                            aria-label={`Pay range ${fmt(s.min)} to ${fmt(s.max)}, average ${fmt(s.avg)}`}
                            style={{ background: "#f3f4f6", borderRadius: 6, height: 8, position: "relative" }}
                          >
                            <div style={{ position: "absolute", left: `${barLeft}%`, width: `${barWidth}%`, top: 0, bottom: 0, background: "#dbeafe", borderRadius: 6 }} />
                            <div style={{ position: "absolute", left: `calc(${avgLeft}% - 4px)`, width: 8, top: -4, bottom: -4, background: "#1a56db", borderRadius: 4 }} />
                          </div>
                        </div>

                        {/* Avg salary */}
                        <div style={{ textAlign: "right", minWidth: 90 }}>
                          <div style={{ fontSize: 22, fontWeight: 700, color: "#1a56db", lineHeight: 1 }}>
                            {fmt(s.avg)}
                          </div>
                          <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>avg / year</div>
                        </div>

                        {/* Badges */}
                        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flexShrink: 0 }}>
                          <span
                            style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}
                          >
                            {s.growth} growth
                          </span>
                          <span
                            style={{ background: demand.bg, color: demand.text, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 20 }}
                          >
                            {s.demand} demand
                          </span>
                        </div>

                        {/* Expand chevron */}
                        <div
                          style={{
                            color: "#9ca3af",
                            fontSize: 18,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          ▾
                        </div>
                      </div>

                      {/* ── Expanded detail panel ── */}
                      {isOpen && (
                        <div
                          style={{
                            borderTop: "1px solid #f3f4f6",
                            padding: "20px",
                            background: "#fafafa",
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 20,
                          }}
                        >
                          {/* Salary breakdown */}
                          <div style={{ flex: "1 1 220px" }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                              Salary Breakdown
                            </p>
                            {[
                              { label: "Entry level",  val: Math.round(s.min * 1.05) },
                              { label: "Average",      val: s.avg, highlight: true },
                              { label: "Senior",       val: Math.round(s.max * 0.9) },
                              { label: "Top earners",  val: s.max },
                            ].map(row => (
                              <div
                                key={row.label}
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  padding: "6px 0",
                                  borderBottom: "1px solid #f3f4f6",
                                  fontWeight: row.highlight ? 700 : 400,
                                  color: row.highlight ? "#1a56db" : "#374151",
                                  fontSize: 14,
                                }}
                              >
                                <span>{row.label}</span>
                                <span>{fmtFull(row.val)}</span>
                              </div>
                            ))}
                          </div>

                          {/* Key facts */}
                          <div style={{ flex: "1 1 180px" }}>
                            <p style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 10 }}>
                              Key Facts
                            </p>
                            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 6 }}>
                              <li style={{ fontSize: 14, color: "#374151" }}>
                                📈 <strong>{s.growth}</strong> salary growth YoY
                              </li>
                              <li style={{ fontSize: 14, color: "#374151" }}>
                                🎯 Demand: <strong>{s.demand}</strong>
                              </li>
                              <li style={{ fontSize: 14, color: "#374151" }}>
                                🕐 Typical experience: <strong>{s.yoe}</strong>
                              </li>
                              <li style={{ fontSize: 14, color: "#374151" }}>
                                🏠 Remote: <strong>{s.remote ? "Often available" : "Mostly on-site"}</strong>
                              </li>
                            </ul>
                          </div>

                          {/* CTA – clickable job search link */}
                          <div
                            style={{
                              flex: "1 1 200px",
                              display: "flex",
                              flexDirection: "column",
                              gap: 10,
                              justifyContent: "center",
                            }}
                          >
                            {/* Primary CTA: search open jobs */}
                            <a
                              href={`/jobs?q=${encodeURIComponent(s.role)}`}
                              style={{
                                display: "block",
                                background: "#1a56db",
                                color: "#fff",
                                textAlign: "center",
                                borderRadius: 8,
                                padding: "12px 16px",
                                fontWeight: 600,
                                fontSize: 14,
                                textDecoration: "none",
                              }}
                              aria-label={`Find ${s.role} jobs now`}
                            >
                              🔍 Find {s.role} Jobs
                            </a>
                            {/* Remote variant */}
                            {s.remote && (
                              <a
                                href={`/jobs?q=${encodeURIComponent(s.role)}&location=remote`}
                                style={{
                                  display: "block",
                                  background: "#f0fdf4",
                                  color: "#16a34a",
                                  textAlign: "center",
                                  borderRadius: 8,
                                  padding: "10px 16px",
                                  fontWeight: 600,
                                  fontSize: 13,
                                  textDecoration: "none",
                                  border: "1px solid #bbf7d0",
                                }}
                                aria-label={`Find remote ${s.role} jobs`}
                              >
                                🏠 Remote {s.role} Jobs
                              </a>
                            )}
                            {/* Related salary links */}
                            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>
                              More in {s.sector}:{" "}
                              {salaries
                                .filter(x => x.sector === s.sector && x.slug !== s.slug)
                                .slice(0, 2)
                                .map((x, i) => (
                                  <span key={x.slug}>
                                    {i > 0 && ", "}
                                    <button
                                      onClick={e => { e.stopPropagation(); setExpanded(x.slug); setQuery(""); setActiveSector("All"); }}
                                      style={{ background: "none", border: "none", color: "#1a56db", cursor: "pointer", padding: 0, fontSize: 12 }}
                                    >
                                      {x.role}
                                    </button>
                                  </span>
                                ))}
                            </p>
                          </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ── FAQ Section (SEO) ── */}
        <section
          aria-labelledby="faq-heading"
          style={{ background: "#f9fafb", padding: "60px 0", borderTop: "1px solid #e5e7eb" }}
        >
          <div className="container" style={{ maxWidth: 800 }}>
            <h2 id="faq-heading" className="section-title" style={{ textAlign: "center", marginBottom: 36 }}>
              Salary FAQs
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                {
                  q: "What is the average salary for a Software Engineer in the US in 2026?",
                  a: "The average Software Engineer salary in the US is $112,000 per year in 2026, with a range of $80,000–$155,000. Senior engineers earn $148,000 on average.",
                },
                {
                  q: "Which tech jobs have the highest salary growth?",
                  a: "Machine Learning Engineer (+20%), Cybersecurity Analyst (+18%), Cloud Architect (+16%), and Data Scientist (+15%) lead salary growth in 2026.",
                },
                {
                  q: "How much does a Registered Nurse earn in the United States?",
                  a: "US Registered Nurses earn an average of $77,000 per year, with a range of $58,000–$100,000 depending on specialisation and state.",
                },
                {
                  q: "What is the highest-paid healthcare job?",
                  a: "General Practitioners (Physicians) earn an average of $210,000 per year in the US. Nurse Practitioners average $115,000.",
                },
                {
                  q: "Are these salaries updated for 2026?",
                  a: "Yes. All figures are sourced from BLS, LinkedIn, and Glassdoor data updated December 2026 and represent full-time US national averages.",
                },
              ].map((item, i) => (
                <details
                  key={i}
                  style={{
                    background: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    padding: "16px 20px",
                  }}
                >
                  <summary
                    style={{
                      fontWeight: 600,
                      fontSize: 15,
                      cursor: "pointer",
                      listStyle: "none",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {item.q}
                    <span style={{ color: "#1a56db", flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ marginTop: 10, color: "#374151", fontSize: 14, lineHeight: 1.7 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>

            {/* Keyword-rich internal links */}
            <div style={{ marginTop: 36, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 12 }}>Explore more on Jobnique</p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                {[
                  { label: "Browse all jobs",        href: "/jobs" },
                  { label: "Tech jobs",               href: "/jobs?q=engineer" },
                  { label: "Healthcare jobs",         href: "/jobs?q=nurse" },
                  { label: "Finance jobs",            href: "/jobs?q=finance" },
                  { label: "Remote jobs",             href: "/jobs?location=remote" },
                  { label: "Career advice",           href: "/career-advice" },
                  { label: "Free CV templates",       href: "/cv-templates" },
                ].map(l => (
                  <a
                    key={l.href}
                    href={l.href}
                    style={{
                      background: "#eff6ff",
                      color: "#1a56db",
                      borderRadius: 20,
                      padding: "6px 14px",
                      fontSize: 13,
                      fontWeight: 500,
                      textDecoration: "none",
                    }}
                  >
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Newsletter />
      <Footer />
    </>
  );
}
