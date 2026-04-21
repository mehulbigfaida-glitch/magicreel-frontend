import { useState } from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];

  const hero = images[0];
  const others = images.slice(1);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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