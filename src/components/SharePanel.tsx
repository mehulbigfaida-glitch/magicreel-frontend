import { useState } from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.asset?.media || [];

  const hero = images[0];
  const others = images.slice(1);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [activePlatform, setActivePlatform] = useState<
    "whatsapp" | "instagram" | null
  >(null);

  const [caption, setCaption] = useState(
    "✨ New collection drop!\n\nPremium looks powered by MagicReel.\n\n#fashion #style #ootd #magicreel"
  );

  const pageUrl = window.location.href;

  return (
    <div
      style={{
        maxWidth: 600,
        margin: "0 auto",
        padding: 16,
      }}
    >
      {/* HERO */}
      {hero && (
        <div style={{ marginBottom: 16 }}>
          <img
            src={hero.url}
            alt="hero"
            style={{
              width: "100%",
              borderRadius: 16,
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 10,
        }}
      >
        {others.map((item: any, i: number) => (
          <img
            key={i}
            src={item.url}
            onClick={() => setSelectedImage(item.url)}
            style={{
              width: "100%",
              borderRadius: 12,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

      {/* SHARE ACTIONS */}
      <div
        style={{
          display: "flex",
          gap: 10,
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <button onClick={() => setActivePlatform("whatsapp")}>
          📲 WhatsApp
        </button>

        <button onClick={() => setActivePlatform("instagram")}>
          📸 Instagram
        </button>

        <button
          onClick={() => {
            navigator.clipboard.writeText(pageUrl);
            alert("Link copied!");
          }}
        >
          🔗 Copy Link
        </button>
      </div>

      {/* WHATSAPP PANEL */}
      {activePlatform === "whatsapp" && (
        <div style={panelStyle}>
          <h3>📲 Share on WhatsApp</h3>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            style={textareaStyle}
          />

          <button
            onClick={() => {
              const url = `https://wa.me/?text=${encodeURIComponent(
                caption + "\n\n" + pageUrl
              )}`;
              window.open(url, "_blank");
            }}
          >
            Open WhatsApp
          </button>

          <button onClick={() => setActivePlatform(null)}>Close</button>
        </div>
      )}

      {/* INSTAGRAM PANEL */}
      {activePlatform === "instagram" && (
        <div style={panelStyle}>
          <h3>📸 Instagram Post Assistant</h3>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={6}
            style={textareaStyle}
          />

          <div style={{ marginTop: 10 }}>
            <strong>Steps to Post:</strong>
            <ol>
              <li>Click "Download Images"</li>
              <li>Open Instagram</li>
              <li>Create Post → Select multiple images</li>
              <li>Paste caption</li>
              <li>Publish 🚀</li>
            </ol>
          </div>

          <button
            onClick={() => {
              images.forEach((m: any) => {
                if (m?.url) window.open(m.url, "_blank");
              });
            }}
          >
            Download Images
          </button>

          <button onClick={() => setActivePlatform(null)}>Close</button>
        </div>
      )}

      {/* FULLSCREEN VIEW */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <img
            src={selectedImage}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 12,
            }}
          />
        </div>
      )}
    </div>
  );
}

/* ---------- STYLES ---------- */

const panelStyle: React.CSSProperties = {
  position: "fixed",
  bottom: 0,
  left: 0,
  right: 0,
  background: "white",
  padding: 20,
  borderTop: "2px solid #eee",
  zIndex: 9999,
};

const textareaStyle: React.CSSProperties = {
  width: "100%",
  padding: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
  marginBottom: 10,
};