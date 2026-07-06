import React from "react";

import OnboardingLayout from "./OnboardingLayout";

interface WelcomeStepProps {
  onContinue: () => void;
  onSkip: () => void;
}

const WelcomeStep: React.FC<WelcomeStepProps> = ({
  onContinue,
  onSkip,
}) => {
  return (
    <OnboardingLayout
      step={1}
      totalSteps={4}
      title="Welcome to MagicReel"
      subtitle="Let's setup your AI Fashion Workspace in less than one minute."
      primaryText="Let's Setup My Brand"
      secondaryText="Skip for now"
      onPrimary={onContinue}
      onSecondary={onSkip}
    >
      <div style={styles.wrapper}>
        <div style={styles.icon}>
          ✨
        </div>

        <div style={styles.heading}>
          Your AI Fashion Workspace
          is ready.
        </div>

        <div style={styles.description}>
          We'll personalize your workspace
          with your brand identity, logo and
          social presence so every AI creation
          stays consistent.
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>
            ✓ Brand Identity
          </div>

          <div style={styles.feature}>
            ✓ Brand Logo
          </div>

          <div style={styles.feature}>
            ✓ Website
          </div>

          <div style={styles.feature}>
            ✓ Social Presence
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    paddingTop: 10,
  },

  icon: {
    fontSize: 72,
    marginBottom: 20,
  },

  heading: {
    fontSize: 32,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 16,
  },

  description: {
    maxWidth: 560,
    fontSize: 17,
    lineHeight: 1.8,
    color: "#64748B",
    marginBottom: 36,
  },

  features: {
    width: "100%",
    maxWidth: 500,

    background: "#F8FAFC",

    border: "1px solid #E5E7EB",

    borderRadius: 18,

    padding: 28,
  },

  feature: {
    textAlign: "left",

    padding: "12px 0",

    borderBottom: "1px solid #EDF2F7",

    color: "#374151",

    fontSize: 16,
  },
};

export default WelcomeStep;