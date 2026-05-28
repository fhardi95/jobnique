import type { Metadata } from "next";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: "Jobnique – Find Jobs, Career Advice, CV Templates",
  description: "Search thousands of jobs across the US and worldwide. Get career advice, download free CV templates, cover letters, and check salary data.",
  keywords: "job search, career advice, CV templates, cover letter, salary checker, jobs USA, find jobs online",
  openGraph: {
    title: "Jobnique – Find Jobs & Advance Your Career",
    description: "Search thousands of jobs, get career advice, download free CV and cover letter templates.",
    url: "https://jobnique.com",
    siteName: "Jobnique",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Jobnique", description: "Find your next job on Jobnique" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Jobnique",
              "url": "https://www.jobnique.com",
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://www.jobnique.com/jobs?q={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body><SessionWrapper>{children}</SessionWrapper></body>
    </html>
  );
}
