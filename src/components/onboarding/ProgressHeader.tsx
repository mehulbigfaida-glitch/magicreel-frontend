import React from "react";

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  title,
  subtitle,
}) => {
  const progress =
    (currentStep / totalSteps) * 100;

  return (
    <div style={styles.wrapper}>
      <div style={styles.topRow}>
        <div style={styles.logo}>
          ⚡ MagicReel
        </div>

        <div style={styles.step}>
          Step {currentStep} of {totalSteps}
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

      <h1 style={styles.title}>
        {title}
      </h1>

      {subtitle && (
        <p style={styles.subtitle}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    marginBottom: 42,
  },

  topRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  logo: {
    fontSize: 24,
    fontWeight: 700,
    color: "#111827",
  },

  step: {
    fontSize: 14,
    fontWeight: 600,
    color: "#64748B",
  },

  progressTrack: {
    width: "100%",
    height: 8,
    background: "#E5E7EB",
    borderRadius: 999,
    overflow: "hidden",
    marginBottom: 30,
  },

  progressFill: {
    height: "100%",
    background:
      "linear-gradient(90deg,#111827,#374151)",
    transition: "width .35s ease",
  },

  title: {
    fontSize: 36,
    fontWeight: 700,
    color: "#111827",
    margin: 0,
  },

  subtitle: {
    marginTop: 14,
    fontSize: 17,
    lineHeight: 1.7,
    color: "#64748B",
    maxWidth: 620,
  },
};

export default ProgressHeader;