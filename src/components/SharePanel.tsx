type ShareData = {
  runId: string;
  type: "hero" | "lookbook" | "reel" | string;
  outputs: {
    heroImage?: string | null;
    lookbookImages?: string[];
    reelVideo?: string | null;
  };
};

export default function SharePanel({ data }: { data: ShareData }) {
  if (!data) return null;

  const { outputs } = data;
  const normalizedType = data.type?.toLowerCase();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        padding: "20px 16px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          fontWeight: 600,
          fontSize: 20,
          letterSpacing: 0.5,
        }}
      >
        MagicReel
      </div>

      {/* HERO */}
      {normalizedType === "hero" && outputs.heroImage && (
        <div
          style={{
            maxWidth: 600,
            margin: "0 auto",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          }}
        >
          <img
            src={outputs.heroImage}
            alt="Hero"
            style={{
              width: "100%",
              display: "block",
              objectFit: "cover",
            }}
          />
        </div>
      )}

      {/* LOOKBOOK */}
      {normalizedType === "lookbook" &&
        outputs.lookbookImages &&
        outputs.lookbookImages.length > 0 && (
          <div
            style={{
              maxWidth: 900,
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
            }}
          >
            {outputs.lookbookImages.map((img, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <img
                  src={img}
                  alt={`Look ${i}`}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        )}

      {/* REEL */}
      {normalizedType === "reel" && outputs.reelVideo && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "80vh",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 420,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 25px 80px rgba(0,0,0,0.25)",
              background: "#000",
            }}
          >
            <video
              src={outputs.reelVideo}
              controls
              autoPlay
              loop
              playsInline
              style={{
                width: "100%",
                height: "80vh",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <div
        style={{
          marginTop: 30,
          textAlign: "center",
          fontSize: 13,
          color: "#888",
        }}
      >
        Created with MagicReel ✨
      </div>
    </div>
  );
}