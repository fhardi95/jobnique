import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events (subscription created, payment failed, etc.)
 *
 * Setup:
 *  1. Add STRIPE_WEBHOOK_SECRET to .env.local
 *  2. In Stripe Dashboard → Webhooks → Add endpoint:
 *     https://jobnique.com/api/stripe/webhook
 *  3. Select events: checkout.session.completed, customer.subscription.deleted
 */

export async function POST(req: NextRequest) {
  let Stripe: typeof import("stripe").default;
  try {
    Stripe = (await import("stripe")).default;
  } catch {
    return NextResponse.json({ error: "Stripe not installed" }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
    apiVersion: "2026-05-27.dahlia" as const,
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  let event: import("stripe").Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as import("stripe").Stripe.Checkout.Session;
      console.log("✅ Payment complete for:", session.customer_email, "Plan:", session.metadata?.plan);
      // TODO: Mark user as paid in your database
      // TODO: Send confirmation email via Brevo/Mailchimp
      break;
    }

    case "customer.subscription.deleted": {
      const sub = event.data.object as import("stripe").Stripe.Subscription;
      console.log("❌ Subscription cancelled:", sub.customer);
      // TODO: Revoke access in your database
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as import("stripe").Stripe.Invoice;
      console.log("⚠️ Payment failed for:", invoice.customer_email);
      // TODO: Send payment failure email
      break;
    }

    default:
      console.log("Unhandled event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
