import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import InterviewGenClient from "./InterviewGenClient";

export const metadata: Metadata = {
  title: "Free Interview Question Generator 2026 – AI-Powered Prep Tool",
  description: "Generate role-specific interview questions with model answers. Prepare for behavioural, technical, and situational questions for any job title using AI.",
  keywords: "interview question generator, interview prep tool, common interview questions, behavioral interview questions, technical interview questions, job interview practice",
  openGraph: {
    title: "AI Interview Question Generator – Prep for Any Role",
    description: "Get tailored interview questions and model answers for any job title. Powered by AI.",
    type: "website",
  },
};

export default function InterviewGenPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "linear-gradient(135deg,#1e1b4b 0%,#4c1d95 60%,#7c3aed 100%)", padding: "52px 20px 44px", color: "#fff", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          🎯 AI-Powered Interview Prep
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", marginBottom: 12, lineHeight: 1.2 }}>
          Interview Question Generator
        </h1>
        <p style={{ color: "#ddd6fe", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Enter any job title and get tailored interview questions with model answers — covering behavioural, technical, and situational questions.
        </p>
      </div>
      <div style={{ background: "#f9fafb", minHeight: "60vh", padding: "0 0 60px" }}>
        <InterviewGenClient />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
