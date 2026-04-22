import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  type: string;
  status: string;
  mediaUrl?: string;
  heroImageUrl?: string;
  lookbookImages?: string[];
  createdAt: string;
  creditsUsed?: number;
}

export default function PredictionsPage() {
  const [data, setData] = useState<Prediction[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const res = await fetch(
        "https://magicreel-backend-production.up.railway.app/api/predictions",
        { credentials: "include" }
      );

      const json = await res.json();

      const predictions: Prediction[] = Array.isArray(json)
        ? json
        : json?.data || [];

      predictions.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() -
          new Date(a.createdAt).getTime()
      );

      setData(predictions);
    };

    fetchPredictions();
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "1600px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "20px" }}>
        Predictions
      </h1>

      {/* ✅ FORCE GRID (WORKS 100%) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {data.map((item) => {
          const mediaUrl =
            item.mediaUrl ||
            item.heroImageUrl ||
            (item.lookbookImages && item.lookbookImages[0]);

          const isVideo =
            item.type === "reel" && mediaUrl?.includes(".mp4");

          return (
            <div
              key={item.id}
              style={{
                position: "relative",
                borderRadius: "12px",
                overflow: "hidden",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              {/* IMAGE */}
              <div style={{ aspectRatio: "3 / 4", background: "#eee" }}>
                {mediaUrl ? (
                  isVideo ? (
                    <video
                      src={mediaUrl}
                      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#f5f5f5"}}
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      style={{ width: "100%", height: "100%", objectFit: "contain", background: "#f5f5f5"}}
                    />
                  )
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#999",
                    }}
                  >
                    No media
                  </div>
                )}
              </div>

              {/* OVERLAY */}
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  background: "rgba(0,0,0,0.7)",
                  color: "#fff",
                  padding: "8px",
                  fontSize: "12px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span style={{ color: "#4ade80" }}>● Ready</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "4px",
                  }}
                >
                  <span>{item.creditsUsed ?? 0} credit</span>
                  <span style={{ textTransform: "uppercase" }}>
                    {item.type}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}