import { NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Generate verification token
    const token = crypto.randomBytes(32).toString("hex");

    // TODO: Save user + token to your database
    // Example with Supabase:
    // const hashedPassword = await bcrypt.hash(password, 12);
    // const { error } = await supabase.from("users").insert({
    //   name, email, password_hash: hashedPassword, email_verified: false
    // });
    // await supabase.from("verification_tokens").insert({
    //   email, token, expires_at: new Date(Date.now() + 86400000).toISOString()
    // });

    // Send confirmation email
    await sendConfirmationEmail(email, name, token);

    return NextResponse.json({ success: true, message: "Check your email to confirm your account" });
  } catch (err) {
    console.error("Registration error:", err);
    return NextResponse.json({ error: "Registration failed. Please try again." }, { status: 500 });
  }
}
