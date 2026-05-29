import { NextResponse } from "next/server";
import { Resend } from "resend";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const fd          = await req.formData();
    const jobId       = fd.get("jobId")       as string;
    const jobTitle    = fd.get("jobTitle")    as string;
    const company     = fd.get("company")     as string;
    const name        = fd.get("name")        as string;
    const email       = fd.get("email")       as string;
    const phone       = fd.get("phone")       as string | null;
    const coverLetter = fd.get("coverLetter") as string | null;
    const cvFile      = fd.get("cv")          as File | null;

    // ── Input validation ─────────────────────────────────────────────────
    if (!name || !email || !cvFile) {
      return NextResponse.json({ error: "Name, email and CV are required." }, { status: 400 });
    }

    const safeName = name.replace(/<[^>]*>/g, "").trim().slice(0, 200);
    if (!safeName) {
      return NextResponse.json({ error: "Invalid name provided." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const allowedExts  = ["pdf", "doc", "docx"];
    const cvExt = cvFile.name.split(".").pop()?.toLowerCase() || "";
    if (!allowedExts.includes(cvExt) || !allowedTypes.includes(cvFile.type)) {
      return NextResponse.json({ error: "CV must be a PDF, DOC, or DOCX file." }, { status: 400 });
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "CV file must be 5 MB or smaller." }, { status: 400 });
    }

    if (!/^[\w\-]+$/.test(jobId || "")) {
      return NextResponse.json({ error: "Invalid job reference." }, { status: 400 });
    }

    // ── 1. Upload CV to Supabase Storage ──────────────────────────────────
    const cvBuffer = Buffer.from(await cvFile.arrayBuffer());
    const cvPath   = `${jobId}/${Date.now()}_${safeName.replace(/\s+/g, "_")}.${cvExt}`;

    const { error: uploadError } = await supabase.storage
      .from("cvs")
      .upload(cvPath, cvBuffer, { contentType: cvFile.type || "application/octet-stream" });

    if (uploadError) {
      console.error("CV upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload CV. Please try again." }, { status: 500 });
    }

    // ── 2. Save application to Supabase database ───────────────────────────
    const { error: dbError } = await supabase.from("applications").insert({
      job_id:          jobId,
      job_title:       jobTitle,
      company:         company,
      applicant_name:  safeName,
      applicant_email: email,
      applicant_phone: phone || null,
      cover_letter:    coverLetter || null,
      cv_filename:     cvFile.name,
      cv_url:          cvPath,
      status:          "new",
    });

    if (dbError) {
      console.error("DB insert error:", dbError);
      return NextResponse.json({ error: "Failed to save application. Please try again." }, { status: 500 });
    }

    // ── 3. Confirmation email via Resend ───────────────────────────────────
    const siteUrl = process.env.NEXTAUTH_URL || "https://jobnique.com";
    const year    = new Date().getFullYear();

    try {
      await resend.emails.send({
        from:    "Jobnique Applications <application@jobnique.com>",
        to:      email,
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
        Hi ${safeName}, your application has been submitted successfully.
      </p>
      <div style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:28px">
        <div style="font-size:13px;color:#6b7280;margin-bottom:4px">You applied for</div>
        <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px">${jobTitle}</div>
        <div style="font-size:14px;color:#374151">🏢 ${company}</div>
      </div>
      <h2 style="font-size:15px;font-weight:700;color:#374151;margin:0 0 14px">What happens next?</h2>
      <div style="margin-bottom:28px">
        <div style="display:flex;gap:12px;font-size:14px;color:#374151;margin-bottom:10px">
          <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">1</div>
          <span style="padding-top:2px">The recruiter will review your application and CV.</span>
        </div>
        <div style="display:flex;gap:12px;font-size:14px;color:#374151;margin-bottom:10px">
          <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">2</div>
          <span style="padding-top:2px">If shortlisted, they will contact you directly.</span>
        </div>
        <div style="display:flex;gap:12px;font-size:14px;color:#374151">
          <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">3</div>
          <span style="padding-top:2px">Keep checking your dashboard for updates.</span>
        </div>
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
    } catch (emailErr) {
      // Don't fail the whole request if email fails — application is already saved
      console.error("Confirmation email error:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Apply API error:", err);
    return NextResponse.json({ error: "Failed to submit application. Please try again." }, { status: 500 });
  }
}
