import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`);
      const data = await res.json();

      const jobsData: Prediction[] = (data || []).map((job: any) => {
        const mediaUrl = job.mediaUrl ?? job.imageUrl ?? null;

        // LOOKBOOK
        if (job.type === "lookbook") {
          return {
            runId: job.id,
            type: "lookbook",
            heroImageUrl: null,
            lookbookImages: job.mediaUrls || [],
            status: job.status ?? "completed",
            createdAt: job.createdAt,
            creditsUsed: 2,
          };
        }

        // REEL
        const isVideo =
          job.type === "reel" ||
          (typeof mediaUrl === "string" &&
            (mediaUrl.includes(".mp4") || mediaUrl.includes("video")));

        if (isVideo) {
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

  if (jobs.length === 0) {
    return (
      <div className="predictions-empty">
        <h2>No predictions yet</h2>
        <p>Create your first look from the studio</p>
      </div>
    );
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => (
          <div className="prediction-card" key={job.runId}>
            <div className="prediction-image" style={{ position: "relative" }}>

              {/* HERO */}
              {job.type === "hero" && job.heroImageUrl && (
                <>
                  <img src={job.heroImageUrl} className="prediction-img" />

                  <div className="prediction-actions">
                    <button
                      className="share"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/reel/share", {
                          state: { reelUrl: job.heroImageUrl },
                        });
                      }}
                    >
                      🔗 Share
                    </button>

                    <a
                      href={job.heroImageUrl}
                      download
                      className="download"
                      onClick={(e) => e.stopPropagation()}
                    >
                      ⬇ Download
                    </a>
                  </div>
                </>
              )}

              {/* REEL */}
              {job.type === "reel" &&
                (job.reelUrl ? (
                  <video src={job.reelUrl} controls className="prediction-img" />
                ) : (
                  <div className="prediction-placeholder">
                    🎬 Processing Reel...
                  </div>
                ))}

              {/* LOOKBOOK 🔥 FINAL */}
              {job.type === "lookbook" && (() => {
  const images = (job.lookbookImages || []).filter(Boolean);

  const isReady = images.length >= 4;

  return (
    <>
      {/* GRID ONLY WHEN READY */}
      {isReady ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4px",
            width: "100%",
            height: "100%",
          }}
        >
          {images.slice(0, 4).map((img, i) => (
            <img
              key={i}
              src={img}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />
          ))}
        </div>
      ) : (
        <div className="prediction-placeholder">
          ⏳ Processing Lookbook...
        </div>
      )}

      {/* ACTIONS ONLY WHEN READY */}
      {isReady && (
        <div className="prediction-actions">
          <button
            className="share"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/reel/share", {
                state: { lookbookImages: images },
              });
            }}
          >
            🔗 Share
          </button>

          <button
            className="download"
            onClick={(e) => {
              e.stopPropagation();

              images.forEach((url, i) => {
                const link = document.createElement("a");
                link.href = url;
                link.download = `lookbook-${i + 1}.jpg`;
                link.click();
              });
            }}
          >
            ⬇ Download
          </button>
        </div>
      )}
    </>
  );
})()}

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
        ))}
      </div>
    </div>
  );
}