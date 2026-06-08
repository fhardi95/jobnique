import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/stripe/webhook
 *
 * Handles Stripe webhook events for job posting payments.
 *
 * Setup:
 *  1. Add STRIPE_WEBHOOK_SECRET to .env.local
 *  2. In Stripe Dashboard → Developers → Webhooks → Add endpoint:
 *       https://jobnique.com/api/stripe/webhook
 *     Select events:
 *       ✓ checkout.session.completed
 *       ✓ payment_intent.payment_failed
 *
 * What this does on checkout.session.completed:
 *   - Finds the job in Supabase by metadata.jobId
 *   - Sets status = "pending" (awaiting editorial review) OR "published" if you
 *     want immediate publication after payment — change the status value below.
 *   - Sends a confirmation email via Resend
 */

export async function POST(req: NextRequest) {
  // ── Load Stripe ────────────────────────────────────────────────────────────
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
  const sig  = req.headers.get("stripe-signature") ?? "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  // ── Verify signature ───────────────────────────────────────────────────────
  let event: import("stripe").Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // ── Handle events ──────────────────────────────────────────────────────────
  switch (event.type) {

    case "checkout.session.completed": {
      const session = event.data.object as import("stripe").Stripe.Checkout.Session;
      const { jobId, jobTitle, companyName } = session.metadata ?? {};

      console.log("✅ Payment complete:", {
        customer: session.customer_email,
        jobId,
        jobTitle,
        companyName,
        amountTotal: session.amount_total,
      });

      if (jobId) {
        // ── Mark job as paid in Supabase ─────────────────────────────────────
        try {
          const { createClient } = await import("@supabase/supabase-js");
          const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
            process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""  // use service role for server-side writes
          );

          const { error: dbError } = await supabase
            .from("direct_jobs")
            .update({
              status:             "pending",           // "pending" = review queue; change to "published" for instant publish
              payment_status:     "paid",
              stripe_session_id:  session.id,
              paid_at:            new Date().toISOString(),
              updated_at:         new Date().toISOString(),
            })
            .eq("id", jobId);

          if (dbError) {
            console.error("DB update error after payment:", dbError);
          } else {
            console.log("✅ Job marked as paid:", jobId);
          }
        } catch (dbErr) {
          console.error("Supabase update failed:", dbErr);
        }

        // ── Send payment confirmation email via Resend ────────────────────────
        try {
          const { Resend } = await import("resend");
          const resend = new Resend(process.env.RESEND_API_KEY);
          const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://jobnique.com";

          await resend.emails.send({
            from: "Jobnique <no-reply@jobnique.com>",
            to:   session.customer_email ?? "",
            subject: `💳 Payment confirmed — ${jobTitle ?? "your job"} Featured Listing`,
            html: `
              <!DOCTYPE html>
              <html>
              <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
              <body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
                <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
                  <div style="background:linear-gradient(135deg,#1e3a8a,#1a56db);padding:36px 40px 28px;text-align:center">
                    <div style="font-size:30px;font-weight:700;color:#fff;letter-spacing:-1px">
                      Job<span style="color:#f97316">nique</span>
                    </div>
                  </div>
                  <div style="padding:40px">
                    <div style="font-size:40px;text-align:center;margin-bottom:16px">✅</div>
                    <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;text-align:center">Payment confirmed!</h1>
                    <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 28px;text-align:center">
                      Your Featured Listing has been paid for and is queued for review.
                    </p>
                    <div style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:28px">
                      <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Featured Listing</div>
                      <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px">${jobTitle ?? "—"}</div>
                      <div style="font-size:14px;color:#374151">🏢 ${companyName ?? "—"}</div>
                      <div style="font-size:14px;color:#1a56db;margin-top:6px;font-weight:600">⭐ Featured placement · 60-day listing</div>
                    </div>
                    <p style="font-size:14px;color:#374151;margin:0 0 24px">
                      Our team will review and publish your listing within <strong>a few hours</strong>. You'll receive another email once it's live.
                    </p>
                    <a href="${siteUrl}/dashboard" style="display:block;background:#1a56db;color:#fff;text-align:center;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:12px">
                      View your dashboard →
                    </a>
                  </div>
                  <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
                    <p style="font-size:12px;color:#9ca3af;margin:0">
                      © ${new Date().getFullYear()} Jobnique · Reference: ${jobId}
                    </p>
                  </div>
                </div>
              </body>
              </html>`,
          });
        } catch (emailErr) {
          console.error("Confirmation email error:", emailErr);
          // Don't fail — payment is confirmed even if email fails
        }
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const pi = event.data.object as import("stripe").Stripe.PaymentIntent;
      console.warn("⚠️ Payment failed:", pi.id, pi.last_payment_error?.message);
      // Optionally: update job status to "payment_failed" and notify recruiter
      break;
    }

    default:
      console.log("Unhandled Stripe event type:", event.type);
  }

  return NextResponse.json({ received: true });
}
