// FILE: app/jobs-near-me/states/mississippi/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ALL_US_CITIES } from "@/app/jobs/cities/page";

export const dynamic = "force-dynamic";
const BASE_URL = "https://www.jobnique.com";
const STATE_ABBR = "MS";
const MIN_WAGE = "$7.25";

export const metadata: Metadata = {
  title: "Jobs Near Me in Mississippi 2026 | Jobnique",
  description: "Jobs near me in Mississippi. Browse local job openings across Mississippi hiring now in retail, hospitality, healthcare, warehouse, admin & customer service. MS employers hiring now. Apply today on Jobnique. Updated daily.",
  keywords: `jobs near me Mississippi, jobs near me MS, jobs near me MS 2026, local Mississippi`,
  alternates: { canonical: `${BASE_URL}/jobs-near-me/states/mississippi` },
  openGraph: { title: `Jobs Near Me in Mississippi 2026`, description: "Jobs near me in Mississippi. Browse local job openings across Mississippi hiring now in retail, hospitality, healthcare, warehouse, admin & customer service. MS employers hiring now. Apply today on Jobnique. Updated daily.", url: `${BASE_URL}/jobs-near-me/states/mississippi`, siteName: "Jobnique", type: "website" },
  robots: { index: true, follow: true },
};

const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },{ "@type": "ListItem", position: 2, name: "Jobs Near Me", item: `${BASE_URL}/jobs-near-me` },{ "@type": "ListItem", position: 3, name: "Mississippi", item: `${BASE_URL}/jobs-near-me/states/mississippi` }] };

const faqItems = [
  { q: `What jobs near me are available in Mississippi?`, a: `Mississippi has hundreds of jobs-near-me roles including retail associates, food service workers, delivery drivers, customer service reps, warehouse staff, healthcare aides, and admin assistants. Jackson is the top hiring city in the state.` },
  { q: `What is the minimum wage in Mississippi in 2026?`, a: `The minimum wage in Mississippi (MS) is $7.25 per hour as of 2026. Check the Mississippi Department of Labor website for the latest updates.` },
  { q: `Which city in Mississippi has the most jobs near me?`, a: `Jackson is the largest job market in Mississippi and has the highest volume of jobs-near-me jobs-near-me roles. The state capital Jackson also has strong public sector jobs-near-me hiring.` },
  { q: `How do I find jobs near me in Mississippi?`, a: `Browse Jobnique's Mississippi listings, filter by jobs-near-me, and apply to multiple roles daily. Use our free AI Cover Letter Generator and CV guide to strengthen your applications.` },
];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqItems.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) };

async function getJobs() {
  const { data } = await supabase.from("ats_jobs").select("id,title,company,location,salary_min,salary_max,contract_time,remote,posted_at").eq("expired", false).ilike("location", `%, MS%`).order("posted_at", { ascending: false }).limit(24);
  return data || [];
}
const fmtSalary = (min?: number, max?: number) => { if (!min && !max) return null; const f = (n: number) => `$${(n/1000).toFixed(0)}k`; if (min && max) return `${f(min)} – ${f(max)}`; return min ? `From ${f(min)}` : `Up to ${f(max!)}`; };
const timeAgo = (d: string) => { const days = Math.floor((Date.now()-new Date(d).getTime())/86400000); if (days===0) return "Today"; if (days===1) return "1d ago"; return `${days}d ago`; };

export default async function Page() {
  const jobs = await getJobs();
  const stateCities = ALL_US_CITIES.filter(c => c.state === STATE_ABBR);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <style>{`
        .job-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:20px 24px;transition:box-shadow .15s,border-color .15s;display:block;text-decoration:none;color:inherit}
        .job-card:hover{box-shadow:0 4px 20px rgba(0,0,0,.08);border-color:#93c5fd}
        .city-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:18px;text-decoration:none;display:block;transition:all .15s}
        .city-card:hover{border-color:#93c5fd;box-shadow:0 4px 16px rgba(0,0,0,.07)}
        .tool-link{display:flex;align-items:center;gap:8px;padding:10px 14px;border-radius:8px;background:#fff;border:1px solid #e5e7eb;font-size:13px;font-weight:500;color:#111827;transition:all .15s;text-decoration:none}
        .tool-link:hover{background:#1a56db;color:#fff;border-color:#1a56db}
        .apply-btn{background:#1a56db;color:#fff;border-radius:8px;padding:7px 16px;font-size:13px;font-weight:600}
        details summary{cursor:pointer;list-style:none;padding:16px 20px;font-weight:600;font-size:14px;color:#0f172a;display:flex;justify-content:space-between;align-items:center}
        details summary::-webkit-details-marker{display:none}
        .faq-arrow{transition:transform .2s;color:#6b7280;margin-left:12px}
        details[open] .faq-arrow{transform:rotate(180deg)}
        @media(max-width:768px){.page-grid{grid-template-columns:1fr !important}}
      `}</style>
      <Navbar />
      <div style={{background:"#f9fafb",borderBottom:"1px solid #e5e7eb",padding:"10px 20px"}}>
        <nav style={{maxWidth:1200,margin:"0 auto",fontSize:13,color:"#6b7280"}}>
          <Link href="/" style={{color:"#6b7280"}}>Home</Link><span style={{margin:"0 8px"}}>›</span>
          <Link href="/jobs-near-me" style={{color:"#6b7280"}}>Jobs Near Me</Link><span style={{margin:"0 8px"}}>›</span>
          <span style={{color:"#111827",fontWeight:500}}>Mississippi</span>
        </nav>
      </div>
      <div style={{background:"linear-gradient(135deg,#1a56db 0%,#1e40af 100%)",padding:"52px 20px 60px"}}>
        <div style={{maxWidth:860,margin:"0 auto",textAlign:"center"}}>
          <span style={{display:"inline-block",background:"rgba(255,255,255,0.2)",color:"#fff",fontSize:13,fontWeight:600,padding:"5px 16px",borderRadius:20,marginBottom:16}}>🇺🇸 Mississippi (MS)</span>
          <h1 style={{fontSize:"clamp(26px,4vw,42px)",fontWeight:800,color:"#fff",marginBottom:14,fontFamily:"'DM Serif Display',serif",lineHeight:1.2}}>Jobs Near Me in Mississippi</h1>
          <p style={{fontSize:17,color:"rgba(255,255,255,0.85)",marginBottom:28,maxWidth:600,margin:"0 auto 28px"}}>Browse jobs-near-me jobs across Mississippi — local job openings available. Min wage $7.25/hr. Updated daily.</p>
          <Link href={`/jobs?location=MS&source=all`} style={{display:"inline-block",background:"#fff",color:"#1a56db",borderRadius:10,padding:"13px 32px",fontSize:15,fontWeight:700,textDecoration:"none",boxShadow:"0 4px 20px rgba(0,0,0,0.15)"}}>Browse All Mississippi Jobs →</Link>
          <div style={{display:"flex",flexWrap:"wrap",justifyContent:"center",gap:20,marginTop:22,fontSize:13,color:"rgba(255,255,255,0.8)"}}>
            <span>✅ Live listings</span><span>✅ Min wage $7.25/hr</span><span>✅ Local</span>
          </div>
        </div>
      </div>
      <div className="page-grid" style={{maxWidth:1200,margin:"0 auto",padding:"40px 20px 80px",display:"grid",gridTemplateColumns:"1fr 320px",gap:40}}>
        <main>
          <section style={{marginBottom:40}}>
            <h2 style={{fontSize:22,fontWeight:700,color:"#0f172a",marginBottom:16}}>Jobs Near Me in Mississippi (2026)</h2>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.75,marginBottom:12}}>Mississippi has a diverse job market with employers across the state actively hiring jobs-near-me candidates. From Jackson to Jackson, there are jobs-near-me roles in retail, hospitality, healthcare, warehousing, and administration available right now.</p>
            <p style={{fontSize:15,color:"#374151",lineHeight:1.75}}>The Mississippi minimum wage is <strong>$7.25/hr in 2026</strong>. Many employers offer paid on-the-job training, so you can earn while you learn from day one.</p>
          </section>

          {stateCities.length > 0 && (
            <section style={{marginBottom:48}}>
              <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:16}}>Browse by City in Mississippi</h2>
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12}}>
                {stateCities.map(city => (
                  <Link key={city.slug} href={`/jobs-near-me/${city.slug}`} className="city-card">
                    <p style={{fontWeight:700,fontSize:14,color:"#0f172a",marginBottom:2}}>{city.label}</p>
                    <p style={{fontSize:12,color:"#6b7280"}}>Jobs near me →</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section style={{marginBottom:48}}>
            <h2 style={{fontSize:20,fontWeight:700,color:"#0f172a",marginBottom:16}}>Latest Jobs Near Me — Mississippi <span style={{fontSize:13,fontWeight:400,color:"#6b7280"}}>Updated today</span></h2>
            {jobs.length === 0 ? (
              <div style={{textAlign:"center",padding:"48px 20px",background:"#f9fafb",borderRadius:12,border:"1px solid #e5e7eb"}}>
                <div style={{fontSize:40,marginBottom:12}}>🔍</div>
                <h3 style={{fontSize:18,fontWeight:700,color:"#0f172a",marginBottom:8}}>No listings loaded yet</h3>
                <Link href={`/jobs?location=MS&source=all`} style={{background:"#1a56db",color:"#fff",borderRadius:8,padding:"11px 28px",fontSize:14,fontWeight:600,textDecoration:"none"}}>Browse All Mississippi Jobs →</Link>
              </div>
            ) : (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {jobs.map(job=>(
                  <Link key={job.id} href={`/jobs/${job.id}`} className="job-card">
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",gap:6,marginBottom:6}}><span className="badge badge-green">Entry Level</span>{job.remote&&<span className="badge badge-blue">🌐 Remote</span>}</div>
                        <h3 style={{fontSize:16,fontWeight:700,color:"#0f172a",marginBottom:4}}>{job.title}</h3>
                        <p style={{fontSize:14,color:"#374151",fontWeight:500,marginBottom:8}}>{job.company}</p>
                        <div style={{display:"flex",gap:12}}><span style={{fontSize:13,color:"#6b7280"}}>📍 {job.location}</span>{job.contract_time&&<span style={{fontSize:13,color:"#6b7280"}}>· {job.contract_time==="full_time"?"Full-time":"Part-time"}</span>}</div>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        {fmtSalary(job.salary_min,job.salary_max)&&<div style={{fontSize:13,fontWeight:700,color:"#1a56db",marginBottom:4}}>💰 {fmtSalary(job.salary_min,job.salary_max)}</div>}
                        <div style={{fontSize:12,color:"#9ca3af",marginBottom:8}}>{timeAgo(job.posted_at)}</div>
                        <span className="apply-btn">Apply Now</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            <div style={{marginTop:20,textAlign:"center"}}><Link href={`/jobs?location=MS&source=all`} style={{display:"inline-block",border:"2px solid #1a56db",color:"#1a56db",borderRadius:10,padding:"12px 32px",fontWeight:700,fontSize:14,textDecoration:"none"}}>View All Jobs Near Me in Mississippi →</Link></div>
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
        </main>
        <aside style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{background:"#eff6ff",border:"1px solid #bfdbfe",borderRadius:12,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:14}}>Free Career Tools</h3>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {[{label:"✉️ AI Cover Letter Generator",href:"/ai-cover-letter"},{label:"📄 CV Guide – Resume Tips",href:"/career-advice/how-to-write-cv-with-jobs-near-me-2026-guide"},{label:"📝 Resume Builder",href:"/resume-builder"},{label:"💰 Paycheck Calculator",href:"/paycheck-calculator"},{label:"🎯 Interview Question Generator",href:"/interview-question-generator"}].map(t=>(<Link key={t.href} href={t.href} className="tool-link">{t.label}</Link>))}
            </div>
          </div>
          <div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:12,padding:20}}>
            <h3 style={{fontWeight:700,fontSize:15,color:"#0f172a",marginBottom:8}}>Mississippi Min. Wage 2026</h3>
            <div style={{fontSize:36,fontWeight:800,color:"#1a56db"}}>$7.25<span style={{fontSize:16,fontWeight:400,color:"#6b7280"}}>/hr</span></div>
            <p style={{fontSize:12,color:"#9ca3af",marginTop:4,marginBottom:14}}>MS minimum wage, effective 2026</p>
            <Link href="/paycheck-calculator" style={{display:"block",textAlign:"center",background:"#1a56db",color:"#fff",borderRadius:8,padding:10,fontSize:13,fontWeight:700,textDecoration:"none"}}>Calculate My Take-Home Pay</Link>
          </div>
          <form action="/api/newsletter" method="POST" style={{background:"linear-gradient(135deg,#1a56db,#1e40af)",borderRadius:12,padding:20,color:"#fff"}}>
            <h3 style={{fontWeight:700,fontSize:15,marginBottom:8}}>Get Job Alerts</h3>
            <p style={{fontSize:13,color:"rgba(255,255,255,0.8)",marginBottom:16}}>Be first to know when new jobs-near-me jobs are posted in Mississippi.</p>
            <input type="email" name="email" placeholder="Your email address" required style={{width:"100%",borderRadius:8,border:"none",padding:"10px 14px",fontSize:13,color:"#111827",marginBottom:8,outline:"none",boxSizing:"border-box" as const}} />
            <button type="submit" style={{width:"100%",background:"#fff",color:"#1a56db",border:"none",borderRadius:8,padding:10,fontSize:13,fontWeight:700,cursor:"pointer"}}>Subscribe Free</button>
          </form>
        </aside>
      </div>
      <Footer />
    </>
  );
}
