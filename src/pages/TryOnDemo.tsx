import { useState } from "react";
import { uploadImage } from "../api/upload";
import { useP2MStore } from "../store/p2mStore";

export default function TryOnDemo() {
  const {
  setProductImageUrl,
  startP2M,
  status,
  resultImageUrl,
  error,
} = useP2MStore();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleSubmit() {
    if (!file) return;
    setUploading(true);

    try {
      const imageUrl = await uploadImage(file);
      setProductImageUrl(imageUrl);
await startP2M(imageUrl);
    } catch (e: any) {
      alert(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const isProcessing =
    uploading || status === "running";

  return (
    <div
      style={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          background: "var(--bg-surface)",
          border: "1px solid var(--bg-surface-border)",
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          MagicReel · Product to Model
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "var(--text-secondary)",
            marginBottom: 24,
          }}
        >
          Upload a product image and generate a styled model
          preview.
        </p>

        {/* Upload */}
        <label
          style={{
            display: "block",
            padding: "14px 16px",
            border: "1px dashed rgba(255,255,255,0.25)",
            borderRadius: 12,
            cursor: "pointer",
            marginBottom: 16,
            color: file
              ? "var(--text-primary)"
              : "var(--text-secondary)",
          }}
        >
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={isProcessing}
            onChange={(e) =>
              setFile(e.target.files?.[0] || null)
            }
          />
          {file
            ? file.name
            : "Click to upload product image"}
        </label>

        <button
          onClick={handleSubmit}
          disabled={!file || isProcessing}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background: "var(--accent-gradient)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            opacity: !file || isProcessing ? 0.6 : 1,
          }}
        >
          {uploading
            ? "Uploading…"
            : status === "running"
            ? "Generating…"
            : "Generate Model"}
        </button>

        {status === "running" && (
          <p
            style={{
              marginTop: 16,
              fontSize: 13,
              color: "var(--text-secondary)",
            }}
          >
            Generating model preview…
          </p>
        )}

        {resultImageUrl && (
          <img
            src={resultImageUrl}
            style={{
              width: "100%",
              marginTop: 24,
              borderRadius: 12,
            }}
          />
        )}

        {error && (
          <p style={{ color: "#F87171", marginTop: 16 }}>
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
