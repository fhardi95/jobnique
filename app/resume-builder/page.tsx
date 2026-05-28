import type { Metadata } from "next";
import ResumeBuilderClient from "./ResumeBuilderClient";

export const metadata: Metadata = {
  title: "AI Resume Builder — Create a Professional Resume Free | Jobnique",
  description:
    "Build a stunning ATS-friendly resume in minutes. Choose from 8+ professional templates, upload your existing CV, or start from scratch. AI-powered suggestions included.",
  keywords:
    "resume builder, CV builder, free resume templates, ATS resume, AI resume, professional CV",
};

export default function ResumeBuilderPage() {
  return <ResumeBuilderClient />;
}
