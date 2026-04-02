import { useLocation, useNavigate } from "react-router-dom";
import "./ReelViewerPage.css";

export default function ReelViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const videoUrl =
    params.get("video") || location.state?.reelVideoUrl || null;

  const heroPreviewUrl =
    params.get("hero") || location.state?.heroPreviewUrl || null;

  /* -----------------------------
     ACTIONS
  ----------------------------- */

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

        <div className="reel-stage">

          {!videoUrl && heroPreviewUrl && (
            <img
              src={heroPreviewUrl}
              className="reel-preview-image"
            />
          )}

          {!videoUrl && (
            <div className="reel-overlay">
              <div className="reel-loader" />

              <div className="reel-loading-title">
                Loading your Reel...
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