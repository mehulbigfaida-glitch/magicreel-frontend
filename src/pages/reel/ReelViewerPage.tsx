import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReelViewerPage.css";

export default function ReelViewerPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const heroFromQuery = params.get("hero");

  const heroPreviewUrl =
    heroFromQuery || location.state?.heroPreviewUrl;

  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {

    if (!heroPreviewUrl) {
      navigate("/create-v2");
      return;
    }

    const generateReel = async () => {

      try {

        const jobId = crypto.randomUUID();

        const res = await fetch("/api/p2m/reel/generate-v1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            jobId,
            heroPreviewUrl
          })
        });

        let data: any = null;

        try {
          data = await res.json();
        } catch {
          console.warn("Non-JSON response");
        }

        /* 🔥 ACCEPT RESULT EVEN IF STATUS NOT OK */
        if (!res.ok && !data?.reelVideoUrl) {
          throw new Error("Reel generation failed");
        }

        if (data?.reelVideoUrl) {
          setVideoUrl(data.reelVideoUrl);
        } else {
          throw new Error("No video returned");
        }

      } catch (err) {

        console.error("Reel generation failed:", err);

        // ❌ removed alert → bad UX
        navigate("/create-v2");

      } finally {

        setLoading(false);

      }

    };

    generateReel();

  }, [heroPreviewUrl, navigate]);

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

        {/* 🔥 SINGLE STAGE (HERO → VIDEO) */}
        <div className="reel-stage">

          {/* HERO (before video) */}
          {!videoUrl && heroPreviewUrl && (
            <img
              src={heroPreviewUrl}
              alt="Hero preview"
              className="reel-preview-image"
            />
          )}

          {/* LOADING OVERLAY */}
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

          {/* VIDEO replaces hero */}
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

            <button onClick={handleBack}>
              Back to Editor
            </button>

          </div>
        )}

      </div>

    </div>

  );

}