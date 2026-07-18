import { useState } from "react";
import { API_BASE } from "../../config/api";
import "./AuthPages.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Unable to send reset email. Please try again.");
    }
  }

  return (
  <div className="auth-page">
    <div className="auth-card">

      <h1 className="auth-title">
        Forgot Password
      </h1>

      <p className="auth-subtitle">
        Enter your registered email address and we'll send you a password reset link.
      </p>

      {submitted ? (
        <div className="auth-message auth-success">
          Password reset link sent successfully.
        </div>
      ) : (
        <form className="auth-form" onSubmit={handleSubmit}>

          <input
            className="auth-input"
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
          />

          <button
            className="auth-button"
            type="submit"
          >
            Send Reset Link
          </button>

        </form>
      )}

    </div>
  </div>
);
}