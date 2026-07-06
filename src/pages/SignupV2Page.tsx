import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { API_BASE } from "../config/api";
import { useAuthStore } from "../store/authStore";

type FormState = {
  fullName: string;
  email: string;
  mobileNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
};

const SignupV2Page: React.FC = () => {
  const navigate = useNavigate();

  const setAuth = useAuthStore((s) => s.setAuth);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    mobileNumber: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const passwordScore = useMemo(() => {
    let score = 0;

    if (form.password.length >= 8) score++;
    if (/[A-Z]/.test(form.password)) score++;
    if (/[0-9]/.test(form.password)) score++;
    if (/[^A-Za-z0-9]/.test(form.password)) score++;

    return score;
  }, [form.password]);

  const passwordStrength = useMemo(() => {
    switch (passwordScore) {
      case 0:
      case 1:
        return {
          label: "Weak",
          color: "#EF4444",
        };

      case 2:
        return {
          label: "Fair",
          color: "#F59E0B",
        };

      case 3:
        return {
          label: "Good",
          color: "#3B82F6",
        };

      default:
        return {
          label: "Strong",
          color: "#10B981",
        };
    }
  }, [passwordScore]);

  const updateField = (
    key: keyof FormState,
    value: string | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!form.email.trim()) {
      return "Please enter your business email.";
    }

    if (!form.mobileNumber.trim()) {
      return "Please enter your mobile number.";
    }

    if (!form.password) {
      return "Please enter a password.";
    }

    if (form.password.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (form.password !== form.confirmPassword) {
      return "Passwords do not match.";
    }

    if (!form.acceptTerms) {
      return "Please accept the Terms of Service.";
    }

    if (!form.acceptPrivacy) {
      return "Please accept the Privacy Policy.";
    }

    return "";
  };

  const handleSignup = async () => {
    const validation = validate();

    if (validation) {
      setError(validation);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await fetch(
        `${API_BASE}/api/auth/register`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            mobileNumber: form.mobileNumber.trim(),
            password: form.password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Registration failed."
        );
      }

      setAuth(data.token, data.user);

      navigate("/onboarding");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.brand}>
          MagicReel
        </div>

        <div style={styles.heroTitle}>
          Create your AI Fashion Workspace
        </div>

        <div style={styles.heroSubtitle}>
          Generate hero campaigns,
          lookbooks, social creatives,
          cinematic visuals and reels
          from a single AI workspace.
        </div>

        <div style={styles.featureList}>
          <div style={styles.feature}>
            ✓ AI Hero Generation
          </div>

          <div style={styles.feature}>
            ✓ Fashion Lookbooks
          </div>

          <div style={styles.feature}>
            ✓ Social Campaigns
          </div>

          <div style={styles.feature}>
            ✓ Cinematic Reels
          </div>

          <div style={styles.feature}>
            ✓ 1 Welcome Credit
          </div>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>
            Create Account
          </div>

          <div style={styles.cardSubtitle}>
            Start building your AI
            Fashion Workspace.
          </div>

          {/* Remaining JSX continues in Part 2 */}

                    <div style={styles.form}>
            <input
              style={styles.input}
              placeholder="Full Name"
              value={form.fullName}
              onChange={(e) =>
                updateField("fullName", e.target.value)
              }
            />

            <input
              style={styles.input}
              placeholder="Business Email"
              type="email"
              value={form.email}
              onChange={(e) =>
                updateField("email", e.target.value)
              }
            />

            <input
              style={styles.input}
              placeholder="Mobile Number"
              value={form.mobileNumber}
              onChange={(e) =>
                updateField(
                  "mobileNumber",
                  e.target.value
                )
              }
            />

            <input
              style={styles.input}
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                updateField(
                  "password",
                  e.target.value
                )
              }
            />

            <div style={styles.passwordBar}>
              <div
                style={{
                  ...styles.passwordFill,
                  width: `${passwordScore * 25}%`,
                  background:
                    passwordStrength.color,
                }}
              />

            </div>

            <div
              style={{
                ...styles.passwordLabel,
                color: passwordStrength.color,
              }}
            >
              {passwordStrength.label}
            </div>

            <input
              style={styles.input}
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={(e) =>
                updateField(
                  "confirmPassword",
                  e.target.value
                )
              }
            />

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.acceptTerms}
                onChange={(e) =>
                  updateField(
                    "acceptTerms",
                    e.target.checked
                  )
                }
              />

              <span>
                I agree to the
                {" "}
                <span style={styles.link}>
                  Terms of Service
                </span>
              </span>
            </label>

            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={form.acceptPrivacy}
                onChange={(e) =>
                  updateField(
                    "acceptPrivacy",
                    e.target.checked
                  )
                }
              />

              <span>
                I agree to the
                {" "}
                <span style={styles.link}>
                  Privacy Policy
                </span>
              </span>
            </label>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            <button
              style={{
                ...styles.button,
                opacity: loading ? 0.7 : 1,
                cursor: loading
                  ? "not-allowed"
                  : "pointer",
              }}
              disabled={loading}
              onClick={handleSignup}
            >
              {loading
                ? "Creating Workspace..."
                : "Create Workspace"}
            </button>

            <div style={styles.loginText}>
              Already have an account?
              {" "}
              <Link
                to="/login"
                style={styles.loginLink}
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    display: "flex",
    minHeight: "100vh",
    background: "#F8FAFC",
  },

  leftPanel: {
    flex: 1,
    background:
      "linear-gradient(135deg,#0F172A,#1E293B)",
    color: "#fff",
    padding: "70px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  rightPanel: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 60,
  },

  card: {
    width: "100%",
    maxWidth: 520,
    background: "#fff",
    borderRadius: 20,
    padding: 42,
    boxShadow:
      "0 25px 60px rgba(0,0,0,.08)",
  },

  brand: {
    fontSize: 42,
    fontWeight: 700,
    marginBottom: 50,
  },

  heroTitle: {
    fontSize: 46,
    fontWeight: 700,
    lineHeight: 1.1,
    marginBottom: 24,
  },

  heroSubtitle: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#CBD5E1",
    maxWidth: 520,
    marginBottom: 50,
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 18,
  },

  feature: {
    fontSize: 18,
  },

  cardTitle: {
    fontSize: 34,
    fontWeight: 700,
  },

  cardSubtitle: {
    color: "#64748B",
    marginTop: 10,
    marginBottom: 30,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  input: {
    padding: "15px 18px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    fontSize: 15,
    outline: "none",
  },

  passwordBar: {
    height: 6,
    borderRadius: 10,
    background: "#E2E8F0",
    overflow: "hidden",
  },

  passwordFill: {
    height: "100%",
    transition: ".25s",
  },

  passwordLabel: {
    fontSize: 13,
    fontWeight: 600,
  },

  checkboxRow: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    fontSize: 14,
    color: "#475569",
  },

  button: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    border: "none",
    background: "#111827",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
  },

  error: {
    color: "#DC2626",
    fontSize: 14,
  },

  loginText: {
    textAlign: "center",
    marginTop: 18,
    color: "#64748B",
  },

  loginLink: {
    color: "#111827",
    textDecoration: "none",
    fontWeight: 700,
  },

  link: {
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
  },
};

export default SignupV2Page;