import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_BASE } from "../../config/api";
import "./AuthPages.css";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Password reset failed.");
      }

      setIsError(false);
      setMessage("Password reset successful. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 2000);

    } catch (err: any) {
      setIsError(true);
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-card">

      <h1 className="auth-title">
        Reset Password
      </h1>

      <p className="auth-subtitle">
        Enter your new password below.
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>

        <input
          className="auth-input"
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        <button
          className="auth-button"
          type="submit"
          disabled={loading}
        >
          {loading ? "Updating..." : "Reset Password"}
        </button>

      </form>

      {message && (
        <div
          className={`auth-message ${
            isError ? "auth-error" : "auth-success"
          }`}
        >
          {message}
        </div>
      )}

    </div>
  </div>
);
}