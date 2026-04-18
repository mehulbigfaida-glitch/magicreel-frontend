import React from "react";

export default function SharePanel({ data }: { data: any }) {
  const images = data?.media || [];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ marginBottom: 20 }}>✨ Shared Lookbook</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        {images.map((item: any, index: number) => (
          <img
            key={index}
            src={item.url}
            alt={`look-${index}`}
            style={{
              width: "100%",
              borderRadius: 12,
            }}
          />
        ))}
      </div>
    </div>
  );
}