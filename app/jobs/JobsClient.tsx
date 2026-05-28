"use client";
import { useState, useEffect, useCallback, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

interface Job {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  description: string;
  redirect_url: string;
  contract_time?: string;
  created: string;
  category?: { label: string };
}

const JOB_TITLES = [
  "Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer",
  "Product Manager","Product Designer","UX Designer","UI Designer","Graphic Designer",
  "Data Analyst","Data Scientist","Data Engineer","Machine Learning Engineer",
  "DevOps Engineer","Cloud Engineer","Site Reliability Engineer","Platform Engineer",
  "Cybersecurity Analyst","Network Engineer","Systems Administrator",
  "Marketing Manager","Digital Marketing Specialist","SEO Specialist","Content Writer",
  "Copywriter","Social Media Manager","Brand Manager","PR Manager",
  "Sales Manager","Account Executive","Business Development Manager","Customer Success Manager",
  "Financial Analyst","Accountant","Auditor","Investment Banker","Risk Analyst",
  "HR Manager","Recruiter","People Operations","Talent Acquisition",
  "Project Manager","Scrum Master","Business Analyst","Operations Manager",
  "Registered Nurse","Physician","Medical Assistant","Pharmacist","Dentist",
  "Teacher","Lecturer","Tutor","School Principal",
  "Lawyer","Paralegal","Legal Counsel",
  "Civil Engineer","Mechanical Engineer","Electrical Engineer","Chemical Engineer",
  "Architect","Interior Designer","Construction Manager",
  "Logistics Manager","Supply Chain Analyst","Warehouse Manager",
  "Retail Manager","Store Associate","Customer Service Representative",
  "Chef","Restaurant Manager","Hospitality Manager",
  "Part-time","Remote","Internship","Graduate",
];

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return "Salary not specified";
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

/** Only allow http/https absolute URLs from known job providers */
function isSafeExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

const timeAgo = (dateStr: string) => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

function highlightMatch(text: string, query: string) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1 || !query) return <span>{text}</span>;
  return (
    <span>
      {text.slice(0, idx)}
      <strong style={{ color: "#1a56db" }}>{text.slice(idx, idx + query.length)}</strong>
      {text.slice(idx + query.length)}
    </span>
  );
}

function AutocompleteInput({ value, onChange, onSelect, placeholder, mode, style }: {
  value: string; onChange: (v: string) => void; onSelect: (v: string) => void;
  placeholder: string; mode: "title" | "city"; style?: React.CSSProperties;
}) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [focused, setFocused]         = useState(false);
  const [activeIdx, setActiveIdx]     = useState(-1);
  const wrapRef  = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = focused && suggestions.length > 0;

  useEffect(() => {
    if (value.length < 2) { setSuggestions([]); return; }
    if (mode === "title") {
      const lower = value.toLowerCase();
      setSuggestions(JOB_TITLES.filter(t => t.toLowerCase().includes(lower)).slice(0, 6));
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(async () => {
        try {
          const res = await fetch(`/api/autocomplete-cities?q=${encodeURIComponent(value)}`);
          setSuggestions(await res.json());
        } catch { setSuggestions([]); }
      }, 300);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [value, mode]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) { setSuggestions([]); setFocused(false); }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function pick(v: string) { onSelect(v); setSuggestions([]); setFocused(false); setActiveIdx(-1); }

  return (
    <div ref={wrapRef} style={{ position: "relative", flex: mode === "title" ? 2 : 1, minWidth: mode === "title" ? 200 : 140 }}>
      <input value={value}
        onChange={e => { onChange(e.target.value); setActiveIdx(-1); }}
        onFocus={() => setFocused(true)}
        onKeyDown={e => {
          if (!show) return;
          if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, suggestions.length - 1)); }
          if (e.key === "ArrowUp")   { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)); }
          if (e.key === "Enter" && activeIdx >= 0) { e.preventDefault(); pick(suggestions[activeIdx]); }
          if (e.key === "Escape") { setSuggestions([]); setFocused(false); }
        }}
        placeholder={placeholder} autoComplete="off"
        style={{ width: "100%", border: "none", borderRadius: 6, padding: "10px 14px", fontSize: 14, outline: "none", boxSizing: "border-box", ...style }}
      />
      {show && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 300, overflow: "hidden" }}>
          {suggestions.map((s, i) => (
            <div key={s} onMouseDown={() => pick(s)}
              style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", background: i === activeIdx ? "#eff6ff" : "#fff", color: "#111827", borderBottom: i < suggestions.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#9ca3af", fontSize: 13 }}>{mode === "title" ? "🔍" : "📍"}</span>
              {highlightMatch(s, value)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function JobsContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const [q,        setQ]        = useState(searchParams.get("q")        || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [jobs,     setJobs]     = useState<Job[]>([]);
  const [loading,  setLoading]  = useState(false);
  const [total,    setTotal]    = useState(0);
  const [page,     setPage]     = useState(1);
  const [searched, setSearched] = useState(false);

  const search = useCallback(async (p = 1, overrideQ?: string, overrideLoc?: string) => {
    setLoading(true); setSearched(true);
    const qVal  = overrideQ   !== undefined ? overrideQ   : q;
    const lVal  = overrideLoc !== undefined ? overrideLoc : location;
    try {
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(qVal)}&location=${encodeURIComponent(lVal)}&page=${p}`);
      const data = await res.json();
      setJobs(data.results || []); setTotal(data.count || 0); setPage(p);
    } catch { setJobs([]); }
    setLoading(false);
  }, [q, location]);

  // Cache job data in sessionStorage so the detail page can read it
  function cacheAndNavigate(job: Job) {
    try {
      sessionStorage.setItem(`job_${job.id}`, JSON.stringify(job));
    } catch {}
    router.push(`/jobs/${job.id}`);
  }

  useEffect(() => { search(1, q, location); }, []);

  return (
    <>
      <Navbar />
      <CookieBanner />

      <div style={{ background: "#1a56db", padding: "32px 20px" }}>
        <div className="container">
          <h1 style={{ color: "#fff", fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Find your next job</h1>
          <div style={{ background: "#fff", borderRadius: 10, padding: 8, display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <AutocompleteInput value={q} onChange={setQ} onSelect={v => setQ(v)} placeholder="Job title, keywords or company" mode="title" />
            <div style={{ width: 1, height: 28, background: "#e5e7eb", flexShrink: 0 }} className="search-divider" />
            <AutocompleteInput value={location} onChange={setLocation} onSelect={v => setLocation(v)} placeholder="City or state" mode="city" />
            <button onClick={() => search(1)} style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 6, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
              Search
            </button>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            {["Remote","New York","Software Engineer","Marketing","Healthcare","Part-time"].map(t => (
              <button key={t} onClick={() => { setQ(t); search(1, t, location); }}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 20, padding: "4px 12px", fontSize: 12, cursor: "pointer" }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: "32px 20px" }}>
        {searched && !loading && (
          <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 20 }}>
            {total > 0
              ? `${total.toLocaleString()} jobs found${q ? ` for "${q}"` : ""}${location ? ` in ${location}` : ""}`
              : "No jobs found — try different keywords"}
          </p>
        )}

        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px" }}>
                <div style={{ height: 18, background: "#f3f4f6", borderRadius: 4, width: "40%", marginBottom: 10, animation: "pulse 1.5s infinite" }} />
                <div style={{ height: 14, background: "#f3f4f6", borderRadius: 4, width: "60%", marginBottom: 8, animation: "pulse 1.5s infinite" }} />
                <div style={{ height: 12, background: "#f3f4f6", borderRadius: 4, width: "80%", animation: "pulse 1.5s infinite" }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {jobs.map(job => (
              <div key={job.id}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap", cursor: "pointer", transition: "border-color 0.15s, box-shadow 0.15s" }}
                onClick={() => cacheAndNavigate(job)}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "#93c5fd"; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(26,86,219,0.08)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "#e5e7eb"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}
              >
                <div style={{ flex: 1, minWidth: 240 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 4, color: "#0f172a" }}>{job.title}</h2>
                  <div style={{ display: "flex", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>🏢 {job.company.display_name}</span>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>📍 {job.location.display_name}</span>
                    <span style={{ fontSize: 14, color: "#6b7280" }}>🕐 {timeAgo(job.created)}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                    <span className="badge badge-blue">💰 {formatSalary(job.salary_min, job.salary_max)}</span>
                    {job.contract_time && <span className="badge badge-green">{job.contract_time === "full_time" ? "Full-time" : "Part-time"}</span>}
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, maxWidth: 600 }}>
                    {job.description?.replace(/<[^>]+>/g, " ").slice(0, 180)}…
                  </p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => cacheAndNavigate(job)}
                    style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", textAlign: "center" }}>
                    Apply now →
                  </button>
                  <button style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
                    ♡ Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {jobs.length > 0 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 40 }}>
            {page > 1 && <button onClick={() => search(page - 1)} className="btn-outline" style={{ padding: "8px 20px" }}>← Previous</button>}
            <span style={{ padding: "8px 16px", fontSize: 14, color: "#6b7280", display: "flex", alignItems: "center" }}>Page {page}</span>
            <button onClick={() => search(page + 1)} className="btn-outline" style={{ padding: "8px 20px" }}>Next →</button>
          </div>
        )}
      </div>

      <style>{`
        @media(max-width:600px){ .search-divider { display: none; } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
      <Footer />
    </>
  );
}

export default function JobsClient() {
  return (
    <Suspense fallback={
      <><Navbar /><div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading jobs...</div><Footer /></>
    }>
      <JobsContent />
    </Suspense>
  );
}
