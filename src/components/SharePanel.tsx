type ShareData = {
  runId: string;
  type: "hero" | "lookbook" | "reel";
  outputs: {
    heroImage?: string | null;
    lookbookImages?: string[];
    reelVideo?: string | null;
  };
};

export default function SharePanel({ data }: { data: ShareData }) {
  if (!data) return null;

  const { type, outputs } = data;

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>MagicReel</h2>

      {/* HERO */}
      {type === "hero" && outputs.heroImage && (
        <img
          src={outputs.heroImage}
          alt="Hero"
          style={{
            width: "100%",
            borderRadius: 12,
            objectFit: "cover",
          }}
        />
      )}

      {/* LOOKBOOK */}
      {type === "lookbook" && outputs.lookbookImages && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 10,
          }}
        >
          {outputs.lookbookImages.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Look ${i}`}
              style={{
                width: "100%",
                borderRadius: 10,
                objectFit: "cover",
              }}
            />
          ))}
        </div>
      )}

      {/* REEL */}
      {type === "reel" && outputs.reelVideo && (
        <video
          src={outputs.reelVideo}
          controls
          autoPlay
          loop
          style={{
            width: "100%",
            borderRadius: 12,
          }}
        />
      )}
    </div>
  );
}