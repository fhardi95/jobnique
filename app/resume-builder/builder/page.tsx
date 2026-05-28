import { Suspense } from "react";
import BuilderClient from "./BuilderClient";

export const metadata = {
  title: "Resume Builder Editor | Jobnique",
};

export default function BuilderPage() {
  return (
    <Suspense fallback={
      <div style={{
        height: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif", background: "#f8fafc",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>✏️</div>
          <p style={{ color: "#6b7280", fontSize: 15 }}>Loading your builder…</p>
        </div>
      </div>
    }>
      <BuilderClient />
    </Suspense>
  );
}
