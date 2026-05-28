import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import PaycheckCalculator from "./PaycheckCalculator";

export const metadata: Metadata = {
  title: "US Take-Home Pay Calculator 2024 – After-Tax Salary | Jobnique",
  description: "Calculate your exact take-home pay after federal tax, state tax, Social Security, Medicare and other deductions. Free US paycheck calculator for 2024.",
  keywords: "take home pay calculator, paycheck calculator, after tax salary calculator, net pay calculator USA, salary calculator 2024",
};

export default function PaycheckPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background: "linear-gradient(135deg,#1e3a8a 0%,#1a56db 100%)", padding: "48px 20px 40px", color: "#fff", textAlign: "center" }}>
        <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 16px", fontSize: 13, fontWeight: 500, marginBottom: 16 }}>
          🇺🇸 Updated for 2024 tax year
        </span>
        <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(28px,4vw,46px)", marginBottom: 12, lineHeight: 1.2 }}>
          US Take-Home Pay Calculator
        </h1>
        <p style={{ color: "#bfdbfe", fontSize: 16, maxWidth: 520, margin: "0 auto" }}>
          Find out exactly how much you take home after federal tax, state tax, Social Security and Medicare deductions.
        </p>
      </div>
      <div style={{ background: "#f9fafb", minHeight: "60vh", padding: "0 0 60px" }}>
        <PaycheckCalculator />
      </div>
      <Newsletter />
      <Footer />
    </>
  );
}
