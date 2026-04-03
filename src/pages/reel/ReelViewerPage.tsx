import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReelViewerPage.css";
import { API_BASE } from "../../config/api";

export default function ReelViewerPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);

  const heroPreviewUrl =
    params.get("hero") || location.state?.heroPreviewUrl || null;

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!heroPreviewUrl) return;

    const generateReel = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            imageUrl: heroPreviewUrl,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.error || "Reel failed");
        }

        setVideoUrl(data.reelVideoUrl);

      } catch (err) {
        console.error("Reel failed:", err);
        navigate("/create-v2");
      }
    };

    generateReel();
  }, [heroPreviewUrl, navigate]);

  const handleDownload = () => {
    if (!videoUrl) return;
    window.open(videoUrl, "_blank");
  };

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
                🎬 Creating your Reel...
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