"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Only allow relative paths as callback URLs (prevent open-redirect)
    const rawCallback = new URLSearchParams(window.location.search).get("callbackUrl") || "/";
    const safeCallback = rawCallback.startsWith("/") && !rawCallback.startsWith("//") ? rawCallback : "/";
    const res = await signIn("credentials", {
      email, password, redirect: false, callbackUrl: safeCallback,
    });
    if (res?.error) setError("Invalid email or password. Please try again.");
    else if (res?.url) window.location.href = res.url;
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: "100vh", background: "#f9fafb", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
              <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: "#1a56db" }}>Job</span>
              <span style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, color: "#f97316" }}>nique</span>
            </Link>
            <h1 style={{ fontSize: 22, fontWeight: 600, marginTop: 16, marginBottom: 6 }}>Welcome back</h1>
            <p style={{ color: "#6b7280", fontSize: 14 }}>Sign in to your Jobnique account</p>
          </div>

          {/* Card */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "32px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Anti-phishing notice */}
            <div style={{ background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 8, padding: "10px 14px", marginBottom: 20, fontSize: 12, color: "#7c2d12", lineHeight: 1.6 }}>
              🛡️ <strong>Security reminder:</strong> Jobnique will never ask for your password by email or phone. Always check you're on <strong>jobnique.com</strong> before signing in.
            </div>

            {/* Social buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
              <button
                onClick={() => signIn("google", { callbackUrl: "/" })}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "11px 16px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#374151", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                onMouseLeave={e => (e.currentTarget.style.background = "#fff")}
              >
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>

              <button
                onClick={() => signIn("apple", { callbackUrl: "/" })}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%", padding: "11px 16px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#000", cursor: "pointer", fontSize: 14, fontWeight: 500, color: "#fff", transition: "background 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1a1a1a")}
                onMouseLeave={e => (e.currentTarget.style.background = "#000")}
              >
                <svg width="18" height="22" viewBox="0 0 814 1000" fill="white"><path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76 0-103.7 40.8-165.9 40.8s-105-57.8-155.5-127.4C46 790.7 0 663.4 0 541.8 0 275.2 178.1 135 352 135c81.9 0 150.7 54.4 202 54.4 48.2 0 125.5-57.6 216.6-57.6 34.7 0 161.2 3.2 243.6 120z"/><path d="M540.1 68.5c30.7-37 52.3-88.5 52.3-140.1 0-7.1-.6-14.3-1.9-20.1C543 24 467.1 79.3 430.3 124.9c-28.3 33.3-54.5 84.8-54.5 137.2 0 7.7 1.3 15.4 1.9 17.9 3.2.6 8.4 1.3 13.6 1.3 45.5 0 116.9-29.4 148.8-72.8z"/></svg>
                Continue with Apple
              </button>
            </div>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 13, color: "#9ca3af" }}>or sign in with email</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            {/* Email/password form */}
            <form onSubmit={handleCredentials} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {error && (
                <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#dc2626" }}>
                  {error}
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, marginBottom: 6, color: "#374151" }}>Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14 }} />
              </div>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>Password</label>
                  <Link href="/forgot-password" style={{ fontSize: 13, color: "#1a56db" }}>Forgot password?</Link>
                </div>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••"
                  style={{ width: "100%", border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "10px 14px", fontSize: 14 }} />
              </div>
              <button type="submit" disabled={loading}
                style={{ background: "#1a56db", color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 15, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}>
                {loading ? "Signing in…" : "Sign in"}
              </button>
            </form>
          </div>

          <p style={{ textAlign: "center", marginTop: 20, fontSize: 14, color: "#6b7280" }}>
            Don't have an account?{" "}
            <Link href="/register" style={{ color: "#1a56db", fontWeight: 600 }}>Create one free →</Link>
          </p>
        </div>
      </div>
    </>
  );
}
