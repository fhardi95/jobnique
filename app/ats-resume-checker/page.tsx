import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import ATSCheckerClient from "./ATSCheckerClient";

export const metadata: Metadata = {
  title: "Free ATS Resume Checker 2026 – Score Your CV",
  description: "Instantly check how your resume scores against an Applicant Tracking System. Paste your CV and job description to get a keyword match score.",
  keywords: "ATS resume checker, ATS score, resume scanner, applicant tracking system, CV checker, resume keyword checker, ATS friendly resume",
  openGraph: {
    title: "Free ATS Resume Checker – Score Your CV Instantly",
    description: "Find out if your resume will pass ATS filters. Get a keyword match score and actionable improvements.",
    type: "website",
  },
};

export default function ATSCheckerPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "linear-gradient(135deg,#0f172a 0%,#1a56db 100%)", padding: "52px 20px 44px", color: "#fff", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          🔍 Free ATS Scanner
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", marginBottom: 12, lineHeight: 1.2 }}>
          ATS Resume Checker
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Paste your resume and the job description to instantly score your keyword match, spot missing skills, and get fixes that help you pass ATS filters.
        </p>
      </div>
      <div style={{ background: "#f9fafb", minHeight: "60vh", padding: "0 0 60px" }}>
        <ATSCheckerClient />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
