"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Constants ───────────────────────────────────────────────────────────────

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

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
];

/**
 * PLANS
 * - "free"     → Pay-Per-Application: form submits directly to /api/post-a-job (no payment)
 * - "featured" → Featured Listing ($79): form collects data, then redirects to Stripe
 *   Stripe price ID is read from NEXT_PUBLIC_STRIPE_PRICE_FEATURED env var (or falls back
 *   to the server-side lookup in /api/stripe/checkout).
 *
 * Add to .env.local:
 *   STRIPE_SECRET_KEY=sk_live_...
 *   NEXT_PUBLIC_STRIPE_PRICE_FEATURED=price_...   ← your Stripe price for Featured Listing
 *   STRIPE_WEBHOOK_SECRET=whsec_...
 *   NEXT_PUBLIC_BASE_URL=https://jobnique.com
 */
const PLANS = [
  {
    id: "free",
    stripePriceKey: null,           // no payment needed
    title: "Pay-Per-Application",
    tagline: "Set a budget and only pay for the applications you receive",
    priceLabel: "Advertise your jobs",
    price: "Free to post",
    priceNote: null,
    priceNumeric: null,
    cta: "Post a job",
    popular: false,
    features: [
      "Standard listing placement",
      "Email notifications on applications",
      "30-day listing duration",
      "Access to applicant CVs",
    ],
    accent: "#e5e7eb",
    accentText: "#374151",
  },
  {
    id: "featured",
    stripePriceKey: "featured",     // matched in /api/stripe/checkout
    title: "Featured Listing",
    tagline: "Stand out at the top of search results and reach more candidates faster",
    priceLabel: "One-time listing fee",
    price: "$79",
    priceNote: "+tax",
    priceNumeric: 79,
    cta: "Get started",
    popular: true,
    features: [
      "Top placement in search results",
      "Featured badge on your listing",
      "Priority email notifications",
      "60-day listing duration",
      "Highlighted in weekly job alerts",
      "Access to applicant CVs",
    ],
    accent: "#1a56db",
    accentText: "#fff",
  },
];

// ─── Styles ───────────────────────────────────────────────────────────────────

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
  fontFamily: "inherit",
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

// ─── Component ────────────────────────────────────────────────────────────────

export default function PostAJobPage() {
  // Step management
  // "plans"   → plan picker
  // "form"    → job detail form
  // "review"  → order review + pay (featured only)
  // "success" → confirmation
  type Step = "plans" | "form" | "review" | "success";
  const [step, setStep] = useState<Step>("plans");

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [jobId, setJobId] = useState("");

  // Company fields
  const [companyName,    setCompanyName]    = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [contactName,    setContactName]    = useState("");
  const [contactEmail,   setContactEmail]   = useState("");
  const [contactPhone,   setContactPhone]   = useState("");

  // Job fields
  const [jobTitle,     setJobTitle]     = useState("");
  const [category,     setCategory]     = useState("");
  const [location,     setLocation]     = useState("");
  const [jobType,      setJobType]      = useState("");
  const [salaryMin,    setSalaryMin]    = useState("");
  const [salaryMax,    setSalaryMax]    = useState("");
  const [description,  setDescription]  = useState("");
  const [requirements, setRequirements] = useState("");
  const [benefits,     setBenefits]     = useState("");

  const plan = PLANS.find(p => p.id === selectedPlan);

  // ── Step helpers ─────────────────────────────────────────────────────────

  function choosePlan(id: string) {
    setSelectedPlan(id);
    setError("");
    setStep("form");
  }

  function handleFormNext(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Free plan → submit immediately
    if (selectedPlan === "free") {
      submitJob();
    } else {
      // Featured → show review/payment step
      setStep("review");
    }
  }

  // ── Submit job to /api/post-a-job ─────────────────────────────────────────

  async function submitJob(paymentSessionId?: string) {
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/post-a-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan?.title ?? selectedPlan,
          companyName,
          companyWebsite,
          contactName,
          contactEmail,
          contactPhone,
          jobTitle,
          category,
          location,
          jobType,
          salaryMin:  salaryMin  ? parseInt(salaryMin)  : null,
          salaryMax:  salaryMax  ? parseInt(salaryMax)  : null,
          description,
          requirements,
          benefits,
          // Pass through Stripe session id so the backend can mark as paid
          stripeSessionId: paymentSessionId ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");
      setJobId(data.jobId ?? "");
      setStep("success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
    setSubmitting(false);
  }

  // ── Stripe checkout ───────────────────────────────────────────────────────
  /**
   * Flow for Featured plan:
   * 1. POST job data to /api/post-a-job with status "pending_payment"
   * 2. Get back a jobId
   * 3. Create Stripe Checkout session via /api/stripe/checkout (one-time payment)
   * 4. Redirect to Stripe-hosted payment page
   * 5. On success, Stripe redirects back to /post-a-job?payment=success&session_id=...
   * 6. Webhook (/api/stripe/webhook) marks job as paid & publishes it
   *
   * We pass the jobId as metadata so the webhook can find the right record.
   */
  async function handleStripeCheckout() {
    setSubmitting(true);
    setError("");
    try {
      // First, save the job as "pending_payment"
      const saveRes = await fetch("/api/post-a-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: plan?.title ?? selectedPlan,
          companyName,
          companyWebsite,
          contactName,
          contactEmail,
          contactPhone,
          jobTitle,
          category,
          location,
          jobType,
          salaryMin:  salaryMin  ? parseInt(salaryMin)  : null,
          salaryMax:  salaryMax  ? parseInt(salaryMax)  : null,
          description,
          requirements,
          benefits,
          status: "pending_payment",
        }),
      });
      const saveData = await saveRes.json();
      if (!saveRes.ok) throw new Error(saveData.error || "Failed to save job");
      const savedJobId: string = saveData.jobId;

      // Then create the Stripe Checkout session
      const checkoutRes = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan: "featured",          // matches PRICE_IDS["featured"] in the route
          email: contactEmail,
          jobId: savedJobId,         // passed as metadata → webhook uses it
          jobTitle,
          companyName,
        }),
      });
      const checkoutData = await checkoutRes.json();
      if (!checkoutRes.ok) throw new Error(checkoutData.error || "Payment setup failed");

      // Redirect to Stripe Checkout
      if (checkoutData.url) {
        window.location.href = checkoutData.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Payment setup failed.");
      setSubmitting(false);
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section style={{ background: "#f8faff", padding: "56px 20px 48px", textAlign: "center", borderBottom: "1px solid #e5e7eb" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          {/* Progress dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 28 }}>
            {(["plans", "form", "review", "success"] as Step[]).map((s, i) => (
              <div key={s} style={{
                width: step === s ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: step === s ? "#1a56db"
                  : (["plans","form","review","success"].indexOf(step) > i ? "#93c5fd" : "#e5e7eb"),
                transition: "all 0.25s ease",
              }} />
            ))}
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,5vw,42px)", fontWeight: 700, color: "#0f172a", lineHeight: 1.15, marginBottom: 14 }}>
            {step === "plans"   && "Advertise jobs and find your perfect candidate"}
            {step === "form"    && "Tell us about the role"}
            {step === "review"  && "Review & pay"}
            {step === "success" && "You're all set!"}
          </h1>
          <p style={{ fontSize: 16, color: "#6b7280", maxWidth: 520, margin: "0 auto", lineHeight: 1.7 }}>
            {step === "plans"   && "Connecting employers with top talent quickly and effectively."}
            {step === "form"    && `Posting a ${plan?.title ?? ""} — fill in the details below.`}
            {step === "review"  && "Check your listing details and complete payment to go live."}
            {step === "success" && "Your job has been submitted and will be reviewed within 24 hours."}
          </p>
        </div>
      </section>

      {/* ════════════════════════════════════════════
          STEP 1 — Plan picker
      ════════════════════════════════════════════ */}
      {step === "plans" && (
        <section style={{ padding: "52px 20px 60px", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 900 }}>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))", gap: 20, marginBottom: 20 }}>
              {PLANS.map(p => (
                <div key={p.id} style={{
                  background: "#fff",
                  border: `2px solid ${p.popular ? "#1a56db" : "#e5e7eb"}`,
                  borderRadius: 16,
                  padding: "32px 28px",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  boxShadow: p.popular ? "0 4px 24px rgba(26,86,219,0.10)" : "none",
                }}>
                  {p.popular && (
                    <div style={{ position: "absolute", top: -13, left: "50%", transform: "translateX(-50%)", background: "#1a56db", color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.5 }}>
                      MOST POPULAR
                    </div>
                  )}
                  <h2 style={{ fontSize: 17, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>{p.title}</h2>
                  <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, marginBottom: 20 }}>{p.tagline}</p>

                  {/* Price */}
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{p.priceLabel}</div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                      <span style={{ fontSize: 32, fontWeight: 800, color: "#0f172a" }}>{p.price}</span>
                      {p.priceNote && <span style={{ fontSize: 13, color: "#9ca3af" }}>{p.priceNote}</span>}
                    </div>
                  </div>

                  {/* Feature list */}
                  <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
                    {p.features.map(f => (
                      <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                        <span style={{ color: "#1a56db", fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => choosePlan(p.id)}
                    style={{
                      background: p.popular ? "#1a56db" : "#fff",
                      color: p.popular ? "#fff" : "#1a56db",
                      border: p.popular ? "none" : "2px solid #1a56db",
                      borderRadius: 10,
                      padding: "13px",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {p.cta}
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
              <Link href="/contact" style={{ background: "#1a56db", color: "#fff", borderRadius: 10, padding: "11px 24px", fontSize: 14, fontWeight: 700, textDecoration: "none", display: "inline-block" }}>
                Contact us
              </Link>
            </div>

            {/* Trust signals */}
            <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap", marginTop: 36 }}>
              {[
                { icon: "🔒", text: "Secure payments via Stripe" },
                { icon: "⚡", text: "Listed within 24 hours" },
                { icon: "📧", text: "Instant application alerts" },
              ].map(item => (
                <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "#6b7280" }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          STEP 2 — Job posting form
      ════════════════════════════════════════════ */}
      {step === "form" && (
        <section style={{ padding: "48px 20px 64px", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 740 }}>

            {/* Back + plan badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <button
                onClick={() => { setSelectedPlan(null); setStep("plans"); setError(""); }}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 14px", fontSize: 13, cursor: "pointer", color: "#374151" }}
              >
                ← Back
              </button>
              <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20 }}>
                {plan?.title}
              </span>
              {plan?.priceNumeric && (
                <span style={{ background: "#f0fdf4", color: "#16a34a", fontSize: 13, fontWeight: 600, padding: "5px 14px", borderRadius: 20 }}>
                  {plan.price} {plan.priceNote}
                </span>
              )}
            </div>

            <form onSubmit={handleFormNext} style={{ display: "flex", flexDirection: "column", gap: 24 }}>

              {/* ── Company information ── */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>
                <h2 style={sectionTitle}>🏢 Company information</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Company name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Acme Inc." style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Company website</label>
                      <input value={companyWebsite} onChange={e => setCompanyWebsite(e.target.value)} placeholder="https://acme.com" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={labelStyle}>Contact name <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required value={contactName} onChange={e => setContactName(e.target.value)} placeholder="Jane Smith" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Contact email <span style={{ color: "#ef4444" }}>*</span></label>
                      <input required type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="jane@acme.com" style={inputStyle} />
                    </div>
                  </div>
                  <div style={{ maxWidth: 340 }}>
                    <label style={labelStyle}>Contact phone <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <input value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="+44 7700 900000" style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* ── Job details ── */}
              <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px" }}>
                <h2 style={sectionTitle}>📋 Job details</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div>
                    <label style={labelStyle}>Job title <span style={{ color: "#ef4444" }}>*</span></label>
                    <input required value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Software Engineer" style={inputStyle} />
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
                    <input required value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. London, UK — or Remote" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Salary range <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <input value={salaryMin} onChange={e => setSalaryMin(e.target.value)} type="number" placeholder="Min e.g. 40000" style={{ ...inputStyle, flex: 1 }} />
                      <span style={{ color: "#6b7280", flexShrink: 0 }}>—</span>
                      <input value={salaryMax} onChange={e => setSalaryMax(e.target.value)} type="number" placeholder="Max e.g. 60000" style={{ ...inputStyle, flex: 1 }} />
                      <span style={{ color: "#6b7280", fontSize: 13, flexShrink: 0 }}>GBP/yr</span>
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
                      rows={3} placeholder="e.g. Private healthcare, pension, flexible hours, remote work…"
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
                {submitting
                  ? "Saving…"
                  : selectedPlan === "free"
                    ? "Submit job posting →"
                    : "Continue to payment →"}
              </button>

              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: 0 }}>
                {selectedPlan === "free"
                  ? "We'll review your listing and publish it within 24 hours."
                  : "You'll be taken to our secure Stripe checkout to complete payment."}
              </p>
            </form>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          STEP 3 — Review & Pay (Featured only)
      ════════════════════════════════════════════ */}
      {step === "review" && plan && (
        <section style={{ padding: "48px 20px 64px", background: "#f8faff" }}>
          <div className="container" style={{ maxWidth: 660 }}>

            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
              <button onClick={() => { setStep("form"); setError(""); }}
                style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 7, padding: "7px 14px", fontSize: 13, cursor: "pointer", color: "#374151" }}>
                ← Edit details
              </button>
            </div>

            {/* Order summary */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "28px 32px", marginBottom: 20 }}>
              <h2 style={sectionTitle}>📋 Order summary</h2>

              {/* Job preview */}
              <div style={{ background: "#f8faff", borderRadius: 10, padding: "16px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", marginBottom: 4 }}>{jobTitle || "—"}</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>
                  🏢 {companyName || "—"} &nbsp;·&nbsp; 📍 {location || "—"} &nbsp;·&nbsp; ⏰ {jobType || "—"}
                </div>
                {(salaryMin || salaryMax) && (
                  <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                    💰 £{salaryMin || "?"} – £{salaryMax || "?"}/yr
                  </div>
                )}
              </div>

              {/* Plan line item */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f3f4f6" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}>{plan.title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280" }}>60-day listing · featured placement</div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, color: "#0f172a" }}>$79</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderTop: "1px solid #f3f4f6" }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Tax</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Calculated at checkout</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0 0", borderTop: "2px solid #0f172a" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0f172a" }}>Total due today</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#0f172a" }}>$79 <span style={{ fontSize: 13, fontWeight: 400, color: "#9ca3af" }}>+tax</span></div>
              </div>
            </div>

            {/* What's included */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px 32px", marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 12 }}>What's included</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: "#374151", display: "flex", gap: 8, marginBottom: 8 }}>
                    <span style={{ color: "#1a56db", fontWeight: 700 }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Secure checkout CTA */}
            <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "24px 32px" }}>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#dc2626", marginBottom: 16 }}>
                  ⚠️ {error}
                </div>
              )}

              <button
                onClick={handleStripeCheckout}
                disabled={submitting}
                style={{
                  width: "100%",
                  background: submitting ? "#93c5fd" : "#1a56db",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "16px",
                  fontSize: 16,
                  fontWeight: 700,
                  cursor: submitting ? "not-allowed" : "pointer",
                  marginBottom: 12,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {submitting ? (
                  "Redirecting to Stripe…"
                ) : (
                  <>
                    <span>🔒</span>
                    Pay $79 securely with Stripe
                  </>
                )}
              </button>

              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 12 }}>
                {["visa", "mastercard", "amex", "apple pay", "google pay"].map(method => (
                  <span key={method} style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 600 }}>{method}</span>
                ))}
              </div>

              <p style={{ fontSize: 12, color: "#9ca3af", textAlign: "center", margin: 0 }}>
                Payments are processed securely by Stripe. Jobnique never stores your card details.
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════
          STEP 4 — Success
      ════════════════════════════════════════════ */}
      {step === "success" && (
        <section style={{ padding: "80px 20px", background: "#f8faff", textAlign: "center" }}>
          <div className="container" style={{ maxWidth: 520 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 10 }}>
              {selectedPlan === "free" ? "Job posted successfully!" : "Payment confirmed!"}
            </h2>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 8, lineHeight: 1.7 }}>
              Thanks <strong>{contactName}</strong>! Your listing for <strong>{jobTitle}</strong> at <strong>{companyName}</strong> has been submitted.
            </p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 10, lineHeight: 1.6 }}>
              A confirmation has been sent to <strong>{contactEmail}</strong>.
            </p>
            <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 36 }}>
              {selectedPlan === "free"
                ? "We'll review and publish your listing within 24 hours."
                : "Payment received — your Featured listing will be live within a few hours."}
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/jobs" style={{ background: "#1a56db", color: "#fff", borderRadius: 8, padding: "12px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                Browse jobs
              </Link>
              <button
                onClick={() => {
                  setStep("plans");
                  setSelectedPlan(null);
                  setCompanyName(""); setCompanyWebsite(""); setContactName(""); setContactEmail(""); setContactPhone("");
                  setJobTitle(""); setCategory(""); setLocation(""); setJobType(""); setSalaryMin(""); setSalaryMax("");
                  setDescription(""); setRequirements(""); setBenefits(""); setError("");
                }}
                style={{ background: "#fff", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, padding: "12px 24px", fontSize: 14, cursor: "pointer" }}
              >
                Post another job
              </button>
            </div>
            {jobId && (
              <p style={{ marginTop: 24, fontSize: 12, color: "#9ca3af" }}>Reference: {jobId}</p>
            )}
          </div>
        </section>
      )}

      <Footer />
    </>
  );
}
