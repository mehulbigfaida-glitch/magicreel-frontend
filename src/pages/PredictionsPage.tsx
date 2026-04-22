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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const res = await fetch(
          "https://magicreel-backend-production.up.railway.app/api/predictions",
          { credentials: "include" }
        );

        const json = await res.json();

        const predictions: Prediction[] = Array.isArray(json)
          ? json
          : json?.data || [];

        // latest first
        predictions.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        );

        setData(predictions);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Predictions</h1>

      {/* ✅ FIXED GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data.map((item) => {
          const mediaUrl =
            item.mediaUrl ||
            item.heroImageUrl ||
            (item.lookbookImages && item.lookbookImages[0]);

          const isVideo =
            item.type === "reel" && mediaUrl?.includes(".mp4");

          const typeLabel = item.type?.toUpperCase();

          return (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col"
            >
              {/* MEDIA */}
              <div className="aspect-[3/4] bg-gray-100">
                {mediaUrl ? (
                  isVideo ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    No media
                  </div>
                )}
              </div>

              {/* META */}
              <div className="p-3 flex flex-col gap-1">
                {/* TYPE */}
                <span className="text-xs font-semibold text-blue-600">
                  {typeLabel}
                </span>

                {/* TIME */}
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}{" "}
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>

                {/* ✅ FIXED CREDITS */}
                <span className="text-sm text-gray-800 font-medium">
                  Credits: {item.creditsUsed ?? 0}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}