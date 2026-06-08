import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    // TODO: Connect to Mailchimp, ConvertKit, or Brevo API
    // Example with Mailchimp:
    // const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;
    // const MAILCHIMP_LIST_ID = process.env.MAILCHIMP_LIST_ID;
    // const MAILCHIMP_DC = process.env.MAILCHIMP_DC; // e.g. "us1"
    // await fetch(`https://${MAILCHIMP_DC}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`, {
    //   method: "POST",
    //   headers: { Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString("base64")}`, "Content-Type": "application/json" },
    //   body: JSON.stringify({ email_address: email, status: "subscribed" }),
    // });
    console.log("Newsletter signup:", email);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
