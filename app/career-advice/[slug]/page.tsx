import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Newsletter from "@/components/Newsletter";
import { getArticle, getArticlesBySection, tagColors } from "@/lib/articles";

const SITE_URL = "https://www.jobnique.com";

// ── Metadata (canonical + SEO) ─────────────────────────────────────────────
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const url = `${SITE_URL}/career-advice/${slug}`;

  return {
    title:       `${article.title} | Jobnique`,
    description: article.description,
    alternates:  { canonical: url },
    openGraph: {
      title:       article.title,
      description: article.description,
      url,
      siteName:    "Jobnique",
      type:        "article",
    },
  };
}

// ── Content renderer (pure server, no hooks needed) ────────────────────────
function renderContent(content: string) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.trim() === "[CTA_RESUME_BUILDER]") {
      elements.push(
        <div key={i} style={{ margin: "36px 0", textAlign: "center" }}>
          <a
            href="https://www.jobnique.com/resume-builder"
            style={{
              display: "inline-block",
              background: "#f97316",
              color: "#fff",
              padding: "14px 32px",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: "0 4px 20px rgba(249,115,22,0.35)",
            }}
          >
            ✏️ Try Our Resume Builder — It&apos;s Free
          </a>
        </div>
      );
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={i} style={{ fontSize: 22, fontWeight: 700, marginTop: 36, marginBottom: 12, color: "#111827" }}>{line.slice(3)}</h2>);
    } else if (line.startsWith("**") && line.endsWith("**")) {
      elements.push(<p key={i} style={{ fontWeight: 700, fontSize: 15, marginBottom: 6, color: "#111827" }}>{line.slice(2, -2)}</p>);
    } else if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith("- ")) { items.push(lines[i].slice(2)); i++; }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: 20, marginBottom: 16 }}>
          {items.map((item, j) => {
            const parts = item.split(/\*\*(.*?)\*\*/g);
            return <li key={j} style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 4 }}>{parts.map((p, k) => k % 2 === 1 ? <strong key={k}>{p}</strong> : p)}</li>;
          })}
        </ul>
      );
      continue;
    } else if (line.startsWith("*") && line.endsWith("*") && !line.startsWith("**")) {
      elements.push(<p key={i} style={{ fontStyle: "italic", color: "#374151", fontSize: 14, background: "#f0f7ff", padding: "10px 16px", borderLeft: "3px solid #1a56db", borderRadius: "0 6px 6px 0", marginBottom: 16 }}>{line.slice(1, -1)}</p>);
    } else if (line.startsWith("❌") || line.startsWith("✅")) {
      elements.push(<p key={i} style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, marginBottom: 8 }}>{line}</p>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: 8 }} />);
    } else {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      elements.push(<p key={i} style={{ fontSize: 15, color: "#374151", lineHeight: 1.8, marginBottom: 10 }}>{parts.map((p, k) => k % 2 === 1 ? <strong key={k}>{p}</strong> : p)}</p>);
    }
    i++;
  }
  return elements;
}

// ── Page (server component) ────────────────────────────────────────────────
export default async function CareerAdviceArticle(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article || article.section !== "career-advice") return notFound();

  const color   = tagColors[article.subcategory];
  const related = getArticlesBySection("career-advice")
    .filter(a => a.subcategory === article.subcategory && a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <Navbar />

      {/* Article header */}
      <div style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb", padding: "32px 20px" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16, fontSize: 13, color: "#6b7280", flexWrap: "wrap" }}>
            <Link href="/career-advice" style={{ color: "#1a56db" }}>Career Advice</Link>
            <span>→</span>
            <span style={{ color: color?.text }}>{article.subcategory}</span>
          </div>
          <span style={{ display: "inline-block", background: color?.bg, color: color?.text, fontSize: 12, fontWeight: 600, padding: "3px 12px", borderRadius: 20, marginBottom: 14 }}>
            {article.subcategory}
          </span>
          <h1 style={{ fontFamily: "'DM Serif Display',serif", fontSize: "clamp(26px,4vw,40px)", lineHeight: 1.2, marginBottom: 14, color: "#111827" }}>
            {article.title}
          </h1>
          <p style={{ color: "#6b7280", fontSize: 16, lineHeight: 1.7, marginBottom: 20 }}>{article.description}</p>
          <div style={{ display: "flex", gap: 16, fontSize: 13, color: "#9ca3af" }}>
            <span>⏱ {article.readTime} min read</span>
            <span>📂 {article.subcategory}</span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div className="container" style={{ maxWidth: 760, padding: "48px 20px" }}>
        <div>{renderContent(article.content)}</div>

        {related.length > 0 && (
          <div style={{ marginTop: 56, paddingTop: 32, borderTop: "1px solid #e5e7eb" }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 20 }}>Related articles</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 14 }}>
              {related.map(r => (
                <Link key={r.slug} href={`/career-advice/${r.slug}`}
                  style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: "16px", display: "block", color: "inherit", textDecoration: "none" }}>
                  <span style={{ background: color?.bg, color: color?.text, fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, display: "inline-block", marginBottom: 8 }}>
                    {r.subcategory}
                  </span>
                  <h4 style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{r.title}</h4>
                  <span style={{ fontSize: 12, color: "#9ca3af", marginTop: 8, display: "block" }}>⏱ {r.readTime} min</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginTop: 32, textAlign: "center" }}>
          <Link href="/career-advice" style={{ color: "#1a56db", fontSize: 14, fontWeight: 500 }}>← Back to Career Advice</Link>
        </div>
      </div>

      <Newsletter />
      <Footer />
    </>
  );
}
