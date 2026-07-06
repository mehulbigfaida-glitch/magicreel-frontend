import React from "react";

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  style?: React.CSSProperties;
}

const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  onClick,
  disabled = false,
  style,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...styles.button,
        ...(disabled ? styles.disabled : {}),
        ...style,
      }}
    >
      {children}
    </button>
  );
};

const styles: Record<string, React.CSSProperties> = {
  button: {
    width: "100%",

    height: 56,

    borderRadius: 14,

    border: "1px solid #D1D5DB",

    background: "#FFFFFF",

    color: "#374151",

    fontSize: 16,

    fontWeight: 600,

    cursor: "pointer",

    transition: "all .25s ease",
  },

  disabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};

export default SecondaryButton;