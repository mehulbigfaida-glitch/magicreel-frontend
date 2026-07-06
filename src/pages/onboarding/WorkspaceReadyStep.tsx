import React from "react";

import OnboardingLayout from "./OnboardingLayout";

interface WorkspaceReadyStepProps {
  onFinish: () => void;
}

const WorkspaceReadyStep: React.FC<
  WorkspaceReadyStepProps
> = ({ onFinish }) => {
  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      title="Your AI Fashion Workspace is Ready"
      subtitle="Everything is configured. You're ready to create your first AI Hero."
      primaryText="Generate First Hero"
      onPrimary={onFinish}
    >
      <div style={styles.container}>
        <div style={styles.icon}>
          🎉
        </div>

        <div style={styles.heading}>
          Welcome to MagicReel
        </div>

        <div style={styles.description}>
          Your workspace has been personalized
          successfully.
        </div>

        <div style={styles.grid}>
          <Feature text="Brand Identity Configured" />
          <Feature text="Social Presence Connected" />
          <Feature text="AI Workspace Created" />
          <Feature text="1 Welcome Credit Ready" />
        </div>
      </div>
    </OnboardingLayout>
  );
};

function Feature({
  text,
}: {
  text: string;
}) {
  return (
    <div style={styles.feature}>
      ✓ {text}
    </div>
  );
}

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 20,
  },

  icon: {
    fontSize: 80,
    marginBottom: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 12,
  },

  description: {
    fontSize: 17,
    color: "#64748B",
    marginBottom: 36,
    maxWidth: 520,
    lineHeight: 1.7,
  },

  grid: {
    width: "100%",
    maxWidth: 540,
    display: "grid",
    gap: 14,
  },

  feature: {
    padding: 18,
    borderRadius: 14,
    background: "#F8FAFC",
    border: "1px solid #E5E7EB",
    fontWeight: 600,
    color: "#374151",
  },
};

export default WorkspaceReadyStep;