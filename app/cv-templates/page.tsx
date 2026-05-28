import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free CV Templates 2025 – Download Word & PDF | Jobnique",
  description: "Download free professional CV templates and cover letter examples. ATS-friendly formats for every profession. Word and PDF format available.",
  keywords: "free CV templates, CV examples, resume templates, cover letter template, download CV",
  alternates: { canonical: "https://www.jobnique.com/cv-templates" },
};

const cvTemplates = [
  { title: "Classic CV",        file: "classic-cv",        desc: "Clean, timeless layout that works for any industry. ATS-friendly and recruiter-approved.",                        tag: "Most downloaded", profession: "All industries", pages: 1, format: "Word" },
  { title: "Graduate CV",       file: "graduate-cv",       desc: "Designed for students and recent graduates with little or no work experience.",                                   tag: "For students",    profession: "All industries", pages: 1, format: "Word" },
  { title: "Creative CV",       file: "creative-cv",       desc: "Bold visual design that stands out. Perfect for design, marketing, and media roles.",                             tag: "Design roles",    profession: "Creative",       pages: 1, format: "Word" },
  { title: "Executive CV",      file: "executive-cv",      desc: "Polished, authoritative layout for senior managers and C-suite professionals.",                                   tag: "Senior level",    profession: "Leadership",     pages: 2, format: "Word" },
  { title: "Tech CV",           file: "tech-cv",           desc: "Highlights technical skills, projects, and GitHub clearly. Built for developers.",                                tag: "Tech roles",      profession: "Technology",     pages: 1, format: "Word" },
  { title: "Healthcare CV",     file: "healthcare-cv",     desc: "Structured for nurses, doctors, and healthcare professionals. Includes certifications section.",                  tag: "Healthcare",      profession: "Medical",        pages: 2, format: "Word" },
  { title: "Sales CV",          file: "sales-cv",          desc: "Results-focused layout that leads with metrics and achievements.",                                                tag: "Sales roles",     profession: "Sales",          pages: 1, format: "Word" },
  { title: "Career Change CV",  file: "career-change-cv",  desc: "Transferable skills focused. Perfect when switching industries.",                                                 tag: "Career changers", profession: "All industries", pages: 1, format: "Word" },
];

const coverLetters = [
  { title: "Standard Cover Letter",       file: "standard-cover-letter",           desc: "Works for any job application. Clear, professional, and adaptable." },
  { title: "Graduate Cover Letter",       file: "graduate-cover-letter",           desc: "Positions your education and potential when you lack experience." },
  { title: "Speculative Cover Letter",    file: "speculative-cover-letter",        desc: "For reaching out to companies who haven't advertised a role." },
  { title: "Career Change Cover Letter",  file: "career-change-cover-letter",      desc: "Addresses your career transition and highlights transferable skills." },
  { title: "Internal Job Cover Letter",   file: "internal-application-cover-letter", desc: "For applying to a new role within your current company." },
  { title: "Email Cover Letter",          file: "email-cover-letter",              desc: "Short, punchy format for sending applications via email." },
];

export default function CVTemplatesPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      <div style={{ background: "#1a56db", padding: "48px 20px", color: "#fff", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,44px)", marginBottom: 12 }}>Free CV & Cover Letter Templates</h1>
        <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Download professional templates instantly. Used by 500,000+ job seekers. Word format included.
        </p>
      </div>

      {/* How to use */}
      <div style={{ background: "#f0f7ff", borderBottom: "1px solid #dbeafe", padding: "20px" }}>
        <div className="container" style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
          {["1. Choose your template","2. Download free Word file","3. Edit with your details","4. Save as PDF and apply"].map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#1e3a8a" }}>
              <span style={{ background: "#1a56db", color: "#fff", width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
              {s.slice(3)}
            </div>
          ))}
        </div>
      </div>

      {/* CV Templates */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">CV templates</h2>
          <p className="section-sub">All templates are ATS-friendly and approved by professional recruiters</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {cvTemplates.map(t => (
              <div key={t.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                {/* Preview */}
                <div style={{ background: "#f8faff", height: 160, display: "flex", alignItems: "center", justifyContent: "center", borderBottom: "1px solid #e5e7eb" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 48 }}>📄</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 8 }}>{t.profession}</div>
                  </div>
                </div>
                <div style={{ padding: "18px 20px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 600 }}>{t.title}</h3>
                    <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap", marginLeft: 8 }}>{t.tag}</span>
                  </div>
                  <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 14 }}>{t.desc}</p>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: "#6b7280", marginBottom: 16 }}>
                    <span>📃 {t.pages} page{t.pages > 1 ? "s" : ""}</span>
                    <span>📎 {t.format}</span>
                  </div>
                  <a
                    href={`/templates/${t.file}.docx`}
                    download
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, background: "#1a56db", color: "#fff", borderRadius: 8, padding: "10px", fontSize: 14, fontWeight: 500, width: "100%", textDecoration: "none" }}
                  >
                    ⬇ Download free
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cover Letters */}
      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div className="container">
          <h2 className="section-title">Cover letter templates</h2>
          <p className="section-sub">Free cover letter examples for every situation</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 16 }}>
            {coverLetters.map(c => (
              <div key={c.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 10, padding: "20px" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✉️</div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 14 }}>{c.desc}</p>
                <a
                  href={`/templates/${c.file}.docx`}
                  download
                  style={{ display: "flex", alignItems: "center", gap: 6, color: "#1a56db", fontSize: 13, fontWeight: 500, border: "1.5px solid #1a56db", borderRadius: 6, padding: "8px 14px", width: "fit-content", textDecoration: "none" }}
                >
                  ⬇ Download Word
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CV tips */}
      <section className="section">
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 className="section-title">How to write a great CV</h2>
          <p className="section-sub">Follow these tips to make your CV stand out</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              ["Keep it to 1–2 pages",          "Recruiters spend an average of 7 seconds on a CV. One page for under 5 years experience, two pages maximum for senior roles."],
              ["Use clear section headings",     "Include: Personal statement, Work experience, Education, Skills, and Achievements. Keep it scannable."],
              ["Tailor it for each job",         "Match your CV keywords to the job description. ATS software filters CVs before humans see them."],
              ["Quantify your achievements",     "'Increased sales by 40%' beats 'Responsible for sales'. Numbers stand out and prove your impact."],
              ["Save as PDF unless asked otherwise", "PDFs preserve your formatting across all devices and operating systems."],
            ].map(([title, desc]) => (
              <div key={title as string} style={{ display: "flex", gap: 16, padding: "16px 20px", background: "#f9fafb", borderRadius: 10, border: "1px solid #e5e7eb" }}>
                <div style={{ color: "#16a34a", fontSize: 20, flexShrink: 0 }}>✓</div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{title}</div>
                  <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
      <Footer />
    </>
  );
}