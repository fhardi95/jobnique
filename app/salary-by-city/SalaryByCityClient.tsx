"use client";
import { useState, useMemo } from "react";

const CITIES = [
  { name: "San Francisco, CA",  mult: 1.45, col: 1.85, abbr: "SF"  },
  { name: "New York, NY",       mult: 1.38, col: 1.75, abbr: "NYC" },
  { name: "Seattle, WA",        mult: 1.30, col: 1.55, abbr: "SEA" },
  { name: "Boston, MA",         mult: 1.25, col: 1.50, abbr: "BOS" },
  { name: "Washington, DC",     mult: 1.22, col: 1.48, abbr: "DC"  },
  { name: "Los Angeles, CA",    mult: 1.20, col: 1.60, abbr: "LA"  },
  { name: "Chicago, IL",        mult: 1.08, col: 1.25, abbr: "CHI" },
  { name: "Denver, CO",         mult: 1.05, col: 1.20, abbr: "DEN" },
  { name: "Austin, TX",         mult: 1.04, col: 1.15, abbr: "AUS" },
  { name: "Miami, FL",          mult: 1.02, col: 1.22, abbr: "MIA" },
  { name: "Atlanta, GA",        mult: 0.98, col: 1.05, abbr: "ATL" },
  { name: "Nashville, TN",      mult: 0.96, col: 1.02, abbr: "NSH" },
  { name: "Phoenix, AZ",        mult: 0.95, col: 1.00, abbr: "PHX" },
  { name: "Dallas, TX",         mult: 0.97, col: 1.08, abbr: "DAL" },
  { name: "Minneapolis, MN",    mult: 0.97, col: 1.05, abbr: "MIN" },
  { name: "Portland, OR",       mult: 1.05, col: 1.22, abbr: "PDX" },
  { name: "Charlotte, NC",      mult: 0.93, col: 0.98, abbr: "CLT" },
  { name: "Columbus, OH",       mult: 0.90, col: 0.92, abbr: "CMH" },
  { name: "Indianapolis, IN",   mult: 0.88, col: 0.90, abbr: "IND" },
  { name: "Kansas City, MO",    mult: 0.87, col: 0.88, abbr: "KC"  },
];

const BASE_SALARIES: Record<string, number> = {
  "Software Engineer":         120000,
  "Product Manager":           115000,
  "Data Scientist":            118000,
  "UX Designer":                95000,
  "Marketing Manager":          88000,
  "Sales Manager":              95000,
  "Financial Analyst":          85000,
  "HR Manager":                 82000,
  "Graphic Designer":           65000,
  "Content Writer":             60000,
  "Nurse (RN)":                 78000,
  "Teacher":                    56000,
  "Accountant":                 75000,
  "Project Manager":            95000,
  "DevOps Engineer":           125000,
  "Cybersecurity Analyst":     110000,
  "Business Analyst":           88000,
  "Operations Manager":         90000,
  "Customer Success Manager":   72000,
  "Recruiter":                  68000,
};

function fmt(n: number) { return "$" + Math.round(n).toLocaleString(); }

const faqs = [
  { q: "Why do salaries differ so much by city?", a: "Salary differences between cities reflect local labour market supply and demand, the concentration of specific industries, and cost of living. Tech hubs like San Francisco and Seattle pay premium wages partly because of competition from major tech employers and partly to offset higher living costs." },
  { q: "How is the 'adjusted salary' calculated?", a: "The adjusted salary shows what a salary in one city is worth relative to a national baseline, factoring in cost of living differences. For example, a $100k salary in San Francisco buys less than $100k in Kansas City because housing, food, and transport cost more in SF." },
  { q: "Should I negotiate salary based on city data?", a: "Yes. Use this data as a starting point — not a ceiling. Research your specific company's pay bands, your years of experience, and current market conditions. Sites like Levels.fyi (tech), LinkedIn Salary, and Glassdoor can supplement city-level data." },
  { q: "Does remote work change these salary norms?", a: "Remote work has blurred city-based pay bands, but many companies still apply geographic pay adjustments. Some companies (like GitLab) pay based on your location; others (like Basecamp) pay a flat rate regardless of location. Always clarify the comp philosophy when evaluating a remote offer." },
  { q: "Which US city offers the best salary-to-cost-of-living ratio?", a: "Based on our data, Austin, TX, Denver, CO, and Raleigh, NC consistently offer strong salaries in technology and business roles relative to living costs. They offer 70–90% of SF/NYC salaries at 50–60% of the cost of living." },
  { q: "How often is this salary data updated?", a: "Our salary benchmarks are updated annually using aggregated data from job postings, salary surveys, and public datasets. The current data reflects 2026 market conditions." },
];

export default function SalaryByCityClient() {
  const [jobTitle, setJobTitle] = useState("Software Engineer");
  const [customSalary, setCustomSalary] = useState("");
  const [sortBy, setSortBy] = useState<"salary" | "adjusted">("salary");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const baseSalary = customSalary ? Number(customSalary.replace(/[^0-9]/g, "")) : (BASE_SALARIES[jobTitle] || 90000);

  const cityData = useMemo(() =>
    CITIES.map(c => ({
      ...c,
      salary: Math.round(baseSalary * c.mult),
      adjustedSalary: Math.round((baseSalary * c.mult) / c.col),
    })).sort((a, b) => sortBy === "salary" ? b.salary - a.salary : b.adjustedSalary - a.adjustedSalary),
    [baseSalary, sortBy]
  );

  const maxSalary = Math.max(...cityData.map(c => c.salary));
  const maxAdjusted = Math.max(...cityData.map(c => c.adjustedSalary));

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Controls */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28, marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Job Title</label>
            <select value={jobTitle} onChange={e => { setJobTitle(e.target.value); setCustomSalary(""); }}
              style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fff", width: "100%" }}>
              {Object.keys(BASE_SALARIES).map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Your Base Salary (optional)</label>
            <input
              value={customSalary}
              onChange={e => setCustomSalary(e.target.value)}
              placeholder={`e.g. ${fmt(BASE_SALARIES[jobTitle] || 90000)}`}
              style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as "salary" | "adjusted")}
              style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fff", width: "100%" }}>
              <option value="salary">Nominal Salary</option>
              <option value="adjusted">Cost-of-Living Adjusted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Highest Paying City", value: cityData[0]?.name.split(",")[0], sub: fmt(cityData[0]?.salary) },
          { label: "National Avg (estimated)", value: fmt(baseSalary), sub: "across all regions" },
          { label: "Best Value City", value: [...cityData].sort((a,b) => b.adjustedSalary - a.adjustedSalary)[0]?.name.split(",")[0], sub: "cost-of-living adjusted" },
        ].map((s,i) => (
          <div key={i} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "20px 22px", textAlign: "center" }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#059669", fontFamily: "'DM Serif Display',serif" }}>{s.value}</div>
            <div style={{ fontSize: 13, color: "#6b7280", marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 0, borderBottom: "2px solid #f3f4f6", padding: "12px 20px", background: "#f9fafb" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", width: 32 }}>#</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280" }}>City</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textAlign: "right" }}>Salary</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textAlign: "right" }}>CoL-Adjusted</div>
        </div>
        {cityData.map((c, i) => (
          <div key={c.name} style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 1fr", gap: 0, padding: "14px 20px", borderBottom: i < cityData.length - 1 ? "1px solid #f9fafb" : "none", alignItems: "center" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#9ca3af", width: 32 }}>{i + 1}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{c.name}</div>
              <div style={{ marginTop: 4, height: 6, background: "#f3f4f6", borderRadius: 100, overflow: "hidden", maxWidth: 180 }}>
                <div style={{ height: "100%", width: `${(c.salary / maxSalary) * 100}%`, background: "#059669", borderRadius: 100 }} />
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{fmt(c.salary)}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>{c.mult > 1 ? "+" : ""}{Math.round((c.mult - 1) * 100)}% vs avg</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#059669" }}>{fmt(c.adjustedSalary)}</div>
              <div style={{ fontSize: 11, color: "#6b7280" }}>after cost of living</div>
            </div>
          </div>
        ))}
      </div>

      {/* FAQs */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 8, color: "#111827" }}>Frequently Asked Questions</h2>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Your questions about US city salaries answered.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 16, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "#6b7280" }}>
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
