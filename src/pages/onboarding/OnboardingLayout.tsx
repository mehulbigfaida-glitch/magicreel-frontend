import React from "react";

export interface OnboardingLayoutProps {
  title: string;
  subtitle?: string;

  step: number;
  totalSteps: number;

  children: React.ReactNode;

  primaryText: string;
  secondaryText?: string;

  onPrimary: () => void;
  onSecondary?: () => void;

  loading?: boolean;
}

const OnboardingLayout: React.FC<OnboardingLayoutProps> = ({
  title,
  subtitle,

  step,
  totalSteps,

  children,

  primaryText,
  secondaryText,

  onPrimary,
  onSecondary,

  loading = false,
}) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logo}>
            MagicReel
          </div>

          <div style={styles.stepText}>
            Step {step} of {totalSteps}
          </div>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${progress}%`,
            }}
          />
        </div>

        <div style={styles.title}>
          {title}
        </div>

        {subtitle && (
          <div style={styles.subtitle}>
            {subtitle}
          </div>
        )}

        <div style={styles.content}>
          {children}
        </div>

        <div style={styles.footer}>
          {secondaryText && (
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={onSecondary}
              disabled={loading}
            >
              {secondaryText}
            </button>
          )}

          <button
  type="button"
  style={{
    ...styles.primaryButton,
    opacity: loading ? 0.7 : 1,
  }}
  disabled={loading}
  onClick={onPrimary}
>
            {loading ? "Please wait..." : primaryText}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#F8FAFC",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    padding: 32,
  },

  card: {
    width: "100%",
    maxWidth: 760,

    background: "#FFFFFF",

    borderRadius: 24,

    padding: 48,

    boxShadow:
      "0 25px 70px rgba(15,23,42,.08)",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 24,
  },

  logo: {
    fontSize: 26,
    fontWeight: 700,
    color: "#111827",
  },

  stepText: {
    color: "#64748B",
    fontWeight: 600,
    fontSize: 14,
  },

  progressTrack: {
    width: "100%",
    height: 8,

    background: "#E2E8F0",

    borderRadius: 999,
    overflow: "hidden",

    marginBottom: 36,
  },

  progressFill: {
    height: "100%",
    background: "#111827",
    transition: "width .3s ease",
  },

  title: {
    fontSize: 36,
    fontWeight: 700,

    color: "#111827",

    marginBottom: 12,
  },

  subtitle: {
    fontSize: 17,
    color: "#64748B",

    lineHeight: 1.6,

    marginBottom: 36,
  },

  content: {
    minHeight: 260,
  },

  footer: {
    marginTop: 40,

    display: "flex",
    justifyContent: "space-between",
    gap: 16,
  },

  secondaryButton: {
    padding: "14px 24px",

    borderRadius: 12,

    border: "1px solid #CBD5E1",

    background: "#FFFFFF",

    color: "#475569",

    fontWeight: 600,

    cursor: "pointer",
  },

  primaryButton: {
    padding: "14px 32px",

    borderRadius: 12,

    border: "none",

    background: "#111827",

    color: "#FFFFFF",

    fontWeight: 700,

    cursor: "pointer",
  },
};

export default OnboardingLayout;