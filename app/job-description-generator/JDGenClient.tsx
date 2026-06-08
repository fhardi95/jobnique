"use client";
import { useState } from "react";

interface JDForm {
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  experience: string;
  industry: string;
  teamSize: string;
  highlights: string;
}

const TEMPLATES: Record<string, Partial<JDForm>> = {
  "Software Engineer":      { experience: "3-5 years", industry: "Technology" },
  "Product Manager":        { experience: "4-6 years", industry: "Technology" },
  "Marketing Manager":      { experience: "3-5 years", industry: "Marketing" },
  "Sales Representative":   { experience: "1-3 years", industry: "Sales" },
  "Data Analyst":           { experience: "2-4 years", industry: "Technology" },
  "UX Designer":            { experience: "2-4 years", industry: "Design" },
  "Customer Success Manager": { experience: "2-4 years", industry: "SaaS" },
  "HR Manager":             { experience: "4-6 years", industry: "Human Resources" },
  "DevOps Engineer":        { experience: "3-5 years", industry: "Technology" },
  "Content Writer":         { experience: "1-3 years", industry: "Content / Media" },
};

const JD_LIBRARY: Record<string, { responsibilities: string[]; requirements: string[]; skills: string[] }> = {
  "Technology": {
    responsibilities: [
      "Design, build, and maintain scalable software systems and APIs",
      "Collaborate with product managers and designers to deliver high-quality features",
      "Participate in code reviews and uphold engineering standards",
      "Write clean, testable, well-documented code",
      "Contribute to technical architecture discussions and decisions",
      "Identify and resolve performance bottlenecks and reliability issues",
      "Mentor junior team members and support their growth",
    ],
    requirements: [
      "Bachelor's degree in Computer Science, Engineering, or equivalent experience",
      "Strong proficiency in one or more programming languages",
      "Experience with cloud platforms (AWS, GCP, or Azure)",
      "Proven ability to work in an Agile / Scrum environment",
      "Excellent problem-solving and communication skills",
    ],
    skills: ["Python", "TypeScript", "React", "PostgreSQL", "Docker", "Kubernetes", "CI/CD", "REST APIs"],
  },
  "Marketing": {
    responsibilities: [
      "Develop and execute integrated marketing strategies across digital channels",
      "Own campaign planning, execution, and performance reporting",
      "Manage and grow social media presence and content calendar",
      "Collaborate with sales to align on messaging and lead generation goals",
      "Analyse campaign data and translate insights into actionable improvements",
      "Manage agency and freelancer relationships",
      "Oversee brand consistency across all marketing materials",
    ],
    requirements: [
      "Bachelor's degree in Marketing, Communications, or related field",
      "Proven track record of owning and scaling marketing campaigns",
      "Experience with marketing analytics and attribution tools",
      "Strong copywriting and presentation skills",
      "Ability to manage multiple projects in a fast-paced environment",
    ],
    skills: ["Google Ads", "Meta Ads", "HubSpot", "SEO/SEM", "Google Analytics", "Copywriting", "A/B Testing"],
  },
  "Sales": {
    responsibilities: [
      "Own the full sales cycle from prospecting to close",
      "Build and maintain a healthy pipeline using CRM tools",
      "Conduct discovery calls, product demos, and negotiate contracts",
      "Exceed monthly and quarterly revenue targets",
      "Collaborate with marketing on lead generation and ICP targeting",
      "Provide feedback to product on market signals and customer needs",
      "Maintain accurate CRM records and forecasting",
    ],
    requirements: [
      "Proven track record of hitting or exceeding sales quotas",
      "Experience with CRM platforms (Salesforce, HubSpot, or similar)",
      "Strong consultative selling and active listening skills",
      "Resilience and motivation to work independently",
      "Excellent written and verbal communication",
    ],
    skills: ["Salesforce", "HubSpot", "MEDDIC", "Outreach.io", "Negotiation", "Solution Selling", "Pipeline Management"],
  },
  "Design": {
    responsibilities: [
      "Lead end-to-end UX design from research to high-fidelity prototypes",
      "Conduct user interviews, usability tests, and synthesise findings",
      "Create wireframes, user flows, and interaction designs",
      "Collaborate closely with product managers and engineers",
      "Maintain and evolve the design system",
      "Champion accessibility and inclusive design principles",
      "Present design decisions to stakeholders and executives",
    ],
    requirements: [
      "Portfolio demonstrating strong product design thinking",
      "Proficiency in Figma or equivalent design tools",
      "Experience running user research and translating insights to design",
      "Strong understanding of design systems and component libraries",
      "Excellent communication and presentation skills",
    ],
    skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "Accessibility", "User Testing", "Information Architecture"],
  },
  "default": {
    responsibilities: [
      "Lead key initiatives aligned with business objectives",
      "Collaborate cross-functionally to deliver high-impact outcomes",
      "Manage stakeholder expectations and communicate progress clearly",
      "Analyse data and metrics to inform decision-making",
      "Identify process improvements and implement best practices",
      "Support and develop team members",
      "Contribute to strategic planning and roadmap development",
    ],
    requirements: [
      "Relevant degree or equivalent professional experience",
      "Demonstrated track record of success in a similar role",
      "Strong analytical and problem-solving skills",
      "Excellent written and verbal communication",
      "Ability to work autonomously and manage competing priorities",
    ],
    skills: ["Project Management", "Data Analysis", "Communication", "Stakeholder Management", "Excel / Google Sheets"],
  },
};

const BENEFITS = [
  "Competitive salary and equity package",
  "Flexible working hours and hybrid/remote options",
  "25 days annual leave plus public holidays",
  "Comprehensive health, dental, and vision insurance",
  "401(k) with company match",
  "$1,500 annual learning and development budget",
  "Home office stipend",
  "Regular team offsites and events",
];

function generateJD(form: JDForm): string {
  const template = JD_LIBRARY[form.industry] || JD_LIBRARY["default"];
  const highlights = form.highlights ? form.highlights.split(",").map(h => h.trim()).filter(Boolean) : [];

  return `# ${form.title}${form.company ? ` at ${form.company}` : ""}

**${form.location || "Location"}** · **${form.type || "Full-time"}**${form.salary ? ` · **${form.salary}**` : ""}

---

## About the Role

We're looking for a talented ${form.title} to join our${form.teamSize ? ` ${form.teamSize}-person` : ""} team. This is an exciting opportunity to make a significant impact${form.company ? ` at ${form.company}` : ""} as we continue to grow.${highlights.length > 0 ? ` You'll be working on: ${highlights.join(", ")}.` : ""}

If you're passionate about ${form.industry || "your field"}, thrive in a collaborative environment, and want to do the best work of your career, we'd love to hear from you.

---

## What You'll Do

${template.responsibilities.map(r => `- ${r}`).join("\n")}

---

## What We're Looking For

- ${form.experience ? `${form.experience} of relevant experience` : "Relevant professional experience"}
${template.requirements.map(r => `- ${r}`).join("\n")}

---

## Technical Skills

${template.skills.map(s => `\`${s}\``).join(" · ")}

---

## Benefits & Perks

${BENEFITS.map(b => `- ${b}`).join("\n")}

---

## Equal Opportunity Statement

${form.company || "We"} ${form.company ? "is" : "are"} an equal opportunity employer. We celebrate diversity and are committed to creating an inclusive environment for all employees. We do not discriminate based on race, religion, gender, sexual orientation, age, disability, or any other protected characteristic.

---

*Ready to apply? We'd love to hear from you. Applications reviewed on a rolling basis.*`;
}

const faqs = [
  { q: "What makes a great job description?", a: "A great JD is clear, specific, and inclusive. It should accurately describe what the person will do day-to-day, what experience is truly required (vs nice-to-have), and why someone would want to work there. Avoid jargon, unrealistic requirements (e.g. '5 years experience in a 3-year-old technology'), and gendered language." },
  { q: "How long should a job description be?", a: "Aim for 400–700 words for most roles. Too short and candidates won't know what to expect; too long and you'll lose them before they apply. Focus on clarity: what they'll do, what you need, and what you offer." },
  { q: "How do I make a job description more inclusive?", a: "Use gender-neutral language (avoid 'he/his', 'she/her'). List only genuinely required qualifications — studies show women apply only when they meet 100% of requirements while men apply at 60%. Avoid culture-fit buzzwords. Explicitly state your commitment to diversity. Mention flexible working options." },
  { q: "Should I include salary in the job description?", a: "Yes — including a salary range increases applications by up to 30% and reduces time-to-hire. It also signals transparency. Many US states (California, New York, Colorado) now legally require salary disclosure in job postings." },
  { q: "What's the difference between responsibilities and requirements?", a: "Responsibilities describe what the person will do in the role. Requirements describe what they need to bring — experience, qualifications, and skills. Keep them separate and specific. Avoid listing the same thing in both sections." },
  { q: "Can I use this generated job description for job boards?", a: "Yes. The generated JD is ready to copy-paste to any job board including LinkedIn, Indeed, Glassdoor, and Jobnique. We recommend personalising it with specific details about your company culture and team before posting." },
];

export default function JDGenClient() {
  const [form, setForm] = useState<JDForm>({
    title: "", company: "", location: "", type: "Full-time",
    salary: "", experience: "2-4 years", industry: "Technology",
    teamSize: "", highlights: "",
  });
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  function handleTemplate(t: string) {
    const preset = TEMPLATES[t] || {};
    setForm(f => ({ ...f, title: t, ...preset }));
  }

  function handleGenerate() {
    if (!form.title.trim()) return;
    setOutput(generateJD(form));
    setTimeout(() => document.getElementById("jd-output")?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function handleCopy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function set(k: keyof JDForm) { return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(f => ({ ...f, [k]: e.target.value })); }

  const inputStyle = { padding: "11px 14px", border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, width: "100%", fontFamily: "'DM Sans',sans-serif" };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 20px" }}>
      {/* Quick templates */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 10 }}>Quick-start templates</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {Object.keys(TEMPLATES).map(t => (
            <button key={t} onClick={() => handleTemplate(t)}
              style={{ padding: "6px 14px", borderRadius: 20, fontSize: 13, fontWeight: 500, cursor: "pointer", border: "1.5px solid", borderColor: form.title === t ? "#d97706" : "#e5e7eb", background: form.title === t ? "#fff7ed" : "#fff", color: form.title === t ? "#d97706" : "#374151" }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 28, marginBottom: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Job Title *</label>
            <input value={form.title} onChange={set("title")} placeholder="e.g. Senior Software Engineer" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Company Name</label>
            <input value={form.company} onChange={set("company")} placeholder="e.g. Acme Corp" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Location</label>
            <input value={form.location} onChange={set("location")} placeholder="e.g. New York, NY / Remote" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Employment Type</label>
            <select value={form.type} onChange={set("type")} style={inputStyle}>
              {["Full-time","Part-time","Contract","Freelance","Internship"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Salary Range</label>
            <input value={form.salary} onChange={set("salary")} placeholder="e.g. $90,000 – $120,000" style={inputStyle} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Experience Required</label>
            <select value={form.experience} onChange={set("experience")} style={inputStyle}>
              {["0-1 years","1-2 years","2-4 years","3-5 years","4-6 years","5-8 years","8+ years"].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Industry / Department</label>
            <select value={form.industry} onChange={set("industry")} style={inputStyle}>
              {["Technology","Marketing","Sales","Design","Human Resources","Finance","Operations","Content / Media","SaaS","default"].map(i => <option key={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Team Size (optional)</label>
            <input value={form.teamSize} onChange={set("teamSize")} placeholder="e.g. 8" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Key Focus Areas (comma-separated, optional)</label>
          <input value={form.highlights} onChange={set("highlights")} placeholder="e.g. API development, system design, mentoring junior engineers" style={inputStyle} />
        </div>
        <button onClick={handleGenerate} disabled={!form.title.trim()}
          style={{ background: "#d97706", color: "#fff", padding: "13px 40px", borderRadius: 10, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", opacity: !form.title.trim() ? 0.5 : 1 }}>
          Generate Job Description →
        </button>
      </div>

      {/* Output */}
      {output && (
        <div id="jd-output" style={{ animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 22, color: "#111827" }}>Your Job Description</h2>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={handleCopy}
                style={{ background: copied ? "#059669" : "#fff", color: copied ? "#fff" : "#374151", border: "1.5px solid", borderColor: copied ? "#059669" : "#e5e7eb", padding: "9px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                {copied ? "✓ Copied!" : "Copy"}
              </button>
              <button onClick={() => { setOutput(""); setForm({ title:"",company:"",location:"",type:"Full-time",salary:"",experience:"2-4 years",industry:"Technology",teamSize:"",highlights:"" }); }}
                style={{ background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", padding: "9px 20px", borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
                Reset
              </button>
            </div>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
            <textarea
              value={output}
              onChange={e => setOutput(e.target.value)}
              style={{ width: "100%", minHeight: 600, border: "none", outline: "none", fontSize: 14, lineHeight: 1.8, fontFamily: "'DM Sans',sans-serif", color: "#111827", resize: "vertical", background: "transparent" }}
            />
          </div>
        </div>
      )}

      {/* FAQs */}
      <div style={{ marginTop: 64 }}>
        <h2 style={{ fontFamily: "'DM Serif Display',serif", fontSize: 28, marginBottom: 8, color: "#111827" }}>Frequently Asked Questions</h2>
        <p style={{ color: "#6b7280", marginBottom: 32, fontSize: 15 }}>Everything you need to know about writing great job descriptions.</p>
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
