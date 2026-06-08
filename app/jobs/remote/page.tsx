import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BASE_URL = "https://www.jobnique.com";

export const metadata: Metadata = {
  title: "Remote Jobs USA – Work From Home | Jobnique",
  description: "Browse thousands of remote and work-from-home jobs in the US. Full-time and part-time remote roles across tech, healthcare, finance and more. Apply today on Jobnique.",
  alternates: { canonical: `${BASE_URL}/jobs/remote` },
  openGraph: {
    title: "Remote Jobs USA – Work From Home | Jobnique",
    description: "Thousands of remote jobs across the US. Apply in minutes on Jobnique.",
    url: `${BASE_URL}/jobs/remote`,
    siteName: "Jobnique",
    type: "website",
  },
  twitter: { card: "summary", title: "Remote Jobs USA | Jobnique", description: "Browse remote & work-from-home jobs in the US." },
};

async function getRemoteJobs() {
  const { data } = await supabase
    .from("ats_jobs")
    .select("id, title, company, location, salary_min, salary_max, contract_time, category, posted_at")
    .eq("expired", false)
    .eq("remote", true)
    .order("posted_at", { ascending: false })
    .limit(60);
  return data || [];
}

const formatSalary = (min?: number, max?: number) => {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
};

const timeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

export default async function RemoteJobsPage() {
  const jobs = await getRemoteJobs();

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Remote Jobs USA",
    description: "Latest remote and work-from-home job listings on Jobnique",
    url: `${BASE_URL}/jobs/remote`,
    numberOfItems: jobs.length,
    itemListElement: jobs.slice(0, 10).map((job, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${BASE_URL}/jobs/${job.id}`,
      name: `${job.title} at ${job.company} (Remote)`,
    })),
  };

  return (
    <>
      <style>{`
        .remote-job-card {
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px 24px;
          cursor: pointer;
          transition: box-shadow 0.15s;
        }
        .remote-job-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
        }
      `}</style>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <Navbar />

      <div style={{ background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)", padding: "48px 20px 56px" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 10 }}>
            <Link href="/" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Home</Link>
            {" · "}
            <Link href="/jobs" style={{ color: "rgba(255,255,255,0.7)", textDecoration: "none" }}>Jobs</Link>
            {" · "}
            <span style={{ color: "#fff" }}>Remote</span>
          </div>
          <h1 style={{ fontSize: "clamp(24px,4vw,36px)", fontWeight: 800, color: "#fff", marginBottom: 12 }}>
            🌐 Remote Jobs in the USA
          </h1>
          <p style={{ fontSize: 16, color: "rgba(255,255,255,0.85)" }}>
            {jobs.length > 0 ? `${jobs.length} remote job${jobs.length !== 1 ? "s" : ""} available` : "Work from anywhere"} · Updated daily
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 20px 64px" }}>
        {jobs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌐</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", marginBottom: 8 }}>No remote jobs listed right now</h2>
            <p style={{ fontSize: 15, color: "#6b7280", marginBottom: 24 }}>Check back soon — we sync jobs daily.</p>
            <Link href="/jobs" style={{ background: "#7c3aed", color: "#fff", borderRadius: 8, padding: "11px 28px", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
              Browse all jobs →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {jobs.map(job => (
              <Link key={job.id} href={`/jobs/${job.id}`} style={{ textDecoration: "none" }}>
                <div className="remote-job-card">
                  <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0f172a", margin: 0 }}>{job.title}</h2>
                        <span style={{ background: "#f5f3ff", color: "#7c3aed", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20 }}>REMOTE</span>
                      </div>
                      <div style={{ fontSize: 14, color: "#374151", fontWeight: 500, marginBottom: 6 }}>{job.company}</div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {job.category && <span style={{ fontSize: 13, color: "#6b7280" }}>📂 {job.category}</span>}
                        {job.contract_time && (
                          <span style={{ fontSize: 13, color: "#6b7280" }}>
                            · {job.contract_time === "full_time" ? "Full-time" : "Part-time"}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {formatSalary(job.salary_min, job.salary_max) && (
                        <div style={{ fontSize: 13, fontWeight: 700, color: "#7c3aed", marginBottom: 4 }}>
                          💰 {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                      )}
                      <div style={{ fontSize: 12, color: "#9ca3af" }}>{timeAgo(job.posted_at)}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Internal links to city pages */}
        <div style={{ marginTop: 52 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#0f172a", marginBottom: 16 }}>Browse jobs by city</h2>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {["new-york","los-angeles","chicago","houston","dallas","san-francisco","seattle","miami","boston","austin","denver","atlanta"].map(slug => (
              <Link key={slug} href={`/jobs/location/${slug}`}
                style={{ background: "#f1f5f9", color: "#374151", fontSize: 13, fontWeight: 500, padding: "7px 14px", borderRadius: 20, textDecoration: "none" }}>
                {slug.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
