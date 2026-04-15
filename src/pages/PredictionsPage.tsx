import { useEffect, useState } from "react";
import "./Predictions.css";
import { API_BASE } from "../config/api";

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

          const cleanImages = images.filter(
            (url) => typeof url === "string" && url.length > 0
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
            
            <div className="prediction-image">

  {/* ❌ FAILED STATE (GLOBAL OVERRIDE) */}
  {job.status === "failed" && (
    <div className="prediction-placeholder">
      ❌ Generation Failed
    </div>
  )}

  {/* HERO */}
  {job.status !== "failed" && job.type === "hero" && job.heroImageUrl && (
    <img
      src={job.heroImageUrl}
      alt="Hero"
      loading="lazy"
      onError={(e) => {
        e.currentTarget.style.display = "none";
      }}
    />
  )}

  {/* REEL */}
  {job.status !== "failed" && job.type === "reel" && (
    job.reelUrl ? (
      <video src={job.reelUrl} controls playsInline muted />
    ) : (
      <div className="prediction-placeholder">
        🎬 Processing Reel...
      </div>
    )
  )}

  {/* LOOKBOOK */}
  {job.status !== "failed" && job.type === "lookbook" && (
    job.lookbookImages && job.lookbookImages.length > 0 ? (
      <img
        src={job.lookbookImages[0]}
        alt="Lookbook"
        loading="lazy"
        onError={(e) => {
          if (job.heroImageUrl) {
            e.currentTarget.src = job.heroImageUrl;
          } else {
            e.currentTarget.style.display = "none";
          }
        }}
      />
    ) : job.heroImageUrl ? (
      <img
        src={job.heroImageUrl}
        alt="Fallback Hero"
        loading="lazy"
      />
    ) : (
      <div className="prediction-placeholder">
        ⏳ Generating...
      </div>
    )
  )}

</div>

            {/* META */}
            <div className="prediction-meta">
              <span>
                {new Date(job.createdAt).toLocaleDateString()} • {job.creditsUsed} credit
              </span>

              <span
                className={`status ${
                  job.status === "completed"
                    ? "completed"
                    : job.status === "running"
                    ? "running"
                    : "failed"
                }`}
              >
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
    </div>
  );
}