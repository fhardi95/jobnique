"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";

const JOB_TITLES = [
  "Software Engineer","Frontend Developer","Backend Developer","Full Stack Developer",
  "Product Manager","Product Designer","UX Designer","Data Scientist","Data Analyst",
  "DevOps Engineer","Cloud Engineer","Marketing Manager","SEO Specialist",
  "Sales Manager","Account Executive","Financial Analyst","Accountant",
  "HR Manager","Recruiter","Project Manager","Registered Nurse","Teacher","Lawyer",
  "Civil Engineer","Mechanical Engineer","Architect","Graphic Designer",
  "Customer Service","Operations Manager","Remote","Part-time","Graduate",
];

const TRENDING_JOBS = [
  "Work from home jobs",
  "Immediate start jobs",
  "Manager jobs",
  "Finance jobs",
  "Warehouse jobs",
  "Accountant jobs",
  "Administrator jobs",
  "Part time jobs",
  "Receptionist jobs",
  "Customer service jobs",
  "Data entry jobs",
  "Graduate jobs",
];

const categories = [
  { icon: "💻", label: "Technology",  count: "18,420" },
  { icon: "🏥", label: "Healthcare",  count: "12,300" },
  { icon: "💰", label: "Finance",     count: "9,870"  },
  { icon: "📐", label: "Engineering", count: "11,200" },
  { icon: "🎓", label: "Education",   count: "7,600"  },
  { icon: "🛒", label: "Retail",      count: "15,100" },
  { icon: "⚖️", label: "Legal",       count: "4,200"  },
  { icon: "🎨", label: "Creative",    count: "6,500"  },
];

const salaries = [
  { role: "Software Engineer", avg: "$112,000", range: "$85k–$150k" },
  { role: "Registered Nurse",  avg: "$77,000",  range: "$60k–$95k"  },
  { role: "Data Scientist",    avg: "$120,000", range: "$90k–$160k" },
  { role: "Product Manager",   avg: "$130,000", range: "$100k–$170k"},
  { role: "Teacher",           avg: "$62,000",  range: "$48k–$80k"  },
  { role: "Accountant",        avg: "$78,000",  range: "$58k–$105k" },
];

const advice = [
  { tag: "CV Advice",    title: "10 CV mistakes that cost you the interview",     time: "5 min read", href: "/career-advice" },
  { tag: "Interviews",   title: "How to answer 'Tell me about yourself'",         time: "4 min read", href: "/interview-tips" },
  { tag: "Salary",       title: "How to negotiate a higher salary (with scripts)", time: "6 min read", href: "/career-advice" },
  { tag: "Career Change",title: "How to switch careers with no experience",        time: "7 min read", href: "/career-advice" },
];

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

export default function Home() {
  const router = useRouter();
  const [q, setQ]               = useState("");
  const [loc, setLoc]           = useState("");
  const [qSugg, setQSugg]       = useState<string[]>([]);
  const [locSugg, setLocSugg]   = useState<string[]>([]);
  const [qFocus, setQFocus]     = useState(false);
  const [locFocus, setLocFocus] = useState(false);
  const [qIdx, setQIdx]         = useState(-1);
  const [locIdx, setLocIdx]     = useState(-1);
  const qRef   = useRef<HTMLDivElement>(null);
  const locRef = useRef<HTMLDivElement>(null);
  const locTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Job title suggestions
  useEffect(() => {
    if (q.length < 2) { setQSugg([]); return; }
    const lower = q.toLowerCase();
    setQSugg(JOB_TITLES.filter(t => t.toLowerCase().includes(lower)).slice(0, 6));
  }, [q]);

  // City suggestions (debounced)
  useEffect(() => {
    if (loc.length < 2) { setLocSugg([]); return; }
    if (locTimer.current) clearTimeout(locTimer.current);
    locTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/autocomplete-cities?q=${encodeURIComponent(loc)}`);
        setLocSugg(await res.json());
      } catch { setLocSugg([]); }
    }, 300);
    return () => { if (locTimer.current) clearTimeout(locTimer.current); };
  }, [loc]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (qRef.current && !qRef.current.contains(e.target as Node))   { setQSugg([]);   setQFocus(false); }
      if (locRef.current && !locRef.current.contains(e.target as Node)){ setLocSugg([]); setLocFocus(false); }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const doSearch = useCallback(() => {
    const params = new URLSearchParams();
    if (q)   params.set("q", q);
    if (loc) params.set("location", loc);
    router.push(`/jobs?${params.toString()}`);
  }, [q, loc, router]);

  const showQSugg   = qFocus   && qSugg.length   > 0;
  const showLocSugg = locFocus && locSugg.length  > 0;

  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 20 }}>
            🇺🇸 1,200,000+ jobs across the US
          </span>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 16, maxWidth: 700, margin: "0 auto 16px" }}>
            Find your next great opportunity
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 17, marginBottom: 40, maxWidth: 500, margin: "0 auto 40px" }}>
            Search thousands of jobs, get career advice, and download free CV templates — all in one place.
          </p>

          {/* Search box */}
          <div style={{ background: "#fff", borderRadius: 12, padding: 8, display: "flex", gap: 8, maxWidth: 700, margin: "0 auto 24px", flexWrap: "wrap", alignItems: "center" }}>

            {/* Job title */}
            <div ref={qRef} style={{ position: "relative", flex: 2, minWidth: 200 }}>
              <input
                value={q}
                onChange={e => { setQ(e.target.value); setQIdx(-1); }}
                onFocus={() => setQFocus(true)}
                onKeyDown={e => {
                  if (!showQSugg) { if (e.key === "Enter") doSearch(); return; }
                  if (e.key === "ArrowDown") { e.preventDefault(); setQIdx(i => Math.min(i + 1, qSugg.length - 1)); }
                  if (e.key === "ArrowUp")   { e.preventDefault(); setQIdx(i => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && qIdx >= 0) { e.preventDefault(); setQ(qSugg[qIdx]); setQSugg([]); setQFocus(false); }
                  if (e.key === "Escape") { setQSugg([]); setQFocus(false); }
                  if (e.key === "Enter" && qIdx < 0) doSearch();
                }}
                placeholder="Job title, keywords or company"
                autoComplete="off"
                style={{ width: "100%", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#111", outline: "none", boxSizing: "border-box" }}
              />
              {showQSugg && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 300, overflow: "hidden", textAlign: "left" }}>
                  {qSugg.map((s, i) => (
                    <div key={s} onMouseDown={() => { setQ(s); setQSugg([]); setQFocus(false); }}
                      style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", background: i === qIdx ? "#eff6ff" : "#fff", borderBottom: i < qSugg.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#9ca3af" }}>🔍</span>{highlightMatch(s, q)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ width: 1, height: 28, background: "#e5e7eb", flexShrink: 0 }} />

            {/* Location */}
            <div ref={locRef} style={{ position: "relative", flex: 1, minWidth: 140 }}>
              <input
                value={loc}
                onChange={e => { setLoc(e.target.value); setLocIdx(-1); }}
                onFocus={() => setLocFocus(true)}
                onKeyDown={e => {
                  if (!showLocSugg) { if (e.key === "Enter") doSearch(); return; }
                  if (e.key === "ArrowDown") { e.preventDefault(); setLocIdx(i => Math.min(i + 1, locSugg.length - 1)); }
                  if (e.key === "ArrowUp")   { e.preventDefault(); setLocIdx(i => Math.max(i - 1, 0)); }
                  if (e.key === "Enter" && locIdx >= 0) { e.preventDefault(); setLoc(locSugg[locIdx]); setLocSugg([]); setLocFocus(false); }
                  if (e.key === "Escape") { setLocSugg([]); setLocFocus(false); }
                  if (e.key === "Enter" && locIdx < 0) doSearch();
                }}
                placeholder="City or state"
                autoComplete="off"
                style={{ width: "100%", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#111", outline: "none", boxSizing: "border-box" }}
              />
              {showLocSugg && (
                <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", zIndex: 300, overflow: "hidden", textAlign: "left" }}>
                  {locSugg.map((s, i) => (
                    <div key={s} onMouseDown={() => { setLoc(s); setLocSugg([]); setLocFocus(false); }}
                      style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", background: i === locIdx ? "#eff6ff" : "#fff", borderBottom: i < locSugg.length - 1 ? "1px solid #f3f4f6" : "none", display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ color: "#9ca3af" }}>📍</span>{highlightMatch(s, loc)}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button onClick={doSearch}
              style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              Search Jobs
            </button>
          </div>

          {/* Quick filters + Browse jobs link */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", alignItems: "center" }}>
            {["Remote","Part-time","Graduate","Healthcare","Tech","Finance"].map(t => (
              <button key={t} onClick={() => { setQ(t); router.push(`/jobs?q=${encodeURIComponent(t)}`); }}
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff", borderRadius: 20, padding: "5px 14px", fontSize: 13, border: "1px solid rgba(255,255,255,0.25)", cursor: "pointer" }}>
                {t}
              </button>
            ))}
            <Link href="/popularjobs"
              style={{ color: "#fff", fontSize: 13, fontWeight: 600, display: "flex", alignItems: "center", gap: 4, marginLeft: 4, textDecoration: "underline", opacity: 0.9 }}>
              Browse jobs →
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Jobs */}
      <section style={{ background: "#fff", padding: "52px 20px 48px" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 700, color: "#0f172a", marginBottom: 28 }}>Trending jobs</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
            {TRENDING_JOBS.map(job => (
              <Link
                key={job}
                href={`/jobs?q=${encodeURIComponent(job.replace(/ jobs$/i, "").trim())}`}
                style={{
                  display: "inline-block",
                  border: "1.5px solid #1e293b",
                  borderRadius: 6,
                  padding: "8px 18px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#1e293b",
                  background: "#fff",
                  transition: "background 0.15s, color 0.15s",
                  textDecoration: "none",
                }}
              >
                {job}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <div style={{ background: "#f8faff", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap", padding: "24px 20px", gap: 20 }}>
          {[["1.2M+","Active job listings"],["50K+","Companies hiring"],["2M+","Job seekers"],["Free","CV templates"]].map(([n,l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#1a56db" }}>{n}</div>
              <div style={{ fontSize: 13, color: "#6b7280" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Job categories */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Browse by category</h2>
          <p className="section-sub">Explore jobs across every industry</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(130px,1fr))", gap: 14 }}>
            {categories.map(c => (
              <Link key={c.label} href={`/jobs?q=${encodeURIComponent(c.label)}`}
                style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px 14px", textAlign: "center", display: "block" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{c.label}</div>
                <div style={{ fontSize: 12, color: "#6b7280" }}>{c.count} jobs</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CV & Cover Letter Downloads */}
      <section style={{ background: "#f0f7ff", padding: "60px 0" }}>
        <div className="container">
          <h2 className="section-title">Free CV & cover letter templates</h2>
          <p className="section-sub">Professional templates used by thousands — download instantly in Word format</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
            {[
              { title:"Classic CV",          desc:"Clean, ATS-friendly",    tag:"Most popular" },
              { title:"Graduate CV",         desc:"No experience needed",   tag:"For students" },
              { title:"Creative CV",         desc:"Stand out visually",     tag:"Design roles" },
              { title:"Executive CV",        desc:"Senior professional",    tag:"Leadership"   },
              { title:"Cover Letter",        desc:"Universal template",     tag:"Essential"    },
              { title:"Speculative Letter",  desc:"Cold applications",      tag:"Proactive"    },
            ].map(t => (
              <div key={t.title} style={{ background: "#fff", border: "1px solid #dbeafe", borderRadius: 10, padding: "20px 18px" }}>
                <span style={{ display: "inline-block", background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, marginBottom: 12 }}>{t.tag}</span>
                <div style={{ fontSize: 18, marginBottom: 4 }}>📄</div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 14 }}>{t.desc}</div>
                <Link href="/cv-templates" style={{ display: "flex", alignItems: "center", gap: 6, color: "#1a56db", fontSize: 13, fontWeight: 500, border: "1.5px solid #1a56db", borderRadius: 6, padding: "7px 14px", width: "fit-content" }}>
                  ⬇ Download free
                </Link>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, textAlign: "center" }}>
            <Link href="/cv-templates" className="btn-outline">View all CV templates →</Link>
          </div>
        </div>
      </section>

      {/* Salary checker */}
      <section className="section">
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <h2 className="section-title">Salary checker</h2>
              <p style={{ color: "#6b7280", fontSize: 15 }}>See what your role pays across the US</p>
            </div>
            <Link href="/salaries" style={{ color: "#1a56db", fontSize: 14, fontWeight: 500 }}>View all salaries →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
            {salaries.map(s => (
              <div key={s.role} style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{s.role}</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Range: {s.range}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#1a56db" }}>{s.avg}</div>
                  <div style={{ fontSize: 11, color: "#6b7280" }}>avg / year</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career advice */}
      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div className="container">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <h2 className="section-title">Career advice</h2>
              <p style={{ color: "#6b7280", fontSize: 15 }}>Expert tips to land your next role</p>
            </div>
            <Link href="/career-advice" style={{ color: "#1a56db", fontSize: 14, fontWeight: 500 }}>All articles →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16 }}>
            {advice.map(a => (
              <Link key={a.title} href={a.href} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px", display: "block" }}>
                <span style={{ display: "inline-block", background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, marginBottom: 12 }}>{a.tag}</span>
                <h3 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.4, marginBottom: 10 }}>{a.title}</h3>
                <span style={{ fontSize: 12, color: "#6b7280" }}>⏱ {a.time}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}
