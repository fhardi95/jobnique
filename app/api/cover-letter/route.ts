import { NextRequest, NextResponse } from "next/server";

// POST /api/cover-letter
// Body: { name, jobTitle, company, jobDescription, experience, skills, tone }
export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not set. Add it to your .env.local file." },
      { status: 500 }
    );
  }

  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { name, jobTitle, company, jobDescription, experience, skills, tone } = body;

  if (!name?.trim() || !jobTitle?.trim() || !company?.trim()) {
    return NextResponse.json(
      { error: "name, jobTitle, and company are required" },
      { status: 400 }
    );
  }

  const toneGuide: Record<string, string> = {
    professional:   "formal, polished, and confident",
    conversational: "warm, friendly, and approachable while remaining professional",
    enthusiastic:   "energetic, passionate, and highly motivated",
    concise:        "direct, brief, and to the point — no filler words",
  };

  const prompt = `You are an expert cover letter writer with 15+ years of experience helping candidates land interviews at top companies.

Write a compelling, tailored cover letter for the following details:

Applicant name: ${name}
Job title applying for: ${jobTitle}
Company: ${company}
${jobDescription ? `Job description / key requirements:\n${jobDescription}` : ""}
${experience    ? `Applicant's experience summary:\n${experience}` : ""}
${skills        ? `Key skills to highlight: ${skills}` : ""}
Tone: ${toneGuide[tone] || toneGuide.professional}

INSTRUCTIONS:
- Write a complete, ready-to-send cover letter (no placeholders like [your name])
- 3–4 paragraphs: strong opening, skills/experience match, why this company, confident closing
- Match the job description keywords naturally
- Keep it under 350 words
- End with a professional sign-off using the applicant's name
- Return ONLY the cover letter text — no preamble, no explanation, no markdown`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 700,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      const message = data?.error?.message || `Anthropic API returned ${response.status}`;
      return NextResponse.json({ error: message }, { status: response.status });
    }

    const letter = data.content?.[0]?.text?.trim();
    if (!letter) {
      return NextResponse.json(
        { error: "No content returned from AI. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ letter });
  } catch (err) {
    console.error("Cover letter generation error:", err);
    return NextResponse.json(
      { error: "Failed to reach the AI service. Please try again." },
      { status: 503 }
    );
  }
}
