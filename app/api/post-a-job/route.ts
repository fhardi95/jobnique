import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    // Parse JSON body
    const body = await req.json();

    const {
      jobTitle,
      category,
      location,
      jobType,
      description,
      requirements,
      benefits,
      salaryMin,
      salaryMax,
      companyName,
      companyWebsite,
      contactName,
      contactEmail,
      contactPhone,
      plan,
    } = body;

    // Input validation
    if (!jobTitle || !category || !location || !jobType || !description || !companyName || !contactName || !contactEmail) {
      return NextResponse.json(
        { error: "Job title, category, location, job type, description, company name, contact name, and contact email are required." },
        { status: 400 }
      );
    }

    if (!/^[\w\.-]+@[\w\.-]+\.[\w]+$/.test(contactEmail)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    // Generate unique job ID
    const jobId = `direct-${uuidv4()}`;

    // Save job to database
    const { error: dbError } = await supabase
      .from("direct_jobs")
      .insert({
        id: jobId,
        job_title: jobTitle,
        category,
        location,
        job_type: jobType,
        description,
        requirements: requirements || null,
        benefits: benefits || null,
        salary_min: salaryMin,
        salary_max: salaryMax,
        company_name: companyName,
        company_website: companyWebsite || null,
        contact_name: contactName,
        contact_email: contactEmail,
        contact_phone: contactPhone || null,
        plan,
        status: "pending", // pending review
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save job posting. Please try again." },
        { status: 500 }
      );
    }

    // Send confirmation email to employer
    const siteUrl = process.env.NEXTAUTH_URL || "https://jobnique.com";

    try {
      await resend.emails.send({
        from: "Jobnique <no-reply@jobnique.com>",
        to: contactEmail,
        subject: `✅ Job posting received — ${jobTitle} at ${companyName}`,
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
              <div style="font-size:40px;text-align:center;margin-bottom:16px">🎉</div>
              <h1 style="font-size:22px;font-weight:700;color:#111827;margin:0 0 8px;text-align:center">Job posting received!</h1>
              <p style="font-size:15px;color:#6b7280;line-height:1.7;margin:0 0 28px;text-align:center">
                Hi ${contactName}, your job posting has been submitted successfully.
              </p>
              <div style="background:#f0f7ff;border:1px solid #dbeafe;border-radius:12px;padding:20px 24px;margin-bottom:28px">
                <div style="font-size:13px;color:#6b7280;margin-bottom:4px">Job details</div>
                <div style="font-size:18px;font-weight:700;color:#0f172a;margin-bottom:4px">${jobTitle}</div>
                <div style="font-size:14px;color:#374151">🏢 ${companyName}</div>
                <div style="font-size:14px;color:#374151">📍 ${location}</div>
                <div style="font-size:14px;color:#374151">⏰ ${jobType}</div>
              </div>
              <h2 style="font-size:15px;font-weight:700;color:#374151;margin:0 0 14px">What happens next?</h2>
              <div style="margin-bottom:28px">
                <div style="display:flex;gap:12px;font-size:14px;color:#374151;margin-bottom:10px">
                  <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">1</div>
                  <span style="padding-top:2px">Our team will review your job posting within 24 hours.</span>
                </div>
                <div style="display:flex;gap:12px;font-size:14px;color:#374151;margin-bottom:10px">
                  <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">2</div>
                  <span style="padding-top:2px">Once approved, it will be published on our site.</span>
                </div>
                <div style="display:flex;gap:12px;font-size:14px;color:#374151">
                  <div style="background:#1a56db;color:#fff;border-radius:50%;width:24px;height:24px;line-height:24px;text-align:center;font-size:12px;font-weight:700;flex-shrink:0">3</div>
                  <span style="padding-top:2px">You'll receive email notifications when candidates apply.</span>
                </div>
              </div>
              <a href="${siteUrl}/dashboard" style="display:block;background:#1a56db;color:#fff;text-align:center;padding:14px 32px;border-radius:10px;font-size:15px;font-weight:600;text-decoration:none;margin-bottom:12px">View your dashboard →</a>
              <a href="${siteUrl}/post-a-job" style="display:block;background:#f1f5f9;color:#374151;text-align:center;padding:12px 32px;border-radius:10px;font-size:14px;font-weight:500;text-decoration:none">Post another job</a>
            </div>
            <div style="background:#f9fafb;border-top:1px solid #e5e7eb;padding:20px 40px;text-align:center">
              <p style="font-size:12px;color:#9ca3af;margin:0">© ${new Date().getFullYear()} Jobnique · <a href="${siteUrl}/privacy-policy" style="color:#9ca3af">Privacy Policy</a></p>
            </div>
          </div>
        </body>
        </html>`,
      });
    } catch (emailErr) {
      console.error("Confirmation email error:", emailErr);
      // Don't fail the request if email fails
    }

    return NextResponse.json({ success: true, jobId });
  } catch (err) {
    console.error("Post job API error:", err);
    return NextResponse.json(
      { error: "Failed to submit job posting. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  // Handle GET requests (for testing or fetching job postings)
  try {
    const { data, error } = await supabase
      .from("direct_jobs")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Get jobs API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch job postings." },
      { status: 500 }
    );
  }
}