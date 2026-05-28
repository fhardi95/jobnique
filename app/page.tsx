import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Jobnique – Find Jobs, Career Advice & Free CV Templates",
  description: "Search thousands of jobs across the US and worldwide. Get career advice, download free CV templates, cover letters, and check salary data.",
  keywords: "job search, career advice, CV templates, cover letter, salary checker, jobs USA, find jobs online",
  openGraph: {
    title: "Jobnique – Find Jobs & Advance Your Career",
    description: "Search thousands of jobs, get career advice, download free CV and cover letter templates.",
    url: "https://www.jobnique.com",
    siteName: "Jobnique",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Jobnique", description: "Find your next job on Jobnique" },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://www.jobnique.com/" },
};

export default function HomePage() {
  return <HomeClient />;
}
