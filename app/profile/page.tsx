"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    location: "",
    title: "",
    bio: "",
    linkedin: "",
    github: "",
    website: "",
    skills: "",
    experience: "",
  });

  const update = (k: string, v: string) => { setForm(f => ({ ...f, [k]: v })); setSaved(false); };
  const save = (e: React.FormEvent) => { e.preventDefault(); setSaved(true); };

  const inputStyle = { width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14, outline:"none" };
  const labelStyle = { display:"block" as const, fontSize:13, fontWeight:500, color:"#374151", marginBottom:6 };

  return (
    <>
      <Navbar />
      <div style={{ background:"#f9fafb", minHeight:"100vh", padding:"40px 20px" }}>
        <div className="container" style={{ maxWidth:720 }}>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>My profile</h1>
          <p style={{ color:"#6b7280", fontSize:15, marginBottom:32 }}>Keep your profile up to date to get better job matches</p>

          <form onSubmit={save}>

            {/* Avatar section */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:20, display:"flex", alignItems:"center", gap:20 }}>
              <div style={{ width:72, height:72, borderRadius:"50%", background:"#1a56db", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:26, fontWeight:700, flexShrink:0 }}>
                {session?.user?.image
                  ? <img src={session.user.image} style={{ width:72, height:72, borderRadius:"50%", objectFit:"cover" }} />
                  : (session?.user?.name?.[0] || "U")}
              </div>
              <div>
                <div style={{ fontWeight:600, fontSize:17 }}>{session?.user?.name || "Your Name"}</div>
                <div style={{ color:"#6b7280", fontSize:14, marginBottom:10 }}>{session?.user?.email}</div>
                <button type="button" style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:7, padding:"6px 14px", fontSize:13, cursor:"pointer" }}>
                  Change photo
                </button>
              </div>
            </div>

            {/* Personal info */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Personal information</h2>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={labelStyle}>Full name</label>
                  <input value={form.name} onChange={e => update("name", e.target.value)} style={inputStyle} placeholder="Jane Smith" />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input value={form.email} onChange={e => update("email", e.target.value)} style={inputStyle} placeholder="jane@example.com" type="email" />
                </div>
                <div>
                  <label style={labelStyle}>Phone</label>
                  <input value={form.phone} onChange={e => update("phone", e.target.value)} style={inputStyle} placeholder="+1 (555) 000-0000" />
                </div>
                <div>
                  <label style={labelStyle}>Location</label>
                  <input value={form.location} onChange={e => update("location", e.target.value)} style={inputStyle} placeholder="New York, NY" />
                </div>
              </div>
              <div style={{ marginTop:16 }}>
                <label style={labelStyle}>Job title / headline</label>
                <input value={form.title} onChange={e => update("title", e.target.value)} style={inputStyle} placeholder="Software Engineer · Open to work" />
              </div>
              <div style={{ marginTop:16 }}>
                <label style={labelStyle}>Bio / personal statement</label>
                <textarea value={form.bio} onChange={e => update("bio", e.target.value)}
                  style={{ ...inputStyle, minHeight:100, resize:"vertical" as const }}
                  placeholder="A brief summary of your experience and what you're looking for..." />
              </div>
            </div>

            {/* Links */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>Links & profiles</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                {[
                  { key:"linkedin", label:"LinkedIn URL", placeholder:"https://linkedin.com/in/yourname" },
                  { key:"github", label:"GitHub URL", placeholder:"https://github.com/yourname" },
                  { key:"website", label:"Personal website", placeholder:"https://yoursite.com" },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input value={(form as any)[f.key]} onChange={e => update(f.key, e.target.value)} style={inputStyle} placeholder={f.placeholder} />
                  </div>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:20 }}>
              <h2 style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Skills</h2>
              <p style={{ fontSize:13, color:"#6b7280", marginBottom:14 }}>Separate skills with commas</p>
              <textarea value={form.skills} onChange={e => update("skills", e.target.value)}
                style={{ ...inputStyle, minHeight:80, resize:"vertical" as const }}
                placeholder="JavaScript, React, Node.js, Python, SQL, Figma..." />
              {form.skills && (
                <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:12 }}>
                  {form.skills.split(",").map(s => s.trim()).filter(Boolean).map(s => (
                    <span key={s} style={{ background:"#eff6ff", color:"#1a56db", fontSize:12, fontWeight:500, padding:"3px 12px", borderRadius:20 }}>{s}</span>
                  ))}
                </div>
              )}
            </div>

            {/* CV Upload */}
            <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:24 }}>
              <h2 style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>Your CV</h2>
              <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>Upload your CV so employers can find you</p>
              <div style={{ border:"2px dashed #e5e7eb", borderRadius:10, padding:"32px", textAlign:"center" }}>
                <div style={{ fontSize:32, marginBottom:8 }}>📄</div>
                <p style={{ fontSize:14, color:"#6b7280", marginBottom:12 }}>Drag & drop your CV here, or</p>
                <button type="button" style={{ background:"#1a56db", color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontSize:13, fontWeight:600, cursor:"pointer" }}>
                  Choose file
                </button>
                <p style={{ fontSize:12, color:"#9ca3af", marginTop:10 }}>PDF or Word · Max 5MB</p>
              </div>
            </div>

            {/* Save button */}
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <button type="submit"
                style={{ background:"#1a56db", color:"#fff", border:"none", borderRadius:10, padding:"12px 32px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
                Save profile
              </button>
              {saved && <span style={{ color:"#16a34a", fontSize:14, fontWeight:500 }}>✅ Profile saved!</span>}
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
