import { cookies } from "next/headers";
import AgentClient from "./AgentClient";
import { redirect } from "next/navigation";

export const metadata = { robots: "noindex", title: "AI Agent — Jobnique" };

async function login(formData: FormData) {
  "use server";
  const pw = formData.get("pw") as string;
  if (pw === process.env.ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("agent_authed", "1", { httpOnly: true, secure: true, maxAge: 60 * 60 * 8 });
    redirect("/agent");
  } else {
    redirect("/agent?error=1");
  }
}

export default async function AgentPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const cookieStore = await cookies();
  const authed = cookieStore.get("agent_authed")?.value === "1";
  if (authed) return <AgentClient />;

  const params = await searchParams;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0f1e", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',sans-serif" }}>
      <div style={{ padding: "2rem", borderRadius: 14, border: "1px solid rgba(26,86,219,0.25)", background: "rgba(15,20,40,0.95)", width: 320, textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🔐</div>
        <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#fff", marginBottom: 4 }}>
          Job<span style={{ color: "#f97316" }}>nique</span>
        </div>
        <p style={{ color: "#6b7280", fontSize: "0.8rem", marginBottom: "1.5rem" }}>AI Content Agent</p>
        <form action={login}>
          <input
            type="password" name="pw" placeholder="Enter admin password" autoFocus
            style={{ width: "100%", padding: "0.65rem 0.9rem", borderRadius: 8, border: "1px solid rgba(26,86,219,0.2)", background: "rgba(0,0,0,0.4)", color: "white", fontSize: "0.9rem", marginBottom: "0.75rem", boxSizing: "border-box", outline: "none" }}
          />
          <button type="submit"
            style={{ width: "100%", padding: "0.65rem", borderRadius: 8, border: "1px solid rgba(26,86,219,0.4)", background: "rgba(26,86,219,0.15)", color: "#1a56db", fontSize: "0.9rem", cursor: "pointer", fontWeight: 700 }}>
            ENTER →
          </button>
        </form>
        {params.error && <p style={{ color: "#ef4444", fontSize: "0.75rem", marginTop: "0.75rem" }}>❌ Wrong password</p>}
      </div>
    </div>
  );
}
