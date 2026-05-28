import type { Metadata } from "next";
import JobsClient from "./JobsClient";

const SITE_URL = "https://www.jobnique.com";
const url = `${SITE_URL}/jobs`;

export const metadata: Metadata = {
  title: "Search Jobs – Find Your Next Role | Jobnique",
  description: "Search thousands of jobs across the US and worldwide. Filter by title, location and contract type. Apply directly in minutes.",
  alternates: { canonical: url },
  openGraph: {
    title: "Search Jobs – Find Your Next Role | Jobnique",
    description: "Search thousands of jobs across the US and worldwide. Filter by title, location and contract type. Apply directly in minutes.",
    url,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Search Jobs | Jobnique",
    description: "Find thousands of jobs across the US. Apply in minutes on Jobnique.",
  },
};

export default function JobsPage() {
  return <JobsClient />;
}
