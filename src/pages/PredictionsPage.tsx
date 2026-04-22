import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  type: string;
  status: string;
  outputImageUrl?: string;
  reelUrl?: string;
  createdAt: string;
  creditsUsed?: number;
}

export default function PredictionsPage() {
  const [data, setData] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/predictions", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch predictions");
        }

        const json = await res.json();

        // SAFE mapping (handles array or nested response)
        const predictions: Prediction[] = Array.isArray(json)
          ? json
          : json?.data || [];

        setData(predictions);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg">Loading predictions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No predictions found.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Predictions</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.map((item) => {
          const mediaUrl = item.outputImageUrl || item.reelUrl;

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <div className="aspect-[3/4] bg-gray-100 flex items-center justify-center">
                {item.type === "reel" && mediaUrl ? (
                  <video
                    src={mediaUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : mediaUrl ? (
                  <img
                    src={mediaUrl}
                    alt="prediction"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <p className="text-sm text-gray-400">No media</p>
                )}
              </div>

              <div className="p-4 space-y-2">
                <p className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleString()}
                </p>

                <p className="text-sm">
                  Credits: {item.creditsUsed || 0}
                </p>

                <div className="flex gap-2 pt-2">
                  {mediaUrl && (
                    <>
                      <a
                        href={mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 text-center text-sm px-3 py-2 bg-black text-white rounded-lg"
                      >
                        View
                      </a>

                      <a
                        href={mediaUrl}
                        download
                        className="flex-1 text-center text-sm px-3 py-2 bg-gray-200 rounded-lg"
                      >
                        Download
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
