import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail(email: string, name: string, token: string) {
  const confirmUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: "Jobnique <no-reply@jobnique.com>",
    to: email,
    subject: "Confirm your Jobnique account ✅",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:linear-gradient(135deg,#1e3a8a,#1a56db);padding:40px 40px 32px;text-align:center">
      <div style="font-size:32px;font-weight:700;color:#fff;letter-spacing:-1px">
        Job<span style="color:#f97316">nique</span>
      </div>
    </div>
    <div style="padding:40px">
      <h1 style="font-size:24px;font-weight:700;color:#111827;margin:0 0 8px">Welcome to Jobnique, ${name}! 🎉</h1>
      <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 28px">
        Thanks for signing up. Please confirm your email address to activate your account and start finding your next opportunity.
      </p>
      <a href="${confirmUrl}"
        style="display:block;background:#1a56db;color:#fff;text-align:center;padding:16px 32px;border-radius:10px;font-size:16px;font-weight:600;text-decoration:none;margin-bottom:28px">
        ✅ Confirm my email address
      </a>
      <p style="font-size:13px;color:#9ca3af;line-height:1.6;margin:0 0 8px">
        Or copy and paste this link into your browser:
      </p>
      <p style="font-size:12px;color:#1a56db;word-break:break-all;margin:0 0 28px">${confirmUrl}</p>
      <div style="background:#f9fafb;border-radius:10px;padding:16px 20px;margin-bottom:28px">
        <p style="font-size:13px;color:#6b7280;margin:0">
          ⏱ This link expires in <strong>24 hours</strong>.<br>
          🔒 If you didn't create an account, you can safely ignore this email.
        </p>
      </div>
      <p style="font-size:14px;font-weight:600;color:#374151;margin:0 0 12px">With your Jobnique account you can:</p>
      <div style="font-size:14px;color:#374151;line-height:2">
        🔍 Search 1.2M+ jobs across the US<br>
        ♡ Save jobs and track applications<br>
        📄 Download free CV and cover letter templates<br>
        💰 Use the take-home pay calculator<br>
        📧 Get weekly job alerts by email
      </div>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:24px 40px;text-align:center">
      <p style="font-size:12px;color:#9ca3af;margin:0">
        © ${new Date().getFullYear()} Jobnique ·
        <a href="${process.env.NEXTAUTH_URL}/privacy-policy" style="color:#9ca3af">Privacy Policy</a> ·
        <a href="${process.env.NEXTAUTH_URL}/settings" style="color:#9ca3af">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`,
  });
}

export async function sendApplicationConfirmation({
  to,
  applicantName,
  jobTitle,
  company,
}: {
  to: string;
  applicantName: string;
  jobTitle: string;
  company: string;
}) {
  const siteUrl = process.env.NEXTAUTH_URL || "https://jobnique.com";
  const year = new Date().getFullYear();

  await resend.emails.send({
    from: "Jobnique Applications <application@jobnique.com>",
    to,
    subject: `✅ Application received — ${jobTitle} at ${company}`,
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:'Helvetica Neue',Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:linear-gradient(135deg,#1e3a8a,#1a56db);padding:36px 40px 28px;text-align:center">
      <div style="font-size:30px;font-weight:700;color:#fff;letter-spacing:-1px">Job<span style="color:#f97316">nique</span></div>
    </div>
    <div style="padding:40px">
      <div style="font-size:40px;text-align:center;margin-bottom:16px">🎉</div>
      <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;text-align:center">Application received!</h1>
      <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 28px;text-align:center">
        Hi ${applicantName}, your application has been submitted successfully.
      </p>
      <div style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:28px">
        <div style="font-size:13px;color:#6b7280;margin-bottom:4px">You applied for</div>
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px">${jobTitle}</div>
        <div style="font-size:14px;color:#374151">🏢 ${company}</div>
      </div>
      <h2 style="font-size:15px;font-weight:700;color:#374151;margin:0 0 14px">What happens next?</h2>
      <div style="margin-bottom:28px;font-size:14px;color:#374151;line-height:2">
        1️⃣ The recruiter will review your application and CV.<br>
        2️⃣ If shortlisted, they will contact you directly.<br>
        3️⃣ Keep checking your dashboard for updates.
      </div>
      <a href="${siteUrl}/jobs" style="display:block;background:#1a56db;color:#fff;text-align:center;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:12px">Browse more jobs →</a>
      <a href="${siteUrl}/dashboard" style="display:block;background:#f1f5f9;color:#374151;text-align:center;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none">View my applications</a>
    </div>
    <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
      <p style="font-size:12px;color:#9ca3af;margin:0">© ${year} Jobnique · <a href="${siteUrl}/privacy-policy" style="color:#9ca3af">Privacy Policy</a></p>
    </div>
  </div>
</body>
</html>`,
  });
}
