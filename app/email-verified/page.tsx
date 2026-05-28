import Link from "next/link";
import Navbar from "@/components/Navbar";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Email Verified | Jobnique" };

export default function EmailVerifiedPage() {
  return (
    <>
      <Navbar />
      <div style={{ minHeight:"80vh", background:"#f9fafb", display:"flex", alignItems:"center", justifyContent:"center", padding:"40px 20px" }}>
        <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:16, padding:"48px 40px", maxWidth:480, width:"100%", textAlign:"center" }}>
          <div style={{ width:72, height:72, borderRadius:"50%", background:"#f0fdf4", border:"2px solid #bbf7d0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 24px", fontSize:32 }}>
            ✅
          </div>
          <h1 style={{ fontSize:24, fontWeight:700, marginBottom:8, color:"#111827" }}>Email confirmed!</h1>
          <p style={{ color:"#6b7280", fontSize:15, lineHeight:1.7, marginBottom:32 }}>
            Your Jobnique account is now active. You can sign in and start your job search.
          </p>
          <Link href="/login" style={{ display:"block", background:"#1a56db", color:"#fff", padding:"13px 32px", borderRadius:10, fontSize:15, fontWeight:600, marginBottom:14 }}>
            Sign in to your account
          </Link>
          <Link href="/jobs" style={{ display:"block", color:"#1a56db", fontSize:14, fontWeight:500 }}>
            Browse jobs →
          </Link>
        </div>
      </div>
    </>
  );
}
