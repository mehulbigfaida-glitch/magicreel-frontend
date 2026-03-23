import { useMagicReel } from "../hooks/useMagicReel";

export default function MagicReelPage() {
  const { generate, status, videoUrl } = useMagicReel();

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
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          padding: 32,
          textAlign: "center",
          backdropFilter: "blur(8px)",
        }}
      >
        <h1 style={{ fontSize: 22, marginBottom: 8 }}>
          MagicReel Video Engine
        </h1>

        <p
          style={{
            fontSize: 14,
            color: "#9CA3AF",
            marginBottom: 24,
          }}
        >
          Generate cinematic reels from a single hero image.
        </p>

        <button
          onClick={() =>
            generate("D:\\magicreel-root\\test-assets\\hero.png")
          }
          disabled={status === "running" || status === "queued"}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: 10,
            border: "none",
            background:
              "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
            color: "#fff",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            opacity:
              status === "running" || status === "queued" ? 0.6 : 1,
          }}
        >
          {status === "running" || status === "queued"
            ? "Generating…"
            : "Generate Reel"}
        </button>

        <p
          style={{
            marginTop: 16,
            fontSize: 13,
            color: "#9CA3AF",
          }}
        >
          Status: {status}
        </p>

        {videoUrl && (
          <div style={{ marginTop: 24 }}>
            <video
              src={videoUrl}
              controls
              style={{
                width: "100%",
                borderRadius: 12,
              }}
            />
            <a
              href={videoUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-block",
                marginTop: 10,
                fontSize: 13,
                color: "#93C5FD",
                textDecoration: "none",
              }}
            >
              Open in new tab
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
