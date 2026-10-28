import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import "./dashboard.css";

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const fetchMe = useAuthStore((state) => state.fetchMe);
  useEffect(() => { if (!user && localStorage.getItem("token")) void fetchMe(); }, [user, fetchMe]);

  const name = user?.fullName || user?.name || user?.email?.split("@")[0] || "there";
  const plan = user?.plan || user?.subscription?.plan || "FREE";
  const credits = Number(user?.creditsAvailable ?? user?.credits ?? 0);
  const card = { background: "var(--card-bg, #14151a)", border: "1px solid var(--border-color, #292d36)", borderRadius: 16, padding: 22, minWidth: 0 } as const;
  const button = { border: "1px solid #3b82f6", background: "#2563eb", color: "#fff", borderRadius: 10, padding: "10px 14px", fontWeight: 600, cursor: "pointer" } as const;

  return <main className="mr-dashboard" style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 20px 48px" }}>
    <h1 className="mr-dashboard-title">Dashboard</h1>
    <p style={{ marginTop: 4, marginBottom: 24, opacity: 0.75 }}>Welcome back, {name}. What would you like to create today?</p>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      <div style={card}><p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>CURRENT PLAN</p><h2 style={{ margin: "10px 0 16px" }}>{plan}</h2><button style={button} onClick={() => navigate("/plans")}>View plans & billing</button></div>
      <div style={card}><p style={{ margin: 0, opacity: 0.7, fontSize: 13 }}>AVAILABLE CREDITS</p><h2 style={{ margin: "10px 0 16px" }}>{credits.toLocaleString()}</h2><button style={button} onClick={() => navigate("/plans")}>Get more credits</button></div>
    </section>
    <h2 style={{ margin: "30px 0 14px", fontSize: 20 }}>Quick actions</h2>
    <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
      <button type="button" style={{ ...card, textAlign: "left", color: "inherit", cursor: "pointer" }} onClick={() => navigate("/create-ai-hero")}><strong style={{ display: "block", fontSize: 17, marginBottom: 8 }}>Create Hero Images</strong><span style={{ opacity: 0.75 }}>Generate product-ready fashion imagery.</span></button>
      <button type="button" style={{ ...card, textAlign: "left", color: "inherit", cursor: "pointer" }} onClick={() => navigate("/pack/ecom")}><strong style={{ display: "block", fontSize: 17, marginBottom: 8 }}>Create an E-commerce Lookbook</strong><span style={{ opacity: 0.75 }}>Build marketplace-ready fashion visuals.</span></button>
      <button type="button" style={{ ...card, textAlign: "left", color: "inherit", cursor: "pointer" }} onClick={() => navigate("/predictions")}><strong style={{ display: "block", fontSize: 17, marginBottom: 8 }}>Open Portfolio</strong><span style={{ opacity: 0.75 }}>Explore your existing creations and generation history.</span></button>
      <button type="button" style={{ ...card, textAlign: "left", color: "inherit", cursor: "pointer" }} onClick={() => navigate("/publish")}><strong style={{ display: "block", fontSize: 17, marginBottom: 8 }}>Publish Content</strong><span style={{ opacity: 0.75 }}>Continue to your publishing workspace.</span></button>
    </section>
    <div style={{ ...card, marginTop: 24, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><strong>Account and billing</strong><p style={{ margin: "6px 0 0", opacity: 0.75 }}>Manage your profile, business billing details and payment records.</p></div><button style={button} onClick={() => navigate("/account")}>Open My Account</button></div>
  </main>;
}
