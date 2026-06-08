import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Jobnique – Get Support & Partnership Inquiries",
  description: "Contact Jobnique for support, partnership opportunities, advertising inquiries, or general questions about our job search platform.",
};

export default function Contact() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 24, maxWidth: 700, margin: "0 auto" }}>
            Contact Us
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Have questions or feedback? We'd love to hear from you. Reach out for support, partnerships, or general inquiries.
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-sub">Choose the best way to connect with our team</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24, marginTop: 32 }}>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 32, marginBottom: 12, color: "#1a56db" }}>📧</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Email Support</h3>
              <p style={{ color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
                For technical support, account issues, or general questions
              </p>
              <a href="mailto:support@jobnique.com" style={{ color: "#1a56db", fontWeight: 600, textDecoration: "underline" }}>
                support@jobnique.com
              </a>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 32, marginBottom: 12, color: "#1a56db" }}>💼</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Partnerships</h3>
              <p style={{ color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
                For employers, job boards, or career service collaborations
              </p>
              <a href="mailto:partnerships@jobnique.com" style={{ color: "#1a56db", fontWeight: 600, textDecoration: "underline" }}>
                partnerships@jobnique.com
              </a>
            </div>
            <div style={{ background: "#f8faff", borderRadius: 12, padding: "24px" }}>
              <div style={{ fontSize: 32, marginBottom: 12, color: "#1a56db" }}>📢</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Advertising</h3>
              <p style={{ color: "#6b7280", marginBottom: 16, lineHeight: 1.6 }}>
                Explore advertising opportunities on our platform
              </p>
              <a href="mailto:ads@jobnique.com" style={{ color: "#1a56db", fontWeight: 600, textDecoration: "underline" }}>
                ads@jobnique.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ background: "#f9fafb", padding: "80px 0" }}>
        <div className="container">
          <h2 className="section-title">Send Us a Message</h2>
          <p className="section-sub">Fill out the form below and we'll get back to you within 24 hours</p>
          <form
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "32px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              maxWidth: "500px",
              margin: "32px auto 0"
            }}
          >
            <div style={{ marginBottom: 24 }}>
              <label htmlFor="name" style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Full Name
              </label>
              <input
                id="name"
                type="text"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label htmlFor="email" style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.2s"
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label htmlFor="subject" style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Subject
              </label>
              <select
                id="subject"
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  transition: "border-color 0.2s",
                  backgroundColor: "#fff"
                }}
              >
                <option value="">Select a topic</option>
                <option value="support">Technical Support</option>
                <option value="partnership">Partnership Inquiry</option>
                <option value="advertising">Advertising Opportunity</option>
                <option value="feedback">Feedback/Suggestion</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: 24 }}>
              <label htmlFor="message" style={{ display: "block", fontWeight: 600, marginBottom: 8, color: "#374151" }}>
                Message
              </label>
              <textarea
                id="message"
                rows={6}
                required
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: 8,
                  fontSize: 16,
                  outline: "none",
                  resize: "vertical",
                  transition: "border-color 0.2s"
                }}
              ></textarea>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                background: "#1a56db",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "14px",
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
                transition: "background-color 0.2s"
              }}
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Office Info */}
      <section style={{ background: "#fff", padding: "60px 0" }}>
        <div className="container">
          <h2 className="section-title">Our Office</h2>
          <p className="section-sub">Where you can find us</p>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start", flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 16 }}>Jobnique Headquarters</div>
              <p style={{ color: "#6b7280", lineHeight: 1.6, marginBottom: 16 }}>
                123 Innovation Drive<br/>
                San Francisco, CA 94107<br/>
                United States
              </p>
              <p style={{ color: "#6b7280", fontSize: 14, marginBottom: 16 }}>
                <strong>Hours:</strong> Monday-Friday, 9:00 AM - 6:00 PM PST
              </p>
            </div>
            <div style={{ flex: 1, minWidth: 280 }}>
              {/* Map placeholder */}
              <div style={{
                width: "100%",
                height: "200px",
                background: "#f3f4f6",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#9ca3af",
                fontStyle: "italic"
              }}>
                Map Loading...
              </div>
              <p style={{ marginTop: 12, color: "#6b7280", fontSize: 14, textAlign: "center" }}>
                View on Google Maps
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}