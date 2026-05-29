"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const ADMIN_KEY = "admin_authenticated";

function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/admin/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json();
      if (data.success) { sessionStorage.setItem(ADMIN_KEY, "1"); onSuccess(); }
      else setError("Incorrect password. Try again.");
    } catch { setError("Something went wrong."); }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "48px 40px", width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Job<span style={{ color: "#f97316" }}>nique</span></div>
        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 32 }}>Admin access</div>
        <div style={{ fontSize: 36, marginBottom: 20 }}>🔐</div>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Admin Dashboard</h1>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>Enter your password to continue</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" autoFocus
            style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "12px 14px", fontSize: 15, outline: "none", textAlign: "center", letterSpacing: "0.2em" }} />
          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>{error}</div>}
          <button type="submit" disabled={loading || !password}
            style={{ background: loading || !password ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontSize: 15, fontWeight: 600, cursor: loading || !password ? "not-allowed" : "pointer" }}>
            {loading ? "Checking…" : "Enter →"}
          </button>
        </form>
        <div style={{ marginTop: 24 }}><Link href="/" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Back to site</Link></div>
      </div>
    </div>
  );
}

interface Application {
  id: string; created_at: string; job_id: string; job_title: string; company: string;
  applicant_name: string; applicant_email: string; applicant_phone: string | null;
  cover_letter: string | null; cv_filename: string; cv_url: string;
  status: "new" | "reviewing" | "shortlisted" | "rejected";
}

interface AtsSource {
  id: string; platform: "greenhouse" | "lever" | "workday";
  token: string; company_name: string; active: boolean; created_at: string;
}

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  new:         { bg: "#eff6ff", color: "#1d4ed8" },
  reviewing:   { bg: "#fef9ec", color: "#b45309" },
  shortlisted: { bg: "#f0fdf4", color: "#16a34a" },
  rejected:    { bg: "#fef2f2", color: "#dc2626" },
};
const STATUS_LABELS: Record<string, string> = {
  new: "🔵 New", reviewing: "🟡 Reviewing", shortlisted: "🟢 Shortlisted", rejected: "🔴 Rejected",
};
const PLATFORM_LABELS: Record<string, string> = {
  greenhouse: "🌿 Greenhouse", lever: "⚙️ Lever", workday: "🏢 Workday",
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000), hours = Math.floor(diff / 3600000), days = Math.floor(diff / 86400000);
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [authChecked, setAuthChecked]     = useState(false);
  useEffect(() => { if (sessionStorage.getItem(ADMIN_KEY) === "1") setAuthenticated(true); setAuthChecked(true); }, []);
  if (!authChecked) return null;
  if (!authenticated) return <LoginScreen onSuccess={() => setAuthenticated(true)} />;
  return <AdminDashboard />;
}

function AdminDashboard() {
  const [tab, setTab] = useState<"applications" | "companies">("applications");

  return (
    <div style={{ minHeight: "100vh", background: "#f8faff", fontFamily: "'Inter',sans-serif" }}>
      {/* Top nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link href="/" style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", textDecoration: "none" }}>Job<span style={{ color: "#f97316" }}>nique</span></Link>
          <span style={{ color: "#e5e7eb" }}>|</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Admin Dashboard</span>
        </div>
        <Link href="/jobs" style={{ fontSize: 13, color: "#6b7280", textDecoration: "none" }}>← Back to site</Link>
      </div>

      {/* Tab nav */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", display: "flex", gap: 0 }}>
        {([["applications", "📋 Applications"], ["companies", "🏢 Job Sources"]] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)}
            style={{ background: "none", border: "none", padding: "14px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              color: tab === key ? "#1a56db" : "#6b7280",
              borderBottom: tab === key ? "2px solid #1a56db" : "2px solid transparent",
              marginBottom: -1 }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>
        {tab === "applications" ? <ApplicationsTab /> : <CompaniesTab />}
      </div>
    </div>
  );
}

// ── Applications Tab ─────────────────────────────────────────────────────
function ApplicationsTab() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading]           = useState(true);
  const [filter, setFilter]             = useState("all");
  const [search, setSearch]             = useState("");
  const [selected, setSelected]         = useState<Application | null>(null);
  const [updatingId, setUpdatingId]     = useState<string | null>(null);
  const [cvLoading, setCvLoading]       = useState<string | null>(null);

  useEffect(() => { fetchApplications(); }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/applications");
      const data = await res.json();
      setApplications(data.applications || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    setUpdatingId(id);
    try {
      await fetch("/api/admin/applications", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status }) });
      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: status as Application["status"] } : a));
      if (selected?.id === id) setSelected(prev => prev ? { ...prev, status: status as Application["status"] } : null);
    } catch (e) { console.error(e); }
    setUpdatingId(null);
  }

  async function downloadCv(app: Application) {
    setCvLoading(app.id);
    try {
      const res = await fetch(`/api/admin/cv?path=${encodeURIComponent(app.cv_url)}`);
      const data = await res.json();
      if (data.url) { const a = document.createElement("a"); a.href = data.url; a.target = "_blank"; a.download = app.cv_filename; a.click(); }
    } catch (e) { console.error(e); }
    setCvLoading(null);
  }

  const filtered = applications.filter(a => {
    const matchStatus = filter === "all" || a.status === filter;
    const matchSearch = !search || a.applicant_name.toLowerCase().includes(search.toLowerCase()) ||
      a.job_title.toLowerCase().includes(search.toLowerCase()) || a.company.toLowerCase().includes(search.toLowerCase()) ||
      a.applicant_email.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = {
    all: applications.length, new: applications.filter(a => a.status === "new").length,
    reviewing: applications.filter(a => a.status === "reviewing").length,
    shortlisted: applications.filter(a => a.status === "shortlisted").length,
    rejected: applications.filter(a => a.status === "rejected").length,
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Applications</h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>{applications.length} total applications</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 14, marginBottom: 28 }}>
        {[{ label: "Total", key: "all", icon: "📋", color: "#1a56db" }, { label: "New", key: "new", icon: "🔵", color: "#1d4ed8" },
          { label: "Reviewing", key: "reviewing", icon: "🟡", color: "#b45309" }, { label: "Shortlisted", key: "shortlisted", icon: "🟢", color: "#16a34a" },
          { label: "Rejected", key: "rejected", icon: "🔴", color: "#dc2626" }].map(s => (
          <div key={s.key} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px 20px" }}>
            <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: s.color }}>{counts[s.key as keyof typeof counts]}</div>
            <div style={{ fontSize: 13, color: "#6b7280" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 16px", marginBottom: 14, display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, job, company…"
              style={{ flex: 1, minWidth: 180, border: "1.5px solid #e5e7eb", borderRadius: 7, padding: "8px 12px", fontSize: 13, outline: "none" }} />
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {["all","new","reviewing","shortlisted","rejected"].map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "1.5px solid",
                    background: filter === s ? "#1a56db" : "#fff", color: filter === s ? "#fff" : "#6b7280", borderColor: filter === s ? "#1a56db" : "#e5e7eb" }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)} ({counts[s as keyof typeof counts]})
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 20px", color: "#6b7280" }}>Loading…</div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No applications yet</div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {filtered.map(app => {
                const sc = STATUS_COLORS[app.status];
                const isActive = selected?.id === app.id;
                return (
                  <div key={app.id} onClick={() => setSelected(isActive ? null : app)}
                    style={{ background: "#fff", border: `1.5px solid ${isActive ? "#1a56db" : "#e5e7eb"}`, borderRadius: 10, padding: "16px 20px", cursor: "pointer", transition: "border-color 0.15s" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a", marginBottom: 3 }}>{app.applicant_name}</div>
                        <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 6 }}>{app.job_title} · {app.company}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af" }}>✉️ {app.applicant_email}{app.applicant_phone && ` · 📞 ${app.applicant_phone}`} · {timeAgo(app.created_at)}</div>
                      </div>
                      <span style={{ background: sc.bg, color: sc.color, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20, whiteSpace: "nowrap" }}>
                        {STATUS_LABELS[app.status]}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {selected && (
          <div style={{ width: 340, flexShrink: 0, background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px 22px", position: "sticky", top: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{selected.applicant_name}</h2>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", fontSize: 18, color: "#9ca3af", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20, fontSize: 13 }}>
              {[["Job", selected.job_title], ["Company", selected.company], ["Applied", new Date(selected.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })]].map(([label, val]) => (
                <div key={label} style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#9ca3af", width: 60, flexShrink: 0 }}>{label}</span>
                  <span style={{ fontWeight: 600, color: "#374151" }}>{val}</span>
                </div>
              ))}
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ color: "#9ca3af", width: 60, flexShrink: 0 }}>Email</span>
                <a href={`mailto:${selected.applicant_email}`} style={{ color: "#1a56db", wordBreak: "break-all" }}>{selected.applicant_email}</a>
              </div>
              {selected.applicant_phone && (
                <div style={{ display: "flex", gap: 8 }}>
                  <span style={{ color: "#9ca3af", width: 60, flexShrink: 0 }}>Phone</span>
                  <span style={{ color: "#374151" }}>{selected.applicant_phone}</span>
                </div>
              )}
            </div>
            <button onClick={() => downloadCv(selected)} disabled={cvLoading === selected.id}
              style={{ width: "100%", background: "#f0f7ff", color: "#1a56db", border: "1.5px solid #dbeafe", borderRadius: 8, padding: "10px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 14 }}>
              {cvLoading === selected.id ? "Getting link…" : `⬇ Download CV — ${selected.cv_filename}`}
            </button>
            {selected.cover_letter && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>Cover letter</div>
                <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, background: "#f9fafb", borderRadius: 8, padding: "12px 14px", maxHeight: 200, overflowY: "auto" }}>{selected.cover_letter}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", marginBottom: 8, textTransform: "uppercase" }}>Update status</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {["new","reviewing","shortlisted","rejected"].map(s => {
                  const sc = STATUS_COLORS[s]; const isActive = selected.status === s;
                  return (
                    <button key={s} onClick={() => updateStatus(selected.id, s)} disabled={isActive || updatingId === selected.id}
                      style={{ background: isActive ? sc.bg : "#fff", color: isActive ? sc.color : "#374151", border: `1.5px solid ${isActive ? sc.color : "#e5e7eb"}`,
                        borderRadius: 7, padding: "8px 14px", fontSize: 13, fontWeight: isActive ? 700 : 500, cursor: isActive ? "default" : "pointer", textAlign: "left" }}>
                      {STATUS_LABELS[s]} {isActive && "✓"}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// ── Companies Tab ────────────────────────────────────────────────────────
function CompaniesTab() {
  const [sources, setSources]   = useState<AtsSource[]>([]);
  const [loading, setLoading]   = useState(true);
  const [url, setUrl]           = useState("");
  const [adding, setAdding]     = useState(false);
  const [error, setError]       = useState("");
  const [success, setSuccess]   = useState("");
  const [syncing, setSyncing]   = useState(false);
  const [syncResult, setSyncResult] = useState("");

  useEffect(() => { fetchSources(); }, []);

  async function fetchSources() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ats-sources");
      const data = await res.json();
      setSources(data.sources || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function addSource(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;
    setAdding(true); setError(""); setSuccess("");
    try {
      const res  = await fetch("/api/admin/ats-sources", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: url.trim() }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add source."); }
      else { setSuccess(`✅ ${data.source.company_name} added successfully!`); setUrl(""); fetchSources(); }
    } catch { setError("Something went wrong."); }
    setAdding(false);
  }

  async function toggleSource(id: string, active: boolean) {
    await fetch("/api/admin/ats-sources", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, active }) });
    setSources(prev => prev.map(s => s.id === id ? { ...s, active } : s));
  }

  async function deleteSource(id: string, name: string) {
    if (!confirm(`Remove ${name}?`)) return;
    await fetch("/api/admin/ats-sources", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setSources(prev => prev.filter(s => s.id !== id));
  }

  async function triggerSync() {
    setSyncing(true); setSyncResult("");
    try {
      const res  = await fetch("/api/admin/ats-sync", { method: "POST" });
      const data = await res.json();
      if (res.status === 401) setSyncResult("❌ Missing CRON_SECRET — trigger sync from cron-job.org instead.");
      else if (data.ok) setSyncResult(`✅ Synced ${data.upserted} jobs (GH: ${data.sources?.greenhouse ?? 0}, Lever: ${data.sources?.lever ?? 0}, WD: ${data.sources?.workday ?? 0})`);
      else setSyncResult("❌ Sync failed — check Vercel logs.");
    } catch { setSyncResult("❌ Sync failed."); }
    setSyncing(false);
  }

  const byPlatform = {
    greenhouse: sources.filter(s => s.platform === "greenhouse"),
    lever:      sources.filter(s => s.platform === "lever"),
    workday:    sources.filter(s => s.platform === "workday"),
  };

  return (
    <>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Job Sources</h1>
        <p style={{ fontSize: 14, color: "#6b7280" }}>{sources.length} companies configured · {sources.filter(s => s.active).length} active</p>
      </div>

      {/* Add company */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px 28px", marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Add a company</h2>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>Paste the company's job board URL — Greenhouse, Lever, or Workday.</p>

        <div style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#374151" }}>
          <strong>Supported URLs:</strong><br />
          🌿 <code>https://boards.greenhouse.io/stripe</code><br />
          ⚙️ <code>https://jobs.lever.co/netflix</code><br />
          🏢 <code>https://amazon.wd5.myworkdayjobs.com/en-US/amazon/External_Career_Site</code>
        </div>

        <form onSubmit={addSource} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste job board URL here…"
            style={{ flex: 1, minWidth: 280, border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 14px", fontSize: 14, outline: "none" }} />
          <button type="submit" disabled={adding || !url.trim()}
            style={{ background: adding || !url.trim() ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 600, cursor: adding || !url.trim() ? "not-allowed" : "pointer", whiteSpace: "nowrap" }}>
            {adding ? "Checking…" : "Add company →"}
          </button>
        </form>

        {error   && <div style={{ marginTop: 12, background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#dc2626", whiteSpace: "pre-line" }}>{error}</div>}
        {success && <div style={{ marginTop: 12, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#16a34a" }}>{success}</div>}
      </div>

      {/* Sync button */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px 28px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Sync jobs now</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>Fetch latest jobs from all active sources</div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          {syncResult && <span style={{ fontSize: 13, color: syncResult.startsWith("✅") ? "#16a34a" : "#dc2626" }}>{syncResult}</span>}
          <button onClick={triggerSync} disabled={syncing}
            style={{ background: syncing ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: syncing ? "not-allowed" : "pointer" }}>
            {syncing ? "Syncing…" : "🔄 Sync now"}
          </button>
        </div>
      </div>

      {/* Sources list */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Loading sources…</div>
      ) : sources.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🏢</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>No companies added yet</div>
          <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>Paste a job board URL above to get started</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {(["greenhouse", "lever", "workday"] as const).map(platform => {
            const group = byPlatform[platform];
            if (group.length === 0) return null;
            return (
              <div key={platform}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {PLATFORM_LABELS[platform]} ({group.length})
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  {group.map(source => (
                    <div key={source.id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>{source.company_name}</div>
                        <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 2 }}>{source.token} · added {timeAgo(source.created_at)}</div>
                      </div>
                      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: source.active ? "#f0fdf4" : "#f9fafb", color: source.active ? "#16a34a" : "#9ca3af", fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20 }}>
                          {source.active ? "● Active" : "○ Paused"}
                        </span>
                        <button onClick={() => toggleSource(source.id, !source.active)}
                          style={{ background: "#f1f5f9", color: "#374151", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          {source.active ? "Pause" : "Resume"}
                        </button>
                        <button onClick={() => deleteSource(source.id, source.company_name)}
                          style={{ background: "#fef2f2", color: "#dc2626", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
