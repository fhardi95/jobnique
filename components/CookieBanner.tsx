"use client";
import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem("jobnique_cookies");
    if (!accepted) setVisible(true);
  }, []);
  const accept = () => { localStorage.setItem("jobnique_cookies", "accepted"); setVisible(false); };
  const decline = () => { localStorage.setItem("jobnique_cookies", "declined"); setVisible(false); };
  if (!visible) return null;
  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 9999, background: "#1f2937", color: "#fff", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, boxShadow: "0 -4px 24px rgba(0,0,0,0.18)" }}>
      <div style={{ flex: 1, minWidth: 280 }}>
        <p style={{ fontWeight: 600, marginBottom: 4, fontSize: 14 }}>🍪 We use cookies</p>
        <p style={{ fontSize: 13, color: "#d1d5db", lineHeight: 1.6 }}>
          We use cookies to personalise content, improve your experience, and analyse traffic. By clicking "Accept All", you consent to our use of cookies.{" "}
          <a href="/privacy" style={{ color: "#60a5fa", textDecoration: "underline" }}>Learn more</a>
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexShrink: 0 }}>
        <button onClick={decline} style={{ background: "transparent", border: "1.5px solid #6b7280", color: "#d1d5db", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13 }}>Decline</button>
        <button onClick={accept} style={{ background: "#1a56db", border: "none", color: "#fff", padding: "8px 18px", borderRadius: 6, cursor: "pointer", fontSize: 13, fontWeight: 500 }}>Accept All</button>
      </div>
    </div>
  );
}
