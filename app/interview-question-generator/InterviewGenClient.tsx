"use client";
import { useState } from "react";

interface Question {
  type: "Behavioural" | "Technical" | "Situational" | "Culture Fit";
  question: string;
  tip: string;
  sampleAnswer: string;
}

const QUESTION_BANK: Record<string, Question[]> = {
  default: [
    { type: "Behavioural", question: "Tell me about yourself.", tip: "Use the Present-Past-Future formula. Keep it to 2 minutes.", sampleAnswer: "I'm a [role] with X years of experience in [industry]. I started my career at [company] where I [key achievement]. Most recently I've been [current role/project]. I'm looking for [next step] because [reason]." },
    { type: "Behavioural", question: "What is your greatest strength?", tip: "Pick one real strength relevant to the role. Back it with a specific example.", sampleAnswer: "My greatest strength is [skill]. For example, at [company] I [specific example that demonstrates the strength] which resulted in [outcome]." },
    { type: "Behavioural", question: "Describe a time you failed and what you learned.", tip: "Use STAR: Situation, Task, Action, Result. Own the failure — don't blame others.", sampleAnswer: "In [situation], I [what went wrong]. I took responsibility by [action taken]. As a result [outcome], and I learned [lesson] which I've applied by [how you changed]." },
    { type: "Behavioural", question: "Give an example of a time you worked under pressure.", tip: "Choose a high-stakes example with a positive outcome. Quantify the pressure.", sampleAnswer: "When [high-pressure situation], I [action taken]. Despite the deadline/constraints, I [result]. I managed the pressure by [coping strategy]." },
    { type: "Situational", question: "Where do you see yourself in 5 years?", tip: "Align your goals with the role. Show ambition without overshooting the position.", sampleAnswer: "In 5 years I'd like to have [specific goal] within [company type]. I'm particularly excited about [aspect of this role] as a foundation for that path. I see strong alignment between my goals and where this company is heading." },
    { type: "Culture Fit", question: "Why do you want to work here?", tip: "Research the company. Mention specific products, values, or initiatives.", sampleAnswer: "I've been following [company] for [time] and I'm particularly impressed by [specific thing]. The role aligns with my background in [area] and I'd love to contribute to [specific goal or team]." },
    { type: "Situational", question: "How do you handle disagreements with a manager?", tip: "Show emotional maturity. Demonstrate you can push back professionally.", sampleAnswer: "I always start by trying to understand their perspective. If I still disagree, I raise my concern privately with specific data or examples. Ultimately, if the decision is made, I commit to it fully — but I make sure my view was heard." },
    { type: "Culture Fit", question: "What are you looking for in your next role?", tip: "Be specific and honest. Avoid generic answers like 'growth opportunities'.", sampleAnswer: "I'm looking for [specific things: ownership, technical challenge, team culture]. This role stood out because [specific aspect], which is exactly the kind of environment I thrive in." },
  ],
  engineer: [
    { type: "Technical", question: "Explain the difference between REST and GraphQL.", tip: "Mention use-cases for each. Mention over-fetching/under-fetching as a key GraphQL benefit.", sampleAnswer: "REST uses fixed endpoints that return all data for a resource. GraphQL lets clients query exactly the data they need. GraphQL avoids over-fetching (getting more data than needed) and under-fetching (needing multiple requests). REST is simpler to cache; GraphQL is better for complex, nested data relationships." },
    { type: "Technical", question: "How do you ensure code quality in a team environment?", tip: "Mention code reviews, testing practices, linting, and CI/CD.", sampleAnswer: "I use a combination of automated testing (unit, integration, e2e), code reviews with clear standards, linting/formatting tools enforced in CI, and regular refactoring sessions. I also write clear documentation and advocate for PRs to be small and focused." },
    { type: "Situational", question: "Describe how you'd debug a production incident.", tip: "Walk through your process: alerts → logs → hypothesis → fix → post-mortem.", sampleAnswer: "First, I assess severity and notify stakeholders. Then I check monitoring dashboards and logs to isolate the issue. I form a hypothesis, test in staging if possible, apply a fix, and monitor. Afterwards I write a post-mortem to prevent recurrence." },
  ],
  manager: [
    { type: "Behavioural", question: "How do you handle a low-performing team member?", tip: "Show empathy first, then process. Mention clear expectations and documentation.", sampleAnswer: "I start by having a private, candid conversation to understand root causes — personal issues, unclear expectations, skill gaps. I set clear, measurable goals with a timeline, offer support, and check in regularly. If performance doesn't improve, I follow the formal PIP process while treating the person with respect." },
    { type: "Situational", question: "How do you prioritise competing projects?", tip: "Mention impact vs effort frameworks. Show stakeholder communication skills.", sampleAnswer: "I use an impact vs effort matrix to score projects, then align with senior stakeholders on strategic priorities. I'm transparent about trade-offs and set clear expectations about timelines. I also protect my team from scope creep by channelling new requests through a defined intake process." },
  ],
  sales: [
    { type: "Technical", question: "Walk me through your sales process.", tip: "Use a named methodology if you know one (MEDDIC, Challenger, SPIN). Show structure.", sampleAnswer: "I follow a structured process: Prospecting → Discovery → Demo → Proposal → Negotiation → Close → Onboarding. In Discovery, I focus on understanding pain points and business impact before ever showing a solution. I use MEDDIC to qualify opportunities rigorously." },
    { type: "Behavioural", question: "Tell me about your biggest deal and how you won it.", tip: "Quantify the deal size, timeline, and your specific role in closing it.", sampleAnswer: "My biggest deal was a $[X]k contract with [company type]. The key was [specific action: executive sponsorship, custom demo, competitive analysis]. I identified the economic buyer early and built a business case around ROI. It took [time] to close but exceeded quota by [%]." },
  ],
};

function getQuestions(jobTitle: string, count: number): Question[] {
  const lower = jobTitle.toLowerCase();
  let bankKey = "default";
  if (lower.includes("engineer") || lower.includes("developer") || lower.includes("software") || lower.includes("tech")) bankKey = "engineer";
  else if (lower.includes("manager") || lower.includes("director") || lower.includes("lead") || lower.includes("head")) bankKey = "manager";
  else if (lower.includes("sales") || lower.includes("account") || lower.includes("business development")) bankKey = "sales";

  const specific = QUESTION_BANK[bankKey] || [];
  const general = QUESTION_BANK.default;
  const all = [...specific, ...general];
  const shuffled = all.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "Behavioural": { bg: "#eff6ff", color: "#1a56db" },
  "Technical":   { bg: "#f0fdf4", color: "#16a34a" },
  "Situational": { bg: "#fff7ed", color: "#ea580c" },
  "Culture Fit": { bg: "#fdf4ff", color: "#9333ea" },
};

const faqs = [
  { q: "What types of interview questions will I get?", a: "The generator creates four types of questions: Behavioural (past experiences), Technical (role-specific knowledge), Situational (hypothetical scenarios), and Culture Fit (values and motivation). Each includes a model answer structure." },
  { q: "What is the STAR method?", a: "STAR stands for Situation, Task, Action, Result. It's the most effective framework for answering behavioural interview questions. Describe the Situation and Task, explain the Action you took, and share the measurable Result." },
  { q: "How many interview questions should I prepare?", a: "Typically prepare 15–20 questions covering all categories. Focus especially on the top 5–7 behavioural questions, 3–5 role-specific technical questions, and have 3–5 strong questions to ask the interviewer at the end." },
  { q: "How do I answer 'Tell me about yourself'?", a: "Use the Present-Past-Future formula. Start with your current role and key achievement, briefly mention relevant past experience, then connect to why this specific role excites you. Keep it to 90–120 seconds." },
  { q: "What questions should I ask the interviewer?", a: "Ask about the team's biggest challenges, what success looks like in the first 90 days, how performance is measured, and what the interviewer enjoys most about the company. Avoid asking about salary or benefits in a first interview." },
  { q: "How should I prepare for technical interview questions?", a: "Review the job description and identify technical skills listed. Prepare real examples from your work that demonstrate each skill. Practice explaining technical concepts in plain English — interviewers often care more about your thinking than perfect answers." },
];

export default function InterviewGenClient() {
  const [jobTitle, setJobTitle] = useState("");
  const [count, setCount] = useState(6);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleGenerate() {
    if (!jobTitle.trim()) return;
    setLoading(true);
    setExpanded(null);
    setTimeout(() => {
      setQuestions(getQuestions(jobTitle, count));
      setLoading(false);
    }, 700);
  }

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "40px 20px" }}>
      {/* Controls */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28, marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "flex-end" }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Job Title *</label>
            <input
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleGenerate()}
              placeholder="e.g. Software Engineer, Sales Manager, Marketing Lead..."
              style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, outline: "none", width: "100%" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Questions</label>
            <select value={count} onChange={e => setCount(Number(e.target.value))}
              style={{ padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fff", width: "100%" }}>
              {[5,6,8,10].map(n => <option key={n} value={n}>{n} questions</option>)}
            </select>
          </div>
          <button onClick={handleGenerate} disabled={!jobTitle.trim() || loading}
            style={{ background: "#7c3aed", color: "#fff", padding: "11px 24px", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", opacity: !jobTitle.trim() ? 0.5 : 1 }}>
            {loading ? "Generating…" : "Generate →"}
          </button>
        </div>
      </div>

      {/* Questions */}
      {questions.length > 0 && (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "#111827" }}>
              Interview Questions for {jobTitle}
            </h2>
            <span style={{ fontSize: 13, color: "#6b7280" }}>{questions.length} questions</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {questions.map((q, i) => {
              const tc = TYPE_COLORS[q.type] || TYPE_COLORS["Behavioural"];
              return (
                <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.04)" }}>
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}
                  >
                    <span style={{ fontSize: 18, fontWeight: 700, color: "#9ca3af", flexShrink: 0, minWidth: 24 }}>{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: tc.bg, color: tc.color }}>{q.type}</span>
                      </div>
                      <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>{q.question}</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, transform: expanded === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "#9ca3af" }}>
                      <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded === i && (
                    <div style={{ padding: "0 20px 20px 58px" }}>
                      <div style={{ background: "#fffbeb", borderRadius: 10, padding: "12px 16px", marginBottom: 12 }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#d97706", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>💡 Interviewer Tip</div>
                        <div style={{ fontSize: 13, color: "#374151" }}>{q.tip}</div>
                      </div>
                      <div style={{ background: "#f9fafb", borderRadius: 10, padding: "12px 16px" }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>📝 Sample Answer Structure</div>
                        <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, fontStyle: "italic" }}>{q.sampleAnswer}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: "center", marginTop: 24 }}>
            <button onClick={handleGenerate}
              style={{ background: "transparent", color: "#7c3aed", border: "1.5px solid #7c3aed", padding: "10px 28px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              ↺ Generate New Set
            </button>
          </div>
        </div>
      )}

      {/* FAQs */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 8, color: "#111827" }}>Frequently Asked Questions</h2>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Expert answers to help you ace your next interview.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "none", border: "none", cursor: "pointer", textAlign: "left", fontFamily: "'DM Sans',sans-serif" }}>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827" }}>{faq.q}</span>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, marginLeft: 16, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", color: "#6b7280" }}>
                  <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              {openFaq === i && <div style={{ padding: "0 20px 16px", fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{faq.a}</div>}
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}
