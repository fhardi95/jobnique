"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle"|"loading"|"success"|"error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) { setStatus("success"); setEmail(""); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  return (
    <section style={{ background: "#1a56db", color: "#fff", padding: "64px 20px" }}>
      <div className="container" style={{ maxWidth: 640, textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "#bfdbfe", marginBottom: 12 }}>Stay ahead</p>
        <h2 style={{ fontSize: 32, fontWeight: 700, fontFamily: "'DM Serif Display',serif", marginBottom: 12 }}>Get the best jobs in your inbox</h2>
        <p style={{ color: "#bfdbfe", fontSize: 15, marginBottom: 32, lineHeight: 1.7 }}>
          Weekly job alerts, career tips, and salary insights — delivered straight to you. Join 50,000+ professionals.
        </p>
        {status === "success" ? (
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "20px 28px", fontSize: 15 }}>
            ✅ You're subscribed! Check your inbox for a confirmation email.
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: "flex", gap: 10, maxWidth: 480, margin: "0 auto", flexWrap: "wrap" }}>
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ flex: 1, minWidth: 220, background: "#fff", color: "#111", border: "none", borderRadius: 8, padding: "12px 16px", fontSize: 14 }}
            />
            <button type="submit" disabled={status === "loading"}
              style={{ background: "#f97316", color: "#fff", border: "none", borderRadius: 8, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer", whiteSpace: "nowrap" }}>
              {status === "loading" ? "Subscribing..." : "Subscribe Free"}
            </button>
          </form>
        )}
        {status === "error" && <p style={{ color: "#fca5a5", marginTop: 12, fontSize: 13 }}>Something went wrong. Please try again.</p>}
        <p style={{ color: "#93c5fd", fontSize: 12, marginTop: 16 }}>No spam, ever. Unsubscribe anytime.</p>
      </div>
    </section>
  );
}
