import type { Metadata } from "next";
import ResumeBuilderClient from "./ResumeBuilderClient";

export const metadata: Metadata = {
  title: "AI Resume Builder — AI-Powered CV Maker | Jobnique",
  description:
    "Build a stunning ATS-friendly resume in minutes with our AI Resume Builder, upload your existing CV, or start from scratch. AI-powered CV Maker.",
  keywords:
    "AI resume builder, AI CV generator, free AI resume builder, best AI resume builder free, CV builder, resume builder free, ATS friendly resume builder, AI resume writer, free resume maker, professional resume builder, resume templates 2026, CV maker free, online resume builder, resume generator AI",
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
