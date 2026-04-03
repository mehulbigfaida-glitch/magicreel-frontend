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
  const [confirmed, setConfirmed] = useState(false);
  const [loadingText, setLoadingText] = useState(
    "🎬 Creating your Reel..."
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  /* -----------------------------
     DYNAMIC LOADER TEXT
  ----------------------------- */
  useEffect(() => {
    if (!confirmed || videoUrl) return;

    const messages = [
      "🎬 Creating your Reel...",
      "✨ Applying cinematic motion...",
      "💡 Enhancing lighting & depth...",
      "🎞️ Rendering smooth transitions...",
      "🚀 Almost ready...",
    ];

    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % messages.length;
      setLoadingText(messages[i]);
    }, 3000);

    return () => clearInterval(interval);
  }, [confirmed, videoUrl]);

  /* -----------------------------
     GENERATE REEL
  ----------------------------- */
  useEffect(() => {
    if (!heroPreviewUrl || !confirmed) return;

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
  if (data?.error === "INSUFFICIENT_CREDITS") {
    setShowPaywall(true);
    return;
  }

  if (!res.ok) {
  if (data?.error === "INSUFFICIENT_CREDITS") {
    setShowPaywall(true);
    return;
  }

  throw new Error(data?.error || "Reel failed");
}
}

        setVideoUrl(data.reelVideoUrl);

        // success moment
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

      } catch (err) {
        console.error("Reel failed:", err);
        ;
      }
    };

    generateReel();
  }, [heroPreviewUrl, confirmed, navigate]);

  /* -----------------------------
     ACTIONS
  ----------------------------- */

  const handleDownload = () => {
    if (!videoUrl) return;
    window.open(videoUrl, "_blank");
  };

  // ✅ UPDATED: Redirect to Share Studio
  const handleShare = () => {
    if (!videoUrl) return;

    navigate("/reel/share", {
      state: { reelUrl: videoUrl },
    });
  };

  /* -----------------------------
     UI
  ----------------------------- */

  return (
    <div className="reel-page">
      <div className="reel-container">

        <h2>🎬 MagicReel Studio</h2>

        {/* ✅ CONFIRM SCREEN */}
        {!confirmed && (
          <div className="reel-confirm">
            <h3>✨ Create your cinematic Reel?</h3>

            <div className="reel-confirm-actions">
              <button onClick={() => setConfirmed(true)}>
                Create Reel
              </button>

              <button onClick={() => navigate("/create-v2")}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ✅ MAIN STAGE */}
        {confirmed && (
          <div className="reel-stage">

            {/* preview image */}
            {!videoUrl && heroPreviewUrl && (
              <img
                src={heroPreviewUrl}
                className="reel-preview-image"
              />
            )}

            {/* loader */}
            {!videoUrl && (
              <div className="reel-overlay">
                <div className="reel-loader" />

                <div className="reel-loading-title">
                  {loadingText}
                </div>

                <div className="reel-loading-sub">
                  Usually ready in 3–5 minutes
                </div>
              </div>
            )}

            {/* success text */}
            {showSuccess && (
              <div className="reel-success">
                ✨ Your Reel is Ready
              </div>
            )}

            {/* video */}
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

        {/* ✅ ACTIONS */}
        {videoUrl && (
          <div className="reel-actions">
            <button onClick={handleDownload}>
              ⬇ Download Reel
            </button>

            <button onClick={handleShare}>
              🔗 Share Reel
            </button>
          </div>
        )}

      </div>
      {showPaywall && (
  <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
    <div className="bg-white text-black p-6 rounded-xl w-[400px] text-center">
      
      <h3 className="text-xl font-semibold mb-2">
        Not Enough Credits
      </h3>

      <p className="mb-4 text-sm">
        You need 3 credits to generate a Reel.
      </p>

      <div className="flex gap-3 justify-center">
        <button
          className="bg-black text-white px-4 py-2 rounded"
          onClick={() => navigate("/pricing")}
        >
          Upgrade Plan
        </button>

        <button
          className="border px-4 py-2 rounded"
          onClick={() => setShowPaywall(false)}
        >
          Cancel
        </button>
      </div>

    </div>
  </div>
)}
    </div>
  );
}