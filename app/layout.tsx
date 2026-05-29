import type { Metadata } from "next";
import { headers } from "next/headers";
import SessionWrapper from "@/components/SessionWrapper";
import "./globals.css";

const BASE_URL = "https://www.jobnique.com";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const url = headersList.get("x-url") || BASE_URL;
  const pathname = new URL(url).pathname;
  const canonical = BASE_URL + pathname;

  return {
    title: "Jobnique – Find Jobs, Career Advice, CV Templates",
    description: "Search thousands of jobs across the US and worldwide. Get career advice, download free CV templates, cover letters, and check salary data.",
    keywords: "job search, career advice, CV templates, cover letter, salary checker, jobs USA, find jobs online",
    metadataBase: new URL(BASE_URL),
    openGraph: {
      title: "Jobnique – Find Jobs & Advance Your Career",
      description: "Search thousands of jobs, get career advice, download free CV and cover letter templates.",
      url: canonical,
      siteName: "Jobnique",
      type: "website",
    },
    twitter: { card: "summary_large_image", title: "Jobnique", description: "Find your next job on Jobnique" },
    robots: { index: true, follow: true },
    alternates: { canonical },
  };
}

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
              "url": BASE_URL,
              "potentialAction": {
                "@type": "SearchAction",
                "target": `${BASE_URL}/jobs?q={search_term_string}`,
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
