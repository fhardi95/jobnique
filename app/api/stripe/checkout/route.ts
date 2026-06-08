import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/stripe/checkout
 *
 * Creates a Stripe Checkout session for job posting payments.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY              — Stripe secret key (sk_live_... or sk_test_...)
 *   STRIPE_PRICE_FEATURED          — Stripe Price ID for the $79 Featured Listing
 *   NEXT_PUBLIC_BASE_URL           — e.g. https://jobnique.com
 *
 * Body params:
 *   plan       — "featured" (only paid plan for job posting)
 *   email      — recruiter's contact email (pre-fills Stripe checkout)
 *   jobId      — ID returned by /api/post-a-job, stored as Stripe metadata
 *   jobTitle   — shown in Stripe checkout line-item description
 *   companyName — shown in Stripe checkout line-item description
 *
 * On success Stripe redirects to: /post-a-job/payment-success?session_id=...
 * On cancel  Stripe redirects to: /post-a-job?payment=cancelled
 *
 * The webhook at /api/stripe/webhook handles checkout.session.completed
 * and marks the job as "paid" + publishes it.
 */

export async function POST(req: NextRequest) {
  try {
    const { plan, email, jobId, jobTitle, companyName } = await req.json();

    // ── Load Stripe ──────────────────────────────────────────────────────────
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

    // ── Price ID map ─────────────────────────────────────────────────────────
    // Add more plans here as needed (e.g. "premium", "bundle")
    const PRICE_IDS: Record<string, string> = {
      featured: process.env.STRIPE_PRICE_FEATURED ?? "",
    };

    const priceId = PRICE_IDS[plan];
    if (!priceId) {
      return NextResponse.json(
        { error: `Invalid or unsupported plan: "${plan}". Add STRIPE_PRICE_FEATURED to .env.local.` },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

    // ── Create Checkout Session ──────────────────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: "payment",                         // one-time payment (not subscription)
      payment_method_types: ["card"],
      customer_email: email || undefined,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // After successful payment → back to our success page
      success_url: `${baseUrl}/post-a-job/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      // If they hit "back" in Stripe → return to review step
      cancel_url: `${baseUrl}/post-a-job?payment=cancelled`,
      // Metadata is forwarded to the webhook so we can activate the listing
      metadata: {
        plan,
        jobId:       jobId       ?? "",
        jobTitle:    jobTitle    ?? "",
        companyName: companyName ?? "",
      },
      // Nice label shown on the Stripe-hosted page
      custom_text: {
        submit: {
          message: `Your Featured Listing for "${jobTitle ?? "your job"}" at ${companyName ?? "your company"} will be published within a few hours of payment.`,
        },
      },
    });

    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err: unknown) {
    console.error("Stripe checkout error:", err);
    const message = err instanceof Error ? err.message : "Payment error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
