import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useViewStore } from "../store/viewStore";

interface StatusResponse {
  status: "fashn_running" | "enhancing" | "completed" | "failed";
  resultImageUrl?: string;
}

export default function ViewPage() {
  const [statusText, setStatusText] = useState("Rendering model…");
  const [failed, setFailed] = useState(false);

  const { images, setImages } = useViewStore();
  const pollRef = useRef<number | null>(null);
  const jobId = new URLSearchParams(window.location.search).get("jobId");

  useEffect(() => {
    if (!jobId) return;

    pollRef.current = window.setInterval(async () => {
      try {
        const res = await axios.get<StatusResponse>(
          `/api/p2m/status/${jobId}`
        );

        const { status, resultImageUrl } = res.data;

        if (status === "failed") {
          setFailed(true);
          clearInterval(pollRef.current!);
          return;
        }

        if (status === "completed" && resultImageUrl) {
          setImages([{ id: "hero-front", src: resultImageUrl }]);
          clearInterval(pollRef.current!);
          return;
        }

        setStatusText(
          status === "enhancing" ? "Enhancing image…" : "Rendering model…"
        );
      } catch {}
    }, 2500);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [jobId, setImages]);

  const hero = images[0];

  if (!hero && !failed) {
    return (
      <div style={overlay}>
        <p style={{ fontSize: 16 }}>{statusText}</p>
      </div>
    );
  }

  if (failed) {
    return (
      <div style={overlay}>
        <p style={{ color: "#ff4d4f" }}>Something went wrong.</p>
      </div>
    );
  }

  return (
    <div style={overlay}>
      <div style={page}>
        {/* HERO */}
        <div style={heroWrap}>
          <div style={heroCard}>
            <div style={imageFrame}>
              <img
                src={hero.src}
                alt="Hero Output"
                style={{ width: "100%", height: "auto" }}
              />
            </div>

            {/* CONTEXT */}
            <div style={context}>
              <span style={{ color: "#111827", fontWeight: 500 }}>
                Garment: Summer Cotton Shirt (SKU 2031)
              </span>
              <button style={downloadBtn}>Download Image</button>
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={actions}>
          <Action
            title="Create Lookbook"
            desc="Generate front and back views with multiple poses for review and validation."
            cta="Create Lookbook"
          />
          <Action
            title="Generate Reel"
            desc="Create a short animated video from this image for social media and ads."
            cta="Generate Reel"
          />
          <Action
            title="Change Background / Add Logo"
            desc="Apply a brand background or place your logo on the image."
            cta="Edit Image"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- STYLES ---------- */

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  overflowY: "auto",
};

const page: React.CSSProperties = {
  maxWidth: 1200,
  margin: "0 auto",
  padding: "40px 20px 80px",
};

const heroWrap: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
};

const heroCard: React.CSSProperties = {
  background: "#ffffff",
  borderRadius: 20,
  padding: 20,
  width: "100%",
  maxWidth: 520,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
};

const imageFrame: React.CSSProperties = {
  background: "#e5e7eb",
  borderRadius: 14,
  padding: 16,
};

const context: React.CSSProperties = {
  marginTop: 14,
  padding: "12px 16px",
  background: "#ffffff",
  border: "1px solid #e5e7eb",
  borderRadius: 10,
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const downloadBtn: React.CSSProperties = {
  background: "#111827",
  color: "#ffffff",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 14,
  border: "none",
  cursor: "pointer",
};

const actions: React.CSSProperties = {
  marginTop: 64,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
  gap: 24,
};

function Action({
  title,
  desc,
  cta,
}: {
  title: string;
  desc: string;
  cta: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 16,
        padding: 24,
      }}
    >
      <h3 style={{ fontSize: 16, fontWeight: 600, color: "#111827" }}>
        {title}
      </h3>
      <p style={{ marginTop: 8, fontSize: 14, color: "#374151" }}>
        {desc}
      </p>
      <button
        style={{
          marginTop: 16,
          padding: "10px 16px",
          borderRadius: 8,
          background: "#111827",
          color: "#ffffff",
          fontSize: 14,
          border: "none",
        }}
      >
        {cta}
      </button>
    </div>
  );
}
