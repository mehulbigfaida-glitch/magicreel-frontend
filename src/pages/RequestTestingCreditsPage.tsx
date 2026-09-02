import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RequestTestingCreditsPage.css";

export default function RequestTestingCreditsPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    designation: "",
    company: "",
    email: "",
    mobile: "",
    instagram: "",
  });

  const [tests, setTests] = useState<string[]>([]);

  const [submitted, setSubmitted] = useState(false);

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleTest = (value: string) => {
    setTests((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value]
    );
  };

  const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  if (
    !form.name.trim() ||
    !form.designation.trim() ||
    !form.company.trim() ||
    !form.email.trim() ||
    !form.mobile.trim()
  ) {
    return;
  }

  try {
    const res = await fetch(
      "https://api.magicreel.in/api/testing-credits/request",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: form.name.trim(),
          designation: form.designation.trim(),
          company: form.company.trim(),
          email: form.email.trim(),
          mobile: form.mobile.trim(),
          instagram:
            form.instagram.trim() || null,
          requestedFeatures: tests,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.error ||
          "Unable to submit testing credit request."
      );
    }

    console.log(
      "Testing Credit Request Submitted",
      data
    );

    setSubmitted(true);

  } catch (error: any) {
    console.error(
      "TESTING CREDIT REQUEST ERROR:",
      error
    );

    alert(
      error?.message ||
        "Unable to submit your request. Please try again."
    );
  }
};

  return (
    <div className="testing-credits-page" style={styles.page}>
      {/* ======================================================
          LEFT PANEL
      ====================================================== */}

      <div className="testing-credits-left-panel" style={styles.leftPanel}>
        <div style={styles.brand}>MagicReel</div>

        <div>
          <h1 style={styles.heroTitle}>
            Request Free
            <br />
            Testing Credits
          </h1>

          <p style={styles.heroSubtitle}>
            Tell us a little about yourself and what
            you would like to explore with MagicReel.
            We will review your request and get back
            to you shortly.
          </p>
        </div>

        <div style={styles.testingSection}>
          <div style={styles.testingTitle}>
            What would you like to test?
          </div>

          <div style={styles.checkboxGrid}>
            {[
              "AI Hero",
              "Lookbook",
              "Editorial",
              "Campaign",
              "360° Reel",
              "Multiple Features",
            ].map((item) => (
              <label
                key={item}
                style={styles.featureCheckbox}
              >
                <input
                  type="checkbox"
                  checked={tests.includes(item)}
                  onChange={() => toggleTest(item)}
                />

                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        </div>

      {/* ======================================================
          RIGHT PANEL
      ====================================================== */}

      <div className="testing-credits-right-panel" style={styles.rightPanel}>
        <div className="testing-credits-card" style={styles.card}>

          {!submitted ? (
            <>
              <h2 style={styles.cardTitle}>
  Request Testing Credits
</h2>

<p style={styles.cardSubtitle}>
  Tell us a little about yourself. We'll
  review your request and get back to you
  shortly.
</p>

              <form
                onSubmit={handleSubmit}
                style={styles.form}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) =>
                    updateField(
                      "name",
                      e.target.value
                    )
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Designation"
                  value={form.designation}
                  onChange={(e) =>
                    updateField(
                      "designation",
                      e.target.value
                    )
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Company"
                  value={form.company}
                  onChange={(e) =>
                    updateField(
                      "company",
                      e.target.value
                    )
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="email"
                  placeholder="Business Email"
                  value={form.email}
                  onChange={(e) =>
                    updateField(
                      "email",
                      e.target.value
                    )
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="tel"
                  placeholder="Mobile Number"
                  value={form.mobile}
                  onChange={(e) =>
                    updateField(
                      "mobile",
                      e.target.value
                    )
                  }
                  style={styles.input}
                  required
                />

                <input
                  type="text"
                  placeholder="Instagram Account (Optional)"
                  value={form.instagram}
                  onChange={(e) =>
                    updateField(
                      "instagram",
                      e.target.value
                    )
                  }
                  style={styles.input}
                />

                <button
                  type="submit"
                  style={styles.button}
                >
                  Request Testing Credits
                </button>
              </form>

              <div style={styles.loginText}>
                Already have a MagicReel account?{" "}
                <span
                  style={styles.link}
                  onClick={() =>
                    navigate("/login")
                  }
                >
                  Login
                </span>
              </div>
            </>
          ) : (
            <div style={styles.success}>
              <div style={styles.successIcon}>
                ✓
              </div>

              <h2 style={styles.cardTitle}>
                Request Received
              </h2>

              <p style={styles.successText}>
                Thank you for your interest in
                MagicReel.
              </p>

              <p style={styles.successText}>
                We've received your testing credit
                request and will review it shortly.
              </p>

              <button
                type="button"
                style={styles.button}
                onClick={() =>
                  navigate("/")
                }
              >
                Return to MagicReel
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

/* ==========================================================
   STYLES
========================================================== */

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
    marginTop: 0,
  },

  heroSubtitle: {
    fontSize: 18,
    lineHeight: 1.7,
    color: "#CBD5E1",
    maxWidth: 520,
    marginBottom: 42,
  },

  testingSection: {
    marginBottom: 42,
  },

  testingTitle: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 18,
  },

  checkboxGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2,minmax(0,1fr))",
    gap: 14,
  },

  featureCheckbox: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 15,
    color: "#E2E8F0",
    cursor: "pointer",
  },

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  feature: {
    fontSize: 17,
  },

  cardTitle: {
  fontSize: 32,
  fontWeight: 700,
  margin: 0,
  color: "#111827",
},

  cardSubtitle: {
    color: "#64748B",
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 1.6,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "15px 18px",
    borderRadius: 12,
    border: "1px solid #CBD5E1",
    fontSize: 15,
    outline: "none",
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
    cursor: "pointer",
  },

  loginText: {
    textAlign: "center",
    marginTop: 18,
    color: "#64748B",
    fontSize: 14,
  },

  link: {
    color: "#111827",
    fontWeight: 700,
    cursor: "pointer",
  },

  success: {
    textAlign: "center",
    padding: "30px 10px",
  },

  successIcon: {
    width: 64,
    height: 64,
    borderRadius: "50%",
    background: "#DCFCE7",
    color: "#16A34A",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 30,
    fontWeight: 700,
    margin: "0 auto 24px",
  },

  successText: {
    color: "#64748B",
    lineHeight: 1.7,
    marginTop: 12,
  },
};