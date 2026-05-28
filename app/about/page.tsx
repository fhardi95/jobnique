import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Jobnique – Your Career Growth Partner",
  description: "Learn about Jobnique's mission to connect job seekers with opportunities, providing free resources, job search tools, and career advice.",
};

export default function About() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 24, maxWidth: 700, margin: "0 auto" }}>
            About Jobnique
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            We're dedicated to simplifying your job search journey with powerful tools, expert advice, and free resources to help you land your dream role.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Our Mission</h2>
          <p className="section-sub">Empowering career growth through accessible technology and expert guidance</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 32 }}>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>🎯</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Simplify Job Search</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                We aggregate millions of job listings and provide intuitive search tools so you spend less time searching and more time applying.
              </p>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>📚</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Free Career Resources</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                Access professional CV templates, cover letters, salary data, and expert career advice—all completely free.
              </p>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>💡</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Expert Guidance</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                Get actionable tips from career professionals on resumes, interviews, networking, and career advancement strategies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section style={{ background: "#f9fafb", padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-title">What We Offer</h2>
          <p className="section-sub">Comprehensive tools for every stage of your career journey</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20, marginTop: 32 }}>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>💼</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Job Search</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Live job listings from Adzuna with advanced filtering options
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>📄</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>CV Templates</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Professionally designed, ATS-friendly templates for every industry
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>💌</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Cover Letters</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Customizable templates to make your application stand out
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>💰</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Salary Data</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Industry-specific salary ranges to negotiate with confidence
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>📘</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Career Advice</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Expert articles on interviews, networking, and professional development
              </p>
            </div>
            <div>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>📧</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Newsletter</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14 }}>
                Weekly career tips and job alerts delivered to your inbox
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <h2 className="section-title">Our Impact</h2>
          <p className="section-sub">Numbers that reflect our commitment to job seekers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 24, marginTop: 32 }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1a56db", marginBottom: 8 }}>1.2M+</div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Active Job Listings</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Updated Daily</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1a56db", marginBottom: 8 }}>50K+</div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Companies Hiring</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Verified Employers</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1a56db", marginBottom: 8 }}>2M+</div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Job Seekers Helped</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>Career Advancement</p>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#1a56db", marginBottom: 8 }}>100%</div>
              <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>Free Resources</p>
              <p style={{ fontSize: 12, color: "#9ca3af" }}>No Hidden Fees</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,36px)", marginBottom: 24 }}>
            Ready to Start Your Job Search Journey?
          </h2>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Join thousands of successful job seekers who've found their next opportunity through Jobnique.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/jobs" style={{ background: "#fff", color: "#1e3a8a", border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              🔍 Search Jobs Now
            </Link>
            <Link href="/cv-templates" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "2px solid #fff", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              📄 Download CV Templates
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}