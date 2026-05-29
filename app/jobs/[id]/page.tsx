"use client";
import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Job {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min?: number;
  salary_max?: number;
  description: string;
  redirect_url: string;
  ats_apply_url?: string;
  source?: string;
  contract_time?: string;
  created: string;
  category?: { label: string };
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / year`;
  if (min) return `From ${fmt(min)} / year`;
  return `Up to ${fmt(max!)} / year`;
};

const timeAgo = (dateStr: string) => {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
};

function formatDescription(raw: string): string[] {
  return raw
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ")
    .split(/\n{2,}|\.\s{2,}/)
    .map(s => s.trim())
    .filter(s => s.length > 30);
}

function isSafeRedirectUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" || parsed.protocol === "http:";
  } catch {
    return false;
  }
}

type Step = "details" | "apply";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob]         = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [step, setStep]       = useState<Step>("details");

  // Apply form state
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [phone, setPhone]             = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [cvFile, setCvFile]           = useState<File | null>(null);
  const [submitting, setSubmitting]   = useState(false);
  const [submitted, setSubmitted]     = useState(false);
  const [error, setError]             = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  // Is this an ATS job (Greenhouse / Lever / Workday)?
  const isAtsJob = job?.source && job.source !== "adzuna";
  const atsUrl   = job?.ats_apply_url || job?.redirect_url;

useEffect(() => {
  const cached = sessionStorage.getItem(`job_${id}`);
  if (cached) {
    setJob(JSON.parse(cached));
    setLoading(false);
    return;
  }

  fetch(`/api/jobs/${id}`)
    .then(r => r.json())
    .then(data => {
      if (data && data.id) {
        setJob(data);
        sessionStorage.setItem(`job_${id}`, JSON.stringify(data));
      }
      setLoading(false);
    })
    .catch(() => setLoading(false));
}, [id]);

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!cvFile) { setError("Please attach your CV."); return; }
    setError("");
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append("jobId",       id as string);
      fd.append("jobTitle",    job?.title || "");
      fd.append("company",     job?.company?.display_name || "");
      fd.append("name",        name);
      fd.append("email",       email);
      fd.append("phone",       phone);
      fd.append("coverLetter", coverLetter);
      fd.append("cv",          cvFile);
      const res  = await fetch("/api/apply", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
    setSubmitting(false);
  }

  if (loading) return (
    <><Navbar /><div style={{ textAlign: "center", padding: "80px 20px", color: "#6b7280" }}>Loading job…</div><Footer /></>
  );

  if (!job) return (
    <>
      <Navbar />
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
        <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>Job not found</h1>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>This listing may have expired.</p>
        <Link href="/jobs" style={{ color: "#1a56db", fontWeight: 600 }}>← Back to jobs</Link>
      </div>
      <Footer />
    </>
  );

  const salary     = formatSalary(job.salary_min, job.salary_max);
  const paragraphs = formatDescription(job.description);

  return (
    <>
      <Navbar />

      {/* Top bar */}
      <div style={{ background: "#1a56db", padding: "18px 20px" }}>
        <div className="container" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => router.back()}
            style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 6, padding: "6px 14px", fontSize: 13, cursor: "pointer" }}>
            ← Back
          </button>
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>
            {job.company.display_name} · {job.location.display_name}
          </span>
        </div>
      </div>

      <div className="container" style={{ padding: "36px 20px 60px", maxWidth: 860, margin: "0 auto" }}>

        {/* Job header card */}
        <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: "clamp(20px,3vw,26px)", fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{job.title}</h1>
              <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 14 }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>🏢 {job.company.display_name}</span>
                <span style={{ fontSize: 14, color: "#6b7280" }}>📍 {job.location.display_name}</span>
                <span style={{ fontSize: 14, color: "#6b7280" }}>🕐 Posted {timeAgo(job.created)}</span>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {salary && (
                  <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                    💰 {salary}
                  </span>
                )}
                {job.contract_time && (
                  <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                    {job.contract_time === "full_time" ? "⏱ Full-time" : "⏱ Part-time"}
                  </span>
                )}
                {job.category?.label && (
                  <span style={{ background: "#fef9ec", color: "#b45309", fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
                    {job.category.label}
                  </span>
                )}
                {isAtsJob && (
                  <span style={{ background: "#f0fdf4", color: "#15803d", fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 20, display: "flex", alignItems: "center", gap: 4 }}>
                    ✅ Direct from employer ATS
                  </span>
                )}
              </div>
            </div>

            {/* Apply button — ATS jobs open external URL, Adzuna jobs use form */}
            {step === "details" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
                {isAtsJob && atsUrl && isSafeRedirectUrl(atsUrl) ? (
                  <a href={atsUrl} target="_blank" rel="noopener noreferrer"
                    style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none", textAlign: "center" }}>
                    Apply on {job.company.display_name} →
                  </a>
                ) : (
                  <button onClick={() => setStep("apply")}
                    style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px 28px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    Apply now →
                  </button>
                )}
                <button style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 20px", fontSize: 13, cursor: "pointer" }}>
                  ♡ Save job
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Tab nav — hide Apply tab for ATS jobs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "2px solid #e5e7eb", marginBottom: 28 }}>
          <button onClick={() => setStep("details")}
            style={{ background: "none", border: "none", padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
              color: step === "details" ? "#1a56db" : "#6b7280",
              borderBottom: step === "details" ? "2px solid #1a56db" : "2px solid transparent",
              marginBottom: -2 }}>
            📋 Job description
          </button>
          {!isAtsJob && (
            <button onClick={() => setStep("apply")}
              style={{ background: "none", border: "none", padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer",
                color: step === "apply" ? "#1a56db" : "#6b7280",
                borderBottom: step === "apply" ? "2px solid #1a56db" : "2px solid transparent",
                marginBottom: -2 }}>
              📨 Apply
            </button>
          )}
        </div>

        {/* ─── Job description tab ─── */}
        {step === "details" && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>

            <div style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: 8, padding: "12px 16px", marginBottom: 24, fontSize: 13, color: "#374151", lineHeight: 1.6 }}>
              <strong>ℹ️ Please note:</strong> This listing is sourced from a third-party job board. <strong>Jobnique is a job search platform</strong> and is not the employer for this role. The hiring company is <strong>{job.company.display_name}</strong>.
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 20, color: "#0f172a" }}>About this role</h2>
            <div style={{ fontSize: 15, lineHeight: 1.8, color: "#374151" }}>
              {paragraphs.length > 0
                ? paragraphs.map((p, i) => <p key={i} style={{ marginBottom: 16 }}>{p}</p>)
                : <p>{job.description}</p>
              }
            </div>

            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid #f3f4f6", display: "flex", justifyContent: "flex-end" }}>
              {isAtsJob && atsUrl && isSafeRedirectUrl(atsUrl) ? (
                <a href={atsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                  Apply on {job.company.display_name} →
                </a>
              ) : (
                <button onClick={() => setStep("apply")}
                  style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                  Apply for this job →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ─── Apply tab (Adzuna jobs only) ─── */}
        {step === "apply" && !isAtsJob && !submitted && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>

            <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "14px 18px", marginBottom: 24, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>ℹ️</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1e40af", margin: "0 0 4px" }}>About Jobnique</p>
                <p style={{ fontSize: 13, color: "#1e3a8a", lineHeight: 1.6, margin: 0 }}>
                  Jobnique is a <strong>job search platform</strong>, not the direct employer. We aggregate listings from trusted third-party sources. Your application will be forwarded to the hiring employer listed above.
                </p>
              </div>
            </div>

            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 12, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>🛡️</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#c2410c", margin: "0 0 4px" }}>Stay safe — avoid scams</p>
                <ul style={{ fontSize: 13, color: "#7c2d12", lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
                  <li>Jobnique will <strong>never</strong> ask for payment, bank details, or gift cards as part of an application.</li>
                  <li>Be cautious of employers who contact you outside of official channels asking for personal financial information.</li>
                  <li>If something feels suspicious, <a href="/contact" style={{ color: "#c2410c", fontWeight: 600 }}>report it to us</a>.</li>
                </ul>
              </div>
            </div>

            <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6, color: "#0f172a" }}>Apply for: {job.title}</h2>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 28 }}>at {job.company.display_name} · {job.location.display_name}</p>

            <form onSubmit={handleApply} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Full name <span style={{ color: "#ef4444" }}>*</span></label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email address <span style={{ color: "#ef4444" }}>*</span></label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone number <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 (555) 000-0000" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>CV / Resume <span style={{ color: "#ef4444" }}>*</span></label>
                <div onClick={() => fileRef.current?.click()}
                  style={{ border: "2px dashed #cbd5e1", borderRadius: 10, padding: "24px 20px", textAlign: "center", cursor: "pointer", background: cvFile ? "#f0fdf4" : "#f8faff" }}>
                  {cvFile ? (
                    <div>
                      <div style={{ fontSize: 24, marginBottom: 6 }}>📄</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#16a34a" }}>{cvFile.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>Click to replace</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>⬆️</div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Upload your CV</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>PDF, DOC or DOCX · max 5MB</div>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" style={{ display: "none" }}
                  onChange={e => setCvFile(e.target.files?.[0] || null)} />
              </div>
              <div>
                <label style={labelStyle}>Cover letter <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
                  rows={6} placeholder="Tell the recruiter why you're a great fit for this role…"
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
              </div>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#dc2626" }}>
                  ⚠️ {error}
                </div>
              )}
              <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", paddingTop: 8 }}>
                <button type="button" onClick={() => setStep("details")}
                  style={{ background: "transparent", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 8, padding: "11px 24px", fontSize: 14, cursor: "pointer" }}>
                  ← Back
                </button>
                <button type="submit" disabled={submitting}
                  style={{ background: submitting ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "11px 32px", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
                  {submitting ? "Sending…" : "Submit application →"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ─── Success state ─── */}
        {step === "apply" && submitted && (
          <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "52px 32px", textAlign: "center" }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Application sent!</h2>
            <p style={{ fontSize: 15, color: "#6b7280", maxWidth: 440, margin: "0 auto 12px" }}>
              Your application for <strong>{job.title}</strong> at <strong>{job.company.display_name}</strong> has been submitted.
            </p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 32 }}>
              A confirmation email has been sent to <strong>{email}</strong>. Good luck!
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/jobs" style={{ background: "#1a56db", color: "#fff", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Browse more jobs
              </Link>
              <Link href="/dashboard" style={{ background: "transparent", color: "#1a56db", border: "1px solid #1a56db", borderRadius: 8, padding: "11px 24px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                View my applications
              </Link>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 14, fontWeight: 600, color: "#374151", marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "11px 14px",
  fontSize: 14, color: "#111827", outline: "none", boxSizing: "border-box",
  background: "#fff",
};
