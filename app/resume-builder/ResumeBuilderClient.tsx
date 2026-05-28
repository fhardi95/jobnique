"use client";
import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import { TEMPLATES } from "@/lib/resume/templates";
import type { ResumeTemplate } from "@/types/resume";

const CATEGORIES = ["All", "Professional", "Modern", "Minimal", "Creative", "Executive", "ATS-Friendly"] as const;
type Category = (typeof CATEGORIES)[number];

const TRUSTED_COMPANIES = [
  { name: "Google",    icon: "🔵" },
  { name: "Amazon",    icon: "🟠" },
  { name: "Microsoft", icon: "🟦" },
  { name: "Meta",      icon: "🔷" },
  { name: "Apple",     icon: "⬛" },
  { name: "Netflix",   icon: "🔴" },
  { name: "Spotify",   icon: "🟢" },
  { name: "Deloitte",  icon: "🟩" },
];

// ─── Mini resume card preview ─────────────────────────────────────────────────
function MiniResumeCard({ accent, lines }: { accent: string; lines: number[] }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 6,
      padding: "10px 10px 8px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
      width: 90,
      flexShrink: 0,
    }}>
      <div style={{ width: 32, height: 4, background: accent, borderRadius: 2, marginBottom: 6 }} />
      <div style={{ width: 50, height: 3, background: "#e5e7eb", borderRadius: 2, marginBottom: 8 }} />
      {lines.map((w, i) => (
        <div key={i} style={{
          width: `${w}%`, height: 2.5,
          background: i % 5 === 0 ? accent : "#e5e7eb",
          borderRadius: 2, marginBottom: 3,
          opacity: i % 5 === 0 ? 0.8 : 0.5,
        }} />
      ))}
    </div>
  );
}

// ─── Template card ────────────────────────────────────────────────────────────
function TemplateCard({ tpl, onSelect }: { tpl: ResumeTemplate; onSelect: (id: string) => void }) {
  const [hovered, setHovered] = useState(false);
  const accent = tpl.colors[0];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: `1.5px solid ${hovered ? accent : "#e5e7eb"}`,
        borderRadius: 16,
        overflow: "hidden",
        transition: "all 0.22s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? `0 12px 36px ${accent}28` : "0 2px 8px rgba(0,0,0,0.06)",
        cursor: "pointer",
      }}
    >
      {/* Preview area */}
      <div style={{
        height: 200,
        background: `linear-gradient(135deg, ${accent}12 0%, ${tpl.colors[2] || "#f8faff"}80 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        borderBottom: "1px solid #f0f0f0",
        overflow: "hidden",
      }}>
        {/* Simulated resume preview */}
        <div style={{
          background: "#fff",
          borderRadius: 8,
          padding: "12px 14px",
          width: 120,
          boxShadow: "0 4px 20px rgba(0,0,0,0.14)",
          transform: hovered ? "scale(1.04) rotate(-1deg)" : "scale(1) rotate(-2deg)",
          transition: "transform 0.22s ease",
        }}>
          <div style={{ width: 36, height: 5, background: accent, borderRadius: 3, marginBottom: 5 }} />
          <div style={{ width: 60, height: 3, background: "#d1d5db", borderRadius: 2, marginBottom: 10 }} />
          {[90, 70, 80, 60, 75, 55, 85, 65, 50, 78, 62].map((w, i) => (
            <div key={i} style={{
              width: `${w}%`, height: 2.5,
              background: i === 3 || i === 7 ? accent : "#e5e7eb",
              borderRadius: 2, marginBottom: 3.5,
              opacity: i === 3 || i === 7 ? 0.7 : 0.45,
            }} />
          ))}
        </div>

        {/* ATS score badge */}
        <div style={{
          position: "absolute", top: 10, right: 10,
          background: tpl.atsScore >= 95 ? "#dcfce7" : tpl.atsScore >= 85 ? "#fef9c3" : "#fff3ed",
          color: tpl.atsScore >= 95 ? "#16a34a" : tpl.atsScore >= 85 ? "#ca8a04" : "#ea580c",
          fontSize: 11, fontWeight: 700,
          padding: "3px 8px", borderRadius: 20,
          border: `1px solid ${tpl.atsScore >= 95 ? "#bbf7d0" : tpl.atsScore >= 85 ? "#fde68a" : "#fed7aa"}`,
        }}>
          ATS {tpl.atsScore}%
        </div>

        {tpl.popular && (
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "#1a56db", color: "#fff",
            fontSize: 10, fontWeight: 700,
            padding: "3px 8px", borderRadius: 20,
          }}>
            ⭐ Popular
          </div>
        )}
      </div>

      {/* Card body */}
      <div style={{ padding: "14px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827" }}>{tpl.name}</h3>
          <span style={{
            background: `${accent}18`, color: accent,
            fontSize: 11, fontWeight: 600,
            padding: "2px 8px", borderRadius: 12,
          }}>
            {tpl.category}
          </span>
        </div>
        <p style={{ fontSize: 12.5, color: "#6b7280", lineHeight: 1.5, marginBottom: 14 }}>
          {tpl.description}
        </p>
        <button
          onClick={() => onSelect(tpl.id)}
          style={{
            width: "100%",
            background: hovered ? accent : "#f3f4f6",
            color: hovered ? "#fff" : "#374151",
            border: "none", borderRadius: 8,
            padding: "9px 0", fontSize: 13, fontWeight: 600,
            cursor: "pointer", transition: "all 0.18s ease",
          }}
        >
          {hovered ? "Use This Template →" : "Use Template"}
        </button>
      </div>
    </div>
  );
}

// ─── Upload zone ──────────────────────────────────────────────────────────────
function UploadZone({ onFile }: { onFile: (f: File) => void }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx"))) {
      onFile(file);
    }
  }, [onFile]);

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      style={{
        border: `2px dashed ${dragging ? "#1a56db" : "#d1d5db"}`,
        borderRadius: 16,
        padding: "40px 24px",
        textAlign: "center",
        background: dragging ? "#eff6ff" : "#f9fafb",
        cursor: "pointer",
        transition: "all 0.18s ease",
        transform: dragging ? "scale(1.01)" : "none",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        style={{ display: "none" }}
        onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
      />
      <div style={{ fontSize: 40, marginBottom: 12 }}>
        {dragging ? "⬇️" : "📄"}
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#111827", marginBottom: 6 }}>
        {dragging ? "Drop to upload" : "Drag & drop your CV here"}
      </div>
      <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 16 }}>
        Supports PDF and Word (.docx) — we'll parse it automatically
      </div>
      <span style={{
        display: "inline-block",
        background: "#1a56db", color: "#fff",
        padding: "10px 24px", borderRadius: 8,
        fontSize: 13, fontWeight: 600,
      }}>
        Browse files
      </span>
    </div>
  );
}

// ─── Upload progress modal ────────────────────────────────────────────────────
function UploadModal({ file, onDone }: { file: File; onDone: () => void }) {
  const [step, setStep] = useState(0);
  const steps = [
    { label: "Reading your file…",            icon: "📤" },
    { label: "Detecting sections…",           icon: "🔍" },
    { label: "Extracting contact info…",      icon: "👤" },
    { label: "Parsing work experience…",      icon: "💼" },
    { label: "Identifying skills…",           icon: "⚡" },
    { label: "AI optimising content…",        icon: "🤖" },
    { label: "Building your resume draft…",   icon: "✨" },
  ];

  // Simulate parsing steps
  useState(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setStep(i);
      if (i >= steps.length - 1) {
        clearInterval(interval);
        setTimeout(onDone, 800);
      }
    }, 600);
  });

  const progress = Math.round((step / (steps.length - 1)) * 100);

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "rgba(0,0,0,0.5)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000,
    }}>
      <div style={{
        background: "#fff", borderRadius: 20,
        padding: "40px 36px",
        width: "min(480px, 90vw)",
        textAlign: "center",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 16, animation: "pulse 1s infinite" }}>
          {steps[step]?.icon}
        </div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6, color: "#111827" }}>
          Parsing your CV
        </h3>
        <p style={{ fontSize: 14, color: "#6b7280", marginBottom: 24 }}>
          {file.name}
        </p>

        {/* Progress bar */}
        <div style={{ background: "#f3f4f6", borderRadius: 100, height: 8, marginBottom: 12, overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #1a56db, #3b82f6)",
            borderRadius: 100,
            transition: "width 0.5s ease",
          }} />
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
          {steps[step]?.label}
        </p>
        <p style={{ fontSize: 12, color: "#9ca3af" }}>{progress}% complete</p>
      </div>

      <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }`}</style>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function ResumeBuilderClient() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDone, setUploadDone] = useState(false);
  const [showUploadSection, setShowUploadSection] = useState(false);

  const filtered = TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSelectTemplate = (id: string) => {
    window.location.href = `/resume-builder/builder?template=${id}`;
  };

  const handleUploadFile = (f: File) => {
    setUploadFile(f);
    setUploadDone(false);
  };

  const handleUploadDone = () => {
    setUploadFile(null);
    setUploadDone(true);
    window.location.href = `/resume-builder/builder?source=upload`;
  };

  return (
    <>
      <Navbar />
      <CookieBanner />

      {uploadFile && !uploadDone && (
        <UploadModal file={uploadFile} onDone={handleUploadDone} />
      )}

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #1a56db 100%)",
        padding: "72px 20px 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", inset: 0, opacity: 0.06,
          backgroundImage: "radial-gradient(circle at 20% 50%, #fff 1px, transparent 1px), radial-gradient(circle at 80% 20%, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }} />

        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 40, alignItems: "center" }}>
            {/* Left copy */}
            <div style={{ maxWidth: 600 }}>
              {/* Badges */}
              <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
                {[
                  { label: "✓ ATS-Friendly", bg: "#dcfce7", color: "#16a34a" },
                  { label: "🤖 AI-Powered",  bg: "#ede9fe", color: "#7c3aed" },
                  { label: "⚡ Free to use", bg: "#fff7ed", color: "#ea580c" },
                ].map((b) => (
                  <span key={b.label} style={{
                    background: b.bg, color: b.color,
                    padding: "4px 12px", borderRadius: 20,
                    fontSize: 12, fontWeight: 700,
                  }}>
                    {b.label}
                  </span>
                ))}
              </div>

              <h1 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(32px, 5vw, 56px)",
                color: "#fff",
                lineHeight: 1.12,
                marginBottom: 20,
                letterSpacing: "-0.5px",
              }}>
                Build a Resume<br />
                <span style={{ color: "#f97316" }}>That Gets You Hired</span>
              </h1>

              <p style={{
                color: "#93c5fd", fontSize: "clamp(14px, 2vw, 17px)",
                lineHeight: 1.65, marginBottom: 36, maxWidth: 500,
              }}>
                Create from scratch, choose a professional template, or upload your existing CV.
                AI-powered suggestions help you stand out from the crowd.
              </p>

              {/* CTAs */}
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/resume-builder/builder" style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#f97316", color: "#fff",
                  padding: "14px 28px", borderRadius: 10,
                  fontSize: 15, fontWeight: 700, textDecoration: "none",
                  boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
                  transition: "all 0.18s",
                }}>
                  ✏️ Create My Resume
                </Link>
                <button
                  onClick={() => setShowUploadSection(true)}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "rgba(255,255,255,0.1)", color: "#fff",
                    border: "1.5px solid rgba(255,255,255,0.25)",
                    padding: "14px 28px", borderRadius: 10,
                    fontSize: 15, fontWeight: 700, cursor: "pointer",
                    backdropFilter: "blur(4px)",
                    transition: "all 0.18s",
                  }}
                >
                  📤 Upload Resume
                </button>
              </div>

              {/* Social proof */}
              <div style={{ marginTop: 32, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ display: "flex" }}>
                  {["🟦", "🟩", "🟧", "🟥", "🟪"].map((e, i) => (
                    <div key={i} style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "#1e3a8a", border: "2px solid #1a56db",
                      marginLeft: i ? -10 : 0,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 14,
                    }}>{e}</div>
                  ))}
                </div>
                <div style={{ color: "#93c5fd", fontSize: 13 }}>
                  <strong style={{ color: "#fff" }}>500,000+</strong> professionals trust Jobnique
                </div>
              </div>
            </div>

            {/* Right — animated resume cards (desktop only) */}
            <div style={{
              display: "flex",
              gap: 10,
              alignItems: "flex-end",
              opacity: 0.9,
            }} className="hero-cards">
              <div style={{ display: "flex", flexDirection: "column", gap: 10, transform: "translateY(16px)" }}>
                <MiniResumeCard accent="#1a56db" lines={[90,70,80,60,75,55,85,65,50,78,62,40,88]} />
                <MiniResumeCard accent="#059669" lines={[80,60,90,50,70,85,45,75,60,80,55,65,70]} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <MiniResumeCard accent="#f97316" lines={[75,90,55,80,65,70,85,50,78,62,80,68,72]} />
                <MiniResumeCard accent="#7c3aed" lines={[65,80,70,90,50,75,60,85,45,78,55,70,80]} />
              </div>
            </div>
          </div>

          {/* Trusted by row */}
          <div style={{
            marginTop: 48,
            paddingTop: 28,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}>
            <p style={{ color: "#64748b", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 16 }}>
              Our users get hired at
            </p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              {TRUSTED_COMPANIES.map((c) => (
                <div key={c.name} style={{
                  display: "flex", alignItems: "center", gap: 6,
                  color: "rgba(255,255,255,0.5)", fontSize: 14, fontWeight: 600,
                }}>
                  <span>{c.icon}</span>
                  {c.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────────────────── */}
      <section style={{ background: "#f0f7ff", borderBottom: "1px solid #dbeafe", padding: "20px" }}>
        <div className="container">
          <div style={{ display: "flex", gap: 0, flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { n: "1", text: "Choose a template",        icon: "🎨" },
              { n: "2", text: "Fill in your details",     icon: "✏️" },
              { n: "3", text: "AI optimises your content",icon: "🤖" },
              { n: "4", text: "Download & apply",         icon: "📥" },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", fontSize: 13.5, color: "#1e3a8a", fontWeight: 500 }}>
                  <span style={{
                    background: "#1a56db", color: "#fff",
                    width: 24, height: 24, borderRadius: "50%",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>{s.n}</span>
                  <span>{s.icon}</span>
                  {s.text}
                </div>
                {i < 3 && (
                  <span style={{ color: "#93c5fd", fontSize: 18, padding: "0 4px" }}>›</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upload section (shown when Upload CTA clicked) ────────────────────── */}
      {showUploadSection && (
        <section id="upload" style={{ padding: "64px 20px", background: "#fff", borderBottom: "1px solid #f0f0f0" }}>
          <div className="container" style={{ maxWidth: 680 }}>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span style={{
                background: "#eff6ff", color: "#1a56db",
                padding: "4px 14px", borderRadius: 20,
                fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 12,
              }}>Upload & Parse</span>
              <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(24px,3vw,36px)", color: "#111827", marginBottom: 12 }}>
                Upload Your Existing CV
              </h2>
              <p style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.6 }}>
                We'll automatically extract your information — name, experience, education, skills — and load it into the editor ready to customise.
              </p>
            </div>

            <UploadZone onFile={handleUploadFile} />

            {/* What we extract */}
            <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10 }}>
              {[
                ["👤", "Contact info"],
                ["💼", "Work experience"],
                ["🎓", "Education"],
                ["⚡", "Skills"],
                ["📜", "Certifications"],
                ["🔗", "Links"],
              ].map(([icon, label]) => (
                <div key={label} style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "#f9fafb", borderRadius: 8, padding: "10px 12px",
                  fontSize: 13, color: "#374151", fontWeight: 500,
                }}>
                  <span>{icon}</span>{label}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Template gallery ──────────────────────────────────────────────────── */}
      <section style={{ padding: "72px 20px", background: "#fff" }}>
        <div className="container">
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <span style={{
              background: "#eff6ff", color: "#1a56db",
              padding: "4px 14px", borderRadius: 20,
              fontSize: 12, fontWeight: 700, display: "inline-block", marginBottom: 12,
            }}>8 Templates</span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 3.5vw, 40px)",
              color: "#111827", marginBottom: 12,
            }}>
              Choose Your Template
            </h2>
            <p style={{ color: "#6b7280", fontSize: 15, maxWidth: 500, margin: "0 auto" }}>
              Every template is ATS-tested and recruiter-approved. Switch at any time without losing your content.
            </p>
          </div>

          {/* Search + filters */}
          <div style={{
            display: "flex", gap: 12, flexWrap: "wrap",
            alignItems: "center", justifyContent: "space-between",
            marginBottom: 28,
          }}>
            {/* Category tabs */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 14px", borderRadius: 20,
                    border: activeCategory === cat ? "none" : "1.5px solid #e5e7eb",
                    background: activeCategory === cat ? "#1a56db" : "#fff",
                    color: activeCategory === cat ? "#fff" : "#374151",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div style={{ position: "relative", minWidth: 200 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontSize: 14 }}>🔍</span>
              <input
                type="text"
                placeholder="Search templates…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  border: "1.5px solid #e5e7eb", borderRadius: 8,
                  padding: "8px 14px 8px 34px", fontSize: 13,
                  outline: "none", width: "100%", background: "#fff",
                }}
              />
            </div>
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 20,
            }}>
              {filtered.map((tpl) => (
                <TemplateCard key={tpl.id} tpl={tpl} onSelect={handleSelectTemplate} />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#6b7280" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <p style={{ fontSize: 15 }}>No templates match &ldquo;{search}&rdquo;</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────────────── */}
      <section style={{ background: "#f9fafb", borderTop: "1px solid #f0f0f0", padding: "60px 20px" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(24px,3vw,36px)", color: "#111827", marginBottom: 8 }}>
              Everything you need to land the job
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 }}>
            {[
              { icon: "🤖", title: "AI-Powered Writing", desc: "Improve bullet points, rewrite your summary, and tailor content to job descriptions automatically." },
              { icon: "🎯", title: "ATS Optimised",       desc: "Every template scores 78-99% on ATS scanners. We test against real recruiting software." },
              { icon: "⚡", title: "Live Preview",        desc: "See every change reflected instantly. No waiting, no refreshing." },
              { icon: "🔄", title: "Instant Switching",   desc: "Switch between templates in one click. Your content moves with you, perfectly formatted." },
              { icon: "📥", title: "PDF Export",          desc: "Download a pixel-perfect, A4-ready PDF. Print-optimised and recruiter-ready." },
              { icon: "💾", title: "Multiple Versions",   desc: "Save different versions tailored to different roles. Keep everything in one place." },
            ].map((f) => (
              <div key={f.title} style={{
                background: "#fff",
                borderRadius: 14,
                padding: "22px 20px",
                border: "1px solid #e5e7eb",
              }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────────────── */}
      <section style={{
        background: "linear-gradient(135deg, #1a56db 0%, #0f172a 100%)",
        padding: "64px 20px",
        textAlign: "center",
      }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🚀</div>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(26px, 3.5vw, 42px)",
            color: "#fff", marginBottom: 14,
          }}>
            Your next job starts here
          </h2>
          <p style={{ color: "#93c5fd", fontSize: 16, lineHeight: 1.65, marginBottom: 36 }}>
            Join 500,000+ professionals who built their resume with Jobnique and landed interviews at their dream companies.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/resume-builder/builder" style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#f97316", color: "#fff",
              padding: "14px 32px", borderRadius: 10,
              fontSize: 15, fontWeight: 700, textDecoration: "none",
              boxShadow: "0 4px 20px rgba(249,115,22,0.4)",
            }}>
              ✏️ Start Building — It&apos;s Free
            </Link>
            <button
              onClick={() => { setShowUploadSection(true); window.scrollTo({ top: 600, behavior: "smooth" }); }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "rgba(255,255,255,0.1)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.25)",
                padding: "14px 28px", borderRadius: 10,
                fontSize: 15, fontWeight: 700, cursor: "pointer",
              }}
            >
              📤 Upload Existing CV
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-cards { display: none !important; }
        }
      `}</style>

      <Footer />
    </>
  );
}
