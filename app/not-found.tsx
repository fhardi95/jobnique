import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 20px", background: "#f9fafb" }}>
        <div style={{ textAlign: "center", maxWidth: 480 }}>
          <div style={{ fontFamily: "'DM Serif Display',serif", fontSize: 96, color: "#1a56db", lineHeight: 1, marginBottom: 8 }}>404</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12 }}>Page not found</h1>
          <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
            The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ background: "#1a56db", color: "#fff", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600 }}>
              ← Back to home
            </Link>
            <Link href="/jobs" style={{ background: "#fff", color: "#1a56db", padding: "12px 24px", borderRadius: 8, fontSize: 14, fontWeight: 600, border: "1.5px solid #1a56db" }}>
              Browse jobs
            </Link>
          </div>
          <div style={{ marginTop: 40, display: "flex", gap: 20, justifyContent: "center", flexWrap: "wrap" }}>
            {[["Career Advice","/career-advice"],["CV Templates","/cv-templates"],["Salaries","/salaries"],["Contact","/contact"]].map(([l,h]) => (
              <Link key={h} href={h} style={{ fontSize: 14, color: "#6b7280", borderBottom: "1px solid #e5e7eb", paddingBottom: 2 }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
