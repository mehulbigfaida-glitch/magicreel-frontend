import { useState, useEffect } from "react";

export default function SharePanel({ data }: { data: any }) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // ✅ ALWAYS USE FRESH DATA
  const images = Array.isArray(data?.media) ? data.media : [];

  const hero = images[0];
  const others = images.slice(1);

  // ✅ RESET WHEN DATA CHANGES
  useEffect(() => {
    setSelectedImage(null);
  }, [data]);

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>

      <h2 style={{ marginBottom: 16 }}>✨ Shared Lookbook</h2>

      {/* HERO */}
      {hero && (
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              width: "100%",
              maxHeight: "75vh",
              overflow: "hidden",
              borderRadius: 16,
            }}
          >
            <img
              src={hero.url}
              alt="hero"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      )}

      {/* POSES */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
        }}
      >
        {others.map((item: any, index: number) => (
          <div
            key={index}
            onClick={() => setSelectedImage(item.url)}
            style={{
              borderRadius: 14,
              overflow: "hidden",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              cursor: "pointer",
            }}
          >
            <img
              src={item.url}
              alt={`look-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
      </div>

      {/* FULLSCREEN */}
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
            zIndex: 999,
          }}
        >
          <img
            src={selectedImage}
            alt="fullscreen"
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