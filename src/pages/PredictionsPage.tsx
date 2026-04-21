import { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

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

      // ✅ CLEAN + STABLE MAPPING (FINAL)
      const jobsData: Prediction[] = (data || []).map((job: any) => {
        let type: "hero" | "lookbook" | "reel" = "hero";
        let mediaUrl: string | null = null;
        let mediaUrls: string[] = [];

        // 🔥 BACKEND-ALIGNED MAPPING (CRITICAL)
        if (job.type === "LOOKBOOK" && job.outputImageUrl) {
          type = "lookbook";
          mediaUrls = [job.outputImageUrl];
        } else if (job.reelUrl) {
          type = "reel";
          mediaUrl = job.reelUrl;
        } else if (job.outputImageUrl) {
          type = "hero";
          mediaUrl = job.outputImageUrl;
        }

        return {
          id: job.id,
          type,
          status: job.status || "completed",
          createdAt: job.createdAt,
          mediaUrl,
          mediaUrls,
          creditsUsed: job.creditsUsed ?? (type === "lookbook" ? 2 : 1),
        };
      });

      setJobs(jobsData);
      setLoading(false);

      // polling control
      const hasRunningJobs = jobsData.some((job: Prediction) => {
        const s = (job.status || "").toLowerCase();
        return (
          s === "running" ||
          s === "processing" ||
          s === "pending" ||
          s === "queued"
        );
      });

      return hasRunningJobs;
    } catch (err) {
      console.error("❌ FETCH ERROR:", err);
      setLoading(false);
      return false;
    }
  };

  // ================= POLLING =================
  useEffect(() => {
    let interval: any;

    const start = async () => {
      const running = await loadPredictions();

      if (running) {
        interval = setInterval(async () => {
          const stillRunning = await loadPredictions();
          if (!stillRunning && interval) clearInterval(interval);
        }, 4000);
      }
    };

    start();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  // ================= UI =================
  if (loading) {
    return <div className="predictions-loading">Loading...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job: Prediction) => {
          const status = (job.status || "").toLowerCase();

          const mainUrl =
            job.type === "lookbook"
              ? job.mediaUrls?.[0]
              : job.mediaUrl;

          return (
            <div className="prediction-card" key={job.id}>
              <div className="prediction-image">
                {status === "failed" && (
                  <div className="prediction-placeholder">❌ Failed</div>
                )}

                {job.type === "hero" && (
                  job.mediaUrl ? (
                    <img src={job.mediaUrl} />
                  ) : (
                    <div className="prediction-placeholder">
                      ⚠️ Missing Image
                    </div>
                  )
                )}

                {job.type === "reel" && (
                  job.mediaUrl ? (
                    <video src={job.mediaUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">
                      ⚠️ Missing Video
                    </div>
                  )
                )}

                {job.type === "lookbook" && (
                  job.mediaUrls && job.mediaUrls.length > 0 ? (
                    <img src={job.mediaUrls[0]} />
                  ) : (
                    <div className="prediction-placeholder">
                      ⚠️ Missing Lookbook
                    </div>
                  )
                )}
              </div>

              <div className="prediction-actions">
                <button onClick={() => window.open(mainUrl || "", "_blank")}>
                  🔍 View
                </button>

                <button
                  onClick={() => {
                    if (!mainUrl) return;
                    const a = document.createElement("a");
                    a.href = mainUrl;
                    a.download = "magicreel";
                    a.click();
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
                  {status === "completed" ? "✅ Ready" : "⏳"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}