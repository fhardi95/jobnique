import { Metadata } from "next";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JobDetailClient from "./JobDetailClient";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jobnique.com";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary_min?: number;
  salary_max?: number;
  description?: string;
  ats_apply_url?: string;
  source?: string;
  contract_time?: string;
  category?: string;
  remote?: boolean;
  posted_at: string;
}

async function getJob(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from("ats_jobs")
    .select("*")
    .eq("id", id)
    .eq("expired", false)
    .single();

  if (error || !data) return null;
  return data as Job;
}

function formatSalary(min?: number, max?: number): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)} / year`;
  if (min) return `From ${fmt(min)} / year`;
  return `Up to ${fmt(max!)} / year`;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 300);
}

// ── Dynamic metadata per job ──────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) {
    return { title: "Job Not Found | Jobnique" };
  }

  const salary = formatSalary(job.salary_min, job.salary_max);
  const salaryText = salary ? ` · ${salary}` : "";
  const title = `${job.title} at ${job.company} – ${job.location}${salaryText} | Jobnique`;
  const description = job.description
    ? `${stripHtml(job.description)} Apply today on Jobnique.`
    : `${job.title} job at ${job.company} in ${job.location}. Apply today on Jobnique.`;

  const canonical = `${BASE_URL}/jobs/${id}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Jobnique",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: { index: true, follow: true },
  };
}

// ── JobPosting JSON-LD schema ─────────────────────────────────────────────────
function buildJobPostingSchema(job: Job) {
  // Ensure description is plain text (Google prefers plain text or HTML, but must be present)
  const descriptionText = job.description
    ? job.description
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&nbsp;/g, " ")
        .replace(/\s+/g, " ")
        .trim()
    : `${job.title} position at ${job.company} in ${job.location}.`;

  // validThrough must be a future date — set to 90 days from posted_at
  const postedDate = new Date(job.posted_at);
  const validThrough = new Date(postedDate.getTime() + 90 * 24 * 60 * 60 * 1000).toISOString();

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: descriptionText,
    datePosted: postedDate.toISOString().split("T")[0], // YYYY-MM-DD format
    validThrough,
    hiringOrganization: {
      "@type": "Organization",
      name: job.company,
      sameAs: `https://www.jobnique.com/jobs?q=${encodeURIComponent(job.company)}`,
    },
    jobLocation: job.remote
      ? {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressCountry: "US",
          },
        }
      : {
          "@type": "Place",
          address: {
            "@type": "PostalAddress",
            addressLocality: job.location.split(",")[0].trim(),
            addressCountry: "US",
          },
        },
    employmentType:
      job.contract_time === "full_time"
        ? "FULL_TIME"
        : job.contract_time === "part_time"
        ? "PART_TIME"
        : "FULL_TIME",
    jobLocationType: job.remote ? "TELECOMMUTE" : undefined,
    directApply: false,
    url: `${BASE_URL}/jobs/${job.id}`,
    applicantLocationRequirements: job.remote
      ? { "@type": "Country", name: "United States" }
      : undefined,
  };

  // Only add baseSalary if both values are present and valid
  if (job.salary_min && job.salary_max && job.salary_min > 0 && job.salary_max > 0) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max,
        unitText: "YEAR",
      },
    };
  } else if (job.salary_min && job.salary_min > 0) {
    schema.baseSalary = {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        unitText: "YEAR",
      },
    };
  }

  if (job.category) {
    schema.occupationalCategory = job.category;
  }

  // Remove all undefined fields recursively
  return JSON.parse(JSON.stringify(schema));
}

// ── Server page ───────────────────────────────────────────────────────────────
export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const job = await getJob(id);

  if (!job) notFound();

  const jobForClient = {
    id: job.id,
    title: job.title,
    company: { display_name: job.company },
    location: { display_name: job.location },
    salary_min: job.salary_min,
    salary_max: job.salary_max,
    description: job.description || "",
    redirect_url: job.ats_apply_url || "",
    ats_apply_url: job.ats_apply_url,
    source: job.source,
    contract_time: job.contract_time,
    created: job.posted_at,
    category: job.category ? { label: job.category } : null,
    remote: job.remote,
  };

  const schema = buildJobPostingSchema(job);
  const schemaJson = JSON.stringify(schema);

  return (
    <>
      {/* JobPosting schema injected server-side — Google Jobs reads this */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: schemaJson }}
      />
      <Navbar />
      <JobDetailClient job={jobForClient} />
      <Footer />
    </>
  );
}
