import React from "react";

interface PrimaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  loading = false,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        ...styles.button,
        ...(disabled || loading
          ? styles.disabled
          : {}),
        ...style,
      }}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  button: {
    width: "100%",

    height: 56,

    border: "none",

    borderRadius: 14,

    background:
      "linear-gradient(135deg,#111827,#1F2937)",

    color: "#FFFFFF",

    fontSize: 16,

    fontWeight: 700,

    cursor: "pointer",

    transition: "all .25s ease",

    boxShadow:
      "0 10px 30px rgba(17,24,39,.20)",
  },

  disabled: {
    opacity: .65,
    cursor: "not-allowed",
  },
};

export default PrimaryButton;