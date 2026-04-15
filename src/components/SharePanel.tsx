type ShareData = {
  runId: string;
  type: "hero" | "lookbook" | "reel" | string; // allow backend values like "REEL"
  outputs: {
    heroImage?: string | null;
    lookbookImages?: string[];
    reelVideo?: string | null;
  };
};

export default function SharePanel({ data }: { data: ShareData }) {
  if (!data) return null;

  const { outputs } = data;

  // 🔥 NORMALIZE TYPE (KEY FIX)
  const normalizedType = data.type?.toLowerCase();

  return (
    <div style={{ padding: "20px", maxWidth: 900, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>MagicReel</h2>

      {/* HERO */}
      {normalizedType === "hero" && outputs.heroImage && (
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
      {normalizedType === "lookbook" &&
        outputs.lookbookImages &&
        outputs.lookbookImages.length > 0 && (
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
      {normalizedType === "reel" && outputs.reelVideo && (
        <video
          src={outputs.reelVideo}
          controls
          autoPlay
          loop
          playsInline
          style={{
            width: "100%",
            borderRadius: 12,
          }}
        />
      )}
    </div>
  );
}