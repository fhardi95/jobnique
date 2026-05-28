"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { TEMPLATES, DEFAULT_RESUME } from "@/lib/resume/templates";
import type {
  ResumeData, SectionType, ExperienceItem,
  EducationItem, SkillGroup, CertificationItem,
  ProjectItem, LanguageItem,
} from "@/types/resume";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return Math.random().toString(36).slice(2, 9); }

const SECTION_LABELS: Record<SectionType, string> = {
  personal:       "Personal Info",
  summary:        "Professional Summary",
  experience:     "Work Experience",
  education:      "Education",
  skills:         "Skills",
  certifications: "Certifications",
  projects:       "Projects",
  languages:      "Languages",
  references:     "References",
};

const SECTION_ICONS: Record<SectionType, string> = {
  personal:       "👤",
  summary:        "📝",
  experience:     "💼",
  education:      "🎓",
  skills:         "⚡",
  certifications: "📜",
  projects:       "🚀",
  languages:      "🌍",
  references:     "🤝",
};

// ─── Input helpers ────────────────────────────────────────────────────────────
function Field({
  label, value, onChange, placeholder = "", multiline = false, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; rows?: number;
}) {
  const base: React.CSSProperties = {
    border: "1.5px solid #e5e7eb", borderRadius: 8,
    padding: "9px 12px", fontSize: 13.5, outline: "none",
    width: "100%", background: "#fff", fontFamily: "inherit",
    transition: "border 0.15s", color: "#111827",
    resize: "vertical" as const,
  };
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value} rows={rows} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      ) : (
        <input
          type="text" value={value} placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          style={base}
          onFocus={(e) => (e.target.style.borderColor = "#1a56db")}
          onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
        />
      )}
    </div>
  );
}

// ─── Section editors ──────────────────────────────────────────────────────────
function PersonalEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const p = data.personal;
  const upd = (k: keyof typeof p) => (v: string) => onChange({ ...data, personal: { ...p, [k]: v } });
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
        <Field label="Full Name"    value={p.fullName}  onChange={upd("fullName")}  placeholder="Alex Johnson" />
        <Field label="Job Title"    value={p.title}     onChange={upd("title")}     placeholder="Senior Software Engineer" />
        <Field label="Email"        value={p.email}     onChange={upd("email")}     placeholder="alex@example.com" />
        <Field label="Phone"        value={p.phone}     onChange={upd("phone")}     placeholder="+44 7700 900000" />
        <Field label="Location"     value={p.location}  onChange={upd("location")}  placeholder="London, UK" />
        <Field label="LinkedIn URL" value={p.linkedin}  onChange={upd("linkedin")}  placeholder="linkedin.com/in/alex" />
      </div>
      <Field label="Website / Portfolio" value={p.website} onChange={upd("website")} placeholder="alexjohnson.dev" />
    </div>
  );
}

function SummaryEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  return (
    <>
      <Field
        label="Professional Summary"
        value={data.summary}
        onChange={(v) => onChange({ ...data, summary: v })}
        multiline rows={5}
        placeholder="Write 2-4 sentences that highlight your experience, key skills, and what you bring to a role…"
      />
      <button style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: "#ede9fe", color: "#7c3aed",
        border: "none", borderRadius: 8, padding: "8px 14px",
        fontSize: 12.5, fontWeight: 600, cursor: "pointer",
      }}>
        🤖 AI Generate Summary
      </button>
    </>
  );
}

function ExperienceEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () => onChange({
    ...data,
    experience: [...data.experience, {
      id: uid(), company: "", role: "", startDate: "", endDate: "",
      current: false, location: "", bullets: [""],
    }],
  });

  const updateItem = (id: string, updates: Partial<ExperienceItem>) => onChange({
    ...data,
    experience: data.experience.map(e => e.id === id ? { ...e, ...updates } : e),
  });

  const removeItem = (id: string) => onChange({
    ...data, experience: data.experience.filter(e => e.id !== id),
  });

  const updateBullet = (expId: string, idx: number, val: string) => {
    const exp = data.experience.find(e => e.id === expId)!;
    const bullets = [...exp.bullets];
    bullets[idx] = val;
    updateItem(expId, { bullets });
  };

  return (
    <div>
      {data.experience.map((exp, i) => (
        <div key={exp.id} style={{
          border: "1.5px solid #e5e7eb", borderRadius: 12,
          padding: "16px", marginBottom: 14,
          background: "#fafafa",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, alignItems: "center" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>
              Position {i + 1}
            </span>
            <button onClick={() => removeItem(exp.id)} style={{
              background: "#fee2e2", color: "#dc2626", border: "none",
              borderRadius: 6, padding: "3px 8px", fontSize: 12, cursor: "pointer",
            }}>✕ Remove</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Field label="Company"   value={exp.company}   onChange={(v) => updateItem(exp.id, { company: v })}   placeholder="Acme Corp" />
            <Field label="Job Title" value={exp.role}      onChange={(v) => updateItem(exp.id, { role: v })}      placeholder="Software Engineer" />
            <Field label="Start Date" value={exp.startDate} onChange={(v) => updateItem(exp.id, { startDate: v })} placeholder="Jan 2022" />
            <Field label="End Date"   value={exp.endDate}   onChange={(v) => updateItem(exp.id, { endDate: v })}   placeholder="Present" />
          </div>
          <Field label="Location" value={exp.location} onChange={(v) => updateItem(exp.id, { location: v })} placeholder="London, UK" />
          <div style={{ marginBottom: 6 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 }}>
              Bullet Points
            </label>
            {exp.bullets.map((b, bi) => (
              <div key={bi} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "flex-start" }}>
                <span style={{ color: "#9ca3af", marginTop: 10, fontSize: 16 }}>•</span>
                <textarea
                  value={b}
                  onChange={(e) => updateBullet(exp.id, bi, e.target.value)}
                  rows={2} placeholder="Describe an achievement with measurable impact…"
                  style={{
                    flex: 1, border: "1.5px solid #e5e7eb", borderRadius: 6,
                    padding: "6px 10px", fontSize: 13, resize: "vertical",
                    fontFamily: "inherit", outline: "none",
                  }}
                />
              </div>
            ))}
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <button onClick={() => updateItem(exp.id, { bullets: [...exp.bullets, ""] })} style={{
                background: "#f3f4f6", border: "none", borderRadius: 6, padding: "6px 12px",
                fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#374151",
              }}>+ Add bullet</button>
              <button style={{
                background: "#ede9fe", color: "#7c3aed", border: "none",
                borderRadius: 6, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>🤖 AI Improve</button>
            </div>
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{
        width: "100%", padding: "10px", border: "2px dashed #d1d5db",
        borderRadius: 10, background: "transparent", color: "#6b7280",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
      }}>+ Add Experience</button>
    </div>
  );
}

function EducationEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () => onChange({
    ...data,
    education: [...data.education, { id: uid(), institution: "", degree: "", field: "", startDate: "", endDate: "" }],
  });
  const updItem = (id: string, updates: Partial<EducationItem>) => onChange({
    ...data, education: data.education.map(e => e.id === id ? { ...e, ...updates } : e),
  });
  return (
    <div>
      {data.education.map((edu) => (
        <div key={edu.id} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "16px", marginBottom: 14, background: "#fafafa" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Field label="Institution" value={edu.institution} onChange={(v) => updItem(edu.id, { institution: v })} placeholder="University of London" />
            <Field label="Degree" value={edu.degree} onChange={(v) => updItem(edu.id, { degree: v })} placeholder="BSc Computer Science" />
            <Field label="Start Year" value={edu.startDate} onChange={(v) => updItem(edu.id, { startDate: v })} placeholder="2018" />
            <Field label="End Year" value={edu.endDate} onChange={(v) => updItem(edu.id, { endDate: v })} placeholder="2022" />
          </div>
          <Field label="Grade (optional)" value={edu.grade || ""} onChange={(v) => updItem(edu.id, { grade: v })} placeholder="First Class Honours" />
        </div>
      ))}
      <button onClick={addItem} style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 10, background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        + Add Education
      </button>
    </div>
  );
}

function SkillsEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const updGroup = (id: string, updates: Partial<SkillGroup>) => onChange({
    ...data, skillGroups: data.skillGroups.map(g => g.id === id ? { ...g, ...updates } : g),
  });
  return (
    <div>
      {data.skillGroups.map((group) => (
        <div key={group.id} style={{ marginBottom: 16 }}>
          <Field label="Category" value={group.category} onChange={(v) => updGroup(group.id, { category: v })} placeholder="Technical Skills" />
          <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>
            Skills (comma-separated)
          </label>
          <input
            type="text"
            value={group.skills.join(", ")}
            onChange={(e) => updGroup(group.id, { skills: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })}
            placeholder="React, TypeScript, Node.js, PostgreSQL"
            style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, outline: "none", width: "100%" }}
          />
        </div>
      ))}
      <button onClick={() => onChange({ ...data, skillGroups: [...data.skillGroups, { id: uid(), category: "", skills: [] }] })}
        style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 10, background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
        + Add Skill Group
      </button>
    </div>
  );
}

function CertEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () => onChange({ ...data, certifications: [...data.certifications, { id: uid(), name: "", issuer: "", date: "" }] });
  const updItem = (id: string, u: Partial<CertificationItem>) => onChange({ ...data, certifications: data.certifications.map(c => c.id === id ? { ...c, ...u } : c) });
  return (
    <div>
      {data.certifications.map((c) => (
        <div key={c.id} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "14px", marginBottom: 12, background: "#fafafa" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 12px" }}>
            <Field label="Certification" value={c.name}   onChange={(v) => updItem(c.id, { name: v })}   placeholder="AWS Solutions Architect" />
            <Field label="Issuer"        value={c.issuer} onChange={(v) => updItem(c.id, { issuer: v })} placeholder="Amazon Web Services" />
            <Field label="Date"          value={c.date}   onChange={(v) => updItem(c.id, { date: v })}   placeholder="March 2024" />
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 10, background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Certification</button>
    </div>
  );
}

function ProjectsEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () => onChange({ ...data, projects: [...data.projects, { id: uid(), name: "", description: "", technologies: [], bullets: [""] }] });
  const updItem = (id: string, u: Partial<ProjectItem>) => onChange({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, ...u } : p) });
  return (
    <div>
      {data.projects.map((p) => (
        <div key={p.id} style={{ border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "14px", marginBottom: 12, background: "#fafafa" }}>
          <Field label="Project Name" value={p.name} onChange={(v) => updItem(p.id, { name: v })} placeholder="Jobnique Platform" />
          <Field label="Description" value={p.description} onChange={(v) => updItem(p.id, { description: v })} multiline rows={2} placeholder="What did you build and why?" />
          <Field label="Technologies (comma-sep)" value={p.technologies.join(", ")} onChange={(v) => updItem(p.id, { technologies: v.split(",").map(s => s.trim()).filter(Boolean) })} placeholder="Next.js, TypeScript, Supabase" />
        </div>
      ))}
      <button onClick={addItem} style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 10, background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Project</button>
    </div>
  );
}

function LanguagesEditor({ data, onChange }: { data: ResumeData; onChange: (d: ResumeData) => void }) {
  const addItem = () => onChange({ ...data, languages: [...data.languages, { id: uid(), language: "", proficiency: "Intermediate" }] });
  const updItem = (id: string, u: Partial<LanguageItem>) => onChange({ ...data, languages: data.languages.map(l => l.id === id ? { ...l, ...u } : l) });
  const levels = ["Native", "Fluent", "Advanced", "Intermediate", "Basic"] as const;
  return (
    <div>
      {data.languages.map((l) => (
        <div key={l.id} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-end" }}>
          <div style={{ flex: 1 }}><Field label="Language" value={l.language} onChange={(v) => updItem(l.id, { language: v })} placeholder="Spanish" /></div>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 4 }}>Level</label>
            <select value={l.proficiency} onChange={(e) => updItem(l.id, { proficiency: e.target.value as LanguageItem["proficiency"] })}
              style={{ border: "1.5px solid #e5e7eb", borderRadius: 8, padding: "9px 12px", fontSize: 13.5, width: "100%", background: "#fff" }}>
              {levels.map(lv => <option key={lv} value={lv}>{lv}</option>)}
            </select>
          </div>
        </div>
      ))}
      <button onClick={addItem} style={{ width: "100%", padding: "10px", border: "2px dashed #d1d5db", borderRadius: 10, background: "transparent", color: "#6b7280", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Language</button>
    </div>
  );
}

// ─── Live Resume Preview ──────────────────────────────────────────────────────
function ResumePreview({ data }: { data: ResumeData }) {
  const tpl = TEMPLATES.find(t => t.id === data.templateId) || TEMPLATES[0];
  const accent = tpl.colors[0];
  const p = data.personal;
  const scale = 0.72;

  return (
    <div style={{ overflow: "hidden", borderRadius: 8 }}>
      {/* Scaled A4 preview */}
      <div style={{
        transform: `scale(${scale})`,
        transformOrigin: "top center",
        width: `${100 / scale}%`,
        marginBottom: `${-(100 - scale * 100) * 7.9}px`,
      }}>
        <div style={{
          width: "210mm",
          minHeight: "297mm",
          background: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 9,
          lineHeight: 1.5,
          color: "#111827",
          margin: "0 auto",
          boxShadow: "0 0 0 1px #e5e7eb",
        }}>
          {/* Header */}
          <div style={{
            background: data.templateId === "minimal" ? "#fff" : accent,
            color: data.templateId === "minimal" ? "#111827" : "#fff",
            padding: "20px 24px 16px",
            borderBottom: data.templateId === "minimal" ? `3px solid ${accent}` : "none",
          }}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 2, fontFamily: "'DM Serif Display', serif" }}>
              {p.fullName || "Your Name"}
            </div>
            <div style={{ fontSize: 11, opacity: 0.85, marginBottom: 8, fontWeight: 500 }}>
              {p.title || "Job Title"}
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 8, opacity: 0.8 }}>
              {p.email    && <span>✉ {p.email}</span>}
              {p.phone    && <span>📞 {p.phone}</span>}
              {p.location && <span>📍 {p.location}</span>}
              {p.linkedin && <span>🔗 {p.linkedin}</span>}
            </div>
          </div>

          <div style={{ padding: "16px 24px", display: "flex", gap: 20 }}>
            {/* Main column */}
            <div style={{ flex: 2 }}>
              {/* Summary */}
              {data.summary && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Profile
                  </div>
                  <p style={{ fontSize: 8, lineHeight: 1.6, color: "#374151" }}>{data.summary}</p>
                </div>
              )}

              {/* Experience */}
              {data.experience.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Experience
                  </div>
                  {data.experience.map((exp) => (
                    <div key={exp.id} style={{ marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 9 }}>{exp.role || "Job Title"}</div>
                      <div style={{ fontSize: 8, color: accent, marginBottom: 2 }}>{exp.company} {exp.location && `· ${exp.location}`}</div>
                      <div style={{ fontSize: 7.5, color: "#6b7280", marginBottom: 4 }}>{exp.startDate} {exp.endDate && `— ${exp.endDate}`}</div>
                      {exp.bullets.filter(Boolean).map((b, i) => (
                        <div key={i} style={{ fontSize: 7.5, color: "#374151", paddingLeft: 8, position: "relative", marginBottom: 2 }}>
                          <span style={{ position: "absolute", left: 0, color: accent }}>•</span>
                          {b}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* Education */}
              {data.education.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Education
                  </div>
                  {data.education.map((edu) => (
                    <div key={edu.id} style={{ marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, fontSize: 9 }}>{edu.degree || "Degree"}</div>
                      <div style={{ fontSize: 8, color: accent }}>{edu.institution}</div>
                      <div style={{ fontSize: 7.5, color: "#6b7280" }}>{edu.startDate} {edu.endDate && `— ${edu.endDate}`}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Side column */}
            <div style={{ flex: 1 }}>
              {/* Skills */}
              {data.skillGroups.some(g => g.skills.length > 0) && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Skills
                  </div>
                  {data.skillGroups.filter(g => g.skills.length > 0).map((g) => (
                    <div key={g.id} style={{ marginBottom: 8 }}>
                      {g.category && <div style={{ fontSize: 8, fontWeight: 700, color: "#374151", marginBottom: 3 }}>{g.category}</div>}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                        {g.skills.map((s) => (
                          <span key={s} style={{
                            background: `${accent}18`, color: accent,
                            padding: "1.5px 6px", borderRadius: 10,
                            fontSize: 7, fontWeight: 600,
                          }}>{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Languages */}
              {data.languages.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Languages
                  </div>
                  {data.languages.map((l) => (
                    <div key={l.id} style={{ fontSize: 8, marginBottom: 3 }}>
                      <span style={{ fontWeight: 700 }}>{l.language}</span>
                      {" — "}<span style={{ color: "#6b7280" }}>{l.proficiency}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {data.certifications.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 800, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 5, paddingBottom: 3, borderBottom: `1.5px solid ${accent}` }}>
                    Certifications
                  </div>
                  {data.certifications.map((c) => (
                    <div key={c.id} style={{ marginBottom: 6 }}>
                      <div style={{ fontSize: 8, fontWeight: 700 }}>{c.name}</div>
                      <div style={{ fontSize: 7.5, color: "#6b7280" }}>{c.issuer} · {c.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Template switcher panel ──────────────────────────────────────────────────
function TemplateSwitcher({ current, onSelect }: { current: string; onSelect: (id: string) => void }) {
  return (
    <div style={{
      display: "flex", gap: 8, flexWrap: "wrap", padding: "10px 0",
    }}>
      {TEMPLATES.map((t) => {
        const active = t.id === current;
        return (
          <button
            key={t.id}
            onClick={() => onSelect(t.id)}
            style={{
              padding: "5px 12px", borderRadius: 20,
              border: active ? "none" : "1.5px solid #e5e7eb",
              background: active ? t.colors[0] : "#fff",
              color: active ? "#fff" : "#374151",
              fontSize: 11.5, fontWeight: 600, cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {t.name}
          </button>
        );
      })}
    </div>
  );
}

// ─── Builder page ─────────────────────────────────────────────────────────────
export default function BuilderClient() {
  const searchParams = useSearchParams();
  const initialTemplate = searchParams.get("template") || "classic";

  const [resume, setResume] = useState<ResumeData>({
    ...DEFAULT_RESUME,
    templateId: initialTemplate,
  });
  const [activeSection, setActiveSection] = useState<SectionType>("personal");
  const [showTemplates, setShowTemplates] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    // In production: call Supabase API
    localStorage.setItem("jobnique_resume_draft", JSON.stringify(resume));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [resume]);

  const visibleSections = resume.sections
    .filter(s => s.visible)
    .sort((a, b) => a.order - b.order);

  const toggleSection = (type: SectionType) => {
    setResume(r => ({
      ...r,
      sections: r.sections.map(s => s.type === type ? { ...s, visible: !s.visible } : s),
    }));
  };

  const renderEditor = () => {
    switch (activeSection) {
      case "personal":       return <PersonalEditor     data={resume} onChange={setResume} />;
      case "summary":        return <SummaryEditor      data={resume} onChange={setResume} />;
      case "experience":     return <ExperienceEditor   data={resume} onChange={setResume} />;
      case "education":      return <EducationEditor    data={resume} onChange={setResume} />;
      case "skills":         return <SkillsEditor       data={resume} onChange={setResume} />;
      case "certifications": return <CertEditor         data={resume} onChange={setResume} />;
      case "projects":       return <ProjectsEditor     data={resume} onChange={setResume} />;
      case "languages":      return <LanguagesEditor    data={resume} onChange={setResume} />;
      default:               return <div style={{ color: "#6b7280", fontSize: 14 }}>Coming soon</div>;
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", fontFamily: "'DM Sans', sans-serif" }}>
      {/* ── Top bar ── */}
      <div style={{
        height: 56, background: "#0f172a",
        display: "flex", alignItems: "center",
        padding: "0 20px", gap: 16,
        borderBottom: "1px solid #1e293b",
        flexShrink: 0,
      }}>
        <Link href="/resume-builder" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1a56db" }}>Job</span>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#f97316" }}>nique</span>
        </Link>

        <div style={{ width: 1, height: 24, background: "#1e293b", margin: "0 4px" }} />

        <span style={{ color: "#94a3b8", fontSize: 13, fontWeight: 500 }}>Resume Builder</span>

        <div style={{ flex: 1 }} />

        {/* Template switcher toggle */}
        <button
          onClick={() => setShowTemplates(!showTemplates)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: showTemplates ? "#1a56db" : "#1e293b",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >
          🎨 Templates
        </button>

        <button style={{
          display: "flex", alignItems: "center", gap: 6,
          background: "#1e293b", color: "#94a3b8", border: "none", borderRadius: 8,
          padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          📥 Export PDF
        </button>

        <button
          onClick={handleSave}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: saved ? "#059669" : "#1a56db",
            color: "#fff", border: "none", borderRadius: 8,
            padding: "7px 14px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            transition: "background 0.2s",
          }}
        >
          {saved ? "✓ Saved" : "💾 Save"}
        </button>
      </div>

      {/* Template switcher bar */}
      {showTemplates && (
        <div style={{
          background: "#1e293b", padding: "8px 20px",
          borderBottom: "1px solid #0f172a",
        }}>
          <TemplateSwitcher
            current={resume.templateId}
            onSelect={(id) => setResume(r => ({ ...r, templateId: id }))}
          />
        </div>
      )}

      {/* ── Main 3-column layout ── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Left sidebar — section list */}
        <div style={{
          width: 200, background: "#f8fafc",
          borderRight: "1px solid #e5e7eb",
          overflowY: "auto", flexShrink: 0,
          padding: "16px 0",
        }}>
          <div style={{ padding: "0 12px 10px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Sections
          </div>

          {/* Visible sections */}
          {visibleSections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.type)}
              style={{
                width: "100%", textAlign: "left",
                padding: "9px 14px",
                background: activeSection === s.type ? "#eff6ff" : "transparent",
                border: "none",
                borderLeft: activeSection === s.type ? "3px solid #1a56db" : "3px solid transparent",
                color: activeSection === s.type ? "#1a56db" : "#374151",
                fontSize: 13, fontWeight: activeSection === s.type ? 700 : 500,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span>{SECTION_ICONS[s.type]}</span>
              <span style={{ fontSize: 12.5 }}>{SECTION_LABELS[s.type]}</span>
            </button>
          ))}

          {/* Hidden sections */}
          <div style={{ padding: "12px 12px 6px", fontSize: 10, fontWeight: 700, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 8 }}>
            Add sections
          </div>
          {resume.sections.filter(s => !s.visible).map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSection(s.type)}
              style={{
                width: "100%", textAlign: "left",
                padding: "7px 14px",
                background: "transparent", border: "none",
                color: "#9ca3af", fontSize: 12.5, cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
              }}
            >
              <span style={{ color: "#d1d5db" }}>+</span>
              <span>{SECTION_LABELS[s.type]}</span>
            </button>
          ))}
        </div>

        {/* Center — form */}
        <div style={{
          flex: 1, overflowY: "auto",
          padding: "24px",
          background: "#fff",
          borderRight: "1px solid #e5e7eb",
          minWidth: 0,
        }}>
          <div style={{ maxWidth: 560, margin: "0 auto" }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 4 }}>
              {SECTION_ICONS[activeSection]} {SECTION_LABELS[activeSection]}
            </h2>
            <p style={{ fontSize: 13, color: "#6b7280", marginBottom: 24 }}>
              {activeSection === "personal"   && "Your contact information and professional title"}
              {activeSection === "summary"    && "A brief professional snapshot — 2-4 sentences"}
              {activeSection === "experience" && "Add your work history, most recent first"}
              {activeSection === "education"  && "Degrees, courses, and academic achievements"}
              {activeSection === "skills"     && "Group your skills by category for clarity"}
              {activeSection === "certifications" && "Professional certifications and credentials"}
              {activeSection === "projects"   && "Notable projects, side projects, or open source work"}
              {activeSection === "languages"  && "Languages you speak and your proficiency level"}
            </p>
            {renderEditor()}
          </div>
        </div>

        {/* Right — live preview */}
        <div style={{
          width: "40%", minWidth: 320, maxWidth: 520,
          background: "#f1f5f9",
          overflowY: "auto",
          padding: "16px",
          flexShrink: 0,
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center", marginBottom: 12,
          }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              Live Preview
            </span>
            <span style={{
              background: "#dcfce7", color: "#16a34a",
              fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
            }}>
              ✓ ATS Ready
            </span>
          </div>
          <ResumePreview data={resume} />
        </div>
      </div>
    </div>
  );
}
