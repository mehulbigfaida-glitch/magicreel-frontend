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
    <div className="p-6 w-full max-w-[1600px] mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Predictions</h1>

      {/* ✅ TIGHT GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
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
              className="relative rounded-xl overflow-hidden shadow-md group"
            >
              {/* IMAGE */}
              <div className="aspect-[3/4] bg-gray-200">
                {mediaUrl ? (
                  isVideo ? (
                    <video
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={mediaUrl}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No media
                  </div>
                )}
              </div>

              {/* ✅ OVERLAY (LIKE YOUR REFERENCE) */}
              <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-2 text-xs">
                <div className="flex justify-between items-center">
                  <span>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-green-400">● Ready</span>
                </div>

                <div className="flex justify-between items-center mt-1">
                  <span>{item.creditsUsed ?? 0} credit</span>
                  <span className="uppercase">{item.type}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}