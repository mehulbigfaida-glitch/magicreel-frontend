import { useState } from "react";
import { API_BASE } from "../../config/api";

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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow">
        <h1 className="text-2xl font-bold text-center">
          Forgot Password
        </h1>

        <p className="mt-2 text-center text-gray-600">
          Enter your email address and we'll send you a password reset link.
        </p>

        {submitted ? (
          <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-700">
            If an account exists with that email, a password reset link has
            been sent.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}