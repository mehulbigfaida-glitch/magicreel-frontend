import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Predictions.css";
import { API_BASE } from "../config/api";

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
  const navigate = useNavigate();

  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`);
      const data = await res.json();

      const jobsData: Prediction[] = data.jobs || [];
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
    return (
      <div className="predictions-loading">
        Loading predictions...
      </div>
    );
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

            <div className="prediction-image">

              {job.heroImageUrl ? (
                <>
                  <img src={job.heroImageUrl} alt="Hero result" />

                  <div className="prediction-actions">

  {job.status === "completed" && (
    <>
      <button
  className="primary"
  onClick={() =>
    navigate("/reel", {
      state: {
        heroPreviewUrl: job.heroImageUrl,
        runId: job.runId,
      },
    })
  }
>
        🎬 Generate Reel
      </button>

      <button
        className="secondary"
        onClick={() =>
          navigate(`/lookbook?runId=${job.runId}`)
        }
      >
        Lookbook
      </button>
    </>
  )}

  <a href={job.heroImageUrl || "#"} download>
    Download
  </a>

</div>
                </>
              ) : (
                <div className="prediction-placeholder">
                  ⏳ Generating hero...
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