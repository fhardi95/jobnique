import { NextRequest, NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

async function getFile(token: string, repo: string, branch: string, filePath: string) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${filePath}?ref=${branch}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`GitHub: could not read ${filePath} (${res.status})`);
  const data = await res.json();
  return { content: Buffer.from(data.content, "base64").toString("utf8"), sha: data.sha };
}

async function updateFile(
  token: string, repo: string, branch: string,
  filePath: string, newContent: string, sha: string, message: string
) {
  const res = await fetch(`${GITHUB_API}/repos/${repo}/contents/${filePath}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json", "Content-Type": "application/json" },
    body: JSON.stringify({ message, content: Buffer.from(newContent).toString("base64"), sha, branch }),
  });
  if (!res.ok) { const err = await res.json(); throw new Error(`GitHub update failed: ${err.message}`); }
  return res.json();
}

// ── POST: publish article to lib/articles.ts ──────────────────────────────
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-agent-secret");
  if (!process.env.AGENT_SECRET || secret !== process.env.AGENT_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) {
    return NextResponse.json({ error: "GITHUB_TOKEN or GITHUB_REPO not set." }, { status: 500 });
  }

  try {
    const { article } = await req.json();

    if (!article?.slug || !article?.title || !article?.content) {
      return NextResponse.json({ error: "Invalid article — slug, title, and content are required." }, { status: 400 });
    }

    // Read lib/articles.ts from GitHub
    const { content: articlesFile, sha } = await getFile(token, repo, branch, "lib/articles.ts");

    // Check for duplicate slug
    if (articlesFile.includes(`slug: "${article.slug}"`)) {
      return NextResponse.json({ error: `Article "${article.slug}" already exists.` }, { status: 409 });
    }

    // Escape backticks in content for template literal
    const safeContent = (article.content as string).replace(/`/g, "\\`").replace(/\${/g, "\\${");

    // Build the article entry to insert
    const entry = `
  {
    slug: "${article.slug}",
    title: ${JSON.stringify(article.title)},
    description: ${JSON.stringify(article.description)},
    category: ${JSON.stringify(article.category)},
    subcategory: ${JSON.stringify(article.subcategory)},
    readTime: ${article.readTime || 5},
    featured: ${article.featured ? "true" : "false"},
    section: "${article.section}",
    content: \`${safeContent}\`,
  },`;

    // Insert after "export const articles: Article[] = ["
    const insertMarker = "export const articles: Article[] = [";
    if (!articlesFile.includes(insertMarker)) {
      return NextResponse.json({ error: "Could not find articles array in lib/articles.ts" }, { status: 500 });
    }

    const updatedFile = articlesFile.replace(
      insertMarker + "\n",
      `${insertMarker}\n${entry}\n`
    );

    await updateFile(token, repo, branch, "lib/articles.ts", updatedFile, sha,
      `feat: add article "${article.title}" [AI Agent]`);

    // Trigger Vercel deploy
    let deployTriggered = false;
    const deployHook = process.env.VERCEL_DEPLOY_HOOK;
    if (deployHook) {
      try {
        const deployRes = await fetch(deployHook, { method: "POST" });
        deployTriggered = deployRes.ok;
      } catch { /* silent */ }
    }

    return NextResponse.json({
      success: true,
      slug: article.slug,
      deployTriggered,
      liveUrl: `https://www.jobnique.com/career-advice/${article.slug}`,
    });

  } catch (err) {
    console.error("Publish error:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal server error" }, { status: 500 });
  }
}

// ── GET: count published articles ─────────────────────────────────────────
export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-agent-secret");
  if (!process.env.AGENT_SECRET || secret !== process.env.AGENT_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const token  = process.env.GITHUB_TOKEN;
  const repo   = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || "main";

  if (!token || !repo) return NextResponse.json({ count: 0, slugs: [] });

  try {
    const { content } = await getFile(token, repo, branch, "lib/articles.ts");
    const slugs = [...content.matchAll(/slug: "([^"]+)"/g)]
      .map(m => m[1])
      .filter(s => s !== "string");
    return NextResponse.json({ count: slugs.length, slugs });
  } catch {
    return NextResponse.json({ count: 0, slugs: [] });
  }
}
