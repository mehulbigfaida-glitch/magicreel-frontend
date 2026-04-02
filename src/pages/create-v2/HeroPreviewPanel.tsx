import "./HeroPreviewPanel.css";
import { useState, useRef, useEffect } from "react";
import { API_BASE } from "../../config/api";

type Props = {
  heroImageUrl: string | null;
  backHeroImageUrl?: string | null;
  loading: boolean;
  error: string | null;
  avatarFaceImageUrl: string;
  garmentFrontImageUrl: string;
  showToggle?: boolean;
  activeView?: "front" | "back";
  onToggle?: (view: "front" | "back") => void;
  categoryKey?: string | null;

  /* 🔥 REEL */
  reelUrl?: string | null;
  reelLoading?: boolean;
};

export default function HeroPreviewPanel({
  heroImageUrl,
  backHeroImageUrl,
  loading,
  error,
  showToggle = false,
  activeView = "front",
  onToggle,
  

  /* 🔥 FIX: ADD THESE */
  reelUrl,
  reelLoading,

}: Props) {

  const [reelStarting, setReelStarting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showReady, setShowReady] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);

  /* -----------------------------
     HERO COMPLETION DETECTION
  ----------------------------- */
  useEffect(() => {
    if (heroImageUrl && !loading) {
      const t = setTimeout(() => {
        setShowReady(true);
      }, 300);
      return () => clearTimeout(t);
    } else {
      setShowReady(false);
    }
  }, [heroImageUrl, loading]);

  /* -----------------------------
     CLOSE MENU ON OUTSIDE CLICK
  ----------------------------- */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
  document.addEventListener("click", handleClickOutside);
}

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  /* -----------------------------
     DOWNLOAD HERO
  ----------------------------- */
  const handleDownloadHero = () => {
    if (!heroImageUrl) return;
    window.open(heroImageUrl, "_blank");
  };

  /* -----------------------------
     GENERATE LOOKBOOK
  ----------------------------- */
  const handleGenerateLookbook = () => {
  if (!heroImageUrl) return;

  setMenuOpen(false);

  const url = `/lookbook?hero=${encodeURIComponent(heroImageUrl)}${
    backHeroImageUrl
      ? `&back=${encodeURIComponent(backHeroImageUrl)}`
      : ""
  }`;

  window.open(url, "_blank");
};

  /* -----------------------------
     GENERATE REEL (UI ONLY)
  ----------------------------- */
  const handleGenerateReel = async () => {
  console.log("🔥 Reel CLICKED");

  try {
    console.log("heroImageUrl:", heroImageUrl);

    if (!heroImageUrl) {
      alert("No hero image");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("token:", token);

    if (!token) {
      alert("No token");
      return;
    }

    setReelStarting(true);
    setMenuOpen(false);

    console.log("🚀 Calling API...");

    const res = await fetch(
      `${API_BASE}/api/p2m/reel/generate-v1`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          imageUrl: heroImageUrl,
        }),
      }
    );

    console.log("📡 Response received");

    const data = await res.json();
    console.log("📦 Data:", data);

    if (!res.ok) {
      throw new Error(data?.error || "Reel generation failed");
    }

    const reelUrl = data.reelVideoUrl;

    console.log("🎬 Redirecting...");

    window.location.href = `/reel?video=${encodeURIComponent(reelUrl)}`;

  } catch (err) {
    console.error("❌ Reel error:", err);
    alert("Reel generation failed");
  } finally {
    setReelStarting(false);
  }
};

  /* -----------------------------
     TOGGLE MENU
  ----------------------------- */
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="hero-preview-panel">

      {error && (
        <div className="hero-preview-error">
          {error}
        </div>
      )}

      <div className="hero-stage">

        {showToggle && (
          <div className="hero-toggle">

            <button
              className={
                activeView === "front"
                  ? "toggle-btn active"
                  : "toggle-btn"
              }
              onClick={() => onToggle?.("front")}
            >
              Front
            </button>

            <button
              className={
                activeView === "back"
                  ? "toggle-btn active"
                  : "toggle-btn"
              }
              onClick={() => onToggle?.("back")}
            >
              Back
            </button>

          </div>
        )}

        <div className="hero-card">

          {heroImageUrl && (
            <img
              src={heroImageUrl}
              alt="Hero preview"
              className="hero-preview-image"
            />
          )}

          {!heroImageUrl && !loading && (
            <div className="hero-preview-empty">
              Hero image will appear here
            </div>
          )}

          {loading && (
            <div className="hero-loading-overlay">
              <div className="hero-spinner" />
              <div className="hero-loading-text">
                Generating AI Hero...
              </div>
            </div>
          )}

          {showReady && (
            <div className="hero-ready-text">
              ✨ Your AI Model is Ready
            </div>
          )}

          {heroImageUrl && !loading && (
            <div className="ai-actions-container" ref={menuRef}>

              <button
                className="ai-action-btn"
                onClick={toggleMenu}
              >
                ✨ AI Actions
              </button>

              {menuOpen && (
                <div className="ai-dropdown">

                  <button
  onClick={handleGenerateLookbook}
  disabled={!heroImageUrl}
>
  Generate Lookbook
</button>

                  <button
                    onClick={handleGenerateReel}
                    disabled={reelStarting}
                  >
                    {reelStarting
                      ? "Generating Reel..."
                      : "Generate Reel"}
                  </button>

                  <button disabled>
                    Create Ad Creatives (Soon)
                  </button>

                  <button onClick={handleDownloadHero}>
                    Download Image
                  </button>

                </div>
              )}

            </div>
          )}

          {/* 🔥 REEL OUTPUT */}

          {reelLoading && (
            <div style={{ marginTop: 12 }}>
              Generating Reel...
            </div>
          )}

          {reelUrl && (
            <video
              src={reelUrl}
              controls
              autoPlay
              loop
              style={{
                width: "100%",
                borderRadius: 12,
                marginTop: 12,
              }}
            />
          )}

        </div>

      </div>

    </div>
  );
}