import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [status, setStatus] = useState<"checking"|"success"|"error">("checking");
  const [message, setMessage] = useState("Verifying your email…");
  useEffect(() => {
    let active = true;
    if (!token) { setStatus("error"); setMessage("This verification link is missing its token."); return; }
    fetch(`${API_BASE}/api/auth/verify-email`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({token}) })
      .then(async r => { const d = await r.json().catch(()=>({})); if (!r.ok) throw new Error(d.error || "This link is invalid or has expired."); return d; })
      .then(() => { if(active){setStatus("success");setMessage("Your email is verified. Welcome to MagicReel!");} })
      .catch(e => { if(active){setStatus("error");setMessage(e.message || "Verification failed.");} });
    return () => { active = false; };
  }, [token]);
  return <main style={s.page}><section style={s.card}>
    <div style={s.brand}>MagicReel</div>
    <div style={s.symbol}>{status==="success"?"✓":status==="error"?"!":"…"}</div>
    <h1 style={s.title}>{status==="success"?"Welcome to MagicReel":status==="error"?"Verification unsuccessful":"Verifying your email"}</h1>
    <p style={s.copy}>{message}</p>
    {status==="success" && <Link style={s.button} to="/plans">Select Plan</Link>}
    {status==="error" && <><p style={s.note}>You can request a fresh verification link from the sign-up page.</p><Link style={s.button} to="/signup">Return to sign up</Link></>}
    {status==="checking" && <div style={s.loader}>Please wait…</div>}
  </section></main>;
}
const s:Record<string,React.CSSProperties>={page:{minHeight:"100vh",display:"grid",placeItems:"center",background:"#f8fafc",padding:24,fontFamily:"Inter,system-ui,sans-serif",color:"#0f172a"},card:{width:"100%",maxWidth:480,boxSizing:"border-box",background:"#fff",padding:40,borderRadius:20,textAlign:"center",boxShadow:"0 24px 70px rgba(15,23,42,.09)"},brand:{fontSize:25,fontWeight:800,color:"#172554",marginBottom:32},symbol:{margin:"0 auto 20px",width:58,height:58,borderRadius:29,background:"#e0e7ff",display:"grid",placeItems:"center",fontSize:30,fontWeight:800,color:"#1e3a8a"},title:{fontSize:30,letterSpacing:"-1px",margin:"0 0 14px"},copy:{lineHeight:1.7,color:"#475569",marginBottom:28},button:{display:"block",padding:15,borderRadius:10,background:"#172554",color:"#fff",fontWeight:700,textDecoration:"none"},note:{fontSize:14,color:"#64748b"},loader:{color:"#64748b"}};
