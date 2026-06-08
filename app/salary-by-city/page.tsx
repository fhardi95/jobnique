import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import SalaryByCityClient from "./SalaryByCityClient";

export const metadata: Metadata = {
  title: "Salary by City 2026 – Compare Pay Across US Cities",
  description: "Compare average salaries for any job title across major US cities. See how San Francisco, New York, Austin, and other cities pay for your role.",
  keywords: "salary by city, salary comparison by location, average salary by city, cost of living salary calculator, US city salary comparison 2026",
  openGraph: {
    title: "Salary by City – Compare Pay Across US Cities",
    description: "See how your salary stacks up in different US cities with cost-of-living adjustments.",
    type: "website",
  },
};

export default function SalaryByCityPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "linear-gradient(135deg,#064e3b 0%,#065f46 60%,#059669 100%)", padding: "52px 20px 44px", color: "#fff", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          🏙️ Updated for 2026
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,48px)", marginBottom: 12, lineHeight: 1.2 }}>
          Salary by City
        </h1>
        <p style={{ color: "#a7f3d0", fontSize: 16, maxWidth: 560, margin: "0 auto" }}>
          Compare salaries for any job title across major US cities. See real pay data with cost-of-living adjustments so you can make informed career moves.
        </p>
      </div>
      <div style={{ background: "#f9fafb", minHeight: "60vh", padding: "0 0 60px" }}>
        <SalaryByCityClient />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
