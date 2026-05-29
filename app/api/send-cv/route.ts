import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, resumeHTML, name } = await req.json();

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "api-key": process.env.BREVO_API_KEY ?? "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: { name: "Jobnique", email: "no-reply@jobnique.com" },
      to: [{ email }],
      subject: `${name || "Your"} Resume – Download from Jobnique`,
      htmlContent: resumeHTML,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
