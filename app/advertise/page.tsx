import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise with Jobnique – Reach Qualified Job Seekers",
  description: "Advertise your brand, services, or job listings on Jobnique. Reach millions of active job seekers with targeted advertising solutions.",
  alternates: { canonical: "https://www.jobnique.com/advertise" },
};

export default function Advertise() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 24, maxWidth: 700, margin: "0 auto" }}>
            Advertise with Jobnique
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Reach highly engaged job seekers actively looking for career opportunities and professional development resources.
          </p>
        </div>
      </section>

      {/* Why Advertise */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Advertise with Jobnique?</h2>
          <p className="section-sub">Targeted reach to quality job seekers</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, marginTop: 32 }}>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>🎯</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Highly Targeted Audience</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                Our users are actively searching for jobs, career advice, and professional resources—making them highly receptive to relevant offers.
              </p>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>📈</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Quality Engagement</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                With average session durations of 4+ minutes and multiple page views per visit, your message gets seen and remembered.
              </p>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 36, marginBottom: 12, color: "#1a56db" }}>💰</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Cost-Effective CPM</h3>
              <p style={{ color: "#6b7280", lineHeight: 1.6 }}>
                Competitive pricing with flexible options to suit budgets of all sizes, from startups to enterprise companies.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Insights */}
      <section style={{ background: "#f9fafb", padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-title">Our Audience</h2>
          <p className="section-sub">Who you'll reach when advertising with Jobnique</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 32 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Demographics</h3>
              <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
                <li>Age: 22-45 (68%)</li>
                <li>Gender: 52% Female, 48% Male</li>
                <li>Education: 76% College Degree or Higher</li>
                <li>Income: $45k-$100k+ (54%)</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Job Intent</h3>
              <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
                <li>Actively Looking: 45%</li>
                <li>Open to Opportunities: 35%</li>
                <li>Career Development Focused: 20%</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Industries</h3>
              <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
                <li>Technology: 28%</li>
                <li>Healthcare: 18%</li>
                <li>Finance & Business: 16%</li>
                <li>Education: 12%</li>
                <li>Retail & Service: 11%</li>
                <li>Other: 15%</li>
              </ul>
            </div>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>Geography</h3>
              <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
                <li>United States: 82%</li>
                <li>Canada: 8%</li>
                <li>United Kingdom: 5%</li>
                <li>Australia: 3%</li>
                <li>Other: 2%</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Options */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Advertising Solutions</h2>
          <p className="section-sub">Choose the right format for your campaign goals</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24, marginTop: 32 }}>
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>🖼️</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Display Ads</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                Banner ads in various sizes placed strategically throughout the site for maximum visibility.
              </p>
              <ul style={{ textAlign: "left", color: "#6b7280", fontSize: 14, marginLeft: 20 }}>
                <li>Leaderboard (728x90)</li>
                <li>Medium Rectangle (300x250)</li>
                <li>Skyscraper (160x600)</li>
                <li>Mobile Banner (320x50)</li>
              </ul>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>📧</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Newsletter Sponsorship</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                Reach engaged subscribers through sponsored content in our weekly career advice newsletter.
              </p>
              <ul style={{ textAlign: "left", color: "#6b7280", fontSize: 14, marginLeft: 20 }}>
                <li>Dedicated email sends</li>
                <li>Sponsored content blocks</li>
                <li>Product/service spotlights</li>
                <li>Exclusive offer promotions</li>
              </ul>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>💼</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Job Listings</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                Promote your job listings to our active job seeker database with featured placement options.
              </p>
              <ul style={{ textAlign: "left", color: "#6b7280", fontSize: 14, marginLeft: 20 }}>
                <li>Featured job placements</li>
                <li>Targeted by location/industry</li>
                <li>Apply tracking and analytics</li>
                <li>Employer branding options</li>
              </ul>
            </div>
            <div style={{ background: "#fff", borderRadius: 12, padding: "24px", border: "1px solid #e5e7eb" }}>
              <div style={{ fontSize: 28, marginBottom: 12, textAlign: "center" }}>📝</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, textAlign: "center", marginBottom: 12 }}>Content Marketing</h3>
              <p style={{ textAlign: "center", color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                Sponsored articles, career guides, or industry reports that provide value while promoting your brand.
              </p>
              <ul style={{ textAlign: "left", color: "#6b7280", fontSize: 14, marginLeft: 20 }}>
                <li>Custom career advice articles</li>
                <li>Industry-specific guides</li>
                <li>Salary report sponsorships</li>
                <li>Webinar collaborations</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,36px)", marginBottom: 24 }}>
            Ready to Start Advertising?
          </h2>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Our advertising team is ready to help you create a customized campaign that reaches your target audience effectively.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, flexWrap: "wrap" }}>
            <Link href="/contact" style={{ background: "#fff", color: "#1e3a8a", border: "none", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              📩 Contact Advertising Team
            </Link>
            <a href="mailto:ads@jobnique.com" style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "2px solid #fff", borderRadius: 8, padding: "14px 28px", fontSize: 16, fontWeight: 600, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 8 }}>
              📧 Email: ads@jobnique.com
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}