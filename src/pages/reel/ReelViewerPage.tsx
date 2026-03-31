import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReelViewerPage.css";
import { API_BASE } from "../../config/api";

export default function ReelViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const jobId =
  location.state?.jobId || params.get("jobId");

const heroPreviewUrl =
  location.state?.heroPreviewUrl || params.get("hero");

  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  /* -----------------------------
     START GENERATION (AFTER CONFIRM)
  ----------------------------- */
  useEffect(() => {
    if (!confirmed || !jobId || !heroPreviewUrl) return;

    const startReel = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            jobId,
            heroPreviewUrl,
          }),
        });

        await res.json();

        /* 🔁 START POLLING */
        setTimeout(pollStatus, 90000); // initial delay

      } catch (err) {
        console.error("Reel start failed:", err);
        navigate("/create-v2");
      }
    };

    const pollStatus = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/p2m/reel/status/${jobId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.status === "completed") {
          setVideoUrl(data.reelVideoUrl);
          setLoading(false);
          return;
        }

        if (data.status === "failed") {
          throw new Error("Reel failed");
        }

        setTimeout(pollStatus, 3000);

      } catch (err) {
        console.error("Polling failed:", err);
        navigate("/create-v2");
      }
    };

    startReel();

  }, [confirmed, jobId, heroPreviewUrl, navigate]);

  /* -----------------------------
     ACTIONS
  ----------------------------- */

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleCancel = () => {
    navigate("/create-v2");
  };

  const handleDownload = () => {
    if (!videoUrl) return;
    window.open(videoUrl, "_blank");
  };

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="reel-page">
      <div className="reel-container">

        <h2>🎬 MagicReel Studio</h2>

        {/* ✅ CONFIRMATION MODAL */}
        {!confirmed && (
          <div className="reel-confirm">
            <h3>Are you sure you want to create Reel?</h3>

            <div className="reel-confirm-actions">
              <button onClick={handleConfirm}>
                Yes, Create Reel
              </button>

              <button onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ✅ MAIN STAGE */}
        {confirmed && (
          <div className="reel-stage">

            {!videoUrl && heroPreviewUrl && (
              <img
                src={heroPreviewUrl}
                className="reel-preview-image"
              />
            )}

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
        )}

        {/* ACTIONS */}
        {videoUrl && (
          <div className="reel-actions">
            <button onClick={handleDownload}>
              ⬇ Download Reel
            </button>

            <button onClick={() => navigate("/create-v2")}>
              Back to Editor
            </button>
          </div>
        )}

      </div>
    </div>
  );
}