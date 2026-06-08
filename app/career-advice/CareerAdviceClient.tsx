"use client";
import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import CookieBanner from "@/components/CookieBanner";
import { getArticlesBySection, getFeaturedArticles, careerAdviceSubcategories, tagColors } from "@/lib/articles";

export default function CareerAdviceClient() {
  const [active, setActive] = useState("All");
  const all = getArticlesBySection("career-advice");
  const featured = getFeaturedArticles("career-advice");
  const filtered = active === "All" ? all : all.filter(a => a.subcategory === active);

  return (
    <>
      <Navbar />
      <CookieBanner />

      {/* Header */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "48px 20px 40px" }}>
        <div className="container">
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(32px,5vw,48px)", marginBottom: 12 }}>Career Advice</h1>
          <p style={{ color: "#6b7280", fontSize: 16, maxWidth: 520 }}>
            Expert guides to help you write better CVs, ace interviews, negotiate salaries, and advance your career.
          </p>
        </div>
      </div>

      {/* Category filter pills */}
      <div style={{ borderBottom: "1px solid #e5e7eb", background: "#fff" }}>
        <div className="container" style={{ display: "flex", gap: 8, flexWrap: "wrap", padding: "14px 20px" }}>
          {["All", ...careerAdviceSubcategories].map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              style={{ padding: "6px 18px", borderRadius: 20, border: active === cat ? "none" : "1px solid #e5e7eb", background: active === cat ? "#1a56db" : "#fff", color: active === cat ? "#fff" : "#374151", fontSize: 14, fontWeight: 500, cursor: "pointer" }}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div style={{ background: "#fff", minHeight: "60vh" }}>
        <div className="container" style={{ padding: "48px 20px" }}>

          {/* Featured — only show when not filtered */}
          {active === "All" && (
            <div style={{ marginBottom: 56 }}>
              <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>Featured guides</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
                {featured.map(a => {
                  const color = tagColors[a.subcategory];
                  return (
                    <Link key={a.slug} href={`/career-advice/${a.slug}`}
                      style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px", display: "block", color: "inherit", textDecoration: "none", transition: "box-shadow 0.15s" }}
                      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)")}
                      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}>
                      <span style={{ display: "inline-block", background: color?.bg, color: color?.text, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 20, marginBottom: 14 }}>{a.subcategory}</span>
                      <h3 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{a.title}</h3>
                      <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.7, marginBottom: 16 }}>{a.description}</p>
                      <span style={{ fontSize: 13, color: "#9ca3af", display: "flex", alignItems: "center", gap: 5 }}>⏱ {a.readTime} min read</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* All articles grid */}
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>{active === "All" ? "All articles" : active}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 14 }}>
              {filtered.map(a => {
                const color = tagColors[a.subcategory];
                return (
                  <Link key={a.slug} href={`/career-advice/${a.slug}`}
                    style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "18px 20px", display: "block", color: "inherit", textDecoration: "none" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                    onMouseLeave={e => (e.currentTarget.style.background = "#fff")}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <span style={{ background: color?.bg, color: color?.text, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20 }}>{a.subcategory}</span>
                      <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap", marginLeft: 8 }}>{a.readTime} min</span>
                    </div>
                    <h3 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: "#111827" }}>{a.title}</h3>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}
