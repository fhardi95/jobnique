import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ── GET — list all sources ─────────────────────────────────────────────
export async function GET() {
  const { data, error } = await supabase
    .from("ats_sources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ sources: data });
}

// ── POST — add a new source from a URL ────────────────────────────────
export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: "URL is required." }, { status: 400 });

    const parsed = parseAtsUrl(url.trim());
    if (!parsed) {
      return NextResponse.json({
        error: "Invalid URL. Supported formats:\n• https://boards.greenhouse.io/TOKEN\n• https://jobs.lever.co/SLUG\n• https://TENANT.wd5.myworkdayjobs.com/en-US/TENANT/SITE"
      }, { status: 400 });
    }

    // Test the URL actually works before saving
    const valid = await validateSource(parsed);
    if (!valid) {
      return NextResponse.json({
        error: `Could not find any jobs at this URL. Please check the URL is correct and the company has open roles.`
      }, { status: 400 });
    }

    // Upsert (ignore duplicate)
    const { data, error } = await supabase
      .from("ats_sources")
      .upsert({ ...parsed, active: true }, { onConflict: "platform,token" })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ source: data });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
}

// ── PATCH — toggle active/inactive ────────────────────────────────────
export async function PATCH(req: Request) {
  const { id, active } = await req.json();
  const { error } = await supabase
    .from("ats_sources")
    .update({ active })
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// ── DELETE — remove a source ──────────────────────────────────────────
export async function DELETE(req: Request) {
  const { id } = await req.json();
  const { error } = await supabase
    .from("ats_sources")
    .delete()
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// ── Helpers ───────────────────────────────────────────────────────────

interface AtsSource {
  platform: "greenhouse" | "lever" | "workday";
  token: string;       // board token / slug / "tenant:site"
  company_name: string;
}

function parseAtsUrl(url: string): AtsSource | null {
  try {
    const u = new URL(url);

    // Greenhouse: boards.greenhouse.io/TOKEN or boards-api.greenhouse.io/...
    if (u.hostname.includes("greenhouse.io")) {
      const token = u.pathname.split("/").filter(Boolean)[0];
      if (!token) return null;
      return {
        platform:     "greenhouse",
        token,
        company_name: capitalise(token),
      };
    }

    // Lever: jobs.lever.co/SLUG
    if (u.hostname === "jobs.lever.co") {
      const token = u.pathname.split("/").filter(Boolean)[0];
      if (!token) return null;
      return {
        platform:     "lever",
        token,
        company_name: capitalise(token),
      };
    }

    // Workday: TENANT.wd5.myworkdayjobs.com/en-US/TENANT/SITE
    if (u.hostname.includes("myworkdayjobs.com")) {
      const tenant = u.hostname.split(".")[0];
      const parts  = u.pathname.split("/").filter(Boolean);
      // parts: ["en-US", "tenant", "site", ...]
      const site   = parts[2] || "External_Career_Site";
      return {
        platform:     "workday",
        token:        `${tenant}:${site}`,
        company_name: capitalise(tenant),
      };
    }

    return null;
  } catch {
    return null;
  }
}

function capitalise(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function validateSource(source: AtsSource): Promise<boolean> {
  try {
    if (source.platform === "greenhouse") {
      const res = await fetch(
        `https://boards-api.greenhouse.io/v1/boards/${source.token}/jobs`,
        { signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      return res.ok && (data.jobs?.length ?? 0) > 0;
    }

    if (source.platform === "lever") {
      const res = await fetch(
        `https://api.lever.co/v0/postings/${source.token}?limit=1`,
        { signal: AbortSignal.timeout(8000) }
      );
      const data = await res.json();
      return res.ok && Array.isArray(data) && data.length > 0;
    }

    if (source.platform === "workday") {
      const [tenant, site] = source.token.split(":");
      const res = await fetch(
        `https://${tenant}.wd5.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appliedFacets: {}, limit: 1, offset: 0, searchText: "" }),
          signal: AbortSignal.timeout(8000),
        }
      );
      const data = await res.json();
      return res.ok && (data.jobPostings?.length ?? 0) > 0;
    }

    return false;
  } catch {
    return false;
  }
}
