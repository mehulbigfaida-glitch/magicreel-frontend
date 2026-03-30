import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReelViewerPage.css";
import { API_BASE } from "../../config/api";

export default function ReelViewerPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const jobId = location.state?.jobId;
  const heroPreviewUrl = location.state?.heroPreviewUrl;

  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {

    if (!jobId || !heroPreviewUrl) {
      navigate("/create-v2");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/create-v2");
      return;
    }

    let interval: ReturnType<typeof setInterval>;

    const pollReel = async () => {
      try {

        const res = await fetch(`${API_BASE}/api/p2m/reel/status/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (data?.status === "completed" && data?.reelVideoUrl) {
          setVideoUrl(data.reelVideoUrl);
          setLoading(false);
          clearInterval(interval);
        }

        if (data?.status === "failed") {
          throw new Error("Reel failed");
        }

      } catch (err) {
        console.error("Polling failed:", err);
        clearInterval(interval);
        navigate("/create-v2");
      }
    };

    // 🔁 poll every 2s
    interval = setInterval(pollReel, 2000);

    // run immediately once
    pollReel();

    return () => clearInterval(interval);

  }, [jobId, heroPreviewUrl, navigate]);

  const handleDownload = () => {
    if (!videoUrl) return;
    window.open(videoUrl, "_blank");
  };

  const handleBack = () => {
    navigate("/create-v2");
  };

  return (

    <div className="reel-page">

      <div className="reel-container">

        <h2>🎬 MagicReel Studio</h2>

        <div className="reel-stage">

          {/* HERO PREVIEW */}
          {!videoUrl && heroPreviewUrl && (
            <img
              src={heroPreviewUrl}
              alt="Hero preview"
              className="reel-preview-image"
            />
          )}

          {/* LOADING */}
          {loading && (
            <div className="reel-overlay">

              <div className="reel-loader" />

              <div className="reel-loading-title">
                🎬 Creating your Reel...
              </div>

              <div className="reel-loading-sub">
                Adding motion, lighting & cinematic styling
              </div>

              <div className="reel-loading-time">
                Usually ready in 1–3 minutes
              </div>

            </div>
          )}

          {/* VIDEO */}
          {videoUrl && (
            <video
              src={videoUrl}
              controls
              autoPlay
              loop
              className="reel-video"
            />
          )}

        </div>

        {videoUrl && (
          <div className="reel-actions">

            <button onClick={handleDownload}>
              ⬇ Download Reel
            </button>

            <button onClick={handleBack}>
              Back to Editor
            </button>

          </div>
        )}

      </div>

    </div>

  );

}