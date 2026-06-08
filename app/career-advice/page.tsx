import type { Metadata } from "next";
import CareerAdviceClient from "./CareerAdviceClient";

const SITE_URL = "https://www.jobnique.com";
const url = `${SITE_URL}/career-advice`;

export const metadata: Metadata = {
  title: "Career Advice – CV Tips, Job Search Guides & More | Jobnique",
  description: "Expert career advice to help you write better CVs, ace interviews, negotiate salaries and advance your career. Free guides for every stage.",
  alternates: { canonical: url },
  openGraph: {
    title: "Career Advice – CV Tips, Job Search Guides & More | Jobnique",
    description: "Expert career advice to help you write better CVs, ace interviews, negotiate salaries and advance your career.",
    url,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Career Advice | Jobnique",
    description: "Free expert career guides — CVs, interviews, salaries and more.",
  },
};

export default function CareerAdvicePage() {
  return <CareerAdviceClient />;
}
