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

        // LOOKBOOK
        if (job.type === "lookbook") {
          const images: string[] = Array.isArray(job.mediaUrls)
            ? job.mediaUrls
            : [];

          return {
            runId: job.id,
            type: "lookbook",
            heroImageUrl: job.heroImageUrl || images[0] || null,
            lookbookImages: images,
            status: job.status ?? "completed",
            createdAt: job.createdAt,
            creditsUsed: 2,
          };
        }

        // REEL
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

        // HERO
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

      // ✅ FIXED POLLING LOGIC
      return jobsData.some((job) => {
        const status = (job.status || "").toLowerCase().trim();
        return (
          status === "running" ||
          status === "processing" ||
          status === "pending"
        );
      });

    } catch (err) {
      console.error("Predictions fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ✅ FIXED POLLING SYSTEM
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
          const normalizedStatus = (job.status || "").toLowerCase().trim();

          return (
            <div className="prediction-card" key={job.runId}>

              {/* IMAGE */}
              <div className="prediction-image">

                {normalizedStatus === "failed" && (
                  <div className="prediction-placeholder">❌ Generation Failed</div>
                )}

                {normalizedStatus !== "failed" && job.type === "hero" && job.heroImageUrl && (
                  <img src={job.heroImageUrl} alt="Hero" loading="lazy" />
                )}

                {normalizedStatus !== "failed" && job.type === "reel" && (
                  job.reelUrl ? (
                    <video src={job.reelUrl} controls playsInline muted />
                  ) : (
                    <div className="prediction-placeholder">🎬 Processing Reel...</div>
                  )
                )}

                {normalizedStatus !== "failed" && job.type === "lookbook" && (
                  job.lookbookImages && job.lookbookImages.length > 0 ? (
                    <img src={job.lookbookImages[0]} alt="Lookbook" loading="lazy" />
                  ) : (
                    <div className="prediction-placeholder">🖼 Preparing Preview...</div>
                  )
                )}

              </div>

              {/* ACTIONS */}
              <div className="prediction-actions">

                {job.type === "hero" && normalizedStatus === "completed" && (
                  <>
                    <button>➕ Lookbook</button>
                    <button>🎬 Reel</button>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                  </>
                )}

                {job.type === "lookbook" && normalizedStatus === "completed" && (
                  <>
                    <button>🎬 Reel</button>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                    <button>🔍 View</button>
                  </>
                )}

                {job.type === "reel" && normalizedStatus === "completed" && (
                  <>
                    <button onClick={() => handleShare(job)}>📤 Share</button>
                    <button>🔍 View</button>
                  </>
                )}

              </div>

              {/* META */}
              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()} • {job.creditsUsed} credit
                </span>

                <span className={`status ${normalizedStatus}`}>
                  {normalizedStatus === "completed"
                    ? "✅ Ready"
                    : normalizedStatus === "running" ||
                      normalizedStatus === "processing" ||
                      normalizedStatus === "pending"
                    ? "⏳ Processing"
                    : "❌ Failed"}
                </span>
              </div>

            </div>
          );
        })}
      </div>

      {/* SHARE MODAL */}
      {shareData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "40px 0"
          }}
        >
          <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
            <button
              onClick={() => setShareData(null)}
              style={{
                position: "sticky",
                top: 10,
                float: "right",
                zIndex: 10000,
                background: "#000",
                color: "#fff",
                border: "none",
                padding: "8px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>

            <SharePanel data={shareData} />
          </div>
        </div>
      )}

    </div>
  );
}