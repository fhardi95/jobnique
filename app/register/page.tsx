"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState<"jobseeker"|"employer">("jobseeker");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Passwords don't match."); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (!agreed) { setError("Please agree to the Terms of Service."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); }
      else { setEmailSent(true); }
    } catch { setError("Something went wrong. Please try again."); }
    setLoading(false);
  };

  // ✅ Email sent confirmation screen
  if (emailSent) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
          <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"48px 40px", maxWidth:460, width:"100%", textAlign:"center" }}>
            <div style={{ width:72, height:72, borderRadius:"50%", background:"#eff6ff", border:"2px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:32 }}>
              📧
            </div>
            <h1 style={{ fontSize:22, fontWeight:700, marginBottom:8 }}>Check your inbox!</h1>
            <p style={{ color:"#6b7280", fontSize:15, lineHeight:1.7, marginBottom:8 }}>
              We've sent a confirmation email to:
            </p>
            <p style={{ fontWeight:600, fontSize:16, color:"#1a56db", marginBottom:24 }}>{email}</p>
            <p style={{ color:"#6b7280", fontSize:14, lineHeight:1.7, marginBottom:28 }}>
              Click the link in the email to activate your account. The link expires in <strong>24 hours</strong>.
            </p>
            <div style={{ background:"#f9fafb", borderRadius:10, padding:"14px 18px", fontSize:13, color:"#6b7280", lineHeight:1.7, marginBottom:24 }}>
              📬 Didn't receive it? Check your spam folder or{" "}
              <button onClick={() => setEmailSent(false)} style={{ background:"none", border:"none", color:"#1a56db", cursor:"pointer", fontSize:13, fontWeight:500 }}>
                try again
              </button>
            </div>
            <Link href="/login" style={{ color:"#6b7280", fontSize:14 }}>
              Already confirmed? <span style={{ color:"#1a56db", fontWeight:500 }}>Sign in →</span>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight:"100vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ width:"100%", maxWidth:480 }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <Link href="/" style={{ display:"inline-flex", alignItems:"center", gap:2 }}>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#1a56db" }}>Job</span>
              <span style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#f97316" }}>nique</span>
            </Link>
            <h1 style={{ fontSize:22, fontWeight:600, marginTop:16, marginBottom:6 }}>Create your free account</h1>
            <p style={{ color:"#6b7280", fontSize:14 }}>Join 2 million+ professionals on Jobnique</p>
          </div>

          <div style={{ background:"#fff", borderRadius:16, border:"1px solid #e5e7eb", padding:"32px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>

            {/* Role toggle */}
            <div style={{ display:"flex", background:"#f3f4f6", borderRadius:10, padding:4, marginBottom:24 }}>
              {(["jobseeker","employer"] as const).map(r => (
                <button key={r} onClick={() => setRole(r)} type="button"
                  style={{ flex:1, padding:"9px", borderRadius:8, border:"none", cursor:"pointer", fontSize:14, fontWeight:500, transition:"all 0.15s",
                    background:role===r?"#fff":"transparent", color:role===r?"#1a56db":"#6b7280",
                    boxShadow:role===r?"0 1px 3px rgba(0,0,0,0.1)":"none" }}>
                  {r==="jobseeker"?"👤 Job seeker":"🏢 Employer"}
                </button>
              ))}
            </div>

            {/* Social buttons */}
            <div style={{ display:"flex", flexDirection:"column", gap:10, marginBottom:22 }}>
              <button onClick={() => signIn("google", { callbackUrl:"/" })} type="button"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", padding:"11px 16px", border:"1.5px solid #e5e7eb", borderRadius:10, background:"#fff", cursor:"pointer", fontSize:14, fontWeight:500, color:"#374151" }}
                onMouseEnter={e=>(e.currentTarget.style.background="#f9fafb")}
                onMouseLeave={e=>(e.currentTarget.style.background="#fff")}>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:22 }}>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
              <span style={{ fontSize:13, color:"#9ca3af" }}>or register with email</span>
              <div style={{ flex:1, height:1, background:"#e5e7eb" }} />
            </div>

            <form onSubmit={handleSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              {error && (
                <div style={{ background:"#fef2f2", border:"1px solid #fecaca", borderRadius:8, padding:"10px 14px", fontSize:13, color:"#dc2626" }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:6, color:"#374151" }}>
                  {role==="employer"?"Company name":"Full name"}
                </label>
                <input type="text" value={name} onChange={e=>setName(e.target.value)} required
                  placeholder={role==="employer"?"Acme Corp":"Jane Smith"}
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14 }} />
              </div>

              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:6, color:"#374151" }}>Email address</label>
                <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="you@example.com"
                  style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14 }} />
              </div>

              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:6, color:"#374151" }}>Password</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Min. 8 chars"
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14 }} />
                </div>
                <div>
                  <label style={{ display:"block", fontSize:13, fontWeight:500, marginBottom:6, color:"#374151" }}>Confirm</label>
                  <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required placeholder="Repeat password"
                    style={{ width:"100%", border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14 }} />
                </div>
              </div>

              {password.length > 0 && (
                <div>
                  <div style={{ display:"flex", gap:4, marginBottom:4 }}>
                    {[1,2,3,4].map(i=>(
                      <div key={i} style={{ flex:1, height:4, borderRadius:2, background:i<=Math.min(4,Math.floor(password.length/2))?(password.length<6?"#ef4444":password.length<10?"#f97316":"#16a34a"):"#e5e7eb" }} />
                    ))}
                  </div>
                  <span style={{ fontSize:11, color:"#6b7280" }}>{password.length<6?"Weak":password.length<10?"Medium":"Strong"} password</span>
                </div>
              )}

              <label style={{ display:"flex", gap:10, alignItems:"flex-start", cursor:"pointer" }}>
                <input type="checkbox" checked={agreed} onChange={e=>setAgreed(e.target.checked)}
                  style={{ marginTop:2, width:16, height:16, accentColor:"#1a56db", flexShrink:0 }} />
                <span style={{ fontSize:13, color:"#6b7280", lineHeight:1.5 }}>
                  I agree to Jobnique's{" "}
                  <Link href="/terms" style={{ color:"#1a56db" }}>Terms of Service</Link>{" "}and{" "}
                  <Link href="/privacy" style={{ color:"#1a56db" }}>Privacy Policy</Link>
                </span>
              </label>

              <button type="submit" disabled={loading}
                style={{ background:"#1a56db", color:"#fff", border:"none", borderRadius:10, padding:"13px", fontSize:15, fontWeight:600, cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1, marginTop:4 }}>
                {loading?"Creating account…":`Create ${role==="employer"?"employer":"free"} account`}
              </button>
            </form>
          </div>

          <p style={{ textAlign:"center", marginTop:20, fontSize:14, color:"#6b7280" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color:"#1a56db", fontWeight:600 }}>Sign in →</Link>
          </p>
        </div>
      </div>
    </>
  );
}
