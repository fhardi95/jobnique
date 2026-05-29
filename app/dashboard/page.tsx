import { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";

export const metadata: Metadata = {
  title: "Dashboard | Jobnique",
};

const recentJobs = [
  { title:"Software Engineer", company:"Google", location:"New York, NY", salary:"$120k–$150k", status:"Applied", date:"2 days ago", color:"#16a34a" },
  { title:"Product Manager", company:"Microsoft", location:"Seattle, WA", salary:"$130k–$160k", status:"Saved", date:"3 days ago", color:"#1a56db" },
  { title:"Data Analyst", company:"Amazon", location:"Austin, TX", salary:"$90k–$110k", status:"Viewed", date:"5 days ago", color:"#6b7280" },
];

const stats = [
  { label:"Jobs applied", value:"12", icon:"📋", color:"#eff6ff", text:"#1a56db" },
  { label:"Saved jobs", value:"34", icon:"♡", color:"#fef3c7", text:"#d97706" },
  { label:"Profile views", value:"8", icon:"👁", color:"#f0fdf4", text:"#16a34a" },
  { label:"Interviews", value:"2", icon:"🎯", color:"#fdf4ff", text:"#9333ea" },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <CookieBanner />
      <div style={{ background:"#f9fafb", minHeight:"100vh", padding:"40px 20px" }}>
        <div className="container" style={{ maxWidth:1000 }}>

          {/* Header */}
          <div style={{ marginBottom:32 }}>
            <h1 style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>Welcome back 👋</h1>
            <p style={{ color:"#6b7280", fontSize:15 }}>Here's what's happening with your job search</p>
          </div>

          {/* Stats */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:16, marginBottom:32 }}>
            {stats.map(s => (
              <div key={s.label} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"20px 24px" }}>
                <div style={{ fontSize:28, marginBottom:8 }}>{s.icon}</div>
                <div style={{ fontSize:28, fontWeight:700, color:s.text, marginBottom:4 }}>{s.value}</div>
                <div style={{ fontSize:13, color:"#6b7280" }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"1fr 340px", gap:24, alignItems:"start" }}>

            {/* Recent activity */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px" }}>
              <h2 style={{ fontSize:17, fontWeight:600, marginBottom:20 }}>Recent job activity</h2>
              {recentJobs.map(j => (
                <div key={j.title} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #f3f4f6", gap:12 }}>
                  <div>
                    <div style={{ fontWeight:600, fontSize:15, marginBottom:3 }}>{j.title}</div>
                    <div style={{ fontSize:13, color:"#6b7280" }}>{j.company} · {j.location}</div>
                    <div style={{ fontSize:12, color:"#9ca3af", marginTop:2 }}>{j.date}</div>
                  </div>
                  <div style={{ textAlign:"right", flexShrink:0 }}>
                    <div style={{ fontSize:13, fontWeight:600, color:j.color, background:j.color+"15", padding:"3px 10px", borderRadius:20, marginBottom:4 }}>{j.status}</div>
                    <div style={{ fontSize:12, color:"#6b7280" }}>{j.salary}</div>
                  </div>
                </div>
              ))}
              <a href="/jobs" style={{ display:"block", textAlign:"center", marginTop:20, color:"#1a56db", fontSize:14, fontWeight:500 }}>Browse more jobs →</a>
            </div>

            {/* Right column */}
            <div style={{ display:"flex", flexDirection:"column", gap:16 }}>

              {/* Profile completion */}
              <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"20px" }}>
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Profile completion</h3>
                <div style={{ display:"flex", justifyContent:"space-between", fontSize:13, marginBottom:8 }}>
                  <span style={{ color:"#6b7280" }}>60% complete</span>
                  <a href="/profile" style={{ color:"#1a56db" }}>Edit →</a>
                </div>
                <div style={{ background:"#f3f4f6", borderRadius:4, height:8 }}>
                  <div style={{ background:"#1a56db", width:"60%", height:"100%", borderRadius:4 }} />
                </div>
                <div style={{ marginTop:14, display:"flex", flexDirection:"column", gap:8 }}>
                  {[["✅","Basic info added"],["✅","Email verified"],["⬜","Upload your CV"],["⬜","Add work experience"],["⬜","Add skills"]].map(([icon,label])=>(
                    <div key={label as string} style={{ display:"flex", gap:8, fontSize:13, color: (icon==="✅") ? "#374151" : "#9ca3af" }}>
                      <span>{icon}</span><span>{label as string}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick links */}
              <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"20px" }}>
                <h3 style={{ fontSize:15, fontWeight:600, marginBottom:14 }}>Quick actions</h3>
                {[
                  { href:"/jobs", label:"🔍 Search jobs" },
                  { href:"/cv-templates", label:"📄 Download CV template" },
                  { href:"/paycheck-calculator", label:"💰 Calculate take-home pay" },
                  { href:"/career-advice", label:"📚 Read career advice" },
                ].map(l => (
                  <a key={l.href} href={l.href} style={{ display:"block", padding:"10px 0", fontSize:14, color:"#374151", borderBottom:"1px solid #f9fafb", fontWeight:500 }}>
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
