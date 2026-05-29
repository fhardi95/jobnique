"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";

type TaskType = "write_article" | "keywords" | "seo_audit" | "content_calendar" | "meta_tags" | "salary_article" | "interview_article";
type PublishStatus = "idle" | "publishing" | "success" | "error";

interface ParsedArticle {
  slug: string;
  title: string;
  description: string;
  category: string;
  subcategory: string;
  readTime: number;
  featured: boolean;
  section: string;
  content: string;
}

interface AgentMessage {
  role: "user" | "agent" | "system";
  content: string;
  timestamp: Date;
  task?: TaskType;
  codeBlock?: string;
  codeLabel?: string;
  parsedArticle?: ParsedArticle | null;
}

interface Task {
  id: TaskType;
  label: string;
  icon: string;
  description: string;
  prompt: string;
  color: string;
}

const now = new Date();
const MONTH_YEAR = now.toLocaleString("en-US", { month: "long", year: "numeric" });
const YEAR = now.getFullYear();

const TASKS: Task[] = [
  {
    id: "write_article",
    label: "Write Career Article",
    icon: "✍️",
    description: "Generate a full SEO article ready to publish",
    color: "#1a56db",
    prompt: `Write a new SEO-optimised career advice article for jobnique.com. Choose a high-traffic topic not yet covered. Output ONLY valid JSON matching the article format exactly, so it can be auto-published. Today's date is ${MONTH_YEAR}.`,
  },
  {
    id: "interview_article",
    label: "Interview Tips Article",
    icon: "🎯",
    description: "Write an interview preparation guide",
    color: "#16a34a",
    prompt: `Write a comprehensive interview tips article for jobnique.com targeting US job seekers. Choose a specific interview topic with high search volume. Output ONLY valid JSON with section: "interview-tips" and appropriate subcategory. Today's date is ${MONTH_YEAR}.`,
  },
  {
    id: "salary_article",
    label: "Salary Guide Article",
    icon: "💰",
    description: "Write a salary guide or negotiation article",
    color: "#7e22ce",
    prompt: `Write a detailed salary guide article for jobnique.com for ${YEAR}. Choose a specific role, industry, or salary negotiation topic with high search volume. Output ONLY valid JSON with section: "career-advice" and subcategory: "Salary". Today's date is ${MONTH_YEAR}.`,
  },
  {
    id: "keywords",
    label: "Keyword Research",
    icon: "🔍",
    description: "Find low-competition keywords to target",
    color: "#b45309",
    prompt: `Do keyword research for jobnique.com. Find 20 high-traffic, low-competition US job search and career advice keywords perfect for a site trying to reach 1 million monthly Google views. Group by intent (Informational / Commercial) and difficulty (Easy / Medium / Hard). Format as a markdown table with columns: Keyword, Monthly Searches, Difficulty, Intent, Content Type.`,
  },
  {
    id: "seo_audit",
    label: "SEO Audit",
    icon: "📊",
    description: "Get a prioritised SEO improvement plan",
    color: "#dc2626",
    prompt: `Perform a detailed SEO audit for jobnique.com. Pages: /, /jobs, /career-advice, /interview-tips, /cv-templates, /salaries, /paycheck-calculator. Niche: US job search platform. Goal: 1 million monthly Google visits and AdSense revenue. Give a prioritised action list: Quick Wins (this week), Medium Term (this month), Long Term (3+ months). Be specific and actionable.`,
  },
  {
    id: "content_calendar",
    label: "Content Calendar",
    icon: "📅",
    description: "Generate a 30-day publishing schedule",
    color: "#0f766e",
    prompt: `Create a 30-day content calendar for jobnique.com targeting 1 million monthly views. For each article: title, target keyword, monthly search volume (estimated), competition (Easy/Medium/Hard), content type (career-advice or interview-tips), subcategory, and publish date. Format as a markdown table. Prioritise articles a new site can rank for within 90 days.`,
  },
  {
    id: "meta_tags",
    label: "Generate Meta Tags",
    icon: "🏷️",
    description: "Optimised title & description for every page",
    color: "#ea580c",
    prompt: `Generate optimised SEO meta tags for all main pages on jobnique.com: home, /jobs, /career-advice, /interview-tips, /cv-templates, /salaries, /paycheck-calculator. Title tag max 60 chars. Meta description max 155 chars. Format as a markdown table with columns: Page, Title Tag, Meta Description, Primary Keyword, Notes.`,
  },
];

const AUTO_TOPICS = [
  `How to write a CV with no experience — ${YEAR} guide`,
  `Best resume format for ${YEAR} — complete guide`,
  `How to answer 'Tell me about yourself' — ${YEAR}`,
  `Salary negotiation scripts that work in ${YEAR}`,
  `How to find a job fast in ${YEAR} — proven strategies`,
  `Common interview questions and answers — ${YEAR}`,
  `How to write a cover letter — ${YEAR} guide`,
  `Career change guide for ${YEAR} — how to switch industries`,
  `How to use LinkedIn to get a job in ${YEAR}`,
  `Average salaries by profession in the US — ${YEAR}`,
  `How to get promoted at work in ${YEAR}`,
  `Remote job search tips — ${YEAR} guide`,
  `How to negotiate a pay rise in ${YEAR}`,
  `Job interview tips for ${YEAR} — complete guide`,
  `How to write a resignation letter — ${YEAR} template`,
  `Best jobs for career changers in ${YEAR}`,
  `How to get a job with no degree in ${YEAR}`,
  `Behavioural interview questions and STAR answers`,
  `How to answer salary expectation questions`,
  `How to follow up after a job interview`,
];

const ARTICLE_SYSTEM_PROMPT = `You are the AI content manager for jobnique.com — a US job search platform targeting 1 million monthly Google visits and AdSense revenue.

SITE: jobnique.com | Pages: /, /jobs, /career-advice, /interview-tips, /cv-templates, /salaries, /paycheck-calculator
NICHE: US job search — career advice, interview tips, CV/resume writing, salary guides, job search strategies
AUDIENCE: US job seekers at all levels — graduates, mid-career, career changers

ARTICLE JSON FORMAT (output ONLY this JSON, no markdown fences, no explanation):
{
  "slug": "article-slug-here",
  "title": "Article Title Here",
  "description": "155 char max SEO meta description.",
  "category": "Career Advice",
  "subcategory": "CV Writing",
  "readTime": 7,
  "featured": false,
  "section": "career-advice",
  "content": "Full markdown article content using ## for headings, **bold**, - for bullet lists"
}

SUBCATEGORY OPTIONS:
- section "career-advice": subcategory must be one of: "CV Writing", "Interviews", "Salary", "Career Change", "Job Search"
- section "interview-tips": subcategory must be one of: "Preparation", "Common Questions", "Body Language"

SEO RULES:
- Title under 60 characters
- Minimum 800 words of content
- Use ## headings, **bold**, - bullet lists
- Include actionable, specific advice
- Reference jobnique.com/jobs and jobnique.com/salaries naturally
- Output ONLY raw JSON starting with { and ending with }`;

const AGENT_SECRET = process.env.NEXT_PUBLIC_AGENT_SECRET || "";

function tryParseArticle(text: string): ParsedArticle | null {
  try {
    const stripped = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    const match = stripped.match(/\{[\s\S]*"slug"[\s\S]*"content"[\s\S]*\}/);
    if (!match) return null;
    const obj = JSON.parse(match[0]);
    if (obj.slug && obj.title && obj.content) return obj as ParsedArticle;
    return null;
  } catch { return null; }
}

function extractCodeBlock(text: string): { prose: string; code: string; label: string } | null {
  const match = text.match(/```(\w*)\n([\s\S]*?)```/);
  if (!match) return null;
  return { label: match[1] || "code", code: match[2], prose: text.replace(/```[\s\S]*?```/, "").trim() };
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function AgentClient() {
  const [messages, setMessages] = useState<AgentMessage[]>([{
    role: "system",
    content: "🤖 Jobnique AI Content Agent is online.\n\nI can write full SEO articles on career advice, interview tips, and salary guides — and publish them directly to your site. Pick a task or type a custom instruction.",
    timestamp: new Date(),
  }]);
  const [input, setInput]               = useState("");
  const [loading, setLoading]           = useState(false);
  const [activeTask, setActiveTask]     = useState<TaskType | null>(null);
  const [history, setHistory]           = useState<{ role: string; content: string }[]>([]);
  const [copiedIdx, setCopiedIdx]       = useState<number | null>(null);
  const [publishStatus, setPublishStatus]   = useState<Record<number, PublishStatus>>({});
  const [publishResult, setPublishResult]   = useState<Record<number, string>>({});
  const [articleCount, setArticleCount]     = useState(20);
  const [autoPublishing, setAutoPublishing] = useState(false);
  const [autoProgress, setAutoProgress]     = useState<{ current: number; total: number; log: string[] }>({ current: 0, total: 3, log: [] });
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, autoProgress.log]);

  useEffect(() => {
    fetch("/api/publish", { headers: { "x-agent-secret": AGENT_SECRET } })
      .then(r => r.json())
      .then(d => { if (d.count) setArticleCount(d.count); })
      .catch(() => {});
  }, []);

  async function autoPublish() {
    if (autoPublishing || loading) return;
    setAutoPublishing(true);
    setAutoProgress({ current: 0, total: 3, log: [] });

    const addLog = (msg: string) =>
      setAutoProgress(prev => ({ ...prev, log: [...prev.log, msg] }));

    const shuffled = [...AUTO_TOPICS].sort(() => Math.random() - 0.5).slice(0, 3);

    for (let i = 0; i < 3; i++) {
      const topic = shuffled[i];
      setAutoProgress(prev => ({ ...prev, current: i + 1 }));
      addLog(`📝 Article ${i + 1}/3: Generating "${topic.split("—")[0].trim()}"...`);

      try {
        const res = await fetch("/api/agent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 8000,
            system: ARTICLE_SYSTEM_PROMPT,
            messages: [{ role: "user", content: `Write a complete SEO-optimised article for jobnique.com about: ${topic}. Today's date is ${MONTH_YEAR}. Output ONLY raw JSON starting with { and ending with }.` }],
          }),
        });

        const data = await res.json();
        const text = data.content?.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n") ?? "";
        const stripped = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const match = stripped.match(/\{[\s\S]*"slug"[\s\S]*"content"[\s\S]*\}/);

        if (!match) { addLog(`⚠️ Article ${i + 1} — JSON parse failed, skipping.`); continue; }

        const article = JSON.parse(match[0]);
        addLog(`✅ Generated: "${article.title}" — publishing to GitHub...`);

        const pubRes = await fetch("/api/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-agent-secret": AGENT_SECRET },
          body: JSON.stringify({ article }),
        });
        const pubData = await pubRes.json();

        if (!pubRes.ok) { addLog(`⚠️ Publish failed: ${pubData.error}`); }
        else { addLog(`🚀 Published! → jobnique.com/${article.section}/${article.slug}`); setArticleCount(c => c + 1); }
      } catch (err) {
        addLog(`❌ Error on article ${i + 1}: ${String(err)}`);
      }

      if (i < 2) { addLog(`⏳ Waiting 10 seconds before next article...`); await new Promise(r => setTimeout(r, 10000)); }
    }

    addLog(`🎉 Done! Vercel is deploying all 3 articles now (~2 min).`);
    setAutoPublishing(false);
  }

  async function sendMessage(userText: string, task?: TaskType) {
    if (!userText.trim() || loading) return;
    setLoading(true);
    const userMsg: AgentMessage = { role: "user", content: userText, timestamp: new Date(), task };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    const newHistory = [...history, { role: "user", content: userText }];

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-5", max_tokens: 8000, system: ARTICLE_SYSTEM_PROMPT, messages: newHistory }),
      });
      const data = await res.json();
      const text = data.content?.filter((b: { type: string }) => b.type === "text").map((b: { text: string }) => b.text).join("\n") ?? "No response.";
      const extracted = extractCodeBlock(text);
      const parsedArticle = tryParseArticle(extracted?.code ?? text);

      const agentMsg: AgentMessage = {
        role: "agent",
        content: extracted ? (extracted.prose || "Here is the generated content:") : parsedArticle ? `✅ Article generated: **${parsedArticle.title}**\n\nReady to publish directly to jobnique.com — click **Publish Now** below.` : text,
        timestamp: new Date(),
        codeBlock: extracted?.code,
        codeLabel: extracted?.label,
        parsedArticle,
      };

      setMessages(prev => [...prev, agentMsg]);
      setHistory([...newHistory, { role: "assistant", content: text }]);
    } catch {
      setMessages(prev => [...prev, { role: "agent", content: "⚠️ Error connecting to AI. Please check your API key and try again.", timestamp: new Date() }]);
    }
    setLoading(false);
  }

  async function publishArticle(msgIdx: number, article: ParsedArticle) {
    setPublishStatus(prev => ({ ...prev, [msgIdx]: "publishing" }));
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-agent-secret": AGENT_SECRET },
        body: JSON.stringify({ article }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setPublishStatus(prev => ({ ...prev, [msgIdx]: "error" }));
        setPublishResult(prev => ({ ...prev, [msgIdx]: data.error || "Unknown error" }));
        return;
      }
      setPublishStatus(prev => ({ ...prev, [msgIdx]: "success" }));
      setPublishResult(prev => ({ ...prev, [msgIdx]: data.deployTriggered ? `🚀 Published! Live at jobnique.com/${article.section}/${article.slug} in ~2 min.` : `✅ Saved to GitHub! Vercel will deploy shortly.` }));
      setArticleCount(c => c + 1);
      setMessages(prev => [...prev, { role: "system", content: `🚀 Article "${article.title}" published to jobnique.com/${article.section}/${article.slug}`, timestamp: new Date() }]);
    } catch {
      setPublishStatus(prev => ({ ...prev, [msgIdx]: "error" }));
      setPublishResult(prev => ({ ...prev, [msgIdx]: "Network error — could not reach publish API." }));
    }
  }

  function handleTask(task: Task) { setActiveTask(task.id); sendMessage(task.prompt, task.id); }
  function handleKeyDown(e: React.KeyboardEvent) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }
  function copyCode(code: string, idx: number) { navigator.clipboard.writeText(code); setCopiedIdx(idx); setTimeout(() => setCopiedIdx(null), 2000); }
  function clearChat() {
    setMessages([{ role: "system", content: "🤖 Jobnique AI Content Agent is online.\n\nChat cleared. Pick a task or type a custom instruction.", timestamp: new Date() }]);
    setHistory([]); setActiveTask(null);
  }

  const targetArticles = 200;
  const articlePct = Math.min(100, Math.round((articleCount / targetArticles) * 100));

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", fontFamily: "'Inter',sans-serif", paddingTop: 0 }}>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(26,86,219,0.2)", background: "rgba(10,15,30,0.97)", padding: "1rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.75rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
            <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#16a34a", boxShadow: "0 0 8px #16a34a" }} />
            <Link href="/" style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", textDecoration: "none" }}>
              Job<span style={{ color: "#f97316" }}>nique</span>
            </Link>
            <span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 600, background: "rgba(26,86,219,0.12)", padding: "2px 10px", borderRadius: 20, border: "1px solid rgba(26,86,219,0.2)" }}>AI Content Agent</span>
          </div>
          <p style={{ color: "#6b7280", fontSize: "0.75rem", marginTop: "0.2rem" }}>Writes → Publishes → Deploys automatically</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem", alignItems: "center" }}>
          <div style={{ padding: "0.3rem 0.75rem", border: "1px solid rgba(22,163,74,0.3)", borderRadius: 7, background: "rgba(22,163,74,0.08)", color: "#16a34a", fontSize: "0.72rem", fontWeight: 700 }}>
            CLAUDE SONNET 4
          </div>
          <button onClick={clearChat} style={{ padding: "0.3rem 0.75rem", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, background: "transparent", color: "#6b7280", fontSize: "0.72rem", cursor: "pointer" }}>
            CLEAR
          </button>
        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 70px)" }}>

        {/* Sidebar */}
        <div style={{ width: 260, flexShrink: 0, borderRight: "1px solid rgba(26,86,219,0.12)", background: "rgba(10,15,30,0.6)", overflowY: "auto", padding: "1rem 0.85rem" }}>

          <p style={{ fontSize: "0.62rem", color: "#6b7280", letterSpacing: "0.15em", fontWeight: 700, marginBottom: "0.7rem", paddingLeft: "0.2rem" }}>QUICK TASKS</p>

          {/* Auto-publish button */}
          <button onClick={autoPublish} disabled={autoPublishing || loading}
            style={{ width: "100%", marginBottom: "0.75rem", padding: "0.75rem 0.8rem", borderRadius: 9, border: "1px solid rgba(22,163,74,0.35)", background: autoPublishing ? "rgba(22,163,74,0.05)" : "rgba(22,163,74,0.1)", color: "#16a34a", cursor: autoPublishing || loading ? "not-allowed" : "pointer", textAlign: "left", opacity: autoPublishing || loading ? 0.7 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.2rem" }}>
              <span style={{ fontSize: "0.95rem" }}>🚀</span>
              <span style={{ fontWeight: 700, fontSize: "0.84rem", color: "#16a34a" }}>
                {autoPublishing ? `Publishing ${autoProgress.current}/3...` : "Auto-Publish 3 Articles"}
              </span>
            </div>
            <p style={{ fontSize: "0.68rem", color: "rgba(22,163,74,0.7)", lineHeight: 1.4, paddingLeft: "1.4rem" }}>
              {autoPublishing ? "Working… do not close this tab" : "Generate & publish 3 SEO articles in one click"}
            </p>
          </button>

          {autoProgress.log.length > 0 && (
            <div style={{ marginBottom: "0.75rem", padding: "0.65rem", borderRadius: 7, background: "rgba(0,0,0,0.3)", border: "1px solid rgba(22,163,74,0.15)", maxHeight: 160, overflowY: "auto" }}>
              {autoProgress.log.map((line, i) => (
                <p key={i} style={{ fontSize: "0.62rem", color: line.startsWith("❌") ? "#ef4444" : line.startsWith("⚠️") ? "#f59e0b" : line.startsWith("🎉") ? "#f59e0b" : "#16a34a", lineHeight: 1.5, marginBottom: "0.15rem" }}>{line}</p>
              ))}
            </div>
          )}

          <div style={{ height: 1, background: "rgba(26,86,219,0.12)", marginBottom: "0.75rem" }} />

          {TASKS.map(task => (
            <button key={task.id} onClick={() => handleTask(task)} disabled={loading || autoPublishing}
              style={{ width: "100%", marginBottom: "0.4rem", padding: "0.65rem 0.8rem", borderRadius: 9, border: `1px solid ${activeTask === task.id ? task.color + "44" : "rgba(255,255,255,0.05)"}`, background: activeTask === task.id ? task.color + "10" : "rgba(255,255,255,0.02)", cursor: loading || autoPublishing ? "not-allowed" : "pointer", textAlign: "left", opacity: loading || autoPublishing ? 0.55 : 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.45rem", marginBottom: "0.15rem" }}>
                <span style={{ fontSize: "0.9rem" }}>{task.icon}</span>
                <span style={{ fontWeight: 700, fontSize: "0.82rem", color: activeTask === task.id ? task.color : "#e5e7eb" }}>{task.label}</span>
              </div>
              <p style={{ fontSize: "0.68rem", color: "#6b7280", lineHeight: 1.4, paddingLeft: "1.35rem" }}>{task.description}</p>
            </button>
          ))}

          {/* Goal tracker */}
          <div style={{ marginTop: "1.25rem", padding: "0.9rem", borderRadius: 9, border: "1px solid rgba(26,86,219,0.15)", background: "rgba(26,86,219,0.04)" }}>
            <p style={{ fontSize: "0.62rem", color: "#1a56db", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "0.75rem" }}>GOAL TRACKER</p>

            {[
              { label: "Articles published", value: `${articleCount} / ${targetArticles}`, pct: articlePct, color: "#1a56db" },
              { label: "Monthly views target", value: "0 / 1M", pct: 1, color: "#f97316" },
              { label: "AdSense revenue", value: "$0 / $1,500", pct: 1, color: "#16a34a" },
            ].map(g => (
              <div key={g.label} style={{ marginBottom: "0.65rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#6b7280", marginBottom: "0.25rem" }}>
                  <span>{g.label}</span>
                  <span style={{ color: g.color }}>{g.value}</span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.pct}%`, background: g.color, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            ))}
          </div>

          {/* Setup checklist */}
          <div style={{ marginTop: "1rem", padding: "0.9rem", borderRadius: 9, border: "1px solid rgba(249,115,22,0.15)", background: "rgba(249,115,22,0.04)" }}>
            <p style={{ fontSize: "0.62rem", color: "#f97316", fontWeight: 700, letterSpacing: "0.12em", marginBottom: "0.6rem" }}>SETUP CHECKLIST</p>
            {[
              { label: "ANTHROPIC_API_KEY set", done: true },
              { label: "AGENT_SECRET set", done: true },
              { label: "GITHUB_TOKEN set", done: true },
              { label: "GITHUB_REPO set", done: true },
              { label: "VERCEL_DEPLOY_HOOK set", done: true },
            ].map(item => (
              <div key={item.label} style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.75rem", color: item.done ? "#16a34a" : "#f97316" }}>{item.done ? "✅" : "⬜"}</span>
                <span style={{ fontSize: "0.66rem", color: item.done ? "#6b7280" : "#f97316" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>

            {messages.map((msg, idx) => (
              <div key={idx}>

                {msg.role === "system" && (
                  <div style={{ textAlign: "center", padding: "0.85rem 1.25rem", background: "rgba(26,86,219,0.04)", border: "1px solid rgba(26,86,219,0.1)", borderRadius: 10, color: "#9ca3af", fontSize: "0.85rem", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>
                    {msg.content}
                  </div>
                )}

                {msg.role === "user" && (
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <div style={{ maxWidth: "70%", background: "rgba(26,86,219,0.1)", border: "1px solid rgba(26,86,219,0.25)", borderRadius: "14px 14px 4px 14px", padding: "0.7rem 1rem" }}>
                      <p style={{ color: "#e5e7eb", fontSize: "0.88rem", lineHeight: 1.6 }}>{msg.content}</p>
                      <p style={{ fontSize: "0.65rem", color: "rgba(107,114,128,0.8)", marginTop: "0.35rem", textAlign: "right" }}>{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                )}

                {msg.role === "agent" && (
                  <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                    <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(26,86,219,0.1)", border: "1px solid rgba(26,86,219,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>🤖</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ background: "rgba(15,20,40,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px 14px 14px 14px", padding: "0.85rem 1.05rem" }}>
                        <p style={{ color: "#e5e7eb", fontSize: "0.88rem", lineHeight: 1.75, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                      </div>

                      {msg.codeBlock && !msg.parsedArticle && (
                        <div style={{ marginTop: "0.65rem", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.45rem 0.9rem", background: "rgba(26,86,219,0.06)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                            <span style={{ fontSize: "0.68rem", color: "#1a56db", fontWeight: 700, letterSpacing: "0.1em" }}>{(msg.codeLabel || "code").toUpperCase()}</span>
                            <button onClick={() => copyCode(msg.codeBlock!, idx)} style={{ padding: "0.25rem 0.7rem", borderRadius: 5, border: "1px solid rgba(26,86,219,0.25)", background: copiedIdx === idx ? "rgba(22,163,74,0.12)" : "transparent", color: copiedIdx === idx ? "#16a34a" : "#1a56db", fontSize: "0.68rem", cursor: "pointer", fontWeight: 700 }}>
                              {copiedIdx === idx ? "✓ COPIED" : "📋 COPY"}
                            </button>
                          </div>
                          <pre style={{ padding: "0.9rem", overflowX: "auto", fontSize: "0.75rem", lineHeight: 1.6, color: "#a8d8ff", fontFamily: "monospace", background: "#020810", maxHeight: 360, overflowY: "auto" }}>
                            {msg.codeBlock}
                          </pre>
                        </div>
                      )}

                      {msg.parsedArticle && (
                        <div style={{ marginTop: "0.75rem", borderRadius: 10, border: "1px solid rgba(22,163,74,0.25)", overflow: "hidden", background: "rgba(22,163,74,0.04)" }}>
                          <div style={{ padding: "0.85rem 1rem", borderBottom: "1px solid rgba(22,163,74,0.12)" }}>
                            <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#e5e7eb", marginBottom: "0.3rem" }}>{msg.parsedArticle.title}</div>
                            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                              {[
                                { label: msg.parsedArticle.subcategory, color: "#1a56db" },
                                { label: msg.parsedArticle.readTime + " min read", color: "#6b7280" },
                                { label: "/" + msg.parsedArticle.section + "/" + msg.parsedArticle.slug, color: "#f97316" },
                              ].map(tag => (
                                <span key={tag.label} style={{ fontSize: "0.68rem", padding: "0.2rem 0.55rem", borderRadius: 20, border: `1px solid ${tag.color}33`, color: tag.color }}>{tag.label}</span>
                              ))}
                            </div>
                          </div>

                          <div style={{ padding: "0.85rem 1rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                            {(!publishStatus[idx] || publishStatus[idx] === "idle") && (
                              <>
                                <button onClick={() => publishArticle(idx, msg.parsedArticle!)}
                                  style={{ padding: "0.55rem 1.25rem", borderRadius: 8, border: "1px solid rgba(22,163,74,0.5)", background: "rgba(22,163,74,0.12)", color: "#16a34a", fontSize: "0.84rem", cursor: "pointer", fontWeight: 700 }}>
                                  🚀 PUBLISH NOW
                                </button>
                                <button onClick={() => copyCode(JSON.stringify(msg.parsedArticle, null, 2), idx)}
                                  style={{ padding: "0.55rem 1rem", borderRadius: 8, border: "1px solid rgba(26,86,219,0.2)", background: "transparent", color: "#1a56db", fontSize: "0.84rem", cursor: "pointer", fontWeight: 700 }}>
                                  {copiedIdx === idx ? "✓ COPIED" : "📋 COPY JSON"}
                                </button>
                              </>
                            )}
                            {publishStatus[idx] === "publishing" && (
                              <span style={{ fontSize: "0.84rem", color: "#16a34a", fontWeight: 700 }}>⏳ Publishing to GitHub...</span>
                            )}
                            {publishStatus[idx] === "success" && (
                              <div>
                                <p style={{ fontSize: "0.84rem", color: "#16a34a", fontWeight: 700 }}>{publishResult[idx]}</p>
                                <a href={`/${msg.parsedArticle.section}/${msg.parsedArticle.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: "0.72rem", color: "#1a56db", textDecoration: "underline", marginTop: "0.25rem", display: "inline-block" }}>View article →</a>
                              </div>
                            )}
                            {publishStatus[idx] === "error" && (
                              <div>
                                <p style={{ fontSize: "0.84rem", color: "#ef4444", fontWeight: 700 }}>⚠️ {publishResult[idx]}</p>
                                <button onClick={() => publishArticle(idx, msg.parsedArticle!)} style={{ fontSize: "0.72rem", color: "#1a56db", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", marginTop: "0.25rem" }}>Try again</button>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      <p style={{ fontSize: "0.65rem", color: "#6b7280", marginTop: "0.35rem", paddingLeft: "0.2rem" }}>{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, background: "rgba(26,86,219,0.1)", border: "1px solid rgba(26,86,219,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", flexShrink: 0 }}>🤖</div>
                <div style={{ background: "rgba(15,20,40,0.9)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "4px 14px 14px 14px", padding: "0.85rem 1.05rem", display: "flex", gap: 5, alignItems: "center" }}>
                  {[0,1,2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: "#1a56db", animation: `pulse ${1.2 + i * 0.2}s ease-in-out infinite` }} />)}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ borderTop: "1px solid rgba(26,86,219,0.1)", padding: "0.9rem 1.25rem", background: "rgba(10,15,30,0.9)" }}>
            <div style={{ display: "flex", gap: "0.45rem", marginBottom: "0.65rem", flexWrap: "wrap" }}>
              {[
                "Write a CV guide article and publish it",
                "Research best keywords for this week",
                "Write an interview tips article for software engineers",
                "Give me a 30-day content calendar",
              ].map(s => (
                <button key={s} onClick={() => { setInput(s); textareaRef.current?.focus(); }} disabled={loading || autoPublishing}
                  style={{ padding: "0.3rem 0.7rem", borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", color: "#6b7280", fontSize: "0.72rem", cursor: "pointer", opacity: loading || autoPublishing ? 0.5 : 1 }}>
                  {s}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "0.65rem", alignItems: "flex-end" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type an instruction… (Enter to send, Shift+Enter for new line)"
                disabled={loading || autoPublishing}
                rows={2}
                style={{ flex: 1, background: "rgba(15,20,40,0.85)", border: "1px solid rgba(26,86,219,0.2)", borderRadius: 9, padding: "0.65rem 0.9rem", color: "#e5e7eb", fontSize: "0.88rem", resize: "none", outline: "none", lineHeight: 1.5, fontFamily: "inherit" }}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || autoPublishing || !input.trim()}
                style={{ padding: "0.65rem 1.1rem", borderRadius: 9, border: "1px solid rgba(26,86,219,0.35)", background: loading || autoPublishing || !input.trim() ? "rgba(26,86,219,0.04)" : "rgba(26,86,219,0.13)", color: loading || autoPublishing || !input.trim() ? "#6b7280" : "#1a56db", cursor: loading || autoPublishing || !input.trim() ? "not-allowed" : "pointer", fontSize: "1.05rem", flexShrink: 0 }}>
                {loading ? "⏳" : "➤"}
              </button>
            </div>

            <p style={{ fontSize: "0.65rem", color: "#6b7280", marginTop: "0.45rem", textAlign: "center" }}>
              Articles are saved to <code style={{ color: "#1a56db", background: "rgba(26,86,219,0.08)", padding: "0 3px", borderRadius: 3 }}>GitHub</code> and deployed via Vercel automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
