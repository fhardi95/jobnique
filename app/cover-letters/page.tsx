import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Free Cover Letter Templates 2025 – Download Word | Jobnique",
  description: "Download free professional cover letter templates. Examples for every job type, experience level and industry. Word format, instantly editable.",
};

const letters = [
  { title: "Standard Cover Letter",      file: "standard-cover-letter",            desc: "The go-to template for most job applications. Professional, adaptable, and recruiter-approved.", tag: "Most popular" },
  { title: "Graduate Cover Letter",      file: "graduate-cover-letter",            desc: "Designed for students and graduates with little work experience. Leads with education and potential.", tag: "Students" },
  { title: "Speculative Letter",         file: "speculative-cover-letter",         desc: "Reach out to companies who haven't advertised. Shows initiative and gets noticed.", tag: "Proactive" },
  { title: "Career Change Letter",       file: "career-change-cover-letter",       desc: "Highlights transferable skills when switching industries or roles.", tag: "Career changers" },
  { title: "Internal Application",       file: "internal-application-cover-letter", desc: "Apply for a promotion or new role within your current organisation.", tag: "Internal" },
  { title: "Email Cover Letter",         file: "email-cover-letter",               desc: "Short, punchy format for sending applications directly via email.", tag: "Email apply" },
  { title: "Retail & Customer Service",  file: "retail-cover-letter",              desc: "Tailored for service roles, emphasising communication and customer skills.", tag: "Retail" },
  { title: "Healthcare Cover Letter",    file: "healthcare-cover-letter",          desc: "For nurses, carers, and medical professionals. Includes clinical skills section.", tag: "Healthcare" },
];

const tips = [
  ["Open strong",               "Don't start with 'I am writing to apply…'. Open with why you're excited about this specific company or role."],
  ["Keep it to one page",       "A cover letter should be 3–4 short paragraphs. Recruiters won't read more."],
  ["Match the job description", "Use keywords from the job ad. Show you've read it carefully and you're a direct fit."],
  ["End with a call to action", "Close with something like: 'I'd welcome the opportunity to discuss this further at interview.'"],
];

export default function CoverLettersPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "#1a56db", padding: "48px 20px", color: "#fff", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,44px)", marginBottom: 12 }}>Free Cover Letter Templates</h1>
        <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>Download and edit instantly. Professional templates for every job and experience level.</p>
      </div>
      <section className="section">
        <div className="container">
          <h2 className="section-title">Cover letter templates</h2>
          <p className="section-sub">All templates include guidance notes and example text</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 18 }}>
            {letters.map(l => (
              <div key={l.title} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "22px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 28 }}>✉️</span>
                  <span style={{ background: "#eff6ff", color: "#1d4ed8", fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, height: "fit-content" }}>{l.tag}</span>
                </div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{l.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>{l.desc}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <a
                    href={`/templates/${l.file}.docx`}
                    download
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#1a56db", color: "#fff", borderRadius: 7, padding: "9px", fontSize: 13, fontWeight: 500, textDecoration: "none" }}
                  >
                    ⬇ Word
                  </a>
                  <a
                    href={`/templates/${l.file}.docx`}
                    download={`${l.file}.docx`}
                    style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5, background: "#f9fafb", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 7, padding: "9px", fontSize: 13, textDecoration: "none" }}
                  >
                    ⬇ PDF
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={{ background: "#f9fafb", padding: "60px 0" }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <h2 className="section-title">How to write a cover letter</h2>
          <p className="section-sub">4 tips that make your letter stand out</p>
          {tips.map(([t, d]) => (
            <div key={t} style={{ display: "flex", gap: 16, padding: "16px 20px", background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", marginBottom: 12 }}>
              <div style={{ color: "#1a56db", fontSize: 18, flexShrink: 0 }}>→</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>{t}</div>
                <div style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Newsletter />
      <Footer />
    </>
  );
}
