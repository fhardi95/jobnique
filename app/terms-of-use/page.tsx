import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use – Jobnique",
  description: "Jobnique's Terms of Use governing your use of our job search platform and services.",
  alternates: { canonical: "https://www.jobnique.com/terms-of-use" },
};

export default function TermsOfUse() {
  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Hero */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "80px 20px 100px", color: "#fff" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,56px)", lineHeight: 1.15, marginBottom: 24, maxWidth: 700, margin: "0 auto" }}>
            Terms of Use
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 18, marginBottom: 32, maxWidth: 600, margin: "0 auto" }}>
            Last updated: May 24, 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Acceptance of Terms</h2>
          <p className="section-sub">By accessing and using Jobnique, you agree to these terms</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            These Terms of Use ("Terms") govern your access to and use of Jobnique's website, job search platform, and related services (collectively, the "Service"). By accessing or using the Service, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use the Service.
          </p>

          <h2 className="section-title">Description of Service</h2>
          <p className="section-sub">What Jobnique provides</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            Jobnique provides an online job search platform that aggregates job listings, offers career resources, provides CV and cover letter templates, and facilitates connections between job seekers and employers. The Service includes features such as job search, application tools, salary data, career advice content, and user accounts.
          </p>

          <h2 className="section-title">User Accounts</h2>
          <p className="section-sub">Registration and account security</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>To access certain features, you may need to register for an account</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You agree to notify us immediately of any unauthorized use of your account</li>
            <li>You are responsible for all activities that occur under your account</li>
          </ul>

          <h2 className="section-title">User Content</h2>
          <p className="section-sub">Your rights and responsibilities regarding content</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>You retain ownership of any content you upload or submit (such as CVs)</li>
            <li>By submitting content, you grant Jobnique a license to use, display, and distribute such content</li>
            <li>You warrant that you have the right to submit any content you provide</li>
            <li>You agree not to submit任何内容 that is illegal, infringing, or violates third-party rights</li>
          </ul>

          <h2 className="section-title">Prohibited Activities</h2>
          <p className="section-sub">What you cannot do on our platform</p>
          <ul style={{ color: "#6b7280", lineHeight: 1.7, marginLeft: 24, marginBottom: 24 }}>
            <li>Violate any applicable laws or regulations</li>
            <li>Interfere with or disrupt the Service or servers/networks</li>
            <li>Attempt to gain unauthorized access to accounts or systems</li>
            <li>Harass, abuse, or harm another person</li>
            <li>Submit false or misleading information</li>
            <li>Use the Service for any commercial purpose without our permission</li>
          </ul>

          <h2 className="section-title">Intellectual Property</h2>
          <p className="section-sub">Ownership of Jobnique's content and technology</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            The Service and its original content, features, and functionality are owned by Jobnique and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
          </p>

          <h2 className="section-title">Third-Party Links</h2>
          <p className="section-sub">Links to external websites</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            The Service may contain links to third-party websites or services that are not owned or controlled by Jobnique. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
          </p>

          <h2 className="section-title">Disclaimer of Warranties</h2>
          <p className="section-sub">What we do not guarantee</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. JOBNIQUE DISCLAIMS ALL WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>

          <h2 className="section-title">Limitation of Liability</h2>
          <p className="section-sub">Our responsibility for damages</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL JOBNIQUE OR ITS OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY.
          </p>

          <h2 className="section-title">Indemnification</h2>
          <p className="section-sub">Your responsibility to protect us</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            You agree to defend, indemnify, and hold harmless Jobnique and its subsidiaries, affiliates, officers, agents, and employees from and against any claims, liabilities, damages, losses, and expenses arising out of or in any way connected with your access to or use of the Service.
          </p>

          <h2 className="section-title">Termination</h2>
          <p className="section-sub">When we can suspend or terminate access</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            We reserve the right, at our sole discretion, to suspend or terminate your access to all or part of the Service without notice for any reason, including violation of these Terms.
          </p>

          <h2 className="section-title">Governing Law</h2>
          <p className="section-sub">Which laws apply to these terms</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law principles.
          </p>

          <h2 className="section-title">Changes to Terms</h2>
          <p className="section-sub">How we modify these terms</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect.
          </p>

          <h2 className="section-title">Contact Us</h2>
          <p className="section-sub">Questions about these terms</p>
          <p style={{ color: "#6b7280", lineHeight: 1.7, marginBottom: 24 }}>
            If you have any questions about these Terms of Use, please contact us at:
          </p>
          <p style={{ background: "#f8faff", borderRadius: 8, padding: "16px", fontFamily: "monospace", marginBottom: 24 }}>
            legal@jobnique.com
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}