// FILE: app/jobs-near-me/dallas/page.tsx
// Auto-generated — jobnique.com/jobs-near-me/dallas

import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_US_CITIES } from "@/app/jobs/cities/page";

export const dynamic = "force-dynamic";

const BASE_URL = "https://www.jobnique.com";
const CITY_LABEL = "Dallas, TX";
const CITY_SLUG = "dallas";
const CITY_SEARCH = "Dallas";
const MIN_WAGE = "$7.25";
const STATE_CODE = "TX";

export const metadata: Metadata = {
  title: "Jobs Near Me in Dallas, TX 2026 | Jobnique",
  description: "Jobs near me in Dallas, TX. Browse local job openings hiring now in retail, hospitality, healthcare, warehouse, admin & customer service near Dallas. Apply today on Jobnique. Updated daily.",
  keywords: `jobs near me Dallas, jobs near me Dallas TX, jobs local Dallas, local Dallas 2026`,
  alternates: { canonical: `${BASE_URL}/jobs-near-me/dallas` },
  openGraph: {
    title: "Jobs Near Me in Dallas, TX 2026 | Jobnique",
    description: "Jobs near me in Dallas, TX. Browse local job openings hiring now in retail, hospitality, healthcare, warehouse, admin & customer service near Dallas. Apply today on Jobnique. Updated daily.",
    url: `${BASE_URL}/jobs-near-me/dallas`,
    siteName: "Jobnique",
    type: "website",
  },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
    { "@type": "ListItem", position: 2, name: "Jobs Near Me", item: `${BASE_URL}/jobs-near-me` },
    { "@type": "ListItem", position: 3, name: "Dallas", item: `${BASE_URL}/jobs-near-me/dallas` },
  ],
};

const faqItems = [
  { q: `What jobs can I get in Dallas for local candidates?`, a: `Dallas has hundreds of jobs-near-me roles requiring no prior experience, including retail associates, food service workers, delivery drivers, customer service representatives, warehouse staff, caregivers, and administrative assistants. Many employers provide paid on-the-job training.` },
  { q: `What is the minimum wage in Dallas in 2026?`, a: `As of 2026, the minimum wage in Dallas, TX is $7.25 per hour. Always check your state Department of Labor for the latest rates.` },
  { q: `How do I get a job in Dallas for local candidates?`, a: `Target industries that hire beginners: retail, hospitality, food service, and warehouse work. Write a strong CV highlighting soft skills, then use our free AI Cover Letter tool to create tailored applications. Apply to multiple listings daily.` },
  { q: `How much do jobs-near-me jobs pay in Dallas?`, a: `Entry-level jobs-near-me jobs in Dallas typically pay between $7.25 and $25 per hour depending on the industry. The TX minimum wage in 2026 is $7.25/hr.` },
  { q: `Do I need a resume to apply for jobs near me in Dallas?`, a: `Most employers ask for a CV even for jobs-near-me roles. Focus on your soft skills, education, and activities. Use our free CV guide or Resume Builder to create a strong application.` },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
};

const industries = [
  { name: "Retail & Sales",        count: "100+", icon: "🛍️", avgPay: `${MIN_WAGE}–$22/hr`, q: "retail"         },
  { name: "Food & Hospitality",    count: "90+",  icon: "🍽️", avgPay: `${MIN_WAGE}–$20/hr`, q: "food"           },
  { name: "Healthcare & Care",     count: "70+",  icon: "🏥", avgPay: "$18–$25/hr",           q: "healthcare"     },
  { name: "Warehouse & Logistics", count: "60+",  icon: "📦", avgPay: "$18–$23/hr",           q: "warehouse"      },
  { name: "Customer Service",      count: "55+",  icon: "💬", avgPay: "$18–$22/hr",           q: "customer+service"},
  { name: "Admin & Office",        count: "40+",  icon: "🗂️", avgPay: "$20–$26/hr",           q: "admin"          },
];

const salaryTable = [
  ["Retail Associate",    `${MIN_WAGE}–$20/hr`, "$32,000–$41,000"],
  ["Food Service Worker", `${MIN_WAGE}–$19/hr`, "$30,000–$39,000"],
  ["Warehouse Associate", "$18–$23/hr",            "$37,000–$47,000"],
  ["Home Health Aide",    "$18–$22/hr",            "$37,000–$45,000"],
  ["Customer Service Rep","$18–$22/hr",            "$37,000–$46,000"],
  ["Admin Assistant",     "$20–$26/hr",            "$42,000–$54,000"],
  ["Delivery Driver",     "$18–$28/hr",            "$37,000–$58,000"],
];

async function getJobs() {
  const { data } = await supabase
    .from("ats_jobs")
    .select("id, title, company, location, salary_min, salary_max, contract_time, remote, posted_at")
    .eq("expired", false)
    .ilike("location", `%Dallas%`)
    .order("posted_at", { ascending: false })
    .limit(20);
  return data || [];
}

const fmtSalary = (min?: number, max?: number) => {
  if (!min && !max) return null;
  const f = (n: number) => `$${(n / 1000).toFixed(0)}k`;
  if (min && max) return `${f(min)} – ${f(max)}`;
  return min ? `From ${f(min)}` : `Up to ${f(max!)}`;
};

const timeAgo = (d: string) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "1d ago";
  return `${days}d ago`;
};

export default async function NoExperienceJobsCity() {
  const jobs = await getJobs();
  const nearbyCities = ALL_US_CITIES.filter(c => c.region === "South" && c.slug !== CITY_SLUG).slice(0, 10);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{`
        .job-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;transition:box-shadow .15s,border-color .15s;display:block;text-decoration:none;color:inherit}
        .job-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.08);border-color:#93c5fd}
        .industry-card{display:flex;align-items:center;gap:14px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px;text-decoration:none;color:inherit;transition:border-color .15s,box-shadow .15s}
        .industry-card:hover{border-color:#93c5fd;box-shadow:0 2px 12px rgba(0,0,0,.06)}
        .city-pill{background:#f1f5f9;color:#374151;font-size:13px;font-weight:500;padding:6px 14px;border-radius:20px;display:inline-block;transition:all .15s;text-decoration:none}
        .city-pill:hover{background:#dbeafe;color:#1d4ed8}
        .tool-link{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;background:#fff;border:1px solid #e5e7eb;font-size:13px;font-weight:500;color:#111827;transition:all .15s;text-decoration:none}
        .tool-link:hover{background:#1a56db;color:#fff;border-color:#1a56db}
        .sidebar-city-link{display:flex;justify-content:space-between;align-items:center;padding:8px 10px;border-radius:8px;font-size:13px;color:#374151;text-decoration:none;transition:background .15s}
        .sidebar-city-link:hover{background:#f1f5f9;color:#1d4ed8}
        .apply-btn{background:#1a56db;color:#fff;border-radius:8px;padding:7px 16px;font-size:13px;font-weight:600;white-space:nowrap;transition:background .15s}
        .apply-btn:hover{background:#1342b0}
        .article-card{text-decoration:none;background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:16px;display:block;transition:all .15s}
        .article-card:hover{border-color:#93c5fd;box-shadow:0 2px 8px rgba(0,0,0,.06)}
        details summary{cursor:pointer;list-style:none;padding:16px 20px;font-weight:600;font-size:14px;color:#0f172a;display:flex;justify-content:space-between;align-items:center}
        details summary::-webkit-details-marker{display:none}
        .faq-arrow{transition:transform .2s;color:#6b7280;margin-left:12px}
        details[open] .faq-arrow{transform:rotate(180deg)}
        @media(max-width:768px){.page-grid{grid-template-columns:1fr !important}}
      `}</style>

      <Navbar />

      <div style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb",padding:"10px 20px"}}>
        <nav aria-label="breadcrumb" style={{maxWidth:1200,margin:"0 auto",fontSize:13,color:"#6b7280"}}>
          <Link href="/" style={{color:"#6b7280"}}>Home</Link>
          <span style={{margin:"0 8px"}}>›</span>
          <Link href="/jobs-near-me" style={{color:"#6b7280"}}>Jobs Near Me</Link>
          <span style={{margin:"0 8px"}}>›</span>
          <span style={{color:"#111827",fontWeight:500}}>Dallas</span>
        </nav>
      </div>

      <div style={{background:"linear-gradient(135deg,#1a56db 0%,#1e40af 100%)",padding:"52px 20px 60px"}}>
        <div style={{maxWidth:860,margin:"0 auto",textAlign:"center"}}>
          <span style={{display:"inline-block",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:13,fontWeight:600,padding:"5px 16px",borderRadius:20,marginBottom:16}}>
            📍 Dallas, TX
          </span>
          <h1 style={{fontSize:"clamp(26px,4vw,42px)",fontWeight:800,color:"#fff",marginBottom:14,fontFamily:"'DM Serif Display',serif",lineHeight:1.2}}>
            Jobs Near Me in Dallas
          </h1>
          <p style={{fontSize:17,color:"rgba(255,255,255,0.85)",marginBottom:28,maxWidth:600,margin:"0 auto 28px"}}>
            Browse jobs-near-me jobs across Dallas, TX — local job openings available. Retail, hospitality, healthcare, admin & more. Updated daily.
          </p>
          <Link href={`/jobs?location=${encodeURIComponent(CITY_SEARCH)}&source=all`} style={{display:"inline-block",background:"#fff",color:"#1a56db",borderRadius:10,padding:"13px 32px",fontSize:15,fontWeight:700,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>
            Browse All Dallas Jobs →
          </Link>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:20,marginTop:22,fontSize:13,color:"rgba(255,255,255,0.8)"}}>
            <span>✅ Live listings</span><span>✅ Updated daily</span><span>✅ Local</span><span>✅ Paid training available</span>
          </div>
        </div>
      </div>

      <div className="page-grid" style={{maxWidth:1200,margin:"0 auto",padding:"40px 20px 80px",display:"grid",gridTemplateColumns:"1fr 320px",gap:40}}>
        <main>
          <section style={{marginBottom:40}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>Finding Jobs Near Me in Dallas (2026)</h2>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.75,marginBottom:12}}>
              Dallas is an active job market with hundreds of employers hiring jobs-near-me candidates every week — no prior experience needed. From retail floors to hospital wards, warehouses to call centres, there are roles across every sector that welcome beginners and provide on-the-job training from day one.
            </p>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.75,marginBottom:12}}>
              Whether you&apos;re a student, recent graduate, career changer, or returning to work — Dallas has jobs-near-me opportunities that fit your schedule. The TX minimum wage in 2026 is <strong>$7.25/hr</strong>, ensuring a solid earnings floor even for your first role.
            </p>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.75}}>
              The most active hiring sectors in Dallas for jobs-near-me roles are retail and sales, food service, warehouse and logistics, healthcare aides, customer service, and administrative support. Many positions offer immediate starts.
            </p>
          </section>

          <section style={{marginBottom:48}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a"}}>
                Latest Jobs Near Me — Dallas
                <span style={{fontSize:13,fontWeight:400,color:"#6b7280",marginLeft:8}}>Updated today</span>
              </h2>
            </div>
            {jobs.length === 0 ? (
              <div style={{textAlign:"center",padding:"48px 20px",background:"#f9fafb",borderRadius:12,border:"1px solid #e5e7eb"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <h3 style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:8}}>No listings loaded yet</h3>
                <p style={{fontSize:14,color:"#6b7280",marginBottom:20}}>Browse all jobs-near-me roles or search by keyword.</p>
                <Link href={`/jobs?location=${encodeURIComponent(CITY_SEARCH)}&source=all`} style={{background:"#1a56db",color:"#fff",borderRadius:8,padding:"11px 28px",fontSize:14,fontWeight:600,textDecoration:"none"}}>
                  Browse All Dallas Jobs →
                </Link>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {jobs.map((job) => (
                  <Link key={job.id} href={`/jobs/${job.id}`} className="job-card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:6}}>
                          <span className="badge badge-green">Entry Level</span>
                          {job.remote && <span className="badge badge-blue">🌐 Remote</span>}
                        </div>
                        <h3 style={{fontSize:16,fontWeight:700,color:"#0f172a",marginBottom:4}}>{job.title}</h3>
                        <p style={{fontSize:14,color:"#374151",fontWeight:500,marginBottom:8}}>{job.company}</p>
                        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                          <span style={{fontSize:13,color:"#6b7280"}}>📍 {job.location}</span>
                          {job.contract_time && <span style={{fontSize:13,color:"#6b7280"}}>· {job.contract_time === "full_time" ? "Full-time" : "Part-time"}</span>}
                        </div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        {fmtSalary(job.salary_min, job.salary_max) && (
                          <div style={{fontSize:13,fontWeight:700,color:"#1a56db",marginBottom:4}}>💰 {fmtSalary(job.salary_min, job.salary_max)}</div>
                        )}
                        <div style={{fontSize:12,color:"#9ca3af",marginBottom:8}}>{timeAgo(job.posted_at)}</div>
                        <span className="apply-btn">Apply Now</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div style={{marginTop:20,textAlign:"center"}}>
              <Link href={`/jobs?location=${encodeURIComponent(CITY_SEARCH)}&source=all`} style={{display:"inline-block",border:"2px solid #1a56db",color:"#1a56db",borderRadius:10,padding:"12px 32px",fontWeight:700,fontSize:14,textDecoration:"none"}}>
                View All Jobs Near Me in Dallas →
              </Link>
            </div>
          </section>

          <section style={{marginBottom:48}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>Top Industries Hiring Near You in Dallas</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
              {industries.map((ind) => (
                <Link key={ind.name} href={`/jobs?location=${encodeURIComponent(CITY_SEARCH)}&q=${ind.q}`} className="industry-card">
                  <span style={{fontSize:28}}>{ind.icon}</span>
                  <div>
                    <p style={{fontWeight:600,fontSize:14,color:"#111827",marginBottom:2}}>{ind.name}</p>
                    <p style={{fontSize:13,color:"#6b7280"}}>{ind.count} roles · {ind.avgPay}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section style={{marginBottom:48}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>What Do Jobs Near Me Pay in Dallas?</h2>
            <div style={{overflowX:"auto",borderRadius:12,border:"1px solid #e5e7eb"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <thead>
                  <tr style={{background:"#f9fafb"}}>
                    {["Job Type","Avg Hourly Pay","Avg Annual"].map(h=>(
                      <th key={h} style={{padding:"12px 16px",textAlign:"left",fontWeight:700,color:"#374151",borderBottom:"1px solid #e5e7eb"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {salaryTable.map(([role,hourly,annual],i)=>(
                    <tr key={role} style={{background:i%2===0?"#fff":"#fafafa"}}>
                      <td style={{padding:"12px 16px",fontWeight:600,color:"#111827",borderBottom:"1px solid #f3f4f6"}}>{role}</td>
                      <td style={{padding:"12px 16px",color:"#374151",borderBottom:"1px solid #f3f4f6"}}>{hourly}</td>
                      <td style={{padding:"12px 16px",color:"#374151",borderBottom:"1px solid #f3f4f6"}}>{annual}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{fontSize:12,color:"#9ca3af",marginTop:10}}>
              Estimates based on 2026 Dallas market data.{" "}
              <Link href="/paycheck-calculator" style={{color:"#1a56db"}}>Calculate your take-home pay →</Link>
            </p>
          </section>

          <section style={{marginBottom:48}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:20}}>Frequently Asked Questions</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {faqItems.map((faq,i)=>(
                <details key={i} style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:10,overflow:"hidden"}}>
                  <summary>{faq.q}<span className="faq-arrow">▼</span></summary>
                  <p style={{padding:"0 20px 16px",fontSize:14,color:"#374151",lineHeight:1.65}}>{faq.a}</p>
                </details>
              ))}
            </div>
          </section>

          {nearbyCities.length > 0 && (
            <section style={{marginBottom:40}}>
              <h2 style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:14}}>Jobs Near Me in Nearby Cities</h2>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {nearbyCities.map(c=>(
                  <Link key={c.slug} href={`/jobs-near-me/${c.slug}`} className="city-pill">{c.label}</Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:16}}>Related Career Guides</h2>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:14}}>
              {[
                {title:"How to Write a CV Near You (2026)",href:"/career-advice/how-to-write-cv-with-jobs-near-me-2026-guide",tag:"CV Writing"},
                {title:"Salary Negotiation Scripts That Work in 2026",href:"/career-advice/salary-negotiation-scripts-that-work-2026",tag:"Salary"},
                {title:"Best Resume Format 2026 – Complete Guide",href:"/career-advice/best-resume-format-2026-complete-guide",tag:"Resume"},
              ].map(a=>(
                <Link key={a.href} href={a.href} className="article-card">
                  <span className="badge badge-blue" style={{marginBottom:8}}>{a.tag}</span>
                  <p style={{fontSize:14,fontWeight:600,color:"#0f172a",lineHeight:1.45}}>{a.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <aside style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Free Career Tools</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[
                {label:"✉️ AI Cover Letter Generator",href:"/ai-cover-letter"},
                {label:"📄 CV Guide – Resume Tips",href:"/career-advice/how-to-write-cv-with-jobs-near-me-2026-guide"},
                {label:"📝 Resume Builder",href:"/resume-builder"},
                {label:"💰 Paycheck Calculator",href:"/paycheck-calculator"},
                {label:"🎯 Interview Question Generator",href:"/interview-question-generator"},
                {label:"🏙️ Salary by City",href:"/salary-by-city"},
              ].map(t=>(<Link key={t.href} href={t.href} className="tool-link">{t.label}</Link>))}
            </div>
          </div>

          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:8}}>Dallas Min. Wage 2026</h3>
            <div style={{fontSize:36,fontWeight:800,color:"#1a56db"}}>$7.25<span style={{fontSize:16,fontWeight:400,color:"#6b7280"}}>/hr</span></div>
            <p style={{fontSize:12,color:"#9ca3af",marginTop:4,marginBottom:14}}>TX minimum wage, effective 2026</p>
            <Link href="/paycheck-calculator" style={{display:"block",textAlign:"center",background:"#1a56db",color:"#fff",borderRadius:8,padding:10,fontSize:13,fontWeight:700,textDecoration:"none"}}>
              Calculate My Take-Home Pay
            </Link>
          </div>

          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Jobs Near Me — Other Cities</h3>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <Link href="/jobs-near-me/cleveland" className="sidebar-city-link"><span>📍 Cleveland, OH</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/orlando" className="sidebar-city-link"><span>📍 Orlando, FL</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/portland" className="sidebar-city-link"><span>📍 Portland, OR</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/cincinnati" className="sidebar-city-link"><span>📍 Cincinnati, OH</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/st-louis" className="sidebar-city-link"><span>📍 St. Louis, MO</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/jacksonville" className="sidebar-city-link"><span>📍 Jacksonville, FL</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/honolulu" className="sidebar-city-link"><span>📍 Honolulu, HI</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me/richmond" className="sidebar-city-link"><span>📍 Richmond, VA</span><span style={{color:"#9ca3af"}}>→</span></Link>
              <Link href="/jobs-near-me" style={{display:"block",textAlign:"center",marginTop:8,fontSize:13,fontWeight:600,color:"#1a56db",textDecoration:"none"}}>View all cities →</Link>
            </div>
          </div>

          <form action="/api/newsletter" method="POST" style={{background:"linear-gradient(135deg,#1a56db,#1e40af)",borderRadius:12,padding:20,color:"#fff"}}>
            <h3 style={{fontWeight:700,fontSize:15,marginBottom:8}}>Get Job Alerts</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:16}}>Be first to know when new jobs-near-me jobs are posted in Dallas.</p>
            <input type="email" name="email" placeholder="Your email address" required style={{width:"100%",borderRadius:8,border:"none",padding:"10px 14px",fontSize:13,color:"#111827",marginBottom:8,outline:"none",boxSizing:"border-box"}} />
            <button type="submit" style={{width:"100%",background:"#fff",color:"#1a56db",border:"none",borderRadius:8,padding:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>Subscribe Free</button>
          </form>
        </aside>
      </div>

      <Footer />
    </>
  );
}
