import React from "react";

interface TextFieldProps {
  label?: string;
  placeholder?: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  type?: string;

  required?: boolean;

  error?: string;

  disabled?: boolean;

  autoFocus?: boolean;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,

  value,
  onChange,

  type = "text",

  required = false,

  error,

  disabled = false,

  autoFocus = false,
}) => {
  return (
    <div style={styles.wrapper}>
      {label && (
        <label style={styles.label}>
          {label}

          {required && (
            <span style={styles.required}>
              *
            </span>
          )}
        </label>
      )}

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        autoFocus={autoFocus}
        disabled={disabled}
        onChange={(e) =>
          onChange(e.target.value)
        }
        style={{
          ...styles.input,

          ...(error
            ? styles.inputError
            : {}),

          ...(disabled
            ? styles.disabled
            : {}),
        }}
      />

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  wrapper: {
    display: "flex",

    flexDirection: "column",

    gap: 8,

    marginBottom: 18,
  },

  label: {
    fontSize: 14,

    fontWeight: 600,

    color: "#374151",
  },

  required: {
    color: "#EF4444",

    marginLeft: 4,
  },

  input: {
    height: 54,

    borderRadius: 14,

    border: "1px solid #D1D5DB",

    padding: "0 18px",

    fontSize: 15,

    outline: "none",

    transition: "all .2s ease",

    background: "#FFFFFF",
  },

  inputError: {
    border: "1px solid #EF4444",
  },

  disabled: {
    background: "#F3F4F6",
  },

  error: {
    color: "#DC2626",

    fontSize: 13,

    fontWeight: 500,
  },
};

export default TextField;