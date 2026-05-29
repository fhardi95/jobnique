import type { Metadata } from "next";
import InterviewTipsClient from "./InterviewTipsClient";

const SITE_URL = "https://www.jobnique.com";
const url = `${SITE_URL}/interview-tips`;

export const metadata: Metadata = {
  title: "Interview Tips – How to Prepare & Ace Any Interview | Jobnique",
  description: "Free interview preparation guides. Learn how to answer tough questions, handle nerves, and turn every interview into a job offer.",
  alternates: { canonical: url },
  openGraph: {
    title: "Interview Tips – How to Prepare & Ace Any Interview | Jobnique",
    description: "Free interview preparation guides. Learn how to answer tough questions, handle nerves, and turn every interview into a job offer.",
    url,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview Tips | Jobnique",
    description: "Prepare for any interview with free expert guides from Jobnique.",
  },
};

export default function InterviewTipsPage() {
  return <InterviewTipsClient />;
}
