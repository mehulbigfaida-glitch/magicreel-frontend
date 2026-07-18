import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config/api";
import { useAuthStore } from "../store/authStore";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const setAuth = useAuthStore((s) => s.setAuth);

  const redirectTo =
  new URLSearchParams(location.search).get("redirect") || "/create-ai-hero";

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // 🔥 SET AUTH (instead of manual localStorage)
      setAuth(data.token, data.user);

      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={titleStyle}>MagicReel Login</div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {error && <div style={errorStyle}>{error}</div>}

<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 12,
  }}
>
  <span
    style={linkStyle}
    onClick={() => navigate("/forgot-password")}
  >
    Forgot Password?
  </span>
</div>

<button onClick={handleLogin} style={buttonStyle}>
  Login
</button>

        {/* 🔥 Signup Redirect */}
        <div style={footerStyle}>
          Don’t have an account?{" "}
          <span
            style={linkStyle}
            onClick={() => navigate("/signup")}
          >
            Sign up
          </span>
        </div>
      </div>
    </div>
  );
};

// ---------------- STYLES ----------------

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0B0F14",
  color: "#FFFFFF",
};

const cardStyle: React.CSSProperties = {
  width: 380,
  padding: "32px 28px",
  borderRadius: 16,
  background: "#111827",
  boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
};

const titleStyle: React.CSSProperties = {
  fontSize: 22,
  fontWeight: 600,
  marginBottom: 20,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "14px 16px",
  borderRadius: 10,
  border: "1px solid #1F2937",
  background: "#0B0F14",
  color: "#FFFFFF",
  fontSize: 14,
  marginBottom: 12,
  outline: "none",
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
  borderRadius: 12,
  border: "none",
  background: "#FFFFFF",
  color: "#0B0F14",
  fontSize: 15,
  fontWeight: 600,
  cursor: "pointer",
};

const errorStyle: React.CSSProperties = {
  color: "#FCA5A5",
  marginBottom: 12,
};

const footerStyle: React.CSSProperties = {
  marginTop: 14,
  fontSize: 13,
  color: "#9CA3AF",
};

const linkStyle: React.CSSProperties = {
  color: "#FFFFFF",
  cursor: "pointer",
  fontWeight: 500,
};

export default Login;