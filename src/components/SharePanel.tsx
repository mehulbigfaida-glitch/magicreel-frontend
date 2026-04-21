import { useState } from "react";

export default function SharePanel({ data }: { data: any }) {
  // ✅ SAFE DATA EXTRACTION
  const media = data?.asset?.media ?? [];

  // 🚨 HARD GUARD (IMPORTANT)
  if (!media || media.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center" }}>
        <h3>Loading images...</h3>
      </div>
    );
  }

  const hero = media[0];
  const others = media.slice(1);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [activePlatform, setActivePlatform] = useState<
    "whatsapp" | "instagram" | null
  >(null);

  const [caption, setCaption] = useState(
    "✨ New collection drop!\n\nPremium looks powered by MagicReel.\n\n#fashion #style #ootd #magicreel"
  );

  const pageUrl = window.location.href;

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 16 }}>
      {/* HERO */}
      {hero?.url && (
        <div style={{ marginBottom: 16 }}>
          <img
            src={hero.url}
            alt="hero"
            style={{ width: "100%", borderRadius: 16 }}
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
        {others.map((item: any, i: number) =>
          item?.url ? (
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
          ) : null
        )}
      </div>

      {/* SHARE BUTTONS */}
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

      {/* WHATSAPP */}
      {activePlatform === "whatsapp" && (
        <div style={panelStyle}>
          <h3>📲 WhatsApp Share</h3>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={5}
            style={textareaStyle}
          />

          <button
            onClick={() => {
              // ✅ IMPORTANT FIX
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

      {/* INSTAGRAM */}
      {activePlatform === "instagram" && (
        <div style={panelStyle}>
          <h3>📸 Instagram Assistant</h3>

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            rows={6}
            style={textareaStyle}
          />

          <p style={{ fontSize: 12 }}>
            Download images → Open Instagram → Upload → Paste caption
          </p>

          <button
            onClick={() => {
              media.forEach((m: any) => {
                if (m?.url) window.open(m.url, "_blank");
              });
            }}
          >
            Download Images
          </button>

          <button onClick={() => setActivePlatform(null)}>Close</button>
        </div>
      )}

      {/* FULLSCREEN */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
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