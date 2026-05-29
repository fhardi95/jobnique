import Link from "next/link";

const jobSearchLinks: { label: string; href: string }[] = [
  { label: "Find Jobs", href: "/jobs" },
  { label: "Jobs by Category", href: "/jobs?filter=category" },
  { label: "Jobs by Location", href: "/jobs?filter=location" },
  { label: "Remote Jobs", href: "/jobs?type=remote" },
  { label: "Part-time Jobs", href: "/jobs?type=part-time" },
];

const careerToolLinks: { label: string; href: string }[] = [
  { label: "Career Advice", href: "/career-advice" },
  { label: "CV Templates", href: "/cv-templates" },
  { label: "Cover Letters", href: "/cover-letters" },
  { label: "Salary Checker", href: "/salaries" },
  { label: "Interview Tips", href: "/interview-tips" },
];

const companyLinks: { label: string; href: string }[] = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms of Use", href: "/terms-of-use" },
  { label: "Advertise with Us", href: "/advertise" },
];

export default function Footer() {
  return (
    <footer style={{ background: "#111827", color: "#9ca3af", marginTop: 80 }}>
      <div className="container" style={{ padding: "48px 20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 40, marginBottom: 40 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#fff" }}>Job</span>
              <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#f97316" }}>nique</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7 }}>Find your next opportunity. Career advice, CV templates, and thousands of jobs across the US and worldwide.</p>
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Job Search</p>
            {jobSearchLinks.map(({ label, href }) => (
              <div key={label} style={{ marginBottom: 8 }}><Link href={href} style={{ fontSize: 13, color: "#9ca3af" }}>{label}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Career Tools</p>
            {careerToolLinks.map(({ label, href }) => (
              <div key={label} style={{ marginBottom: 8 }}><Link href={href} style={{ fontSize: 13, color: "#9ca3af" }}>{label}</Link></div>
            ))}
          </div>
          <div>
            <p style={{ color: "#fff", fontWeight: 600, fontSize: 13, marginBottom: 14 }}>Company</p>
            {companyLinks.map(({ label, href }) => (
              <div key={label} style={{ marginBottom: 8 }}><Link href={href} style={{ fontSize: 13, color: "#9ca3af" }}>{label}</Link></div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 24, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 12 }}>© {new Date().getFullYear()} Jobnique. All rights reserved.</p>
          <p style={{ fontSize: 12 }}>Jobs powered by Adzuna API</p>
        </div>
        <div style={{ borderTop: "1px solid #1f2937", paddingTop: 16, marginTop: 8 }}>
          <p style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.7, maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            <strong style={{ color: "#9ca3af" }}>Disclaimer:</strong> Jobnique is a job search platform and aggregator — we are not the employer for any role listed on this site. Job listings are sourced from third-party providers. Jobnique will never request payment or financial details as part of a job application. If you believe a listing is fraudulent, please <a href="/contact" style={{ color: "#6b7280", textDecoration: "underline" }}>contact us</a>.
          </p>
        </div>
      </div>
    </footer>
  );
}
