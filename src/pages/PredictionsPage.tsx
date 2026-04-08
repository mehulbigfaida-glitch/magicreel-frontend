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
        // LOOKBOOK
if (job.type === "lookbook") {
  const cleanImages = (job.mediaUrls || []).filter(
    (url: string) => typeof url === "string" && url.length > 0
  );

  return {
    runId: job.id,
    type: "lookbook",
    heroImageUrl: null,
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "✅ Ready";
      case "running":
        return "⏳ Processing";
      case "failed":
        return "❌ Failed";
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const images =
            (job.lookbookImages || []).filter(
              (img) => img && img.startsWith("http")
            ) || [];

          return (
            <div className="prediction-card" key={job.runId}>
              <div className="prediction-image">

                {/* HERO */}
                {job.type === "hero" && job.heroImageUrl && (
                  <img src={job.heroImageUrl} />
                )}

                {/* REEL */}
                {job.type === "reel" &&
                  (job.reelUrl ? (
                    <video src={job.reelUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">
                      🎬 Processing Reel...
                    </div>
                  ))}

                {/* LOOKBOOK */}
                {job.type === "lookbook" && (
                  images.length > 0 ? (
                    <div className="lookbook-grid">
                      {images.slice(0, 4).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ))}

                      {/* Fill empty slots */}
                      {Array.from({ length: 4 - images.length }).map((_, i) => (
                        <div
                          key={`empty-${i}`}
                          style={{
                            background: "#111",
                            borderRadius: "8px",
                          }}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="prediction-placeholder">
                      ⏳ Processing Lookbook...
                    </div>
                  )
                )}

              </div>

              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()}
                </span>

                <span>•</span>

                <span>{job.creditsUsed} credit</span>

                <span>•</span>

                <span className={`status ${job.status}`}>
                  {getStatusLabel(job.status)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}