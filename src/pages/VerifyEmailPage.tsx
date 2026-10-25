import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function VerifyEmailPage() {
  const [params] = useSearchParams();
  const [state, setState] = useState<{ loading: boolean; error: string; message: string; purpose: string }>({
    loading: true, error: "", message: "", purpose: "",
  });

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      setState({ loading: false, error: "This verification link is missing its token. Request a fresh email and try again.", message: "", purpose: "" });
      return;
    }
    let active = true;
    fetch(`${API_BASE}/api/auth/verify-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "This verification link is invalid or expired.");
      if (active) setState({ loading: false, error: "", message: data.message || "Email verified.", purpose: data.purpose || "" });
    }).catch((error) => {
      if (active) setState({ loading: false, error: error.message || "Unable to verify email.", message: "", purpose: "" });
    });
    return () => { active = false; };
  }, [params]);

  const box: React.CSSProperties = { maxWidth: 560, margin: "10vh auto", padding: 32, borderRadius: 18, background: "#fff", boxShadow: "0 20px 60px rgba(15,23,42,.10)", fontFamily: "Arial,sans-serif", color: "#111827", lineHeight: 1.6 };
  return <main style={{ minHeight: "100vh", padding: 20, background: "#f8fafc", boxSizing: "border-box" }}>
    <section style={box}>
      <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>MagicReel</div>
      {state.loading ? <p>Verifying your email securely…</p> : state.error ? <>
        <h2>Verification could not be completed</h2><p style={{ color: "#b91c1c" }}>{state.error}</p>
        <p>If the link has expired, return to the form and request a fresh verification email.</p>
        <p><Link to="/signup">Regular sign-up</Link> · <Link to="/testing-credits/request">Testing-credit request</Link></p>
      </> : <>
        <h2>Email verified ✓</h2><p>{state.message}</p>
        {state.purpose === "testing" ? <p>Your testing-credit request will now be reviewed. Verification is not an approval or credit allocation.</p> : <p>Your account is activated. You can now sign in to MagicReel.</p>}
        <p><Link to="/login">Sign in</Link> · <Link to="/">Return to MagicReel</Link></p>
      </>}
    </section>
  </main>;
}
