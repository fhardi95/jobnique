"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const JOB_CATEGORIES = [
  "Accounting & Finance",
  "Admin & Secretarial",
  "Construction & Property",
  "Customer Service",
  "Education & Training",
  "Engineering",
  "Healthcare & Medical",
  "Hospitality & Catering",
  "HR & Recruitment",
  "IT & Software",
  "Legal",
  "Logistics & Warehouse",
  "Manufacturing",
  "Marketing & PR",
  "Media & Design",
  "Retail",
  "Sales",
  "Science & Research",
  "Social Care",
  "Transport & Driving",
  "Other",
];

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Temporary", "Internship", "Remote"];

const PLANS = [
  {
    id: "pay-per-application",
    title: "Pay-Per-Application",
    tagline: "Set a budget and only pay for the applications you receive",
    priceLabel: "Advertise your jobs",
    price: "Free to post",
    priceNote: null,
    cta: "Post a job",
    popular: false,
  },
  {
    id: "featured-listing",
    title: "Featured Listing",
    tagline: "Stand out at the top of search results and reach more candidates faster",
    priceLabel: "Post your job from",
    price: "$79",
    priceNote: "+tax",
    cta: "Get started",
    popular: true,
  },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #e5e7eb",
  borderRadius: 8,
  padding: "11px 14px",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 14,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  color: "#0f172a",
  marginBottom: 18,
  paddingBottom: 10,
  borderBottom: "1px solid #f3f4f6",
};

export default function PostAJobPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [submitted, setSubmitted]       = useState(false);
  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState("");

  // Company info
  const [companyName,    setCompanyName]    = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [contactName,    setContactName]    = useState("");
  const [contactEmail,   setContactEmail]   = useState("");
  const [contactPhone,   setContactPhone]   = useState("");

  // Job details
  const [jobTitle,      setJobTitle]      = useState("");
  const [category,      setCategory]      = useState("");
  const [location,      setLocation]      = useState("");
  const [jobType,       setJobType]       = useState("");
  const [salaryMin,     setSalaryMin]     = useState("");
  const [salaryMax,     setSalaryMax]     = useState("");
  const [description,   setDescription]   = useState("");
  const [requirements,  setRequirements]  = useState("");
  const [benefits,      setBenefits]      = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/post-a-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan:          PLANS.find(p => p.id === selectedPlan)?.title || selectedPlan,
          companyName,   companyWebsite,
          contactName,   contactEmail, contactPhone,
          jobTitle,      category, location, jobType,
          salaryMin:     salaryMin ? parseInt(salaryMin) : null,
          salaryMax:     salaryMax ? parseInt(salaryMax) : null,
          description,   requirements, benefits,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSubmitting(false);
  }

  return (
    <>
      <Navbar />

      {/* Hero */}
      <section style={{ background: "#f8faff", padding: "56px 20px 48px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, color: "#0f172a", lineHeight: 1.15, marginBottom: 14 }}>
            Advertise jobs and find your perfect candidate
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            Connecting employers with top US talent quickly and effectively.
          </p>
        </div>
      </section>

      {/* ── Step 1: Pick a plan ── */}
      {!selectedPlan && (
        <section style={{ padding: "52px 20px 60px", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 860 }}>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20, marginBottom: 20 }}>
              {PLANS.map(plan => (
                <div key={plan.id} style={{ background: "#fff", border: `2px solid ${plan.popular ? "#1a56db" : "#e5e7eb"}`, borderRadius: 16, padding: "32px 28px", display: "flex", flexDirection: "column", position: "relative" }}>
                  {plan.popular && (
                    <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#1a56db", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{plan.title}</h2>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 24, flex: 1 }}>{plan.tagline}</p>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 4 }}>{plan.priceLabel}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{plan.price}</span>
                      {plan.priceNote && <span style={{ fontSize: 13, color: "#9ca3af" }}>{plan.priceNote}</span>}
                    </div>
                  </div>
                  <button onClick={() => setSelectedPlan(plan.id)}
                    style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "13px", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>

            {/* Resume Search banner */}
            <div style={{ background: "#fff", border: "2px solid #e5e7eb", borderRadius: 16, padding: "24px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>Resume Search</h3>
                <p style={{ fontSize: 14, color: "#6b7280", margin: 0 }}>Find talent faster with direct access to our candidate database</p>
              </div>
              <button onClick={() => setSelectedPlan("resume-search")}
                style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
                Search talent
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── Step 2: Job posting form ── */}
      {selectedPlan && !submitted && (
        <section style={{ padding: "48px 20px 64px", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 740 }}>

            {/* Back + plan badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <button onClick={() => setSelectedPlan(null)}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 14px", fontSize: 13, cursor: "pointer", color: "#374151" }}>
                ← Back
              </button>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20 }}>
                {PLANS.find(p => p.id === selectedPlan)?.title || "Resume Search"}
              </span>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* ── Company information ── */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>
                <h2 style={sectionTitle}>🏢 Company information</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Company name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required value={companyName} onChange={e => setCompanyName(e.target.value)}
                        placeholder="Acme Inc." style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Company website</label>
                      <input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)}
                        placeholder="https://acme.com" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Contact name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required value={contactName} onChange={e => setContactName(e.target.value)}
                        placeholder="Jane Smith" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Contact email <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)}
                        placeholder="jane@acme.com" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ maxWidth: 340 }}>
                    <label style={labelStyle}>Contact phone <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <input value={contactPhone} onChange={e => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* ── Job details ── */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>
                <h2 style={sectionTitle}>📋 Job details</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Job title <span style={{ color: "#ef4444" }}>*</span></label>
                    <input required value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer" style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
                      <select required value={category} onChange={e => setCategory(e.target.value)}
                        style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236b7280' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
                        <option value="">Select a category</option>
                        {JOB_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Job type <span style={{ color: "#ef4444" }}>*</span></label>
                      <select required value={jobType} onChange={e => setJobType(e.target.value)}
                        style={{ ...inputStyle, appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M2 4l4 4 4-4' stroke='%236b7280' strokeWidth='1.5' fill='none' strokeLinecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", paddingRight: 36 }}>
                        <option value="">Select job type</option>
                        {JOB_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>Location <span style={{ color: "#ef4444" }}>*</span></label>
                    <input required value={location} onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. New York, NY — or Remote" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Salary range <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input value={salaryMin} onChange={e => setSalaryMin(e.target.value)} type="number"
                        placeholder="Min e.g. 60000" style={{ ...inputStyle, flex: 1 }} />
                      <span style={{ color: "#6b7280", flexShrink: 0 }}>—</span>
                      <input value={salaryMax} onChange={e => setSalaryMax(e.target.value)} type="number"
                        placeholder="Max e.g. 90000" style={{ ...inputStyle, flex: 1 }} />
                      <span style={{ color: "#6b7280", fontSize: 13, flexShrink: 0 }}>USD/yr</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Job description ── */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>
                <h2 style={sectionTitle}>📝 Job description</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Description <span style={{ color: "#ef4444" }}>*</span></label>
                    <textarea required value={description} onChange={e => setDescription(e.target.value)}
                      rows={7} placeholder="Describe the role, day-to-day responsibilities, team, and what makes this a great opportunity…"
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Requirements <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <textarea value={requirements} onChange={e => setRequirements(e.target.value)}
                      rows={4} placeholder="List required skills, qualifications and experience…"
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                  </div>
                  <div>
                    <label style={labelStyle}>Benefits <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <textarea value={benefits} onChange={e => setBenefits(e.target.value)}
                      rows={3} placeholder="e.g. Health insurance, 401k, flexible hours, remote work…"
                      style={{ ...inputStyle, resize: "vertical", lineHeight: 1.7 }} />
                  </div>
                </div>
              </div>

              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#dc2626" }}>
                  ⚠️ {error}
                </div>
              )}

              <button type="submit" disabled={submitting}
                style={{ background: submitting ? "#93c5fd" : "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "15px", fontSize: 15, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer" }}>
                {submitting ? "Submitting…" : "Submit job posting →"}
              </button>

              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: 0 }}>
                We&apos;ll review your listing and publish it within 24 hours.
              </p>
            </form>
          </div>
        </section>
      )}

      {/* ── Success ── */}
      {submitted && (
        <section style={{ padding: "80px 20px", background: "#f8faff", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>Job posted successfully!</h2>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 8, lineHeight: 1.7 }}>
              Thanks <strong>{contactName}</strong>! Your listing for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been submitted.
            </p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 36 }}>
              A confirmation has been sent to <strong>{contactEmail}</strong>. We&apos;ll review and publish it within 24 hours.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/jobs" style={{ background: "#1a56db", color: "#fff", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Browse jobs
              </Link>
              <button onClick={() => { setSubmitted(false); setSelectedPlan(null); }}
                style={{ background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}>
                Post another job
              </button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
