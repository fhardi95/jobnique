import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  if (!token || !email) {
    return NextResponse.redirect(new URL("/login?error=invalid-token", req.url));
  }

  // TODO: Verify token against your database
  // Example with Supabase:
  // const { data } = await supabase.from("verification_tokens")
  //   .select().eq("token", token).eq("email", email).single();
  // if (!data || new Date(data.expires_at) < new Date()) {
  //   return NextResponse.redirect(new URL("/login?error=expired-token", req.url));
  // }
  // await supabase.from("users").update({ email_verified: true }).eq("email", email);
  // await supabase.from("verification_tokens").delete().eq("token", token);

  // For now redirect to success page
  return NextResponse.redirect(new URL("/email-verified", req.url));
}
