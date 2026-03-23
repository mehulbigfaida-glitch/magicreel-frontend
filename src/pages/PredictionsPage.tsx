import { useEffect, useState } from "react";
import "./Predictions.css";

type Prediction = {
  runId: string;
  heroImageUrl: string | null;
  status: string;
  createdAt: string;
  creditsUsed: number;
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadPredictions = async () => {
    try {
      const res = await fetch("/api/predictions");
      const data = await res.json();

      const jobsData: Prediction[] = data.jobs || [];
      setJobs(jobsData);

      // Only trigger status check for running jobs
      jobsData.forEach((job) => {
        if (job.status === "running") {
          fetch(`/api/p2m/hero/status/${job.runId}`).catch(() => {});
        }
      });

      setLoading(false);

      return jobsData.some((job) => job.status === "running");
    } catch (err) {
      console.error("Predictions fetch error:", err);
      setLoading(false);
      return false;
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const init = async () => {
      const hasRunningJobs = await loadPredictions();

      if (hasRunningJobs) {
        interval = setInterval(loadPredictions, 5000);
      }
    };

    init();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
      <div className="predictions-loading">
        Loading predictions...
      </div>
    );
  }

  return (
    <div className="predictions-page">

      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">

        {jobs.map((job) => (
          <div className="prediction-card" key={job.runId}>

            <div className="prediction-image">

              {job.heroImageUrl ? (
                <>
                  <img src={job.heroImageUrl} alt="Hero result" />

                  <div className="prediction-overlay">

                    <button
                      disabled={job.status !== "completed"}
                      onClick={() =>
                        window.location.href = `/lookbook?runId=${job.runId}`
                      }
                    >
                      Lookbook
                    </button>

                    <button
                      disabled={job.status !== "completed"}
                      onClick={() =>
                        window.location.href = `/reel?runId=${job.runId}`
                      }
                    >
                      Reel
                    </button>

                    <a href={job.heroImageUrl} download>
                      Download
                    </a>

                  </div>
                </>
              ) : (
                <div className="prediction-placeholder">
                  Generating hero...
                </div>
              )}

            </div>

            <div className="prediction-meta">

              <span>
                {new Date(job.createdAt).toLocaleDateString()}
              </span>

              <span>•</span>

              <span>{job.creditsUsed} credit</span>

              <span>•</span>

              <span className="status">
                {job.status}
              </span>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}