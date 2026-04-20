import { useEffect, useState } from "react";
import "./Predictions.css";
import { API_BASE } from "../config/api";
import SharePanel from "../components/SharePanel";

type PredictionType = "hero" | "reel" | "lookbook";

type Prediction = {
  runId: string;
  type: PredictionType;
  heroImageUrl: string | null;
  reelUrl?: string | null;
  lookbookImages?: string[];
  status: string;
  createdAt: string;
  creditsUsed: number;
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<any>(null);

  const handleShare = (job: Prediction) => {
    let media: { url: string }[] = [];

    if (job.type === "hero" && job.heroImageUrl) {
      media = [{ url: job.heroImageUrl }];
    }

    if (job.type === "lookbook" && job.lookbookImages) {
      media = job.lookbookImages.map((url) => ({ url }));
    }

    if (job.type === "reel" && job.reelUrl) {
      media = [{ url: job.reelUrl }];
    }

    setShareData({ media });
  };

  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`);
      const data = await res.json();

      const jobsData: Prediction[] = (data || []).map((job: any) => {
        const mediaUrl = job.mediaUrl ?? null;

        if (job.type === "lookbook") {
  const images: string[] = Array.isArray(job.mediaUrls)
    ? job.mediaUrls
    : [];

  const hero = job.heroImageUrl || "";

  // ✅ FILTER CORRECT IMAGES
  const filteredImages = images.filter((url) => {
    if (!url) return false;

    // remove replicate junk
    if (url.includes("replicate.delivery")) return false;

    // ensure same hero group (Cloudinary version match)
    const heroVersion = hero.split("/upload/")[1]?.split("/")[0];
    const urlVersion = url.split("/upload/")[1]?.split("/")[0];

    return heroVersion && urlVersion && heroVersion === urlVersion;
  });

  return {
    runId: job.id,
    type: "lookbook",
    heroImageUrl: hero || filteredImages[0] || null,
    lookbookImages:
      filteredImages.length > 0 ? filteredImages : images,
    status: job.status ?? "completed",
    createdAt: job.createdAt,
    creditsUsed: 2,
  };
}

        if (job.type === "reel") {
          return {
            runId: job.id,
            type: "reel",
            heroImageUrl: null,
            reelUrl: mediaUrl,
            status: job.status ?? "completed",
            createdAt: job.createdAt,
            creditsUsed: 3,
          };
        }

        return {
          runId: job.id,
          type: "hero",
          heroImageUrl: mediaUrl,
          status: job.status ?? "completed",
          createdAt: job.createdAt,
          creditsUsed: 1,
        };
      });

      setJobs(jobsData);

      // ✅ FINAL POLLING FIX
      return jobsData.some((job) => {
        const status = (job.status || "").toLowerCase().trim();

        const createdTime = new Date(job.createdAt).getTime();
        const now = Date.now();

        const isRecent = now - createdTime < 5 * 60 * 1000;

        return (
          isRecent &&
          (status === "running" ||
            status === "processing" ||
            status === "pending" ||
            status === "queued")
        );
      });

    } catch (err) {
      console.error("Predictions fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = async () => {
      const hasRunningJobs = await loadPredictions();

      if (hasRunningJobs) {
        interval = setInterval(async () => {
          const stillRunning = await loadPredictions();

          if (!stillRunning && interval) {
            clearInterval(interval);
            interval = null;
          }
        }, 4000);
      }
    };

    startPolling();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const status = (job.status || "").toLowerCase().trim();

          return (
            <div className="prediction-card" key={job.runId}>

              <div className="prediction-image">
                {status === "failed" && (
                  <div className="prediction-placeholder">❌ Failed</div>
                )}

                {status !== "failed" && job.type === "hero" && job.heroImageUrl && (
                  <img src={job.heroImageUrl} alt="Hero" />
                )}

                {status !== "failed" && job.type === "reel" && (
                  job.reelUrl ? (
                    <video src={job.reelUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}

                {status !== "failed" && job.type === "lookbook" && (
                  job.lookbookImages?.length ? (
                    <img src={job.lookbookImages[0]} alt="Lookbook" />
                  ) : (
                    <div className="prediction-placeholder">Preparing...</div>
                  )
                )}
              </div>

              <div className="prediction-actions">
                {job.type === "hero" && status === "completed" && (
                  <>
                    <button>➕ Lookbook</button>
                    <button>🎬 Reel</button>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                  </>
                )}

                {job.type === "lookbook" && status === "completed" && (
                  <>
                    <button>🎬 Reel</button>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                    <button>🔍 View</button>
                  </>
                )}

                {job.type === "reel" && status === "completed" && (
                  <>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                    <button>🔍 View</button>
                  </>
                )}
              </div>

              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()} • {job.creditsUsed} credit
                </span>

                <span className={`status ${status}`}>
                  {status === "completed"
                    ? "✅ Ready"
                    : ["running", "processing", "pending", "queued"].includes(status)
                    ? "⏳ Processing"
                    : "❌ Failed"}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {shareData && (
        <div style={{ position: "fixed", inset: 0, background: "#0009", zIndex: 9999 }}>
          <button onClick={() => setShareData(null)}>Close</button>
          <SharePanel data={shareData} />
        </div>
      )}

    </div>
  );
}