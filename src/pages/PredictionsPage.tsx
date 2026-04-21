import { useEffect, useState } from "react";
import "./Predictions.css";
import SharePanel from "../components/SharePanel";

type Prediction = {
  id: string;
  type: "hero" | "lookbook" | "reel";
  status: string;
  createdAt: string;
  mediaUrl?: string | null;
  mediaUrls?: string[];
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<any>(null);

  const API_BASE = "https://magicreel-backend-production.up.railway.app";

  // 🔥 FETCH
  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`);
      const data = await res.json();

      const mapped: Prediction[] = (data || []).map((job: any) => ({
        id: job.id,
        type: job.type,
        status: job.status ?? "completed",
        createdAt: job.createdAt,
        mediaUrl: job.mediaUrl ?? null,
        mediaUrls: job.mediaUrls ?? [],
      }));

      setJobs(mapped);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPredictions();
  }, []);

  // 🔥 SHARE
  const handleShare = async (job: Prediction) => {
    try {
      let media: { url: string }[] = [];

      if ((job.type === "hero" || job.type === "reel") && job.mediaUrl) {
        media = [{ url: job.mediaUrl }];
      }

      if (job.type === "lookbook") {
        media = (job.mediaUrls || [])
          .filter((u) => u)
          .map((u) => ({ url: u }));
      }

      console.log("🚀 FINAL SHARE MEDIA:", media);

      if (!media.length) {
        alert("No images to share");
        return;
      }

      const res = await fetch(`${API_BASE}/api/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: job.type,
          media,
        }),
      });

      const json = await res.json();
      const shareId = json?.asset?.id;

      if (!shareId) throw new Error("Share failed");

      setShareData({
        media,
        shareUrl: `${window.location.origin}/s/${shareId}`,
      });

    } catch (err) {
      console.error("Share error:", err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="predictions-page">
      <h2>Predictions</h2>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const preview =
            job.type === "lookbook"
              ? job.mediaUrls?.[0]
              : job.mediaUrl;

          return (
            <div key={job.id} className="prediction-card">
              {job.type === "reel" && preview ? (
                <video src={preview} controls />
              ) : preview ? (
                <img src={preview} />
              ) : (
                <div>Processing...</div>
              )}

              <div className="actions">
                <button onClick={() => handleShare(job)}>
                  Share
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* SHARE MODAL */}
      {shareData && (
        <div className="share-modal">
          <button onClick={() => setShareData(null)}>Close</button>

          <SharePanel data={{ asset: { media: shareData.media } }} />
        </div>
      )}
    </div>
  );
}