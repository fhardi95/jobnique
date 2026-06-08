"use client";
import { useState } from "react";

interface ATSResult {
  score: number;
  matchedKeywords: string[];
  missingKeywords: string[];
  suggestions: string[];
  sectionFeedback: { section: string; status: "good" | "warning" | "missing"; message: string }[];
}

function analyzeATS(resume: string, jobDesc: string): ATSResult {
  const resumeLower = resume.toLowerCase();
  const jobLower = jobDesc.toLowerCase();

  // Extract keywords from job description
  const stopWords = new Set(["the","a","an","and","or","but","in","on","at","to","for","of","with","by","from","as","is","are","was","were","be","been","have","has","had","do","does","did","will","would","could","should","may","might","shall","can","this","that","these","those","we","our","you","your","they","their","it","its","i","me","my","we","us"]);
  const jobWords = jobLower.match(/\b[a-z][a-z0-9+#.-]{2,}\b/g) || [];
  const jobKeywords = [...new Set(jobWords.filter(w => !stopWords.has(w) && w.length > 3))];

  const matched: string[] = [];
  const missing: string[] = [];

  jobKeywords.slice(0, 40).forEach(kw => {
    if (resumeLower.includes(kw)) matched.push(kw);
    else missing.push(kw);
  });

  const score = Math.round((matched.length / Math.max(matched.length + missing.length, 1)) * 100);

  // Section detection
  const sections = [
    { name: "Contact Info",  patterns: ["email","phone","linkedin","github","@"],         required: true },
    { name: "Work Experience", patterns: ["experience","employment","work history","role","position","job"], required: true },
    { name: "Education",    patterns: ["education","university","college","degree","bachelor","master","phd"], required: true },
    { name: "Skills",       patterns: ["skills","technologies","tools","proficiencies","expertise"], required: true },
    { name: "Summary/Objective", patterns: ["summary","objective","profile","about me"],  required: false },
    { name: "Achievements", patterns: ["achievement","award","accomplishment","recognition","honor"], required: false },
  ];

  const sectionFeedback = sections.map(s => {
    const found = s.patterns.some(p => resumeLower.includes(p));
    return {
      section: s.name,
      status: (found ? "good" : s.required ? "missing" : "warning") as "good" | "warning" | "missing",
      message: found
        ? `${s.name} section detected`
        : s.required
          ? `${s.name} section not found — this is required by most ATS`
          : `${s.name} section missing — recommended but optional`,
    };
  });

  const suggestions: string[] = [];
  if (score < 50) suggestions.push("Your keyword match is low. Mirror the exact language from the job description.");
  if (score < 70) suggestions.push(`Add these missing keywords naturally: ${missing.slice(0,5).join(", ")}.`);
  if (!resumeLower.includes("quantif") && !resumeLower.match(/\d+%|\$\d+|\d+ (years|months|people|team)/)) {
    suggestions.push("Add quantified achievements (e.g. 'grew revenue by 30%', 'managed 8-person team').");
  }
  if (resume.length < 400) suggestions.push("Your resume seems short. Aim for at least 400–600 words for a full-time role.");
  if (resume.includes("objective") && !resume.includes("summary")) {
    suggestions.push("Replace 'Objective' with a 'Professional Summary' — it performs better with ATS.");
  }
  suggestions.push("Use standard section headings (Experience, Education, Skills) — avoid creative headings.");
  suggestions.push("Save as a .docx or plain PDF — avoid headers, footers, and tables when applying via ATS portals.");

  return { score, matchedKeywords: matched.slice(0, 20), missingKeywords: missing.slice(0, 20), suggestions, sectionFeedback };
}

const faqs = [
  { q: "What is an ATS and why does it matter?", a: "An Applicant Tracking System (ATS) is software used by 99% of Fortune 500 companies and most mid-size businesses to filter incoming resumes. Before a human ever sees your CV, the ATS scans it for keywords matching the job description. If your score is too low, your resume is automatically rejected." },
  { q: "What is a good ATS score?", a: "A score of 70%+ is considered strong and means your resume is well-matched to the job. 50–70% is moderate — worth improving before applying. Below 50% means significant keyword gaps that will likely cause an ATS to filter you out." },
  { q: "How do I make my resume more ATS-friendly?", a: "Use standard section headings (Experience, Education, Skills). Mirror keywords from the job description. Avoid graphics, tables, headers, and footers. Save as .docx or a plain PDF. Use standard fonts like Arial, Calibri, or Garamond." },
  { q: "Should I stuff keywords into my resume?", a: "No — keyword stuffing is detectable and looks unnatural to human reviewers after ATS. Instead, naturally weave in relevant keywords where they genuinely describe your experience." },
  { q: "Does this tool store my resume data?", a: "No. All analysis happens locally in your browser. We never store or transmit your resume or job description text." },
  { q: "How often should I update my resume for each application?", a: "Ideally, tailor your resume for every application. At minimum, adjust your Professional Summary and Skills section to match the specific job's language and requirements." },
];

export default function ATSCheckerClient() {
  const [resume, setResume] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleCheck() {
    if (!resume.trim() || !jobDesc.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setResult(analyzeATS(resume, jobDesc));
      setLoading(false);
    }, 900);
  }

  const scoreColor = result
    ? result.score >= 70 ? "#16a34a" : result.score >= 50 ? "#d97706" : "#dc2626"
    : "#1a56db";
  const scoreLabel = result
    ? result.score >= 70 ? "Strong Match" : result.score >= 50 ? "Fair Match" : "Weak Match"
    : "";

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Tool */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 32 }}>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Your Resume Text *</label>
          <textarea
            value={resume}
            onChange={e => setResume(e.target.value)}
            placeholder="Paste your full resume text here..."
            style={{ width: "100%", height: 280, padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = "#1a56db")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Job Description *</label>
          <textarea
            value={jobDesc}
            onChange={e => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            style={{ width: "100%", height: 280, padding: "12px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 13, fontFamily: "'DM Sans',sans-serif", resize: "vertical", outline: "none", lineHeight: 1.6 }}
            onFocus={e => (e.target.style.borderColor = "#1a56db")}
            onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
          />
        </div>
      </div>

      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <button
          onClick={handleCheck}
          disabled={!resume.trim() || !jobDesc.trim() || loading}
          style={{ background: "#1a56db", color: "#fff", padding: "13px 40px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: (!resume.trim() || !jobDesc.trim()) ? 0.5 : 1 }}
        >
          {loading ? "Analysing…" : "Check ATS Score →"}
        </button>
      </div>

      {result && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          {/* Score */}
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: "32px", marginBottom: 24, textAlign: "center", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 72, fontWeight: 800, color: scoreColor, lineHeight: 1, fontFamily: "'DM Serif Display',serif" }}>{result.score}%</div>
            <div style={{ fontSize: 18, fontWeight: 600, color: scoreColor, marginTop: 4 }}>{scoreLabel}</div>
            <div style={{ fontSize: 14, color: "#6b7280", marginTop: 8 }}>
              {result.matchedKeywords.length} of {result.matchedKeywords.length + result.missingKeywords.length} job keywords found in your resume
            </div>
            <div style={{ height: 12, background: "#f3f4f6", borderRadius: 100, margin: "20px auto 0", maxWidth: 400, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${result.score}%`, background: scoreColor, borderRadius: 100, transition: "width 0.8s ease" }} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
            {/* Matched */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#16a34a", marginBottom: 14 }}>✅ Matched Keywords ({result.matchedKeywords.length})</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.matchedKeywords.map(kw => (
                  <span key={kw} style={{ background: "#f0fdf4", color: "#16a34a", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{kw}</span>
                ))}
              </div>
            </div>
            {/* Missing */}
            <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 24 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#dc2626", marginBottom: 14 }}>❌ Missing Keywords ({result.missingKeywords.length})</h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {result.missingKeywords.map(kw => (
                  <span key={kw} style={{ background: "#fef2f2", color: "#dc2626", padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Section feedback */}
          <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#111827", marginBottom: 16 }}>📋 Resume Section Analysis</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
              {result.sectionFeedback.map(sf => (
                <div key={sf.section} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 14px", background: sf.status === "good" ? "#f0fdf4" : sf.status === "missing" ? "#fef2f2" : "#fffbeb", borderRadius: 10 }}>
                  <span style={{ fontSize: 16, flexShrink: 0 }}>{sf.status === "good" ? "✅" : sf.status === "missing" ? "❌" : "⚠️"}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>{sf.section}</div>
                    <div style={{ fontSize: 12, color: "#6b7280" }}>{sf.message}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div style={{ background: "#eff6ff", borderRadius: 14, border: "1px solid #bfdbfe", padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#1a56db", marginBottom: 14 }}>💡 Improvement Suggestions</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
              {result.suggestions.map((s, i) => (
                <li key={i} style={{ display: "flex", gap: 10, fontSize: 14, color: "#1e3a8a" }}>
                  <span style={{ flexShrink: 0, fontWeight: 700 }}>{i + 1}.</span>{s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* FAQs */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 8, color: "#111827" }}>Frequently Asked Questions</h2>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Everything you need to know about ATS systems and resume optimisation.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 16, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "#6b7280" }}>
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{faq.a}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
