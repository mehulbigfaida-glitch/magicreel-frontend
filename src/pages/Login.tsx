import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_BASE } from "../config/api";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo =
    new URLSearchParams(location.search).get("redirect") || "/create-v2";

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      // ✅ Store JWT
      localStorage.setItem("token", data.token);

      // Redirect after login
      navigate(redirectTo);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0B0F14",
        color: "#FFFFFF",
      }}
    >
      <div
        style={{
          width: 380,
          padding: "32px 28px",
          borderRadius: 16,
          background: "#111827",
          boxShadow: "0 20px 40px rgba(0,0,0,0.45)",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          MagicReel Login
        </div>

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

        {error && (
          <div style={{ color: "#FCA5A5", marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} style={buttonStyle}>
          Login
        </button>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 14,
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

export default Login;