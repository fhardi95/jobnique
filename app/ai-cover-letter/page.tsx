"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";

// ─── Types ───────────────────────────────────────────────────────────────────

interface FormData {
  name: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  experience: string;
  skills: string;
  tone: string;
}

type Step = "form" | "template" | "result";

interface Template {
  id: string;
  name: string;
  accentColor: string;
  headerBg: string;
  fontStyle: "serif" | "sans";
  layout: "classic" | "sidebar" | "modern" | "bold" | "prestige" | "vivid";
}

// ─── Templates ───────────────────────────────────────────────────────────────

const TEMPLATES: Template[] = [
  { id: "elegant",  name: "Elegant",  accentColor: "#1a56db", headerBg: "#f8faff", fontStyle: "serif",  layout: "classic"  },
  { id: "initials", name: "Initials", accentColor: "#374151", headerBg: "#f9fafb", fontStyle: "sans",   layout: "sidebar"  },
  { id: "peaks",    name: "Peaks",    accentColor: "#1e3a5f", headerBg: "#1e3a5f", fontStyle: "sans",   layout: "modern"   },
  { id: "boldline", name: "Boldline", accentColor: "#111827", headerBg: "#fff",    fontStyle: "serif",  layout: "bold"     },
  { id: "prestige", name: "Prestige", accentColor: "#7c3aed", headerBg: "#fff",    fontStyle: "sans",   layout: "prestige" },
  { id: "vivid",    name: "Vivid",    accentColor: "#0ea5e9", headerBg: "#e0f2fe", fontStyle: "sans",   layout: "vivid"    },
];

// ─── Static data ─────────────────────────────────────────────────────────────

const TIPS = [
  { icon: "🎯", title: "Open with impact",            desc: "Skip 'I am writing to apply…'. Lead with why you're genuinely excited about this specific role and company. Recruiters decide in seconds.",                                                      tag: "First impression" },
  { icon: "🔍", title: "Mirror the job description",  desc: "Identify the top 5 keywords in the job posting and weave them in naturally. ATS systems filter out letters that don't reflect the role's language.",                                            tag: "ATS tip"          },
  { icon: "📏", title: "Keep it to one page",         desc: "3–4 tight paragraphs is the sweet spot. Recruiters spend under 30 seconds on a cover letter — make every sentence pull its weight.",                                                             tag: "Length"           },
  { icon: "📊", title: "Quantify your achievements",  desc: "Numbers build credibility instantly. 'Grew sales by 40%' hits harder than 'improved sales'. Even rough estimates outperform vague claims.",                                                       tag: "Achievements"     },
  { icon: "🏢", title: "Show you know the company",   desc: "Reference a recent product launch, company value, or mission statement. One specific, genuine detail proves you're not sending a generic blast.",                                                  tag: "Research"         },
  { icon: "✉️", title: "End with a clear CTA",         desc: "Close confidently: 'I'd welcome the chance to discuss this further.' Passive endings like 'hope to hear from you' waste your final impression.",                                                  tag: "Closing"          },
  { icon: "🔄", title: "Tailor every application",    desc: "A cover letter sent to 50 companies is a cover letter for none of them. Personalise the opening paragraph and company reference each time.",                                                       tag: "Personalisation"  },
  { icon: "👁️", title: "Proofread ruthlessly",         desc: "A single typo signals carelessness. Read it aloud, then read it backwards. One error can undo an otherwise perfect application.",                                                                tag: "Quality"          },
];

const FAQS = [
  { q: "Is the AI cover letter generator free?",               a: "Yes — the Jobnique AI Cover Letter Generator is completely free to use. Fill in your details, generate, and copy your letter with no account required." },
  { q: "How does the AI cover letter generator work?",         a: "You enter your name, the job title, the company, and optional details like the job description and your experience. Our AI then crafts a personalised, professional cover letter tailored to that specific role and organisation." },
  { q: "Will the cover letter pass an ATS?",                   a: "Yes. When you paste the job description into the generator, the AI naturally incorporates the role's key terms and requirements, making the output ATS-friendly." },
  { q: "How long does it take to generate a cover letter?",    a: "Typically 5–10 seconds. Fill in your details, click Generate, and your personalised cover letter is ready to copy, edit, and send." },
  { q: "Can I download my cover letter as a PDF or Word doc?", a: "Yes — once your letter is generated and a template is chosen, you can download it as a PDF directly from your browser or as a plain-text Word-compatible file." },
  { q: "Can I send the cover letter to my email?",             a: "Yes. Enter your email address in the Send to Email field and we'll send you a formatted copy instantly so you have it ready to attach to any application." },
  { q: "What tone should I choose?",                           a: "Professional works for most industries. Conversational suits start-ups and creative agencies. Enthusiastic is great for sales roles. Concise works well for senior applications." },
  { q: "Should I edit the generated cover letter?",            a: "Yes — always personalise the output. The AI gives you an excellent first draft but adding a specific detail about the company makes the letter genuinely stand out." },
  { q: "Is a cover letter still necessary in 2026?",           a: "For many applications, yes. A well-written cover letter gives you a chance to explain gaps, highlight personality, and demonstrate motivation in a way a CV cannot." },
  { q: "What's the ideal length for a cover letter?",          a: "3–4 paragraphs, roughly 250–350 words. Recruiters are busy — a concise, focused letter that addresses the role directly performs better than a lengthy one." },
];

const JSONLD_FAQ = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: FAQS.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};
const JSONLD_APP = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "Jobnique AI Cover Letter Generator", applicationCategory: "BusinessApplication",
  operatingSystem: "Web", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: "https://www.jobnique.com/ai-cover-letter",
};
const JSONLD_BC = {
  "@context": "https://schema.org", "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: "https://www.jobnique.com" },
    { "@type": "ListItem", position: 2, name: "AI Cover Letter Generator", item: "https://www.jobnique.com/ai-cover-letter" },
  ],
};

// ─── Template Preview SVGs ────────────────────────────────────────────────────

function TemplatePreview({ t, selected }: { t: Template; selected: boolean }) {
  const line = (y: number, w: number, color = "#e5e7eb", h = 4) => (
    <rect x={20} y={y} width={w} height={h} rx={2} fill={color} />
  );

  const previews: Record<string, React.ReactElement> = {
    classic: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <rect x={0} y={0} width={160} height={48} fill={t.headerBg} />
        <rect x={20} y={12} width={80} height={10} rx={2} fill={t.accentColor} opacity={0.9} />
        <rect x={20} y={26} width={50} height={6} rx={2} fill={t.accentColor} opacity={0.4} />
        <rect x={0} y={48} width={160} height={2} fill={t.accentColor} opacity={0.3} />
        {[60,72,84,96,108,120,132,144,156].map((y,i) => line(y, i%4===0?100:i%3===0?80:110, "#d1d5db", 5))}
      </svg>
    ),
    sidebar: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <rect x={0} y={0} width={50} height={200} fill="#f3f4f6" />
        <circle cx={25} cy={30} r={14} fill={t.accentColor} opacity={0.2} />
        <text x={25} y={34} textAnchor="middle" fontSize={10} fill={t.accentColor} fontWeight="bold">AB</text>
        {[55,68,81,94].map((y,i) => <rect key={y} x={8} y={y} width={34} height={4} rx={2} fill="#9ca3af" opacity={0.5} />)}
        <rect x={60} y={14} width={80} height={8} rx={2} fill={t.accentColor} opacity={0.8} />
        <rect x={60} y={26} width={55} height={5} rx={2} fill="#9ca3af" opacity={0.5} />
        {[50,62,74,86,98,110,122,134,146,158].map((y,i) => <rect key={y} x={60} y={y} width={i%3===0?75:85} height={4} rx={2} fill="#d1d5db" />)}
      </svg>
    ),
    modern: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <polygon points="0,0 160,0 160,55 0,40" fill={t.headerBg} />
        <polygon points="110,0 160,0 160,55" fill={t.accentColor} opacity={0.8} />
        <rect x={16} y={10} width={70} height={9} rx={2} fill="#fff" opacity={0.95} />
        <rect x={16} y={24} width={45} height={5} rx={2} fill="#fff" opacity={0.6} />
        {[58,70,82,94,106,118,130,142,154].map((y,i) => <rect key={y} x={16} y={y} width={i%4===0?100:i%3===0?85:110} height={4} rx={2} fill="#d1d5db" />)}
      </svg>
    ),
    bold: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <rect x={16} y={14} width={90} height={12} rx={2} fill={t.accentColor} />
        <rect x={16} y={30} width={60} height={5} rx={2} fill="#9ca3af" opacity={0.6} />
        <rect x={0} y={44} width={160} height={3} fill={t.accentColor} />
        {[54,66,78,90,102,114,126,138,150].map((y,i) => <rect key={y} x={16} y={y} width={i%4===0?100:i%3===0?80:115} height={4} rx={2} fill="#d1d5db" />)}
      </svg>
    ),
    prestige: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <rect x={16} y={14} width={85} height={10} rx={2} fill={t.accentColor} opacity={0.85} />
        <rect x={16} y={28} width={55} height={5} rx={2} fill={t.accentColor} opacity={0.3} />
        <rect x={16} y={40} width={128} height={1} fill={t.accentColor} opacity={0.4} />
        <rect x={16} y={44} width={128} height={1} fill={t.accentColor} opacity={0.2} />
        {[54,66,78,90,102,114,126,138,150].map((y,i) => <rect key={y} x={16} y={y} width={i%4===0?100:i%3===0?80:115} height={4} rx={2} fill="#e5e7eb" />)}
      </svg>
    ),
    vivid: (
      <svg viewBox="0 0 160 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
        <rect width={160} height={200} fill="#fff" />
        <rect x={0} y={0} width={160} height={52} fill={t.headerBg} />
        <rect x={0} y={0} width={6} height={200} fill={t.accentColor} />
        <rect x={16} y={14} width={80} height={10} rx={2} fill={t.accentColor} opacity={0.9} />
        <rect x={16} y={28} width={50} height={5} rx={2} fill={t.accentColor} opacity={0.4} />
        {[62,74,86,98,110,122,134,146,158].map((y,i) => <rect key={y} x={16} y={y} width={i%4===0?100:i%3===0?85:110} height={4} rx={2} fill="#d1d5db" />)}
      </svg>
    ),
  };

  return previews[t.layout] || previews.classic;
}

// ─── Render letter with template styling ─────────────────────────────────────

function getLetterHTML(letter: string, t: Template, name: string, jobTitle: string, company: string): string {
  const paragraphs = letter.split(/\n+/).filter(Boolean);
  const today = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const fontFamily = t.fontStyle === "serif" ? "Georgia, 'Times New Roman', serif" : "'Helvetica Neue', Arial, sans-serif";

  const layouts: Record<string, string> = {
    classic: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
        <div style="background:${t.headerBg};padding:32px 40px 24px;border-bottom:3px solid ${t.accentColor};">
          <div style="font-size:24px;font-weight:700;color:${t.accentColor};margin-bottom:4px;">${name}</div>
          <div style="font-size:13px;color:#6b7280;">${jobTitle} · Applicant</div>
        </div>
        <div style="padding:32px 40px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
    sidebar: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);display:flex;">
        <div style="width:180px;min-height:600px;background:#f3f4f6;padding:28px 20px;flex-shrink:0;">
          <div style="width:56px;height:56px;border-radius:50%;background:${t.accentColor};color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;margin:0 auto 16px;">
            ${name.split(" ").map((n:string) => n[0]).join("").slice(0,2).toUpperCase()}
          </div>
          <div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Applying for</div>
          <div style="font-size:12px;color:#6b7280;margin-bottom:16px;">${jobTitle}</div>
          <div style="font-size:11px;font-weight:700;color:#374151;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.05em;">Company</div>
          <div style="font-size:12px;color:#6b7280;">${company}</div>
        </div>
        <div style="flex:1;padding:32px 32px;">
          <div style="font-size:22px;font-weight:700;color:#111827;margin-bottom:4px;">${name}</div>
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
    modern: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
        <div style="background:${t.accentColor};padding:32px 40px 28px;position:relative;overflow:hidden;">
          <div style="position:absolute;top:0;right:0;width:120px;height:100%;background:rgba(255,255,255,0.08);clip-path:polygon(40% 0,100% 0,100% 100%)"></div>
          <div style="font-size:26px;font-weight:700;color:#fff;margin-bottom:4px;">${name}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);">${jobTitle}</div>
        </div>
        <div style="padding:32px 40px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
    bold: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
        <div style="padding:36px 40px 20px;">
          <div style="font-size:28px;font-weight:900;color:${t.accentColor};letter-spacing:-0.5px;margin-bottom:4px;">${name.toUpperCase()}</div>
          <div style="font-size:12px;color:#9ca3af;letter-spacing:0.08em;text-transform:uppercase;">${jobTitle}</div>
          <div style="height:4px;background:${t.accentColor};margin:16px 0 0;border-radius:2px;"></div>
        </div>
        <div style="padding:8px 40px 32px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
    prestige: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
        <div style="padding:40px 48px 24px;text-align:center;border-bottom:1px solid ${t.accentColor};">
          <div style="font-size:26px;font-weight:700;color:${t.accentColor};letter-spacing:0.04em;margin-bottom:4px;">${name}</div>
          <div style="font-size:12px;color:#9ca3af;letter-spacing:0.1em;text-transform:uppercase;">${jobTitle}</div>
        </div>
        <div style="padding:28px 48px 40px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.9;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
    vivid: `
      <div style="font-family:${fontFamily};max-width:680px;margin:0 auto;background:#fff;box-shadow:0 2px 20px rgba(0,0,0,0.08);border-left:6px solid ${t.accentColor};">
        <div style="background:${t.headerBg};padding:28px 36px 20px;">
          <div style="font-size:24px;font-weight:700;color:${t.accentColor};margin-bottom:4px;">${name}</div>
          <div style="font-size:13px;color:#6b7280;">${jobTitle}</div>
        </div>
        <div style="padding:28px 36px 36px;">
          <div style="font-size:12px;color:#9ca3af;margin-bottom:20px;">${today}</div>
          ${paragraphs.map(p => `<p style="font-size:14px;line-height:1.8;color:#374151;margin:0 0 14px;">${p}</p>`).join("")}
        </div>
      </div>`,
  };

  return layouts[t.layout] || layouts.classic;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function AICoverLetterPage() {
  const [step, setStep]       = useState<Step>("form");
  const [form, setForm]       = useState<FormData>({ name: "", jobTitle: "", company: "", jobDescription: "", experience: "", skills: "", tone: "professional" });
  const [letter, setLetter]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [selectedTpl, setSelectedTpl] = useState<Template>(TEMPLATES[0]);
  const [copied, setCopied]   = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [emailAddr, setEmailAddr]   = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle"|"sending"|"sent"|"error">("idle");
  const [dlStatus, setDlStatus] = useState<"pdf"|"docx"|"">("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleGenerate() {
    setError("");
    if (!form.name.trim() || !form.jobTitle.trim() || !form.company.trim()) {
      setError("Please fill in your name, the job title, and the company name.");
      return;
    }
    setLoading(true);
    setLetter("");
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setLetter(data.letter);
      setStep("template");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectTemplate(t: Template) {
    setSelectedTpl(t);
    setStep("result");
  }

  // Download as PDF using browser print
  function handleDownloadPDF() {
    setDlStatus("pdf");
    const html = getLetterHTML(letter, selectedTpl, form.name, form.jobTitle, form.company);
    const win = window.open("", "_blank");
    if (!win) { setDlStatus(""); return; }
    win.document.write(`<!DOCTYPE html><html><head><title>Cover Letter – ${form.name}</title>
      <style>body{margin:0;padding:24px;background:#f9fafb;}@media print{body{padding:0;background:#fff;}}</style>
      </head><body>${html}<script>window.onload=()=>{window.print();window.onafterprint=()=>window.close();}<\/script></body></html>`);
    win.document.close();
    setTimeout(() => setDlStatus(""), 1500);
  }

  // Download as .txt (Word-compatible plain text)
  function handleDownloadDOCX() {
    setDlStatus("docx");
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${form.name.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setTimeout(() => setDlStatus(""), 1500);
  }

  // Send to email via Brevo
  async function handleSendEmail() {
    if (!emailAddr.includes("@")) return;
    setEmailStatus("sending");
    const html = getLetterHTML(letter, selectedTpl, form.name, form.jobTitle, form.company);
    try {
      const res = await fetch("/api/send-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailAddr,
          name: form.name,
          resumeHTML: `<div style="font-family:sans-serif;padding:20px;">${html}<br/><hr/><p style="font-size:12px;color:#9ca3af;">Sent from Jobnique AI Cover Letter Generator · <a href="https://www.jobnique.com/ai-cover-letter">jobnique.com</a></p></div>`,
        }),
      });
      if (!res.ok) throw new Error();
      setEmailStatus("sent");
      setTimeout(() => setEmailStatus("idle"), 3000);
    } catch {
      setEmailStatus("error");
      setTimeout(() => setEmailStatus("idle"), 3000);
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // ── Shared styles
  const inputStyle: React.CSSProperties = { border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14, outline: "none", width: "100%", background: "#fff", fontFamily: "'DM Sans', sans-serif", transition: "border 0.15s" };
  const labelStyle: React.CSSProperties = { display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 };
  const btnPrimary: React.CSSProperties = { background: "#1a56db", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", transition: "background 0.15s", whiteSpace: "nowrap" as const };
  const btnOutline: React.CSSProperties = { background: "transparent", color: "#1a56db", border: "1.5px solid #1a56db", borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "'DM Sans', sans-serif", whiteSpace: "nowrap" as const };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_FAQ) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_APP) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(JSONLD_BC) }} />

      <Navbar />
      <CookieBanner />

      {/* ── Hero ── */}
      <div style={{ background: "linear-gradient(135deg, #1a56db 0%, #1342b0 100%)", padding: "56px 20px 48px", color: "#fff", textAlign: "center" }}>
        <nav aria-label="Breadcrumb" style={{ marginBottom: 20, fontSize: 13, color: "#93c5fd" }}>
          <a href="/" style={{ color: "#93c5fd", textDecoration: "none" }}>Home</a>
          <span style={{ margin: "0 8px" }}>›</span>
          <span style={{ color: "#fff" }}>AI Cover Letter Generator</span>
        </nav>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 600, marginBottom: 16, color: "#bfdbfe" }}>
          ✨ AI-Powered • Free • No sign-up required
        </div>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px,4vw,48px)", marginBottom: 14, lineHeight: 1.2 }}>
          AI Cover Letter Generator
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: 17, maxWidth: 560, margin: "0 auto 28px", lineHeight: 1.6 }}>
          Enter your details, choose a template, and download a tailored cover letter in seconds.
        </p>
        <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap", fontSize: 13, color: "#bfdbfe" }}>
          {["✓ ATS-friendly output", "✓ 6 professional templates", "✓ Download PDF & Word", "✓ Send to your email"].map(s => <span key={s}>{s}</span>)}
        </div>
      </div>

      {/* ── Step indicator ── */}
      <div style={{ background: "#f0f7ff", borderBottom: "1px solid #dbeafe", padding: "16px 20px" }}>
        <div className="container" style={{ display: "flex", gap: 0, justifyContent: "center", maxWidth: 560 }}>
          {(["Your details", "Choose template", "Download"] as const).map((label, i) => {
            const stepKeys: Step[] = ["form", "template", "result"];
            const active = stepKeys[i] === step;
            const done   = stepKeys.indexOf(step) > i;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", flex: 1 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: done ? "#16a34a" : active ? "#1a56db" : "#e5e7eb", color: done||active ? "#fff" : "#9ca3af", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, transition: "all 0.2s" }}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: active ? "#1a56db" : done ? "#16a34a" : "#9ca3af", whiteSpace: "nowrap" }}>{label}</span>
                </div>
                {i < 2 && <div style={{ flex: 1, height: 2, background: done ? "#16a34a" : "#e5e7eb", margin: "0 6px", marginBottom: 18, transition: "background 0.2s" }} />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════ STEP 1 — FORM ════════════════ */}
      {step === "form" && (
        <section className="section" style={{ background: "#f0f7ff" }}>
          <div className="container" style={{ maxWidth: 860 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,86,219,0.08)" }}>
              <div style={{ background: "#f8faff", borderBottom: "1px solid #e5e7eb", padding: "18px 28px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>✉️</span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>Cover Letter Generator</div>
                  <div style={{ fontSize: 12, color: "#6b7280" }}>Fill in your details — the more you add, the better the result</div>
                </div>
              </div>

              <div style={{ padding: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle} htmlFor="name">Your full name <span style={{ color: "#dc2626" }}>*</span></label>
                    <input id="name" name="name" type="text" placeholder="e.g. Sarah Johnson" value={form.name} onChange={handleChange} style={inputStyle} aria-required="true" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="jobTitle">Job title <span style={{ color: "#dc2626" }}>*</span></label>
                    <input id="jobTitle" name="jobTitle" type="text" placeholder="e.g. Marketing Manager" value={form.jobTitle} onChange={handleChange} style={inputStyle} aria-required="true" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="company">Company <span style={{ color: "#dc2626" }}>*</span></label>
                    <input id="company" name="company" type="text" placeholder="e.g. Google" value={form.company} onChange={handleChange} style={inputStyle} aria-required="true" />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginBottom: 16 }}>
                  <div>
                    <label style={labelStyle} htmlFor="skills">Key skills <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <input id="skills" name="skills" type="text" placeholder="e.g. SEO, Google Ads, team leadership" value={form.skills} onChange={handleChange} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="tone">Tone</label>
                    <select id="tone" name="tone" value={form.tone} onChange={handleChange} style={inputStyle}>
                      <option value="professional">Professional</option>
                      <option value="conversational">Conversational</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="concise">Concise</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 16, marginBottom: 20 }}>
                  <div>
                    <label style={labelStyle} htmlFor="jobDescription">Job description <span style={{ color: "#9ca3af", fontWeight: 400 }}>(paste for best results)</span></label>
                    <textarea id="jobDescription" name="jobDescription" rows={5} placeholder="Paste the job description here. The AI will match keywords and requirements automatically." value={form.jobDescription} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="experience">Your experience summary <span style={{ color: "#9ca3af", fontWeight: 400 }}>(optional)</span></label>
                    <textarea id="experience" name="experience" rows={5} placeholder="e.g. 5 years in digital marketing, managed £500k budgets, led a team of 8 across SEO and paid media…" value={form.experience} onChange={handleChange} style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }} />
                  </div>
                </div>

                {error && (
                  <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16 }}>{error}</div>
                )}

                <button onClick={handleGenerate} disabled={loading} style={{ ...btnPrimary, background: loading ? "#93c5fd" : "#1a56db", cursor: loading ? "not-allowed" : "pointer", padding: "13px 32px", fontSize: 15 }} aria-busy={loading}>
                  {loading ? (
                    <><span style={{ display: "inline-block", width: 16, height: 16, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />Generating your cover letter…</>
                  ) : <>✨ Generate Cover Letter</>}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════ STEP 2 — TEMPLATE PICKER ═══ */}
      {step === "template" && (
        <section className="section" style={{ background: "#f9fafb" }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <div style={{ background: "#f8faff", borderBottom: "1px solid #e5e7eb", padding: "20px 28px" }}>
                <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>Choose your cover letter template</div>
                <div style={{ fontSize: 13, color: "#6b7280" }}>Select a template to generate your cover letter.</div>
              </div>

              <div style={{ padding: "28px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 16 }}>
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => handleSelectTemplate(t)}
                      style={{ background: "#fff", border: `2px solid ${selectedTpl.id === t.id ? t.accentColor : "#e5e7eb"}`, borderRadius: 12, padding: 12, cursor: "pointer", textAlign: "center", transition: "all 0.15s", boxShadow: selectedTpl.id === t.id ? `0 0 0 3px ${t.accentColor}22` : "none", fontFamily: "'DM Sans', sans-serif" }}
                    >
                      <div style={{ background: "#f8faff", borderRadius: 8, overflow: "hidden", marginBottom: 10, aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <TemplatePreview t={t} selected={selectedTpl.id === t.id} />
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>{t.name}</div>
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28, paddingTop: 20, borderTop: "1px solid #f3f4f6", flexWrap: "wrap", gap: 12 }}>
                  <button onClick={() => setStep("form")} style={{ ...btnOutline, color: "#374151", borderColor: "#e5e7eb" }}>← Back</button>
                  <button onClick={() => setStep("result")} style={{ ...btnPrimary, padding: "13px 32px", fontSize: 15 }}>
                    ✨ Generate Cover Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════ STEP 3 — RESULT ═════════════ */}
      {step === "result" && (
        <section className="section" style={{ background: "#f0f7ff" }}>
          <div className="container" style={{ maxWidth: 900 }}>
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 4px 24px rgba(26,86,219,0.08)" }}>

              {/* Result header */}
              <div style={{ background: "#f8faff", borderBottom: "1px solid #e5e7eb", padding: "18px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ color: "#16a34a", fontSize: 18 }}>✓</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>Your cover letter is ready</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>Template: <strong>{selectedTpl.name}</strong> · {form.jobTitle} at {form.company}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  <button onClick={() => setStep("template")} style={{ ...btnOutline, color: "#374151", borderColor: "#e5e7eb", fontSize: 13, padding: "8px 14px" }}>← Change template</button>
                  <button onClick={() => { setStep("form"); setLetter(""); }} style={{ ...btnOutline, fontSize: 13, padding: "8px 14px" }}>🔄 New letter</button>
                  <button onClick={handleCopy} style={{ ...btnPrimary, fontSize: 13, padding: "8px 14px", background: copied ? "#16a34a" : "#1a56db" }}>
                    {copied ? "✓ Copied!" : "📋 Copy text"}
                  </button>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 0 }}>

                {/* Letter preview */}
                <div style={{ padding: "28px", borderRight: "1px solid #f3f4f6" }}>
                  <div
                    id="cover-letter-preview"
                    dangerouslySetInnerHTML={{ __html: getLetterHTML(letter, selectedTpl, form.name, form.jobTitle, form.company) }}
                    style={{ fontSize: 14, lineHeight: 1.8, color: "#374151" }}
                  />
                </div>

                {/* Action panel */}
                <div style={{ padding: "24px", background: "#fafafa" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: "#111827", marginBottom: 16 }}>Download & Share</div>

                  {/* Download PDF */}
                  <button
                    onClick={handleDownloadPDF}
                    style={{ ...btnPrimary, width: "100%", justifyContent: "center", marginBottom: 10, background: dlStatus === "pdf" ? "#16a34a" : "#1a56db" }}
                  >
                    {dlStatus === "pdf" ? "✓ Opening PDF…" : "⬇ Download PDF"}
                  </button>

                  {/* Download Word */}
                  <button
                    onClick={handleDownloadDOCX}
                    style={{ ...btnOutline, width: "100%", justifyContent: "center", marginBottom: 20, color: dlStatus === "docx" ? "#16a34a" : "#1a56db", borderColor: dlStatus === "docx" ? "#16a34a" : "#1a56db" }}
                  >
                    {dlStatus === "docx" ? "✓ Downloaded!" : "⬇ Download Word (.txt)"}
                  </button>

                  {/* Send to email */}
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 8 }}>📧 Send to my email</div>
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={emailAddr}
                      onChange={e => setEmailAddr(e.target.value)}
                      style={{ ...inputStyle, marginBottom: 8 }}
                    />
                    <button
                      onClick={handleSendEmail}
                      disabled={emailStatus === "sending" || !emailAddr.includes("@")}
                      style={{
                        ...btnPrimary,
                        width: "100%",
                        justifyContent: "center",
                        background: emailStatus === "sent" ? "#16a34a" : emailStatus === "error" ? "#dc2626" : (!emailAddr.includes("@") ? "#93c5fd" : "#1a56db"),
                        cursor: emailStatus === "sending" || !emailAddr.includes("@") ? "not-allowed" : "pointer",
                      }}
                    >
                      {emailStatus === "sending" ? "Sending…" : emailStatus === "sent" ? "✓ Sent!" : emailStatus === "error" ? "Failed — retry" : "Send Cover Letter"}
                    </button>
                    <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 8 }}>We'll send a formatted copy to your inbox.</p>
                  </div>

                  {/* Template switcher */}
                  <div style={{ borderTop: "1px solid #e5e7eb", paddingTop: 20, marginTop: 8 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: "#374151", marginBottom: 10 }}>Switch template</div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                      {TEMPLATES.map(t => (
                        <button
                          key={t.id}
                          onClick={() => setSelectedTpl(t)}
                          title={t.name}
                          style={{ border: `2px solid ${selectedTpl.id === t.id ? t.accentColor : "#e5e7eb"}`, borderRadius: 8, padding: 4, cursor: "pointer", background: "#fff", aspectRatio: "4/5", overflow: "hidden" }}
                        >
                          <TemplatePreview t={t} selected={selectedTpl.id === t.id} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── How it works ── */}
      <div style={{ background: "#f0f7ff", borderBottom: "1px solid #dbeafe", padding: "18px 20px" }}>
        <div className="container" style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center" }}>
          {[["1","Enter your details"],["2","AI writes your letter"],["3","Pick a template"],["4","Download or email"]].map(([num,s]) => (
            <div key={num} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#1e3a8a" }}>
              <span style={{ background: "#1a56db", color: "#fff", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{num}</span>
              {s}
            </div>
          ))}
        </div>
      </div>

      {/* ── Tips grid ── */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">What makes a great cover letter?</h2>
          <p className="section-sub">8 proven techniques that get cover letters read — and applications shortlisted</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {TIPS.map(tip => (
              <article key={tip.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>{tip.icon}</span>
                  <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{tip.tag}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{tip.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.65 }}>{tip.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <h2 className="section-title">Frequently asked questions</h2>
          <p className="section-sub">Everything you need to know about AI-generated cover letters</p>
          {FAQS.map((faq, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, marginBottom: 10, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                aria-expanded={openFaq === i}
                style={{ width: "100%", background: "transparent", border: "none", padding: "18px 20px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}
              >
                <span style={{ fontWeight: 600, fontSize: 15, color: "#111827" }}>{faq.q}</span>
                <span style={{ color: "#1a56db", fontSize: 20, flexShrink: 0, transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 18px", paddingTop: 14, fontSize: 14, color: "#6b7280", lineHeight: 1.7, borderTop: "1px solid #f3f4f6" }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Related tools ── */}
      <section className="section">
        <div className="container" style={{ maxWidth: 900 }}>
          <h2 className="section-title">More free career tools</h2>
          <p className="section-sub">Everything you need to land your next role</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {[
              { href: "/cover-letters", icon: "📄", title: "Cover Letter Templates", desc: "Download free Word templates for every situation", tag: "Free download" },
              { href: "/cv-templates",  icon: "📋", title: "CV Templates",           desc: "ATS-friendly CV templates used by 500,000+ job seekers", tag: "Free download" },
              { href: "/resume-builder",icon: "🤖", title: "AI Resume Builder",      desc: "Build a stunning CV with AI in minutes",                tag: "AI-powered"   },
              { href: "/salaries",      icon: "💰", title: "Salary Checker",         desc: "Find out what your role pays in 2026",                 tag: "2026 data"    },
            ].map(tool => (
              <a key={tool.href} href={tool.href} style={{ display: "block", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "20px", textDecoration: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <span style={{ fontSize: 26 }}>{tool.icon}</span>
                  <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 20, height: "fit-content" }}>{tool.tag}</span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 6, color: "#111827" }}>{tool.title}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{tool.desc}</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      <Newsletter />
      <Footer />
    </>
  );
}
