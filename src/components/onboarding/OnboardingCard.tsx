import React from "react";

interface OnboardingCardProps {
  children: React.ReactNode;
  maxWidth?: number;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  children,
  maxWidth = 760,
}) => {
  return (
    <div style={styles.page}>
      <div
        style={{
          ...styles.card,
          maxWidth,
        }}
      >
        {children}
      </div>
    </div>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  page: {
    minHeight: "100vh",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    padding: 40,

    background:
      "linear-gradient(180deg,#F8FAFC 0%, #EEF2FF 100%)",
  },

  card: {
    width: "100%",

    background: "#FFFFFF",

    borderRadius: 28,

    padding: 48,

    boxShadow:
      "0 25px 70px rgba(15,23,42,.08)",

    border: "1px solid rgba(226,232,240,.8)",
  },
};

export default OnboardingCard;