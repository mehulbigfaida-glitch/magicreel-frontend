import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./lookbook.css";
import SharePanel from "../../../components/SharePanel";
import { API_BASE } from "../../../config/api";

type Pose = {
  poseId: string;
  imageUrl?: string;
  crop?: "chest" | "waist" | "fabric";
  loading?: boolean;
};

export default function LookbookPage() {

  const location = useLocation();
  const navigate = useNavigate();

  const heroImageUrl = location.state?.heroImageUrl as string | undefined;
  const backHeroImageUrl = location.state?.backHeroImageUrl as string | undefined;
  const categoryKey = location.state?.categoryKey as string | undefined;

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasGenerated = useRef(false);

/* Redirect if hero missing */

useEffect(() => {
  if (!heroImageUrl) {
    navigate("/create-v2");
  }
}, [heroImageUrl, navigate]);

/* Lock body scroll */

useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

/* Generate Lookbook */

useEffect(() => {

  if (!heroImageUrl) {
    setLoading(false);
    return;
  }

  if (hasGenerated.current) return;
  hasGenerated.current = true;

  /* ---------------- PLACEHOLDERS ---------------- */

  const placeholders: Pose[] = [];

  // HERO (front only)
  placeholders.push({
    poseId: "HERO",
    imageUrl: heroImageUrl,
  });

  // BACK (display only)
  if (backHeroImageUrl) {
    placeholders.push({
      poseId: "BACK",
      imageUrl: backHeroImageUrl,
    });
  }

  // Pose placeholders
  placeholders.push(
    { poseId: "P1", loading: true },
    { poseId: "P2", loading: true },
    { poseId: "P3", loading: true },
    { poseId: "P4", loading: true }
  );

  setPoses(placeholders);
  setSelectedImage(heroImageUrl);

  /* ---------------- GENERATE LOOKBOOK ---------------- */

  const generateLookbook = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login again.");
        setLoading(false);
        return;
      }

      // ✅ ONLY FRONT HERO IS SENT
      const res = await fetch("/api/p2m/lookbook/generate-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          heroImageUrl,   // ✅ ONLY THIS
          categoryKey,
        }),
      });

      if (!res.ok) {
        setError("Lookbook generation failed");
        setLoading(false);
        return;
      }

      const response = await res.json();
      const poseData: Pose[] = response?.poses || [];

      /* ---------------- SAFE MAPPING ---------------- */

      setPoses(prev => {

        const updated = [...prev];

        poseData.forEach((p) => {

          const index = updated.findIndex(
            item => item.poseId === p.poseId
          );

          if (index !== -1) {
            updated[index] = {
              poseId: p.poseId,
              imageUrl: p.imageUrl,
            };
          }

        });

        return updated;

      });

      setLoading(false);

    } catch (err) {

      console.error("Lookbook error:", err);
      setError("Lookbook generation failed");
      setLoading(false);

    }

  };

  generateLookbook();

}, [heroImageUrl, backHeroImageUrl, categoryKey]);

  /* Upload detail frame */

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {

      const image = reader.result as string;

      const newPose: Pose = {
        poseId: "DETAIL",
        imageUrl: image,
      };

      setPoses(prev => [...prev, newPose]);
      setSelectedImage(image);

    };

    reader.readAsDataURL(file);

  };

  /* Export ZIP */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleExport = async () => {

    if (!poses.length) return;

    try {

      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/lookbook/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          images: poses
            .filter(p => p.imageUrl)
            .map(p => p.imageUrl),
        }),
      });

      if (!res.ok) {
        alert("Export failed");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "magicreel-lookbook.zip";
      link.click();

      window.URL.revokeObjectURL(url);

    } catch (err) {

      console.error("Export error:", err);

    }

  };

  /* Generate Reel */

  const handleGenerateReel = async () => {

    try {

      const res = await fetch("/api/reel/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: poses
            .filter(p => p.imageUrl)
            .map(p => p.imageUrl),
        }),
      });

      const data = await res.json();

      if (data?.reelVideoUrl) {
        window.open(data.reelVideoUrl, "_blank");
      }

    } catch (err) {

      console.error("Reel generation failed:", err);

    }

  };

  const detailCount = poses.filter(p => p.poseId === "DETAIL").length;

  return (

    <div className="lookbook-page">

      {/* HEADER */}

      <div className="lookbook-header">

        <div style={{ flex: 1 }} />

        <div className="header-actions">

  <div style={{ width: "240px" }}>
    <SharePanel videoUrl={selectedImage || ""} />
  </div>

  <button className="theme-btn" disabled>
    Cinematic Lookbook (Coming Soon)
  </button>

</div>

      </div>

      {/* MAIN */}

      <div className="lookbook-main">

        {/* HERO COLUMN */}

        <div className="hero-column">

          <div className="hero-frame">

            {selectedImage && (
              <img src={selectedImage} alt="Preview" />
            )}

            <div
              className="reel-overlay"
              onClick={handleGenerateReel}
            >
              ▶ Generate Reel
            </div>

          </div>

        </div>

        {/* THUMBNAILS */}

        <div className="thumbnail-panel">

          <h3 style={{ marginBottom: 14 }}>
            AI Lookbook Shots
          </h3>

          {loading && (
            <div style={{ marginBottom: 12 }}>
              Generating AI Lookbook Shots...
            </div>
          )}

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <div className="thumbnail-grid">

            {poses.map(pose => (

              <div
                key={pose.poseId + (pose.imageUrl || "loading")}
                className={`thumb-card ${
                  selectedImage === pose.imageUrl ? "selected" : ""
                }`}
                onClick={() =>
                  pose.imageUrl &&
                  setSelectedImage(pose.imageUrl)
                }
              >

                {pose.loading ? (
                  <div className="loading-skeleton" />
                ) : (
                  <img src={pose.imageUrl} alt={pose.poseId} />
                )}

                <div className="pose-label">
                  {pose.poseId === "HERO"
                    ? "Hero"
                    : pose.poseId.replaceAll("_", " ")}
                </div>

              </div>

            ))}

            {/* Upload tile (max 3) */}

            {detailCount < 3 && (

              <div
                className="thumb-card upload-card"
                onClick={() => fileInputRef.current?.click()}
              >

                Upload Detail Frame
                <br />
                Fabric • Logo • Stitching
                <br />
                Optional

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageUpload}
                />

              </div>

            )}

          </div>

        </div>

      </div>

    </div>

  );
}