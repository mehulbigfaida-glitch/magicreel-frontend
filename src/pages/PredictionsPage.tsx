import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE;

type Prediction = {
  id: string;
  type: "hero" | "lookbook" | "reel";
  status: string;
  createdAt: string;
  mediaUrl: string | null;
  mediaUrls: string[];
  creditsUsed: number;
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  const loadPredictions = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/predictions`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        console.error("❌ API FAILED:", res.status);
        setLoading(false);
        return false;
      }

      const data = await res.json();

      // ✅ CLEAN + FILTERED MAPPING
      const jobsData: Prediction[] = (data || [])
        .map((job: any) => {
          let type: "hero" | "lookbook" | "reel" = "hero";
          let mediaUrl: string | null = null;
          let mediaUrls: string[] = [];

          // ✅ TYPE DETECTION
          if (Array.isArray(job.lookbook) && job.lookbook.length > 0) {
            type = "lookbook";
            mediaUrls = job.lookbook;
          } else if (job.reelUrl) {
            type = "reel";
            mediaUrl = job.reelUrl;
          } else if (job.heroImageUrl) {
            type = "hero";
            mediaUrl = job.heroImageUrl;
          }

          return {
            id: job.id,
            type,
            status: job.status || "completed",
            createdAt: job.createdAt,
            mediaUrl,
            mediaUrls,
            creditsUsed: job.creditsUsed ?? 1,
          };
        })

        // ❗ REMOVE BROKEN JOBS (MAIN FIX)
        .filter((job: Prediction) => {
          if (job.type === "lookbook") return job.mediaUrls.length > 0;
          return !!job.mediaUrl;
        });

      setJobs(jobsData);
      setLoading(false);

      // ✅ CHECK RUNNING JOBS
      const hasRunningJobs = jobsData.some((job) => {
        const status = (job.status || "").toLowerCase().trim();
        return (
          status === "running" ||
          status === "processing" ||
          status === "pending" ||
          status === "queued"
        );
      });

      return hasRunningJobs;
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setLoading(false);
      return false;
    }
  };

  // ================= POLLING =================
  useEffect(() => {
    let interval: any = null;

    const startPolling = async () => {
      const running = await loadPredictions();

      if (running) {
        interval = setInterval(async () => {
          const stillRunning = await loadPredictions();
          if (!stillRunning && interval) {
            clearInterval(interval);
          }
        }, 4000);
      }
    };

    startPolling();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // ================= UI =================
  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job: Prediction) => {
          const status = (job.status || "").toLowerCase();

          const mainUrl =
            job.type === "hero"
              ? job.mediaUrl
              : job.type === "lookbook"
              ? job.mediaUrls?.[0]
              : job.mediaUrl;

          return (
            <div className="prediction-card" key={job.id}>
              <div className="prediction-image">
                {status === "failed" && (
                  <div className="prediction-placeholder">❌ Failed</div>
                )}

                {status !== "failed" && job.type === "hero" && (
                  job.mediaUrl ? (
                    <img src={job.mediaUrl} />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}

                {status !== "failed" && job.type === "reel" && (
                  job.mediaUrl ? (
                    <video src={job.mediaUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}

                {status !== "failed" && job.type === "lookbook" && (
                  job.mediaUrls?.length ? (
                    <img src={job.mediaUrls[0]} />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}
              </div>

              <div className="prediction-actions">
                <button onClick={() => mainUrl && window.open(mainUrl)}>
                  🔍 View
                </button>

                <button
                  onClick={() => {
                    if (!mainUrl) return;
                    const link = document.createElement("a");
                    link.href = mainUrl;
                    link.download = "magicreel";
                    link.click();
                  }}
                >
                  ⬇️ Download
                </button>
              </div>

              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()} •{" "}
                  {job.creditsUsed} credit
                </span>

                <span className={`status ${status}`}>
                  {status === "completed"
                    ? "✅ Ready"
                    : ["running", "processing", "pending", "queued"].includes(
                        status
                      )
                    ? "⏳ Processing"
                    : "❌ Failed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}