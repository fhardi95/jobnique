"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * /app/post-a-job/payment-success/page.tsx
 *
 * Stripe redirects here after a successful payment:
 *   /post-a-job/payment-success?session_id=cs_...
 *
 * The actual job activation is handled by the webhook — this page is purely
 * a thank-you screen.
 */

function PaymentSuccessContent() {
  const params    = useSearchParams();
  const sessionId = params.get("session_id") ?? "";
  const [dots, setDots] = useState(".");

  useEffect(() => {
    if (!sessionId) return;
    const id = setInterval(() => setDots(d => d.length >= 3 ? "." : d + "."), 500);
    return () => clearInterval(id);
  }, [sessionId]);

  return (
    <section style={{ padding: "80px 20px", background: "#f8faff", textAlign: "center", minHeight: "60vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: 520, margin: "0 auto" }}>

        <div style={{ fontSize: 72, marginBottom: 20 }}>🎉</div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(24px, 5vw, 36px)",
          fontWeight: 700,
          color: "#0f172a",
          marginBottom: 14,
          lineHeight: 1.2,
        }}>
          Payment confirmed!
        </h1>

        <p style={{ fontSize: 16, color: "#6b7280", lineHeight: 1.7, marginBottom: 10, maxWidth: 420, margin: "0 auto 10px" }}>
          Your <strong>Featured Listing</strong> payment was successful. Our team is reviewing your job posting and it will be live within a few hours.
        </p>

        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 36 }}>
          You&apos;ll receive a confirmation email once your listing is published.
        </p>

        {/* Status card */}
        <div style={{
          background: "#fff",
          border: "1px solid #e5e7eb",
          borderRadius: 14,
          padding: "20px 28px",
          marginBottom: 32,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#374151" }}>
            <span>Payment</span>
            <span style={{ color: "#16a34a", fontWeight: 600 }}>✓ Confirmed</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#374151" }}>
            <span>Listing review</span>
            <span style={{ color: "#f97316", fontWeight: 600 }}>In progress{dots}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, color: "#374151" }}>
            <span>Live on Jobnique</span>
            <span style={{ color: "#9ca3af" }}>Within a few hours</span>
          </div>
        </div>

        {sessionId && (
          <p style={{ fontSize: 11, color: "#9ca3af", marginBottom: 24 }}>
            Session: {sessionId}
          </p>
        )}

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/dashboard" style={{
            background: "#1a56db",
            color: "#fff",
            borderRadius: 8,
            padding: "12px 28px",
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
          }}>
            Go to dashboard
          </Link>
          <Link href="/jobs" style={{
            background: "#fff",
            color: "#374151",
            border: "1px solid #e5e7eb",
            borderRadius: 8,
            padding: "12px 24px",
            fontSize: 14,
            textDecoration: "none",
          }}>
            Browse jobs
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function PaymentSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <section style={{ padding: "80px 20px", textAlign: "center", minHeight: "60vh" }}>
          <p style={{ color: "#6b7280" }}>Loading…</p>
        </section>
      }>
        <PaymentSuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
