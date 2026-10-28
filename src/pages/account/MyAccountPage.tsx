import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../../config/api";
import { useAuthStore } from "../../store/authStore";
type Data = Record<string, any>;
const first = (...items: any[]) => items.find((x) => typeof x === "string" && x.trim()) || "";
function Row({ label, children }: { label: string; children: ReactNode }) {
 return <div style={{ padding: "12px 0", borderBottom: "1px solid #292d36", display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}><span style={{ opacity: .7 }}>{label}</span><strong style={{ textAlign: "right", overflowWrap: "anywhere" }}>{children || "Not provided"}</strong></div>;
}
export default function MyAccountPage() {
 const user = useAuthStore((s) => s.user); const fetchMe = useAuthStore((s) => s.fetchMe);
 const [business, setBusiness] = useState<Data | null>(null); const [billing, setBilling] = useState<Data | null>(null);
 const [payments, setPayments] = useState<Data[]>([]); const [loading, setLoading] = useState(true); const [notice, setNotice] = useState("");
 useEffect(() => {
  let active = true; const token = localStorage.getItem("token");
  async function load() {
   if (!user && token) await fetchMe();
   if (!token) { if (active) setLoading(false); return; }
   const headers = { Authorization: `Bearer ${token}` };
   const read = async (path: string) => { const r = await fetch(`${API_BASE}${path}`, { headers }); if (!r.ok) return null; return r.json(); };
   const [b, bill, p] = await Promise.all([read("/api/business-profile"), read("/api/billing-profile"), read("/api/payments/history")]);
   if (!active) return;
   setBusiness(b?.profile ?? b); setBilling(bill?.profile ?? bill); setPayments(Array.isArray(p?.data) ? p.data : Array.isArray(p) ? p : []); setLoading(false);
  }
  load().catch((e) => { console.error("Unable to load account details", e); if (active) { setNotice("Some account details could not be loaded. Please refresh and try again."); setLoading(false); } });
  return () => { active = false; };
 }, [fetchMe, user]);
 const panel = { background: "#14151a", border: "1px solid #292d36", borderRadius: 16, padding: 22, minWidth: 0 } as const;
 const link = { display: "inline-block", border: "1px solid #3b82f6", background: "#2563eb", color: "#fff", borderRadius: 10, padding: "10px 14px", fontWeight: 600, textDecoration: "none" } as const;
 const plan = user?.plan || user?.subscription?.plan || "FREE";
 return <main style={{ maxWidth: 1000, margin: "0 auto", padding: "30px 20px 56px", color: "var(--text-primary, #f3f4f6)" }}>
  <div style={{ marginBottom: 24 }}><p style={{ color: "#60a5fa", fontSize: 12, letterSpacing: ".12em", fontWeight: 700 }}>ACCOUNT CENTRE</p><h1 style={{ fontSize: 30, margin: "6px 0" }}>My Account</h1><p style={{ opacity: .72, margin: 0 }}>Manage your profile, business billing details and payment records.</p></div>
  {notice && <p role="status" style={{ background: "#422006", padding: 12, borderRadius: 8 }}>{notice}</p>}
  {loading ? <p>Loading account details…</p> : <div style={{ display: "grid", gap: 18 }}>
   <section style={panel}><h2 style={{ marginTop: 0 }}>Personal profile</h2><Row label="Name">{first(user?.fullName, user?.name)}</Row><Row label="Email">{user?.email}</Row><Row label="Phone">{first(user?.phone, user?.phoneNumber)}</Row><Row label="Current plan">{plan}</Row><Row label="Available credits">{user?.creditsAvailable ?? user?.credits ?? 0}</Row></section>
   <section style={panel}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}><h2 style={{ margin: 0 }}>Business details</h2><Link style={link} to="/onboarding?required=1&billingOnly=1&returnTo=/account">Review details</Link></div><Row label="Business / legal name">{first(business?.businessName, business?.legalName, billing?.businessName, billing?.legalName, billing?.fullName)}</Row><Row label="Trade name">{first(business?.tradeName, billing?.tradeName)}</Row><Row label="GSTIN">{first(business?.gstin, business?.GSTIN, billing?.gstin, billing?.GSTIN)}</Row><Row label="Billing address">{[billing?.addressLine1, billing?.addressLine2, billing?.city, billing?.state, billing?.postalCode, billing?.country].filter(Boolean).join(", ")}</Row><p style={{ opacity: .68, fontSize: 13, marginBottom: 0 }}>Details reflect information currently returned by your account. Use Review details to update them where supported.</p></section>
   <section style={panel}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}><h2 style={{ margin: 0 }}>Subscription & invoices</h2><Link style={link} to="/plans">Manage plan & billing</Link></div><Row label="Current plan">{plan}</Row><Row label="Payment records">{payments.length}</Row>
   {payments.length > 0 && <div style={{ marginTop: 14, overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}><thead><tr style={{ textAlign: "left", opacity: .7 }}><th style={{ padding: "10px 8px" }}>Date</th><th style={{ padding: "10px 8px" }}>Description</th><th style={{ padding: "10px 8px" }}>Amount</th><th style={{ padding: "10px 8px" }}>Status</th></tr></thead><tbody>{payments.slice(0,5).map((p,i) => <tr key={p.id || p.orderId || i} style={{ borderTop: "1px solid #292d36" }}><td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{first(p.createdAt,p.created_at,p.date) ? new Date(first(p.createdAt,p.created_at,p.date)).toLocaleDateString() : "—"}</td><td style={{ padding: "10px 8px" }}>{first(p.plan,p.description,p.type) || "Payment"}</td><td style={{ padding: "10px 8px", whiteSpace: "nowrap" }}>{p.currency || "INR"} {p.amount != null ? p.amount : "—"}</td><td style={{ padding: "10px 8px" }}>{first(p.status,p.paymentStatus) || "—"}</td></tr>)}</tbody></table></div>}
   <p style={{ opacity: .68, fontSize: 13, marginBottom: 0 }}>Invoice downloads are shown only when supported by the billing records.</p></section>
   <section style={panel}><h2 style={{ marginTop: 0 }}>Connected accounts</h2><p style={{ opacity: .75 }}>Manage social publishing connections in the Social Accounts area.</p><Link style={link} to="/social-media">Manage social accounts</Link></section>
  </div>}
 </main>;
}
