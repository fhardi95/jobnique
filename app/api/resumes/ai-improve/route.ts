import { NextRequest, NextResponse } from "next/server";

// POST /api/resumes/ai-improve
// Body: { type: "summary" | "bullet" | "rewrite", content: string, context?: string }
export async function POST(req: NextRequest) {
  const { type, content, context } = await req.json();

  const prompts: Record<string, string> = {
    summary: `You are a professional resume writer. Rewrite the following professional summary to be more compelling, concise, and impactful. Use strong action words, quantify where possible, and keep it to 3-4 sentences. Return only the improved summary text, no preamble.\n\nOriginal: ${content}`,
    bullet: `You are a professional resume writer. Rewrite the following job bullet point to be more impactful. Start with a strong action verb, quantify the impact if possible, and keep it under 2 lines. Return only the improved bullet point.\n\nOriginal: ${content}`,
    rewrite: `You are a professional resume writer. Improve the following resume content to be more professional and impactful. Keep the same information but make it more compelling. Return only the improved text.\n\nContext: ${context || "resume section"}\nContent: ${content}`,
  };

  const prompt = prompts[type];
  if (!prompt) return NextResponse.json({ error: "Invalid type" }, { status: 400 });

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();
    const improved = data.content?.[0]?.text || content;
    return NextResponse.json({ improved });
  } catch {
    return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
  }
}
