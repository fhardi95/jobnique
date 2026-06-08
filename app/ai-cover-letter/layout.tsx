import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Cover Letter Generator 2026 – Jobnique",
  description:
    "Generate a professional, personalised cover letter in seconds with Jobnique's free AI Cover Letter Generator. ATS-friendly, tailored to any job.",
  keywords: [
    "AI cover letter generator",
    "free cover letter generator",
    "AI cover letter writer",
    "cover letter generator free",
    "cover letter maker",
    "AI cover letter",
    "automatic cover letter generator",
    "cover letter writer AI",
    "free AI cover letter",
    "professional cover letter generator",
    "cover letter generator 2026",
    "ATS cover letter generator",
    "personalised cover letter generator",
    "instant cover letter",
    "cover letter builder free",
  ].join(", "),
  alternates: {
    canonical: "https://www.jobnique.com/ai-cover-letter",
  },
  openGraph: {
    title: "Free AI Cover Letter Generator — Personalised in Seconds",
    description:
      "Enter your name, role, and company. Our AI writes you a professional, ATS-friendly cover letter instantly. Free, no sign-up.",
    url: "https://www.jobnique.com/ai-cover-letter",
    siteName: "Jobnique",
    type: "website",
    images: [
      {
        url: "https://www.jobnique.com/og-ai-cover-letter.png",
        width: 1200,
        height: 630,
        alt: "Jobnique AI Cover Letter Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free AI Cover Letter Generator | Jobnique",
    description:
      "Generate a tailored cover letter in seconds. AI-powered, ATS-friendly, completely free.",
  },
  robots: { index: true, follow: true },
};

export default function AICoverLetterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
