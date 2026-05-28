import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – Jobnique",
  description: "Jobnique's privacy policy explaining how we collect, use, and protect your personal information when you use our job search platform.",
};

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 24, maxWidth: 700, margin: "0 auto" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Last updated: May 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Introduction</h2>
          <p className="section-sub">Your privacy is important to us</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            This Privacy Policy describes how Jobnique ("we", "our", or "us") collects, uses, and discloses information when you use our job search platform and related services ("Service"). By using the Service, you agree to the collection and use of information in accordance with this policy.
          </p>

          <h2 className="section-title">Information We Collect</h2>
          <p className="section-sub">Data we gather to provide and improve our service</p>

          <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1a56db" }}>Personal Information</h3>
            <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
              <li>Name, email address, and contact information when you register or subscribe</li>
              <li>Uploaded CV/resume documents</li>
              <li>Profile information including work history, education, and skills</li>
              <li>Job search preferences and application history</li>
            </ul>
          </div>

          <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px", marginBottom: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, color: "#1a56db" }}>Usage Data</h3>
            <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 20 }}>
              <li>IP address, browser type, and device information</li>
              <li>Pages visited, search queries, and click-through behavior</li>
              <li>Referring/exit pages and URLs</li>
              <li>Cookies and similar tracking technologies</li>
            </ul>
          </div>

          <h2 className="section-title">How We Use Your Information</h2>
          <p className="section-sub">Purposes for processing your data</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>To provide, maintain, and improve our job search services</li>
            <li>To personalize your experience and show relevant job recommendations</li>
            <li>To communicate with you about your account, job alerts, and service updates</li>
            <li>To process job applications and facilitate connections with employers</li>
            <li>For analytics, research, and to enhance our platform's functionality</li>
            <li>To detect, prevent, and address security issues or technical problems</li>
          </ul>

          <h2 className="section-title">Sharing and Disclosure</h2>
          <p className="section-sub">When we share your information</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>With employers when you apply for jobs through our platform</li>
            <li>With service providers who help us operate our business</li>
            <li>As required by law or to protect our legal rights</li>
            <li>In connection with a merger, acquisition, or sale of assets</li>
            <li>With your consent or at your direction</li>
          </ul>

          <h2 className="section-title">Data Security</h2>
          <p className="section-sub">How we protect your information</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            We implement reasonable security measures designed to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
          </p>

          <h2 className="section-title">Your Rights and Choices</h2>
          <p className="section-sub">Control over your personal information</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>Access, correct, or delete your personal information</li>
            <li>Opt-out of marketing communications and job alerts</li>
            <li>Restrict or object to certain uses of your data</li>
            <li>Export your data in a portable format</li>
            <li>Withdraw consent where applicable</li>
          </ul>

          <h2 className="section-title">Cookies and Tracking Technologies</h2>
          <p className="section-sub">How we use cookies and similar technologies</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            We use cookies to enhance your experience, analyze site usage, and personalize content. You can manage cookie preferences through your browser settings.
          </p>

          <h2 className="section-title">Children's Privacy</h2>
          <p className="section-sub">Our commitment to protecting minors</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            Our Service is not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>

          <h2 className="section-title">Changes to This Privacy Policy</h2>
          <p className="section-sub">How we notify you of updates</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2 className="section-title">Contact Us</h2>
          <p className="section-sub">Questions about your privacy</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            If you have any questions about this Privacy Policy, please contact us at:
          </p>
          <p style={{ background: "#f8faff", borderRadius: 8, padding: "16px", fontFamily: "monospace", marginBottom: 24 }}>
            privacy@jobnique.com
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}