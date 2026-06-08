"use client";
import { useState, useRef } from "react";

/* ──────────────────────────────────────────────
   TYPES
────────────────────────────────────────────── */
type Step = "builder" | "plans" | "payment" | "download";
type Plan = "7day" | "quarterly";

interface ResumeData {
  name: string;
  email: string;
  phone: string;
  location: string;
  title: string;
  summary: string;
  experience: { role: string; company: string; period: string; bullets: string }[];
  education: { degree: string; school: string; year: string }[];
  skills: string;
}

const EMPTY_RESUME: ResumeData = {
  name: "",
  email: "",
  phone: "",
  location: "",
  title: "",
  summary: "",
  experience: [{ role: "", company: "", period: "", bullets: "" }],
  education: [{ degree: "", school: "", year: "" }],
  skills: "",
};

const PLANS = [
  {
    id: "7day" as Plan,
    label: "7-day trial",
    price: "£2.95",
    renewal: "£19.95/mo after 7 days",
    badge: "MOST POPULAR",
    highlight: true,
    tooltip: "3,253 people chose this in the last 24 hours",
  },
  {
    id: "quarterly" as Plan,
    label: "Quarterly",
    price: "£16.65",
    priceUnit: "/mo",
    renewal: "Billed every 3 months",
    badge: null,
    highlight: false,
  },
];

const BENEFITS = [
  { icon: "🎯", text: "Quickly tailor your resume for every job posting" },
  { icon: "📄", text: "Access 500+ professional resume templates" },
  { icon: "📨", text: "Match and send your resume to 50 recruiters per week" },
  { icon: "✍️", text: "Create unlimited resumes and matching cover letters" },
  { icon: "🤖", text: "We submit job applications for you — up to 20 per day", isNew: true },
  { icon: "🔎", text: "See every online job board in one simple place" },
  { icon: "💰", text: "Money-back guarantee during first 7 days" },
  { icon: "💬", text: "24/7 customer support" },
];

const HIRED_BY = ["Booking.com", "Apple", "DHL", "Amazon", "Amex", "Accenture", "KPMG"];

/* ──────────────────────────────────────────────
   HELPERS
────────────────────────────────────────────── */
function buildResumeHTML(r: ResumeData): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"/>
<style>
  body{font-family:Georgia,serif;max-width:800px;margin:40px auto;padding:0 40px;color:#1a1a2e;line-height:1.5}
  h1{font-size:2rem;margin:0;color:#0f3460}
  .sub{color:#555;font-size:0.95rem;margin:2px 0 4px}
  .contact{font-size:0.85rem;color:#444;margin-bottom:18px}
  hr{border:none;border-top:2px solid #0f3460;margin:14px 0}
  h2{font-size:1.05rem;text-transform:uppercase;letter-spacing:.1em;color:#0f3460;margin:18px 0 8px}
  .exp{margin-bottom:12px}
  .exp-header{display:flex;justify-content:space-between;font-weight:700;font-size:0.95rem}
  .exp-company{color:#555;font-size:0.88rem}
  ul{margin:4px 0;padding-left:18px;font-size:0.88rem}
  .edu{display:flex;justify-content:space-between;font-size:0.9rem;margin-bottom:6px}
  .skills-grid{display:flex;flex-wrap:wrap;gap:8px}
  .skill{background:#e8f0fe;border-radius:4px;padding:3px 10px;font-size:0.82rem;color:#1a56db}
</style></head><body>
<h1>${r.name || "Your Name"}</h1>
<p class="sub">${r.title || ""}</p>
<p class="contact">${[r.email, r.phone, r.location].filter(Boolean).join(" · ")}</p>
${r.summary ? `<hr/><h2>Summary</h2><p style="font-size:.9rem">${r.summary}</p>` : ""}
${r.experience.length ? `<hr/><h2>Experience</h2>${r.experience.map(e => `
<div class="exp">
  <div class="exp-header"><span>${e.role}</span><span>${e.period}</span></div>
  <div class="exp-company">${e.company}</div>
  ${e.bullets ? `<ul>${e.bullets.split("\n").filter(Boolean).map(b => `<li>${b.replace(/^[-•]\s*/,"")}</li>`).join("")}</ul>` : ""}
</div>`).join("")}` : ""}
${r.education.length ? `<hr/><h2>Education</h2>${r.education.map(e => `<div class="edu"><span><strong>${e.degree}</strong> — ${e.school}</span><span>${e.year}</span></div>`).join("")}` : ""}
${r.skills ? `<hr/><h2>Skills</h2><div class="skills-grid">${r.skills.split(",").map(s => `<span class="skill">${s.trim()}</span>`).join("")}</div>` : ""}
</body></html>`;
}

/* ──────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────── */
export default function ResumeBuilderClient() {
  const [step, setStep] = useState<Step>("builder");
  const [resume, setResume] = useState<ResumeData>(EMPTY_RESUME);
  const [selectedPlan, setSelectedPlan] = useState<Plan>("7day");

  // Payment form state
  const [payEmail, setPayEmail] = useState("");
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);

  // Email CV
  const [emailCVAddr, setEmailCVAddr] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailError, setEmailError] = useState("");

  // Tooltip
  const [tooltip, setTooltip] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  /* ── resume field helpers ── */
  const setField = (k: keyof ResumeData, v: string) =>
    setResume(p => ({ ...p, [k]: v }));

  const setExp = (i: number, k: keyof ResumeData["experience"][0], v: string) =>
    setResume(p => {
      const e = [...p.experience];
      e[i] = { ...e[i], [k]: v };
      return { ...p, experience: e };
    });

  const setEdu = (i: number, k: keyof ResumeData["education"][0], v: string) =>
    setResume(p => {
      const e = [...p.education];
      e[i] = { ...e[i], [k]: v };
      return { ...p, education: e };
    });

  /* ── Stripe payment — redirects to Stripe Checkout ── */
  const handlePay = async () => {
    if (!payEmail) {
      setPayError("Please enter your email address.");
      return;
    }
    setPayError("");
    setPayLoading(true);

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan, email: payEmail }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPayError(data.error ?? "Payment failed. Please try again.");
        setPayLoading(false);
      }
    } catch {
      setPayError("Network error. Please try again.");
      setPayLoading(false);
    }
  };

  /* ── PDF download via print ── */
  const downloadPDF = () => {
    const html = buildResumeHTML(resume);
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); }, 400);
  };

  /* ── DOC download ── */
  const downloadDOC = () => {
    const html = buildResumeHTML(resume);
    const blob = new Blob([html], { type: "application/msword" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${resume.name || "resume"}.doc`;
    a.click();
  };

  /* ── Email CV via Brevo ── */
  const handleEmailCV = async () => {
    if (!emailCVAddr) return;
    setEmailLoading(true);
    setEmailError("");
    try {
      const html = buildResumeHTML(resume);
      const res = await fetch("/api/send-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailCVAddr, resumeHTML: html, name: resume.name }),
      });
      const data = await res.json();
      if (res.ok) {
        setEmailSent(true);
      } else {
        setEmailError(data.error ?? "Failed to send. Please try again.");
      }
    } catch {
      setEmailError("Network error. Please try again.");
    }
    setEmailLoading(false);
  };

  /* ── Step labels ── */
  const STEPS = [
    { id: "builder", label: "Create resume" },
    { id: "plans", label: "Choose plan" },
    { id: "payment", label: "Payment details" },
    { id: "download", label: "Download resume" },
  ];
  const stepIdx = STEPS.findIndex(s => s.id === step);

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: "#f8f9fc", minHeight: "100vh" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus, textarea:focus, select:focus { outline: 2px solid #1a56db; outline-offset: 1px; }
        .btn-primary {
          background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%);
          color: #fff; border: none; border-radius: 8px;
          padding: 14px 28px; font-size: 1rem; font-weight: 700;
          cursor: pointer; transition: opacity .15s; letter-spacing: .01em;
        }
        .btn-primary:hover { opacity: .92; }
        .btn-green {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #fff; border: none; border-radius: 8px;
          padding: 16px 32px; font-size: 1.05rem; font-weight: 700;
          cursor: pointer; transition: all .18s; width: 100%;
        }
        .btn-green:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(22,163,74,.35); }
        .btn-outline {
          background: transparent; border: 2px solid #1a56db; color: #1a56db;
          border-radius: 8px; padding: 12px 24px; font-size: 0.95rem; font-weight: 600;
          cursor: pointer; transition: all .15s;
        }
        .btn-outline:hover { background: #eff6ff; }
        .form-input {
          width: 100%; border: 1.5px solid #e2e8f0; border-radius: 8px;
          padding: 10px 14px; font-size: 0.92rem; font-family: inherit;
          background: #fff; color: #1a1a2e; transition: border-color .15s;
        }
        .form-input:hover { border-color: #94a3b8; }
        .section-card {
          background: #fff; border-radius: 12px; padding: 24px;
          box-shadow: 0 1px 4px rgba(0,0,0,.06); margin-bottom: 16px;
        }
        .section-title {
          font-size: 0.75rem; font-weight: 700; letter-spacing: .1em;
          text-transform: uppercase; color: #64748b; margin-bottom: 14px;
        }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px)} to { opacity:1; transform:none } }
        .fade-up { animation: fadeUp .4s ease both; }
        @keyframes spin { to { transform: rotate(360deg) } }
      `}</style>

      {/* ═══════════════════════════ STEP PROGRESS ═════════════════════════════ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e8ecf0", padding: "18px 0" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 0 }}>
            {STEPS.map((s, i) => (
              <div key={s.id} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: i < stepIdx ? "#16a34a" : i === stepIdx ? "#1a56db" : "#e2e8f0",
                    color: i <= stepIdx ? "#fff" : "#94a3b8",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.8rem", fontWeight: 700, flexShrink: 0,
                  }}>
                    {i < stepIdx ? "✓" : i + 1}
                  </div>
                  <span style={{
                    fontSize: "0.85rem", fontWeight: i === stepIdx ? 700 : 400,
                    color: i === stepIdx ? "#1a1a2e" : i < stepIdx ? "#16a34a" : "#94a3b8",
                    whiteSpace: "nowrap",
                  }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ width: 40, height: 2, background: i < stepIdx ? "#16a34a" : "#e2e8f0", margin: "0 8px" }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════ STEP: BUILDER ══════════════════════════════ */}
      {step === "builder" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px", display: "flex", gap: 24, alignItems: "flex-start" }}>
          <div style={{ flex: "0 0 420px", minWidth: 0 }} className="fade-up">
            <div className="section-card">
              <p className="section-title">Personal Information</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Full Name", key: "name" as const, placeholder: "Jane Smith" },
                  { label: "Job Title", key: "title" as const, placeholder: "Software Engineer" },
                  { label: "Email", key: "email" as const, placeholder: "jane@email.com" },
                  { label: "Phone", key: "phone" as const, placeholder: "+44 7700 900000" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>{f.label}</label>
                    <input className="form-input" placeholder={f.placeholder} value={resume[f.key]} onChange={e => setField(f.key, e.target.value)} />
                  </div>
                ))}
                <div style={{ gridColumn: "span 2" }}>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Location</label>
                  <input className="form-input" placeholder="London, UK" value={resume.location} onChange={e => setField("location", e.target.value)} />
                </div>
              </div>
            </div>

            <div className="section-card">
              <p className="section-title">Professional Summary</p>
              <textarea className="form-input" rows={4} placeholder="A results-driven professional with 5+ years experience in…"
                value={resume.summary} onChange={e => setField("summary", e.target.value)} style={{ resize: "vertical" }} />
            </div>

            <div className="section-card">
              <p className="section-title">Work Experience</p>
              {resume.experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: i < resume.experience.length - 1 ? 20 : 0, paddingBottom: i < resume.experience.length - 1 ? 20 : 0, borderBottom: i < resume.experience.length - 1 ? "1px solid #f1f5f9" : "none" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Job Title</label>
                      <input className="form-input" placeholder="Product Manager" value={exp.role} onChange={e => setExp(i, "role", e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Company</label>
                      <input className="form-input" placeholder="Acme Corp" value={exp.company} onChange={e => setExp(i, "company", e.target.value)} />
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Period</label>
                      <input className="form-input" placeholder="Jan 2021 – Present" value={exp.period} onChange={e => setExp(i, "period", e.target.value)} />
                    </div>
                  </div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Key Achievements (one per line)</label>
                  <textarea className="form-input" rows={3} placeholder="- Led a team of 8 engineers to deliver…&#10;- Increased conversion rate by 32%" value={exp.bullets} onChange={e => setExp(i, "bullets", e.target.value)} style={{ resize: "vertical" }} />
                </div>
              ))}
              <button onClick={() => setResume(p => ({ ...p, experience: [...p.experience, { role: "", company: "", period: "", bullets: "" }] }))}
                style={{ marginTop: 12, background: "none", border: "1px dashed #94a3b8", borderRadius: 8, padding: "8px 16px", color: "#64748b", fontSize: "0.82rem", cursor: "pointer", width: "100%" }}>
                + Add another role
              </button>
            </div>

            <div className="section-card">
              <p className="section-title">Education</p>
              {resume.education.map((edu, i) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
                  <div style={{ gridColumn: "span 2" }}>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Degree / Qualification</label>
                    <input className="form-input" placeholder="BSc Computer Science" value={edu.degree} onChange={e => setEdu(i, "degree", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>School / University</label>
                    <input className="form-input" placeholder="University of London" value={edu.school} onChange={e => setEdu(i, "school", e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Year</label>
                    <input className="form-input" placeholder="2018" value={edu.year} onChange={e => setEdu(i, "year", e.target.value)} />
                  </div>
                </div>
              ))}
              <button onClick={() => setResume(p => ({ ...p, education: [...p.education, { degree: "", school: "", year: "" }] }))}
                style={{ marginTop: 4, background: "none", border: "1px dashed #94a3b8", borderRadius: 8, padding: "8px 16px", color: "#64748b", fontSize: "0.82rem", cursor: "pointer", width: "100%" }}>
                + Add another
              </button>
            </div>

            <div className="section-card">
              <p className="section-title">Skills</p>
              <textarea className="form-input" rows={3} placeholder="React, TypeScript, Node.js, Product Strategy, Agile, SQL…"
                value={resume.skills} onChange={e => setField("skills", e.target.value)} style={{ resize: "vertical" }} />
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 6 }}>Separate skills with commas</p>
            </div>

            <button className="btn-primary" style={{ width: "100%", padding: "16px", fontSize: "1.05rem" }} onClick={() => setStep("plans")}>
              Continue to Choose Plan →
            </button>
          </div>

          {/* RIGHT: Live Preview */}
          <div style={{ flex: 1, position: "sticky", top: 24 }} className="fade-up">
            <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 24px rgba(0,0,0,.1)", overflow: "hidden" }}>
              <div style={{ background: "linear-gradient(135deg, #0f3460 0%, #1a56db 100%)", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: "#fff", fontSize: "0.82rem", fontWeight: 600, letterSpacing: ".05em" }}>LIVE PREVIEW</span>
                <span style={{ color: "rgba(255,255,255,.5)", fontSize: "0.72rem" }}>Updates as you type</span>
              </div>
              <div ref={previewRef} style={{ padding: "32px 28px", maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}>
                <div style={{ fontFamily: "Georgia, serif" }}>
                  <h1 style={{ fontSize: "1.8rem", margin: "0 0 2px", color: "#0f3460" }}>{resume.name || "Your Name"}</h1>
                  <p style={{ margin: "0 0 2px", color: "#555", fontSize: "1rem" }}>{resume.title || "Job Title"}</p>
                  <p style={{ margin: "0 0 16px", color: "#777", fontSize: "0.82rem" }}>
                    {[resume.email, resume.phone, resume.location].filter(Boolean).join(" · ") || "email · phone · location"}
                  </p>
                  {resume.summary && (<>
                    <hr style={{ border: "none", borderTop: "2px solid #0f3460", margin: "0 0 10px" }} />
                    <h2 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: ".12em", color: "#0f3460", margin: "0 0 6px" }}>Summary</h2>
                    <p style={{ fontSize: "0.84rem", lineHeight: 1.6, margin: "0 0 14px" }}>{resume.summary}</p>
                  </>)}
                  {resume.experience.some(e => e.role || e.company) && (<>
                    <hr style={{ border: "none", borderTop: "2px solid #0f3460", margin: "0 0 10px" }} />
                    <h2 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: ".12em", color: "#0f3460", margin: "0 0 10px" }}>Experience</h2>
                    {resume.experience.filter(e => e.role || e.company).map((e, i) => (
                      <div key={i} style={{ marginBottom: 12 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "0.9rem" }}>
                          <span>{e.role}</span><span style={{ color: "#555" }}>{e.period}</span>
                        </div>
                        <div style={{ color: "#666", fontSize: "0.82rem", marginBottom: 4 }}>{e.company}</div>
                        {e.bullets && <ul style={{ margin: "4px 0", paddingLeft: 16 }}>
                          {e.bullets.split("\n").filter(Boolean).map((b, j) => (
                            <li key={j} style={{ fontSize: "0.82rem", marginBottom: 2 }}>{b.replace(/^[-•]\s*/, "")}</li>
                          ))}
                        </ul>}
                      </div>
                    ))}
                  </>)}
                  {resume.education.some(e => e.degree || e.school) && (<>
                    <hr style={{ border: "none", borderTop: "2px solid #0f3460", margin: "0 0 10px" }} />
                    <h2 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: ".12em", color: "#0f3460", margin: "0 0 8px" }}>Education</h2>
                    {resume.education.filter(e => e.degree || e.school).map((e, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 6 }}>
                        <span><strong>{e.degree}</strong>{e.school ? ` — ${e.school}` : ""}</span>
                        <span style={{ color: "#555" }}>{e.year}</span>
                      </div>
                    ))}
                  </>)}
                  {resume.skills && (<>
                    <hr style={{ border: "none", borderTop: "2px solid #0f3460", margin: "0 0 10px" }} />
                    <h2 style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: ".12em", color: "#0f3460", margin: "0 0 8px" }}>Skills</h2>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {resume.skills.split(",").filter(Boolean).map((s, i) => (
                        <span key={i} style={{ background: "#e8f0fe", borderRadius: 4, padding: "3px 10px", fontSize: "0.78rem", color: "#1a56db" }}>{s.trim()}</span>
                      ))}
                    </div>
                  </>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ STEP: PLANS ════════════════════════════════ */}
      {step === "plans" && (
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }} className="fade-up">
          <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: 800, color: "#0f1729", margin: "0 0 8px" }}>
            You&apos;re about to get hired faster
          </h1>
          <p style={{ textAlign: "center", color: "#64748b", marginBottom: 36 }}>Choose your plan to download your resume and access all features</p>

          <div style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>
            <div style={{ flex: "0 0 340px" }}>
              <div style={{ position: "relative", marginBottom: 12 }}>
                {tooltip && (
                  <div style={{ position: "absolute", top: -48, left: 12, background: "#1a1a2e", color: "#fff", borderRadius: 8, padding: "8px 14px", fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap", zIndex: 10, boxShadow: "0 4px 16px rgba(0,0,0,.2)" }}>
                    3,253 people chose this in the last 24 hours
                    <div style={{ position: "absolute", bottom: -6, left: 20, width: 12, height: 12, background: "#1a1a2e", transform: "rotate(45deg)" }} />
                  </div>
                )}
              </div>

              <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                {PLANS.map(plan => (
                  <div key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    onMouseEnter={() => plan.tooltip ? setTooltip(true) : undefined}
                    onMouseLeave={() => setTooltip(false)}
                    style={{ flex: 1, border: `2px solid ${selectedPlan === plan.id ? "#1a56db" : "#e2e8f0"}`, borderRadius: 12, padding: "18px 14px", cursor: "pointer", background: selectedPlan === plan.id ? "#eff6ff" : "#fff", transition: "all .18s", position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                      <div style={{ width: 18, height: 18, borderRadius: "50%", border: `2px solid ${selectedPlan === plan.id ? "#1a56db" : "#e2e8f0"}`, background: selectedPlan === plan.id ? "#1a56db" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {selectedPlan === plan.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                      </div>
                      <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1a1a2e" }}>{plan.label}</span>
                    </div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f1729" }}>
                      {plan.price}<span style={{ fontSize: "0.85rem", fontWeight: 400, color: "#64748b" }}>{plan.priceUnit || ""}</span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#94a3b8", marginTop: 2 }}>{plan.renewal}</div>
                    {plan.badge && (
                      <div style={{ position: "absolute", bottom: -12, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #1a56db, #6366f1)", color: "#fff", fontSize: "0.65rem", fontWeight: 800, letterSpacing: ".1em", padding: "3px 10px", borderRadius: 20 }}>
                        {plan.badge}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="section-card" style={{ marginTop: 20 }}>
                {[
                  { text: "Unlimited resumes and cover letters", bold: "Unlimited" },
                  { text: "Access 500+ professional resume templates" },
                  { text: "We submit job applications for you — up to 20 per day" },
                  { text: "Unlimited access to expert-led courses", bold: "Unlimited" },
                  { text: "Auto-renews at £19.95 after 7 days (billed monthly)" },
                  { text: "Money Back Guarantee", bold: "Money Back Guarantee" },
                ].map((item, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                    <span style={{ color: "#1a56db", fontSize: "1rem", flexShrink: 0, marginTop: 1 }}>✓</span>
                    <span style={{ fontSize: "0.87rem", color: "#334155" }}>
                      {item.bold ? <><strong>{item.bold}</strong>{item.text.replace(item.bold, "")}</> : item.text}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "16px 0" }}>
                <strong style={{ fontSize: "0.95rem" }}>Excellent</strong>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(i => <span key={i} style={{ color: "#00b67a", fontSize: "1.1rem" }}>★</span>)}
                </div>
                <span style={{ fontSize: "0.8rem", color: "#64748b" }}><strong>55,638</strong> reviews on</span>
                <span style={{ color: "#00b67a", fontWeight: 800, fontSize: "0.9rem" }}>Trustpilot</span>
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <div className="section-card">
                <p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 18, color: "#0f1729" }}>All Subscription Benefits</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {BENEFITS.map((b, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "12px 14px", background: i >= 6 ? "#f0fdf4" : "#f8fafc", borderRadius: 10, border: `1px solid ${i >= 6 ? "#bbf7d0" : "#e8ecf4"}`, position: "relative" }}>
                      <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{b.icon}</span>
                      <span style={{ fontSize: "0.83rem", color: "#334155", lineHeight: 1.45 }}>{b.text}</span>
                      {b.isNew && (
                        <span style={{ position: "absolute", top: -8, right: 8, background: "#3b82f6", color: "#fff", fontSize: "0.6rem", fontWeight: 800, padding: "2px 6px", borderRadius: 10, letterSpacing: ".06em" }}>NEW</span>
                      )}
                    </div>
                  ))}
                </div>
                <button className="btn-green" style={{ marginTop: 22 }} onClick={() => setStep("payment")}>
                  Continue →
                </button>
                <p style={{ textAlign: "center", fontSize: "0.78rem", color: "#94a3b8", marginTop: 10 }}>
                  Cancel any time online or by email{" "}
                  <a href="mailto:support@jobnique.com" style={{ color: "#1a56db" }}>support@jobnique.com</a>
                </p>
              </div>

              <div style={{ marginTop: 24, textAlign: "center" }}>
                <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 14, fontWeight: 600 }}>Our customers have been hired by:</p>
                <div style={{ display: "flex", gap: 20, alignItems: "center", justifyContent: "center", flexWrap: "wrap" }}>
                  {HIRED_BY.map(c => <span key={c} style={{ fontSize: "0.88rem", fontWeight: 700, color: "#334155", opacity: .75 }}>{c}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════ STEP: PAYMENT ══════════════════════════════ */}
      {step === "payment" && (
        <div style={{ maxWidth: 580, margin: "0 auto", padding: "40px 24px" }} className="fade-up">
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0f1729", margin: "0 0 6px" }}>Payment details</h1>
          <p style={{ color: "#64748b", marginBottom: 28 }}>
            {selectedPlan === "7day" ? "Start your 7-day trial for £2.95. Cancel anytime." : "Subscribe quarterly at £16.65/mo. Cancel anytime."}
          </p>

          <div style={{ background: "#f0f7ff", border: "1.5px solid #bfdbfe", borderRadius: 12, padding: "16px 20px", marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 700, color: "#0f1729", margin: 0 }}>{selectedPlan === "7day" ? "7-Day Trial" : "Quarterly Plan"}</p>
                <p style={{ color: "#64748b", fontSize: "0.82rem", margin: "2px 0 0" }}>
                  {selectedPlan === "7day" ? "Renews at £19.95/mo after trial" : "Billed every 3 months"}
                </p>
              </div>
              <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1a56db" }}>
                {selectedPlan === "7day" ? "£2.95" : "£16.65"}
              </span>
            </div>
          </div>

          <div className="section-card">
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "8px 12px", background: "#f8fafc", borderRadius: 8, border: "1px solid #e2e8f0" }}>
              <svg width="42" height="18" viewBox="0 0 42 18" fill="none"><path d="M5.25 6.3c0-.84.69-1.17 1.83-1.17 1.63 0 3.69.5 5.32 1.39V2.46C10.72 1.72 8.96 1.5 7.08 1.5 3.15 1.5.75 3.48.75 6.51c0 4.68 6.45 3.93 6.45 5.94 0 .99-.87 1.32-2.07 1.32-1.79 0-4.08-.75-5.88-1.74v4.11c2 .87 4.01 1.23 5.88 1.23 4.02 0 6.78-2.01 6.78-5.1C11.91 7.59 5.25 8.49 5.25 6.3zM19.32 1.5l-3.33 16.2h4.38l3.33-16.2h-4.38zM30 5.01c-1.5 0-2.52.69-3.06 1.17l-.21-.93h-3.87L20.97 18h4.35l.03-.18 1.11-5.52c.3-1.53.93-2.46 2.49-2.46.99 0 1.41.48 1.41 1.47 0 .3-.03.6-.09.87L29.25 18h4.35l1.05-5.94c.09-.48.15-.99.15-1.47 0-2.73-1.44-5.58-4.8-5.58z" fill="#635BFF"/></svg>
              <span style={{ fontSize: "0.78rem", color: "#64748b" }}>Secured by Stripe · SSL encrypted</span>
              <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
                {["💳 Visa", "💳 MC", "💳 Amex"].map(c => (
                  <span key={c} style={{ fontSize: "0.68rem", background: "#e8ecf4", borderRadius: 4, padding: "2px 6px", color: "#475569" }}>{c}</span>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: "0.78rem", fontWeight: 600, color: "#475569", display: "block", marginBottom: 4 }}>Email</label>
              <input className="form-input" type="email" placeholder="jane@email.com" value={payEmail} onChange={e => setPayEmail(e.target.value)} />
              <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 6 }}>
                You will be redirected to Stripe&apos;s secure checkout page to enter your card details.
              </p>
            </div>

            {payError && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", color: "#dc2626", fontSize: "0.85rem", marginBottom: 14 }}>
                ⚠️ {payError}
              </div>
            )}

            <button className="btn-green" onClick={handlePay} disabled={payLoading} style={{ opacity: payLoading ? .8 : 1 }}>
              {payLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  <span style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                  Redirecting to Stripe…
                </span>
              ) : `Pay ${selectedPlan === "7day" ? "£2.95" : "£16.65"} with Stripe →`}
            </button>

            <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 14 }}>
              {["🔒 Secure checkout", "💰 Money-back guarantee", "❌ Cancel anytime"].map(t => (
                <span key={t} style={{ fontSize: "0.72rem", color: "#94a3b8" }}>{t}</span>
              ))}
            </div>
          </div>

          <button onClick={() => setStep("plans")} style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: "0.85rem", display: "block", margin: "16px auto 0" }}>
            ← Back to plans
          </button>
        </div>
      )}

      {/* ═══════════════════════════ STEP: DOWNLOAD ═════════════════════════════ */}
      {step === "download" && (
        <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px" }} className="fade-up">
          <div style={{ background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)", borderRadius: 14, padding: "24px 28px", marginBottom: 28, color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 8 }}>🎉</div>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0 0 4px" }}>Payment successful!</h2>
            <p style={{ opacity: .85, margin: 0, fontSize: "0.9rem" }}>Your resume is ready to download. You now have full access to all features.</p>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0f1729", marginBottom: 16 }}>📥 Download Your Resume</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button onClick={downloadPDF}
                style={{ flex: 1, minWidth: 160, background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#fff", border: "none", borderRadius: 10, padding: "16px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .18s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                <span style={{ fontSize: "1.3rem" }}>📄</span>
                Download PDF
              </button>
              <button onClick={downloadDOC}
                style={{ flex: 1, minWidth: 160, background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", color: "#fff", border: "none", borderRadius: 10, padding: "16px 20px", cursor: "pointer", fontWeight: 700, fontSize: "0.95rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all .18s" }}
                onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")}
                onMouseLeave={e => (e.currentTarget.style.transform = "none")}>
                <span style={{ fontSize: "1.3rem" }}>📝</span>
                Download .DOC
              </button>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: 10, textAlign: "center" }}>
              PDF opens your browser print dialog — choose &quot;Save as PDF&quot;. DOC downloads immediately.
            </p>
          </div>

          <div className="section-card" style={{ marginBottom: 20 }}>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0f1729", marginBottom: 6 }}>✉️ Receive CV by Email</p>
            <p style={{ fontSize: "0.85rem", color: "#64748b", marginBottom: 14 }}>We&apos;ll send your resume as an HTML attachment to your inbox.</p>
            {!emailSent ? (
              <>
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="form-input" type="email" placeholder="your@email.com" value={emailCVAddr}
                    onChange={e => setEmailCVAddr(e.target.value)} style={{ flex: 1 }} />
                  <button onClick={handleEmailCV} disabled={emailLoading}
                    className="btn-primary" style={{ flexShrink: 0, padding: "10px 20px", fontSize: "0.88rem", opacity: emailLoading ? .8 : 1 }}>
                    {emailLoading ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ width: 12, height: 12, borderRadius: "50%", border: "2px solid rgba(255,255,255,.3)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite", display: "inline-block" }} />
                        Sending…
                      </span>
                    ) : "Send CV"}
                  </button>
                </div>
                {emailError && (
                  <p style={{ color: "#dc2626", fontSize: "0.82rem", marginTop: 8 }}>⚠️ {emailError}</p>
                )}
              </>
            ) : (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "#16a34a", fontSize: "1.2rem" }}>✅</span>
                <span style={{ color: "#15803d", fontWeight: 600, fontSize: "0.9rem" }}>Your CV has been sent to {emailCVAddr}</span>
              </div>
            )}
          </div>

          <div className="section-card">
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#0f1729", marginBottom: 14 }}>🚀 What&apos;s next?</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: "🎯", title: "Tailor for each job", desc: "Edit your resume for every application using your dashboard" },
                { icon: "📨", title: "Auto-apply to 20 jobs/day", desc: "Let us submit applications on your behalf" },
                { icon: "📚", title: "Access 500+ templates", desc: "Try different formats to stand out" },
              ].map(item => (
                <div key={item.title} style={{ display: "flex", gap: 12, padding: "12px 14px", background: "#f8fafc", borderRadius: 10 }}>
                  <span style={{ fontSize: "1.2rem", flexShrink: 0 }}>{item.icon}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#0f1729", margin: "0 0 2px" }}>{item.title}</p>
                    <p style={{ color: "#64748b", fontSize: "0.82rem", margin: 0 }}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button onClick={() => setStep("builder")} className="btn-outline">← Edit my resume</button>
          </div>
        </div>
      )}
    </div>
  );
}
