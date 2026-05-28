import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobnique",
  alternates: { canonical: "https://www.jobnique.com/popular-jobs" },
};

const POPULAR_JOB_TITLES = [
  "Account Manager",
  "Accountant",
  "Administrative Assistant",
  "Barista",
  "Business Analyst",
  "Business Development Manager",
  "Care Assistant",
  "Chef",
  "Customer Service Representative",
  "Customer Service Manager",
  "Data Analyst",
  "Data Scientist",
  "Delivery Driver",
  "Executive Assistant",
  "Financial Analyst",
  "Graphic Designer",
  "Healthcare Administrator",
  "HR Manager",
  "IT Support Specialist",
  "Marketing Manager",
  "Medical Assistant",
  "Operations Manager",
  "Paralegal",
  "Pharmacist",
  "Product Manager",
  "Project Manager",
  "Receptionist",
  "Registered Nurse",
  "Sales Manager",
  "Sales Representative",
  "Social Media Manager",
  "Software Engineer",
  "Teacher",
  "UX Designer",
  "Warehouse Associate",
  "Web Developer",
];

const JOBS_BY_LOCATION = {
  regions: [
    { name: "Jobs in the Northeast", href: "/jobs?location=Northeast" },
    { name: "Jobs in the South", href: "/jobs?location=South" },
    { name: "Jobs in the Midwest", href: "/jobs?location=Midwest" },
    { name: "Jobs in the West", href: "/jobs?location=West" },
  ],
  states: [
    "California", "Texas", "Florida", "New York", "Pennsylvania",
    "Illinois", "Ohio", "Georgia", "North Carolina", "Michigan",
    "New Jersey", "Virginia", "Washington", "Arizona", "Massachusetts",
    "Tennessee", "Indiana", "Missouri", "Maryland", "Wisconsin",
  ],
  cities: [
    "New York City", "Los Angeles", "Chicago", "Houston", "Phoenix",
    "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose",
    "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte",
    "Indianapolis", "San Francisco", "Seattle", "Denver", "Nashville",
  ],
};

export default function PopularJobsPage() {
  return (
    <>
      <Navbar />

      {/* Page header */}
      <section style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 60%,#2563eb 100%)", padding: "60px 20px 56px", color: "#fff", textAlign: "center" }}>
        <div className="container">
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,46px)", lineHeight: 1.15, marginBottom: 12 }}>
            Browse Jobs
          </h1>
          <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 520, margin: "0 auto 28px" }}>
            Explore popular job titles, locations and states across the United States.
          </p>
          <Link href="/jobs" style={{ display: "inline-block", background: "#f97316", color: "#fff", borderRadius: 8, padding: "11px 28px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
            Search all jobs →
          </Link>
        </div>
      </section>

      {/* Popular job titles */}
      <section style={{ padding: "60px 20px 48px", background: "#fff" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: "36px 40px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#1a56db", marginBottom: 28 }}>Popular jobs</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "10px 0" }}>
              {POPULAR_JOB_TITLES.map(title => (
                <Link
                  key={title}
                  href={`/jobs?q=${encodeURIComponent(title)}`}
                  style={{ color: "#1a56db", fontSize: 14, lineHeight: "2.2", textDecoration: "none", display: "block" }}
                >
                  {title}
                </Link>
              ))}
            </div>
            <div style={{ marginTop: 24, borderTop: "1px solid #f3f4f6", paddingTop: 20 }}>
              <Link href="/jobs" style={{ color: "#1a56db", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                ↓ See more
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs by location */}
      <section style={{ padding: "0 20px 60px", background: "#fff" }}>
        <div className="container" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: "36px 40px" }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0f172a", marginBottom: 28 }}>Jobs by location</h2>

            {/* Regions */}
            <div style={{ display: "flex", gap: "32px 40px", flexWrap: "wrap", marginBottom: 28 }}>
              {JOBS_BY_LOCATION.regions.map(r => (
                <Link key={r.name} href={r.href} style={{ color: "#1a56db", fontSize: 14, fontWeight: 600, textDecoration: "none" }}>
                  {r.name}
                </Link>
              ))}
            </div>

            {/* States */}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 24, marginBottom: 28 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 16 }}>Jobs by state</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "8px 0" }}>
                {JOBS_BY_LOCATION.states.map(state => (
                  <Link
                    key={state}
                    href={`/jobs?location=${encodeURIComponent(state)}`}
                    style={{ color: "#1a56db", fontSize: 14, lineHeight: "2.1", textDecoration: "none", display: "block" }}
                  >
                    Jobs in {state}
                  </Link>
                ))}
              </div>
              <div style={{ marginTop: 16 }}>
                <Link href="/jobs" style={{ color: "#1a56db", fontSize: 14, fontWeight: 500, display: "inline-flex", alignItems: "center", gap: 4 }}>
                  ↓ See more
                </Link>
              </div>
            </div>

            {/* Cities */}
            <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: "#374151", marginBottom: 16 }}>Jobs by city</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "8px 0" }}>
                {JOBS_BY_LOCATION.cities.map(city => (
                  <Link
                    key={city}
                    href={`/jobs?location=${encodeURIComponent(city)}`}
                    style={{ color: "#1a56db", fontSize: 14, lineHeight: "2.1", textDecoration: "none", display: "block" }}
                  >
                    Jobs in {city}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
