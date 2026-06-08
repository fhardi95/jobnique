import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import JDGenClient from "./JDGenClient";

export const metadata: Metadata = {
  title: "Free Job Description Generator 2026 – Write JDs in Seconds",
  description: "Generate professional, inclusive job descriptions for any role in seconds. Our AI-powered tool creates ATS-optimised job postings with responsibilities.",
  keywords: "job description generator, JD generator, job posting template, write job description, job ad generator, HR tools, job description writer",
  openGraph: {
    title: "Free Job Description Generator – Write Any JD in Seconds",
    description: "Create professional, inclusive job descriptions with responsibilities, requirements, and benefits. Free HR tool.",
    type: "website",
  },
};

export default function JDGenPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "linear-gradient(135deg,#1c1917 0%,#78350f 60%,#d97706 100%)", padding: "52px 20px 44px", color: "#fff", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          📝 AI-Powered HR Tool
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", marginBottom: 12, lineHeight: 1.2 }}>
          Job Description Generator
        </h1>
        <p style={{ color: "#fde68a", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Create professional, inclusive, ATS-optimised job descriptions for any role in seconds. Customise, copy, and post with ease.
        </p>
      </div>
      <div style={{ background: "#f9fafb", minHeight: "60vh", padding: "0 0 60px" }}>
        <JDGenClient />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
