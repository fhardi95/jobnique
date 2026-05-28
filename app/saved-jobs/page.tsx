"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const initialJobs = [
  { id:1, title:"Software Engineer", company:"Google", location:"New York, NY", salary:"$120k–$150k", type:"Full-time", saved:"2 days ago", logo:"G" },
  { id:2, title:"Product Manager", company:"Microsoft", location:"Seattle, WA", salary:"$130k–$160k", type:"Full-time", saved:"3 days ago", logo:"M" },
  { id:3, title:"UX Designer", company:"Apple", location:"Cupertino, CA", salary:"$110k–$140k", type:"Full-time", saved:"5 days ago", logo:"A" },
  { id:4, title:"Data Scientist", company:"Netflix", location:"Remote", salary:"$115k–$145k", type:"Remote", saved:"1 week ago", logo:"N" },
  { id:5, title:"DevOps Engineer", company:"Spotify", location:"Austin, TX", salary:"$105k–$135k", type:"Hybrid", saved:"1 week ago", logo:"S" },
];

const logoColors = ["#EA4335","#0078D4","#000","#E50914","#1DB954","#FF6600","#0061FF"];

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState(initialJobs);
  const remove = (id: number) => setJobs(jobs.filter(j => j.id !== id));

  return (
    <>
      <Navbar />
      <div style={{ background:"#f9fafb", minHeight:"100vh", padding:"40px 20px" }}>
        <div className="container" style={{ maxWidth:800 }}>
          <div style={{ marginBottom:28 }}>
            <h1 style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>Saved jobs</h1>
            <p style={{ color:"#6b7280", fontSize:15 }}>{jobs.length} job{jobs.length !== 1 ? "s" : ""} saved</p>
          </div>

          {jobs.length === 0 ? (
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"60px 32px", textAlign:"center" }}>
              <div style={{ fontSize:48, marginBottom:16 }}>♡</div>
              <h3 style={{ fontSize:18, fontWeight:600, marginBottom:8 }}>No saved jobs yet</h3>
              <p style={{ color:"#6b7280", fontSize:14, marginBottom:24 }}>Browse jobs and click the heart icon to save them here</p>
              <a href="/jobs" style={{ background:"#1a56db", color:"#fff", padding:"10px 24px", borderRadius:8, fontSize:14, fontWeight:600 }}>Browse jobs</a>
            </div>
          ) : (
            <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
              {jobs.map((job, i) => (
                <div key={job.id} style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"20px 24px", display:"flex", alignItems:"center", gap:16, flexWrap:"wrap" }}>
                  {/* Logo */}
                  <div style={{ width:44, height:44, borderRadius:10, background:logoColors[i % logoColors.length], color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:18, fontWeight:700, flexShrink:0 }}>
                    {job.logo}
                  </div>
                  {/* Info */}
                  <div style={{ flex:1, minWidth:200 }}>
                    <div style={{ fontWeight:600, fontSize:16, marginBottom:3 }}>{job.title}</div>
                    <div style={{ fontSize:13, color:"#6b7280", marginBottom:6 }}>{job.company} · {job.location}</div>
                    <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                      <span style={{ background:"#eff6ff", color:"#1a56db", fontSize:12, fontWeight:500, padding:"2px 10px", borderRadius:20 }}>{job.salary}</span>
                      <span style={{ background:"#f3f4f6", color:"#6b7280", fontSize:12, padding:"2px 10px", borderRadius:20 }}>{job.type}</span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div style={{ display:"flex", flexDirection:"column", gap:8, flexShrink:0 }}>
                    <div style={{ fontSize:12, color:"#9ca3af", textAlign:"right", marginBottom:4 }}>Saved {job.saved}</div>
                    <a href="/jobs" style={{ background:"#1a56db", color:"#fff", border:"none", borderRadius:8, padding:"8px 18px", fontSize:13, fontWeight:600, textAlign:"center", display:"block" }}>
                      Apply now
                    </a>
                    <button onClick={() => remove(job.id)}
                      style={{ background:"transparent", color:"#ef4444", border:"1px solid #fecaca", borderRadius:8, padding:"7px 18px", fontSize:13, cursor:"pointer" }}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
