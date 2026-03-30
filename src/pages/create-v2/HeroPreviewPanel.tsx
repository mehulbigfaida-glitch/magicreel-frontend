import "./HeroPreviewPanel.css";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { API_BASE } from "../../config/api"; // ✅ ADDED

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
};

export default function HeroPreviewPanel({
  heroImageUrl,
  backHeroImageUrl,
  loading,
  error,
  avatarFaceImageUrl,
  garmentFrontImageUrl,
  showToggle = false,
  activeView = "front",
  onToggle,
  categoryKey,
}: Props) {

  const navigate = useNavigate();

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
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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

    navigate("/lookbook", {
      state: {
        heroImageUrl,
        backHeroImageUrl,
        avatarFaceImageUrl,
        garmentFrontImageUrl,
        categoryKey,
      },
    });
  };

  /* -----------------------------
     GENERATE REEL (✅ FIXED)
  ----------------------------- */
  const handleGenerateReel = async () => {
  if (!heroImageUrl || reelStarting) return;

  try {
    setMenuOpen(false);
    setReelStarting(true);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again");
      setReelStarting(false);
      return;
    }

    const jobId = crypto.randomUUID(); // ✅ UNIQUE JOB ID

    const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        jobId,
        heroPreviewUrl: heroImageUrl,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Reel generation failed");
    }

    // 🚀 NAVIGATE TO REEL VIEWER (KEY CHANGE)
    navigate("/reel", {
      state: {
        jobId,
        heroPreviewUrl: heroImageUrl,
      },
    });

  } catch (err) {
    console.error("Hero reel error:", err);
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

          {/* ✨ READY TEXT */}
          {showReady && (
            <div className="hero-ready-text">
              ✨ Your AI Model is Ready
            </div>
          )}

          {/* 🔥 AI ACTION BUTTON */}
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

                  <button onClick={handleGenerateLookbook}>
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

        </div>

      </div>

    </div>
  );
}