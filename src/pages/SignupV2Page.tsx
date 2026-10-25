import React, { useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function SignupV2Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!accepted) { setError("Please accept the Terms of Service and Privacy Policy."); return; }
    if (password.length < 8) { setError("Password must contain at least 8 characters."); return; }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/auth/register-pending`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "We couldn't start your registration. Please try again.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Registration failed.");
    } finally { setLoading(false); }
  }

  return <div style={styles.page}>
    <section style={styles.hero}>
      <div style={styles.brand}>MagicReel</div>
      <h1 style={styles.heroTitle}>Fashion creativity, reimagined.</h1>
      <p style={styles.heroCopy}>Create professional fashion images, lookbooks, campaigns and reels from one AI-powered workspace. No prompt engineering required.</p>
      <ul style={styles.features}><li>AI Hero Generation</li><li>Marketplace-ready Lookbooks</li><li>Social Campaigns</li><li>Cinematic Reels</li></ul>
    </section>
    <section style={styles.side}>
      <div style={styles.card}>
        {!submitted ? <>
          <h2 style={styles.title}>Create your account</h2>
          <p style={styles.subtitle}>Start with your email. We’ll verify it before you continue.</p>
          <form style={styles.form} onSubmit={handleSignup}>
            <label style={styles.label}>Email address</label>
            <input style={styles.input} type="email" autoComplete="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" />
            <label style={styles.label}>Password</label>
            <input style={styles.input} type="password" autoComplete="new-password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)} placeholder="At least 8 characters" />
            <label style={styles.check}><input type="checkbox" checked={accepted} onChange={e=>setAccepted(e.target.checked)} /> <span>I agree to the <a href="/policies/terms">Terms of Service</a> and <a href="/policies/privacy">Privacy Policy</a>.</span></label>
            {error && <p role="alert" style={styles.error}>{error}</p>}
            <button style={{...styles.button, opacity: loading ? 0.65 : 1}} disabled={loading}>{loading ? "Sending verification…" : "Create account"}</button>
          </form>
          <p style={styles.login}>Already have an account? <Link to="/login">Log in</Link></p>
        </> : <>
          <div style={styles.mailIcon}>✉</div>
          <h2 style={styles.title}>Check your inbox</h2>
          <p style={styles.subtitle}>If registration was accepted, a MagicReel verification link is on its way to <strong>{email}</strong>. Open it to verify your email and continue.</p>
          <button style={styles.button} disabled={loading} onClick={async()=>{setLoading(true);setError("");try{const r=await fetch(`${API_BASE}/api/auth/resend-verification`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:email.trim().toLowerCase()})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||"Could not resend the email.");setError("If your account is awaiting verification, a fresh link has been sent.");}catch(e:any){setError(e.message||"Could not resend the email.");}finally{setLoading(false);}}}>{loading?"Sending…":"Resend verification email"}</button><button style={{...styles.button,background:"#475569"}} onClick={()=>{setSubmitted(false);setError("");}}>Back to sign up</button>{error && <p role="status" style={styles.error}>{error}</p>}
          <p style={styles.login}>Already verified? <Link to="/login">Log in</Link></p>
        </>}
      </div>
    </section>
  </div>;
}

const styles: Record<string, React.CSSProperties> = {
  page:{minHeight:"100vh",display:"flex",background:"#f8fafc",fontFamily:"Inter,system-ui,sans-serif",color:"#0f172a"},
  hero:{flex:"1 1 50%",background:"linear-gradient(145deg,#0b1220,#172554)",color:"#fff",padding:"clamp(32px,6vw,84px)",display:"flex",flexDirection:"column",justifyContent:"center"},
  brand:{fontSize:30,fontWeight:800,letterSpacing:"-1px",marginBottom:56},
  heroTitle:{fontSize:"clamp(36px,4vw,56px)",lineHeight:1.08,letterSpacing:"-1.5px",margin:"0 0 22px"},
  heroCopy:{fontSize:17,lineHeight:1.7,color:"#cbd5e1",maxWidth:520},
  features:{listStyle:"none",padding:0,marginTop:32,lineHeight:2.5,fontWeight:600},
  side:{flex:"1 1 50%",display:"flex",alignItems:"center",justifyContent:"center",padding:24},
  card:{width:"100%",maxWidth:430,background:"#fff",padding:"clamp(26px,4vw,44px)",borderRadius:20,boxShadow:"0 24px 70px rgba(15,23,42,.09)",boxSizing:"border-box"},
  title:{fontSize:30,letterSpacing:"-0.8px",margin:"0 0 10px"},
  subtitle:{color:"#64748b",lineHeight:1.65,marginBottom:28},
  form:{display:"flex",flexDirection:"column",gap:12},
  label:{fontSize:14,fontWeight:650},
  input:{padding:"14px 15px",border:"1px solid #cbd5e1",borderRadius:10,fontSize:16,width:"100%",boxSizing:"border-box"},
  check:{display:"flex",gap:9,alignItems:"flex-start",fontSize:13,lineHeight:1.6,color:"#475569",marginTop:6},
  button:{marginTop:8,padding:15,border:0,borderRadius:10,background:"#172554",color:"#fff",fontWeight:700,fontSize:16,cursor:"pointer",width:"100%"},
  error:{color:"#b91c1c",fontSize:14},
  login:{textAlign:"center",marginTop:22,color:"#64748b",fontSize:14},
  mailIcon:{fontSize:36,marginBottom:18}
};
