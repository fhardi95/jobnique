"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const navLinks = [
  { href: "/jobs",          label: "Find Jobs" },
  { href: "/career-advice", label: "Career Advice" },
  { href: "/salaries",      label: "Salaries" },
  { href: "/cv-templates",  label: "CV & Cover Letters" },
];

const toolsLinks = [
  { href: "/ai-cover-letter",           label: "AI Cover Letter",           icon: "✉️", desc: "Generate a tailored letter in seconds" },
  { href: "/resume-builder",            label: "Resume Builder",            icon: "📄", desc: "Build an ATS-friendly CV with AI" },
  { href: "/ats-resume-checker",        label: "ATS Resume Checker",        icon: "🔍", desc: "Score your CV against any job description" },
  { href: "/paycheck-calculator",       label: "Take-Home Pay Calculator",  icon: "💰", desc: "Calculate your after-tax salary" },
  { href: "/interview-question-generator", label: "Interview Question Generator", icon: "🎯", desc: "Prep with AI-generated interview questions" },
  { href: "/salary-by-city",            label: "Salary by City",            icon: "🏙️", desc: "Compare salaries across US cities" },
  { href: "/job-description-generator", label: "Job Description Generator", icon: "📝", desc: "Write compelling JDs in seconds" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [dropdownOpen, setDropdownOpen]     = useState(false);
  const [mobileOpen,   setMobileOpen]       = useState(false);
  const [toolsOpen,    setToolsOpen]        = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) setToolsOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const initials = session?.user?.name
    ? session.user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <>
      <nav style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", position: "sticky", top: 0, zIndex: 100 }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>

          {/* Logo */}
          <Link href="/" style={{ display: "flex", alignItems: "center" }}>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#1a56db" }}>Job</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#f97316" }}>nique</span>
          </Link>

          {/* Desktop nav links */}
          <div className="nav-links-desktop" style={{ display: "flex", gap: 24, alignItems: "center" }}>
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} style={{ fontSize: 14, fontWeight: 500, color: "#374151" }}>{l.label}</Link>
            ))}

            {/* Tools dropdown */}
            <div ref={toolsRef} style={{ position: "relative" }}>
              <button
                onClick={() => setToolsOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 14, fontWeight: 500, color: "#374151", background: "none", border: "none", cursor: "pointer", padding: 0, fontFamily: "'DM Sans', sans-serif" }}
              >
                Tools
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "#9ca3af", transform: toolsOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                  <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {toolsOpen && (
                <div style={{ position: "absolute", left: "50%", transform: "translateX(-50%)", top: "calc(100% + 12px)", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 32px rgba(0,0,0,0.12)", minWidth: 280, zIndex: 200, overflow: "hidden" }}>
                  <div style={{ padding: "8px 6px 6px", borderBottom: "1px solid #f3f4f6" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", padding: "2px 12px 6px" }}>Career Tools</div>
                    {toolsLinks.slice(0,3).map(t => (
                      <Link key={t.href} href={t.href} onClick={() => setToolsOpen(false)}
                        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 12px", borderRadius: 8, color: "#374151", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 1 }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{t.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div style={{ padding: "6px 6px 8px" }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.06em", padding: "6px 12px 6px" }}>Salary & JD Tools</div>
                    {toolsLinks.slice(3).map(t => (
                      <Link key={t.href} href={t.href} onClick={() => setToolsOpen(false)}
                        style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "9px 12px", borderRadius: 8, color: "#374151", textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{t.icon}</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", marginBottom: 1 }}>{t.label}</div>
                          <div style={{ fontSize: 11, color: "#6b7280" }}>{t.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <Link href="/post-a-job" className="post-job-btn"
              style={{ fontSize: 13, fontWeight: 600, color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, padding: "7px 14px", whiteSpace: "nowrap" }}>
              Recruiting? <span style={{ color: "#1a56db" }}>Post a job</span>
            </Link>

            <div className="nav-auth-desktop" style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {status === "loading" && <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#f3f4f6" }} />}
              {status === "unauthenticated" && (
                <>
                  <Link href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#374151", padding: "8px 14px" }}>Sign in</Link>
                  <Link href="/register" style={{ background: "#1a56db", color: "#fff", padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>Get started</Link>
                </>
              )}
              {status === "authenticated" && session?.user && (
                <div ref={dropdownRef} style={{ position: "relative" }}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "1.5px solid #e5e7eb", borderRadius: 40, padding: "5px 12px 5px 5px", cursor: "pointer" }}
                  >
                    {session.user.image ? (
                      <img src={session.user.image} alt={session.user.name || "User"} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#1a56db", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600 }}>{initials}</div>
                    )}
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#374151", maxWidth: 100, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {session.user.name?.split(" ")[0] || "Account"}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "#9ca3af", transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}>
                      <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {dropdownOpen && (
                    <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.10)", minWidth: 220, zIndex: 200, overflow: "hidden" }}>
                      <div style={{ padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: "#111827", marginBottom: 2 }}>{session.user.name || "User"}</div>
                        <div style={{ fontSize: 12, color: "#6b7280" }}>{session.user.email}</div>
                      </div>
                      {[
                        { href: "/dashboard",  icon: "⊞", label: "Dashboard" },
                        { href: "/saved-jobs", icon: "♡", label: "Saved jobs" },
                        { href: "/profile",    icon: "◎", label: "My profile" },
                        { href: "/settings",   icon: "⚙", label: "Settings" },
                      ].map(item => (
                        <Link key={item.href} href={item.href} onClick={() => setDropdownOpen(false)}
                          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}
                          onMouseEnter={e => (e.currentTarget.style.background = "#f9fafb")}
                          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                        >
                          <span style={{ fontSize: 16 }}>{item.icon}</span>{item.label}
                        </Link>
                      ))}
                      <button
                        onClick={() => { signOut({ callbackUrl: "/" }); setDropdownOpen(false); }}
                        style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", fontSize: 14, color: "#dc2626", width: "100%", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                      >
                        <span style={{ fontSize: 16 }}>→</span>Sign out
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <button className="hamburger-btn" onClick={() => setMobileOpen(true)} aria-label="Open menu"
              style={{ display: "none", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 5, width: 40, height: 40, background: "none", border: "1px solid #e5e7eb", borderRadius: 8, cursor: "pointer", padding: 0 }}>
              <span style={{ display: "block", width: 18, height: 2, background: "#374151", borderRadius: 2 }} />
              <span style={{ display: "block", width: 18, height: 2, background: "#374151", borderRadius: 2 }} />
              <span style={{ display: "block", width: 18, height: 2, background: "#374151", borderRadius: 2 }} />
            </button>
          </div>
        </div>

        <style>{`
          @media(max-width:768px){
            .nav-links-desktop { display: none !important; }
            .nav-auth-desktop  { display: none !important; }
            .hamburger-btn     { display: flex !important; }
            .post-job-btn      { display: none !important; }
          }
          @keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }
          @keyframes fadeIn  { from { opacity: 0; } to { opacity: 1; } }
        `}</style>
      </nav>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div onClick={() => setMobileOpen(false)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, animation: "fadeIn 0.2s ease" }} />
          <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: "80%", maxWidth: 320, background: "#fff", zIndex: 201, display: "flex", flexDirection: "column", animation: "slideIn 0.25s ease", boxShadow: "-4px 0 24px rgba(0,0,0,0.12)" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 64, borderBottom: "1px solid #f3f4f6" }}>
              <Link href="/" onClick={() => setMobileOpen(false)} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#1a56db" }}>Job</span>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#f97316" }}>nique</span>
              </Link>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu"
                style={{ width: 36, height: 36, borderRadius: 8, background: "#f3f4f6", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M1 1l12 12M13 1L1 13" stroke="#374151" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
              {navLinks.map(l => (
                <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                  style={{ display: "flex", alignItems: "center", padding: "13px 24px", fontSize: 15, fontWeight: 500, color: "#111827", borderBottom: "1px solid #f9fafb" }}>
                  {l.label}
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto", color: "#9ca3af" }}>
                    <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              ))}

              <button onClick={() => setMobileToolsOpen(o => !o)}
                style={{ display: "flex", alignItems: "center", width: "100%", padding: "13px 24px", fontSize: 15, fontWeight: 500, color: "#111827", background: "none", border: "none", borderBottom: "1px solid #f9fafb", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", textAlign: "left" }}>
                Tools
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto", color: "#9ca3af", transform: mobileToolsOpen ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {mobileToolsOpen && (
                <div style={{ background: "#f9fafb", borderBottom: "1px solid #f3f4f6" }}>
                  {toolsLinks.map(t => (
                    <Link key={t.href} href={t.href}
                      onClick={() => { setMobileOpen(false); setMobileToolsOpen(false); }}
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 24px 11px 32px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f3f4f6", textDecoration: "none" }}>
                      <span style={{ fontSize: 18 }}>{t.icon}</span>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#111827" }}>{t.label}</div>
                        <div style={{ fontSize: 11, color: "#6b7280" }}>{t.desc}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              <Link href="/post-a-job" onClick={() => setMobileOpen(false)}
                style={{ display: "flex", alignItems: "center", padding: "13px 24px", fontSize: 15, fontWeight: 600, color: "#1a56db", borderBottom: "1px solid #f9fafb" }}>
                Recruiting? Post a job
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginLeft: "auto", color: "#9ca3af" }}>
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>

            <div style={{ padding: "16px 20px", borderTop: "1px solid #f3f4f6" }}>
              {status === "unauthenticated" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <Link href="/login" onClick={() => setMobileOpen(false)}
                    style={{ textAlign: "center", padding: "11px", fontSize: 14, fontWeight: 500, color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8 }}>Sign in</Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}
                    style={{ textAlign: "center", padding: "11px", fontSize: 14, fontWeight: 600, color: "#fff", background: "#1a56db", borderRadius: 8 }}>Get started</Link>
                </div>
              )}
              {status === "authenticated" && session?.user && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                    {session.user.image ? (
                      <img src={session.user.image} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#1a56db", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600 }}>{initials}</div>
                    )}
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#111827" }}>{session.user.name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280" }}>{session.user.email}</div>
                    </div>
                  </div>
                  {[
                    { href: "/dashboard",  label: "Dashboard" },
                    { href: "/saved-jobs", label: "Saved jobs" },
                    { href: "/profile",    label: "My profile" },
                    { href: "/settings",   label: "Settings" },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                      style={{ display: "block", padding: "9px 0", fontSize: 14, color: "#374151", borderBottom: "1px solid #f9fafb" }}>
                      {item.label}
                    </Link>
                  ))}
                  <button
                    onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                    style={{ marginTop: 12, width: "100%", padding: "11px", fontSize: 14, fontWeight: 500, color: "#dc2626", background: "#fef2f2", border: "none", borderRadius: 8, cursor: "pointer" }}>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
