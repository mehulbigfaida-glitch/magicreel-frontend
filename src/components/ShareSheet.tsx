import React from "react";

export default function ShareSheet({
  runId,
  videoUrl,
  onClose,
}: {
  runId: string;
  videoUrl: string;
  onClose: () => void;
}) {
  const shareUrl = `${window.location.origin}/share/${runId}`;

  const caption = `Serving looks ✨
Effortless style powered by MagicReel

#fashion #ootd #style #reelsinstagram #magicreel`;

  const shareToWhatsApp = () => {
    const text = `${caption}\n\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  return (
    <div style={overlay}>
      <div style={sheet}>
        <h3 style={{ marginBottom: 12 }}>✨ Ready to Post</h3>

        {/* Preview */}
        <video
          src={videoUrl}
          muted
          autoPlay
          loop
          style={{
            width: "100%",
            borderRadius: 12,
            marginBottom: 16,
          }}
        />

        {/* Caption */}
        <textarea
          value={caption}
          readOnly
          style={{
            width: "100%",
            height: 100,
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        />

        {/* Actions */}
        <div style={grid}>
          <button onClick={() => navigator.clipboard.writeText(caption)}>
            📋 Copy Caption
          </button>

          <button onClick={() => window.open(videoUrl)}>
            ⬇ Download Video
          </button>

          <button onClick={() => window.open("https://www.instagram.com/")}>
            📸 Open Instagram
          </button>

          <button onClick={shareToWhatsApp}>
            📲 WhatsApp
          </button>
        </div>

        <button onClick={onClose} style={{ marginTop: 16 }}>
          Close
        </button>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "flex-end",
  zIndex: 999,
};

const sheet: React.CSSProperties = {
  width: "100%",
  background: "#fff",
  borderTopLeftRadius: 20,
  borderTopRightRadius: 20,
  padding: 16,
};

const grid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 10,
};