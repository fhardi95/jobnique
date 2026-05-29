import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    let Stripe: typeof import("stripe").default;
    try {
      Stripe = (await import("stripe")).default;
    } catch {
      return NextResponse.json(
        { error: "Stripe package not installed. Run: npm install stripe" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
      apiVersion: "2026-05-27.dahlia" as const,
    });

    const PRICE_IDS: Record<string, string> = {
      "7day": process.env.STRIPE_PRICE_7DAY ?? "",
      "quarterly": process.env.STRIPE_PRICE_QUARTERLY ?? "",
    };

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/resume-builder/builder?step=download&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/resume-builder/builder?step=payment`,
      subscription_data: plan === "7day" ? { trial_period_days: 7 } : undefined,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Payment error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
