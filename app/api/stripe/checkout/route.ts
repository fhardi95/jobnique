import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout Session for resume builder plans.
 *
 * Setup:
 *  1. npm install stripe
 *  2. Add STRIPE_SECRET_KEY to .env.local
 *  3. Add STRIPE_PRICE_7DAY and STRIPE_PRICE_QUARTERLY (Price IDs from Stripe dashboard)
 *  4. Add NEXT_PUBLIC_BASE_URL to .env.local (e.g. https://jobnique.com)
 *
 * Then update ResumeBuilderClient.tsx to call this endpoint instead of the mock payment.
 */

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    // Lazy-load Stripe so the route works even without the package during dev
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
      apiVersion: "2024-04-10",
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
      mode: plan === "7day" ? "subscription" : "subscription",
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/resume-builder/builder?step=download&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/resume-builder/builder?step=payment`,
      subscription_data:
        plan === "7day"
          ? { trial_period_days: 7 }
          : undefined,
      metadata: { plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("Stripe error:", err);
    const message = err instanceof Error ? err.message : "Payment error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
