import React, { useRef } from "react";

interface LogoUploaderProps {
  logo?: string;
  onChange: (file: File | null) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({
  logo,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      e.target.files?.[0] || null;

    onChange(file);
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleChange}
      />

      <div
        style={styles.container}
        onClick={openPicker}
      >
        {logo ? (
          <img
            src={logo}
            alt="Brand Logo"
            style={styles.image}
          />
        ) : (
          <>
            <div style={styles.icon}>
              🖼️
            </div>

            <div style={styles.title}>
              Upload Brand Logo
            </div>

            <div style={styles.subtitle}>
              PNG, JPG or SVG
            </div>
          </>
        )}
      </div>
    </>
  );
};

const styles: Record<
  string,
  React.CSSProperties
> = {
  container: {
    width: 180,
    height: 180,

    borderRadius: 22,

    border: "2px dashed #CBD5E1",

    background: "#F8FAFC",

    display: "flex",

    flexDirection: "column",

    justifyContent: "center",

    alignItems: "center",

    cursor: "pointer",

    transition: ".25s",

    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  icon: {
    fontSize: 42,
    marginBottom: 14,
  },

  title: {
    fontWeight: 700,
    color: "#111827",
    marginBottom: 6,
  },

  subtitle: {
    color: "#64748B",
    fontSize: 13,
  },
};

export default LogoUploader;