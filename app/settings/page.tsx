"use client";
import { useState } from "react";
import { signOut } from "next-auth/react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({ jobAlerts:true, newsletter:true, applications:true, marketing:false });
  const [privacy, setPrivacy] = useState({ profileVisible:true, showSalary:false, openToWork:true });
  const [saved, setSaved] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const toggle = (group: "notifications"|"privacy", key: string) => {
    if (group === "notifications") setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }));
    else setPrivacy(p => ({ ...p, [key]: !p[key as keyof typeof p] }));
    setSaved(false);
  };

  const Toggle = ({ on, onClick }: { on: boolean; onClick: () => void }) => (
    <button onClick={onClick} type="button"
      style={{ width:44, height:24, borderRadius:12, background:on?"#1a56db":"#d1d5db", border:"none", cursor:"pointer", position:"relative", transition:"background 0.2s", flexShrink:0 }}>
      <span style={{ position:"absolute", top:2, left:on?22:2, width:20, height:20, borderRadius:"50%", background:"#fff", transition:"left 0.2s", display:"block" }} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background:"#fff", border:"1px solid #e5e7eb", borderRadius:12, padding:"24px", marginBottom:20 }}>
      <h2 style={{ fontSize:16, fontWeight:600, marginBottom:20 }}>{title}</h2>
      {children}
    </div>
  );

  const Row = ({ label, desc, on, onToggle }: { label: string; desc: string; on: boolean; onToggle: () => void }) => (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #f9fafb", gap:16 }}>
      <div>
        <div style={{ fontSize:14, fontWeight:500 }}>{label}</div>
        <div style={{ fontSize:12, color:"#6b7280", marginTop:2 }}>{desc}</div>
      </div>
      <Toggle on={on} onClick={onToggle} />
    </div>
  );

  return (
    <>
      <Navbar />
      <div style={{ background:"#f9fafb", minHeight:"100vh", padding:"40px 20px" }}>
        <div className="container" style={{ maxWidth:680 }}>
          <h1 style={{ fontSize:26, fontWeight:700, marginBottom:4 }}>Settings</h1>
          <p style={{ color:"#6b7280", fontSize:15, marginBottom:32 }}>Manage your account preferences</p>

          {/* Account */}
          <Section title="Account">
            <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#374151", marginBottom:6 }}>Email address</label>
                <div style={{ display:"flex", gap:10 }}>
                  <input defaultValue="fhardisaid@yahoo.fr" style={{ flex:1, border:"1.5px solid #e5e7eb", borderRadius:8, padding:"10px 14px", fontSize:14 }} />
                  <button style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 16px", fontSize:13, cursor:"pointer", fontWeight:500 }}>Update</button>
                </div>
              </div>
              <div>
                <label style={{ display:"block", fontSize:13, fontWeight:500, color:"#374151", marginBottom:6 }}>Password</label>
                <button style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:8, padding:"10px 16px", fontSize:13, cursor:"pointer", fontWeight:500 }}>Change password</button>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:10, padding:"12px 14px", background:"#f0fdf4", borderRadius:8, border:"1px solid #bbf7d0" }}>
                <span style={{ fontSize:18 }}>✅</span>
                <div>
                  <div style={{ fontSize:13, fontWeight:600, color:"#15803d" }}>Email verified</div>
                  <div style={{ fontSize:12, color:"#16a34a" }}>Your email address has been confirmed</div>
                </div>
              </div>
            </div>
          </Section>

          {/* Notifications */}
          <Section title="Email notifications">
            <Row label="Job alerts" desc="Get notified when new jobs match your search" on={notifications.jobAlerts} onToggle={() => toggle("notifications","jobAlerts")} />
            <Row label="Weekly newsletter" desc="Career tips, salary insights and top jobs" on={notifications.newsletter} onToggle={() => toggle("notifications","newsletter")} />
            <Row label="Application updates" desc="Updates on jobs you've applied to" on={notifications.applications} onToggle={() => toggle("notifications","applications")} />
            <Row label="Marketing emails" desc="Promotions, offers and product news" on={notifications.marketing} onToggle={() => toggle("notifications","marketing")} />
          </Section>

          {/* Privacy */}
          <Section title="Privacy & visibility">
            <Row label="Public profile" desc="Allow employers to find your profile" on={privacy.profileVisible} onToggle={() => toggle("privacy","profileVisible")} />
            <Row label="Open to work" desc="Show recruiters you're actively looking" on={privacy.openToWork} onToggle={() => toggle("privacy","openToWork")} />
            <Row label="Show salary expectations" desc="Display your salary expectations on your profile" on={privacy.showSalary} onToggle={() => toggle("privacy","showSalary")} />
          </Section>

          {/* Connected accounts */}
          <Section title="Connected accounts">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0" }}>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <svg width="20" height="20" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.36-8.16 2.36-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                <div>
                  <div style={{ fontSize:14, fontWeight:500 }}>Google</div>
                  <div style={{ fontSize:12, color:"#16a34a" }}>Connected</div>
                </div>
              </div>
              <button style={{ background:"transparent", border:"1px solid #e5e7eb", borderRadius:8, padding:"6px 14px", fontSize:13, cursor:"pointer", color:"#6b7280" }}>Disconnect</button>
            </div>
          </Section>

          {/* Save */}
          <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:24 }}>
            <button onClick={() => setSaved(true)}
              style={{ background:"#1a56db", color:"#fff", border:"none", borderRadius:10, padding:"12px 32px", fontSize:15, fontWeight:600, cursor:"pointer" }}>
              Save settings
            </button>
            {saved && <span style={{ color:"#16a34a", fontSize:14, fontWeight:500 }}>✅ Settings saved!</span>}
          </div>

          {/* Danger zone */}
          <div style={{ background:"#fff", border:"1.5px solid #fecaca", borderRadius:12, padding:"24px" }}>
            <h2 style={{ fontSize:16, fontWeight:600, color:"#dc2626", marginBottom:8 }}>Danger zone</h2>
            <p style={{ fontSize:13, color:"#6b7280", marginBottom:16 }}>Once you delete your account, all your data will be permanently removed. This cannot be undone.</p>
            {!deleteConfirm ? (
              <button onClick={() => setDeleteConfirm(true)}
                style={{ background:"transparent", border:"1.5px solid #ef4444", color:"#ef4444", borderRadius:8, padding:"9px 20px", fontSize:14, fontWeight:500, cursor:"pointer" }}>
                Delete my account
              </button>
            ) : (
              <div style={{ background:"#fef2f2", borderRadius:10, padding:"16px" }}>
                <p style={{ fontSize:14, fontWeight:500, color:"#dc2626", marginBottom:12 }}>Are you absolutely sure? This cannot be undone.</p>
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setDeleteConfirm(false)}
                    style={{ background:"#f3f4f6", border:"1px solid #e5e7eb", borderRadius:8, padding:"9px 20px", fontSize:14, cursor:"pointer" }}>
                    Cancel
                  </button>
                  <button style={{ background:"#ef4444", color:"#fff", border:"none", borderRadius:8, padding:"9px 20px", fontSize:14, fontWeight:600, cursor:"pointer" }}>
                    Yes, delete my account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
