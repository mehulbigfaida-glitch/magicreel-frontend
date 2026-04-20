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
  const [shareData, setShareData] = useState<any>(null); // ✅ FIXED

  // ✅ SHARE HANDLER (CORRECT PLACE)
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
  let images: string[] = [];

  if (Array.isArray(job.mediaUrls)) {
    images = job.mediaUrls;
  } else if (typeof job.mediaUrl === "string") {
    images = [job.mediaUrl];
  }

  // ✅ FILTER: remove invalid / mismatched URLs
  const cleanImages = images.filter(
    (url) =>
      typeof url === "string" &&
      url.length > 0 &&
      url.includes("cloudinary") // basic sanity check
  );

  return {
    runId: job.id,
    type: "lookbook",
    heroImageUrl: job.heroImageUrl || null,
    lookbookImages: cleanImages,
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
      return jobsData.some((job) => job.status === "running");
    } catch (err) {
      console.error("Predictions fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const init = async () => {
      const hasRunningJobs = await loadPredictions();

      if (hasRunningJobs) {
        interval = setInterval(loadPredictions, 4000);
      }
    };

    init();

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
        {jobs.map((job) => (
          <div className="prediction-card" key={job.runId}>

            {/* IMAGE */}
            <div className="prediction-image">

              {job.status === "failed" && (
                <div className="prediction-placeholder">❌ Generation Failed</div>
              )}

              {job.status !== "failed" && job.type === "hero" && job.heroImageUrl && (
                <img src={job.heroImageUrl} alt="Hero" loading="lazy" />
              )}

              {job.status !== "failed" && job.type === "reel" && (
                job.reelUrl ? (
                  <video src={job.reelUrl} controls playsInline muted />
                ) : (
                  <div className="prediction-placeholder">🎬 Processing Reel...</div>
                )
              )}

              {job.status !== "failed" && job.type === "lookbook" && (
                job.lookbookImages && job.lookbookImages.length > 0 ? (
                  <img src={job.lookbookImages[0]} alt="Lookbook" loading="lazy" />
                ) : (
                  <div className="prediction-placeholder">🖼 Preparing Preview...</div>
                )
              )}

            </div>

            {/* ACTIONS */}
            <div className="prediction-actions">

              {job.type === "hero" && job.status === "completed" && (
                <>
                  <button>➕ Lookbook</button>
                  <button>🎬 Reel</button>
                  <button onClick={() => handleShare(job)}>📤 Share</button>
                </>
              )}

              {job.type === "lookbook" && job.status === "completed" && (
                <>
                  <button>🎬 Reel</button>
                  <button onClick={() => handleShare(job)}>📤 Share</button>
                  <button>🔍 View</button>
                </>
              )}

              {job.type === "reel" && job.status === "completed" && (
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

              <span className={`status ${job.status}`}>
                {job.status === "completed"
                  ? "✅ Ready"
                  : job.status === "running"
                  ? "⏳ Processing"
                  : "❌ Failed"}
              </span>
            </div>

          </div>
        ))}
      </div>

      {/* ✅ SHARE MODAL */}
      {shareData && (
  <div
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.9)",
      zIndex: 9999,
      overflowY: "auto",   // ✅ enable scroll
      padding: "40px 0"
    }}
  >
    <div
      style={{
        maxWidth: 1000,
        margin: "0 auto",
        position: "relative"
      }}
    >
      {/* CLOSE BUTTON */}
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