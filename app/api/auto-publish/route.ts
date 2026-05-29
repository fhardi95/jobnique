import { NextRequest, NextResponse } from "next/server";

const BASE_TOPICS = [
  // CV Writing
  "How to write a CV with no experience — complete guide",
  "ATS-friendly CV template — how to beat the bots",
  "How to write a cover letter that gets interviews",
  "Best CV formats for 2025 — which to choose",
  "How to tailor your CV for every job application",
  "CV personal statement examples — what to write",
  "How to list skills on a CV — with examples",
  "How to write a CV for a career change",

  // Job Search
  "How to find a job fast — proven strategies",
  "How to use LinkedIn to find a job in 2025",
  "Job search mistakes that are costing you interviews",
  "How to write a cold email to get a job",
  "Best job search sites in the US — ranked",
  "How to follow up after a job application",
  "How to get a job through networking",

  // Interviews
  "How to answer 'Why do you want to work here?'",
  "How to answer 'What is your greatest weakness?'",
  "How to answer 'Where do you see yourself in 5 years?'",
  "How to answer 'Tell me about yourself' — with examples",
  "Common behavioural interview questions and answers",
  "How to prepare for a phone interview",
  "How to prepare for a second interview",
  "Questions to ask at the end of a job interview",
  "How to follow up after an interview",

  // Salary
  "How to negotiate salary — with exact scripts",
  "How to answer salary expectation questions",
  "Average salaries by industry in the US — 2025",
  "How to ask for a pay rise — with scripts",
  "How to evaluate a job offer — beyond the salary",

  // Career Development
  "How to get promoted at work — proven strategies",
  "How to build your professional network from scratch",
  "How to find a mentor at work",
  "How to deal with a difficult boss",
  "How to resign professionally — with template",
  "How to handle being made redundant",
  "Remote work tips — how to stay productive at home",
  "How to get a job at a startup",
  "How to get a job at a FAANG company",

  // Specific roles
  "How to get into product management with no experience",
  "How to become a data analyst in 2025",
  "How to get into tech sales",
  "How to become a UX designer — complete guide",
  "How to get a job in marketing with no experience",
];

const ARTICLE_SYSTEM_PROMPT = `You are the AI content manager for jobnique.com — a US job search platform targeting 1 million monthly Google visits and AdSense revenue.

SITE: jobnique.com | Pages: /, /jobs, /career-advice, /interview-tips, /cv-templates, /salaries, /paycheck-calculator
NICHE: US job search — career advice, interview tips, CV/resume writing, salary guides, job search strategies
AUDIENCE: US job seekers at all levels — graduates, mid-career, career changers

ARTICLE JSON FORMAT — output ONLY this JSON, no markdown fences, no explanation:
{
  "slug": "article-slug-here",
  "title": "Article Title Here",
  "description": "155 char max SEO meta description.",
  "category": "Career Advice",
  "subcategory": "CV Writing",
  "readTime": 7,
  "featured": false,
  "section": "career-advice",
  "content": "Full markdown content here using ## for headings, **bold**, - for bullet lists, *italic for callouts*"
}

SUBCATEGORY OPTIONS:
- section "career-advice": subcategory must be one of: "CV Writing", "Interviews", "Salary", "Career Change", "Job Search"
- section "interview-tips": subcategory must be one of: "Preparation", "Common Questions", "Body Language"

SEO RULES:
- Title under 60 characters
- Include the target keyword naturally in title, description, and content
- Minimum 800 words of content
- Use ## headings to structure the article
- Include specific, actionable advice — not generic platitudes
- Reference jobnique.com/jobs and jobnique.com/salaries naturally where relevant
- Output ONLY raw JSON starting with { and ending with }`;

async function generateArticle(apiKey: string, topic: string): Promise<Record<string, unknown> | null> {
  const now = new Date();
  const monthYear = now.toLocaleString("en-US", { month: "long", year: "numeric" });

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-5",
      max_tokens: 8000,
      system: ARTICLE_SYSTEM_PROMPT,
      messages: [{
        role: "user",
        content: `Write a complete SEO-optimised article for jobnique.com about: ${topic}. Today's date is ${monthYear}. Output ONLY raw JSON starting with { and ending with }.`,
      }],
    }),
  });

  const data = await res.json();
  const text = data.content
    ?.filter((b: { type: string }) => b.type === "text")
    .map((b: { text: string }) => b.text)
    .join("\n") ?? "";

  const stripped = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  const match = stripped.match(/\{[\s\S]*"slug"[\s\S]*"content"[\s\S]*\}/);
  if (!match) return null;

  try { return JSON.parse(match[0]); }
  catch { return null; }
}

async function publishArticle(
  token: string, repo: string, branch: string,
  article: Record<string, unknown>
): Promise<{ success: boolean; error?: string }> {
  try {
    const GITHUB_API = "https://api.github.com";

    // Read lib/articles.ts
    const readRes = await fetch(`${GITHUB_API}/repos/${repo}/contents/lib/articles.ts?ref=${branch}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
    });
    if (!readRes.ok) throw new Error(`Could not read articles.ts (${readRes.status})`);
    const readData = await readRes.json();
    const articlesFile = Buffer.from(readData.content, "base64").toString("utf8");
    const sha = readData.sha;

    // Check duplicate
    if (articlesFile.includes(`slug: "${article.slug}"`)) {
      return { success: false, error: `Slug "${article.slug}" already exists` };
    }

    const safeContent = (article.content as string)
      .replace(/`/g, "\\`")
      .replace(/\${/g, "\\${");

    const entry = `
  {
    slug: "${article.slug}",
    title: ${JSON.stringify(article.title)},
    description: ${JSON.stringify(article.description)},
    category: ${JSON.stringify(article.category)},
    subcategory: ${JSON.stringify(article.subcategory)},
    readTime: ${article.readTime || 5},
    featured: false,
    section: "${article.section}",
    content: \`${safeContent}\`,
  },`;

    const insertMarker = "export const articles: Article[] = [";
    if (!articlesFile.includes(insertMarker)) {
      return { success: false, error: "Could not find articles array" };
    }

    const updatedFile = articlesFile.replace(insertMarker + "\n", `${insertMarker}\n${entry}\n`);

    // Write back to GitHub
    await fetch(`${GITHUB_API}/repos/${repo}/contents/lib/articles.ts`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
      body: JSON.stringify({
        message: `feat: add "${article.title}" [Daily Agent]`,
        content: Buffer.from(updatedFile).toString("base64"),
        sha,
        branch,
      }),
    });

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-agent-secret");
  if (!process.env.AGENT_SECRET || secret !== process.env.AGENT_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!apiKey || !token || !repo) {
    return NextResponse.json({ error: "Missing environment variables" }, { status: 500 });
  }

  const topic = BASE_TOPICS[Math.floor(Math.random() * BASE_TOPICS.length)];
  const results: { topic: string; slug?: string; success: boolean; error?: string }[] = [];

  try {
    const article = await generateArticle(apiKey, topic);
    if (!article) {
      results.push({ topic, success: false, error: "Failed to generate article" });
    } else {
      const publishResult = await publishArticle(token, repo, branch, article);
      results.push({ topic, slug: article.slug as string, ...publishResult });
    }
  } catch (err) {
    results.push({ topic, success: false, error: err instanceof Error ? err.message : "Unknown error" });
  }

  // Trigger Vercel deploy
  let deployTriggered = false;
  const deployHook = process.env.VERCEL_DEPLOY_HOOK;
  if (deployHook && results.some(r => r.success)) {
    try {
      const deployRes = await fetch(deployHook, { method: "POST" });
      deployTriggered = deployRes.ok;
    } catch { /* silent */ }
  }

  return NextResponse.json({ results, deployTriggered });
}
