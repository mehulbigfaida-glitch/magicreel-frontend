import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./lookbook.css";

import { API_BASE } from "../../../config/api";

type Pose = {
  poseId: string;
  imageUrl?: string;
  loading?: boolean;
};

const DEV_MODE = false;

export default function LookbookPage() {
  const location = useLocation();

  const heroImageUrl = location.state?.heroImageUrl as string | undefined;
  const backHeroImageUrl = location.state?.backHeroImageUrl as string | undefined;

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasGenerated = useRef(false);

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  /* Generate Lookbook */
  useEffect(() => {
    if (hasGenerated.current) return;
    hasGenerated.current = true;

    if (DEV_MODE) return;

    const generateLookbook = async () => {
      try {
        setLoading(true);

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login again");
          setLoading(false);
          return;
        }

        if (!heroImageUrl) {
          setError("Missing hero image");
          setLoading(false);
          return;
        }

        const res = await fetch(`${API_BASE}/api/p2m/lookbook/generate-v2`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            heroImageUrl,
            backHeroImageUrl,
          }),
        });

        if (!res.ok) {
          setError("Lookbook generation failed");
          setLoading(false);
          return;
        }

        const data = await res.json();
        let poseData: Pose[] = data?.poses || [];

        if (!poseData.length) {
          setError("No poses generated");
          setLoading(false);
          return;
        }

        // 🔥 ORDER FIX (HERO → BACK → others)
        const order = ["HERO", "BACK", "P1", "P2", "P3", "P4"];

        const sorted = order
          .map(id => poseData.find(p => p.poseId === id))
          .filter((p): p is Pose => Boolean(p));

        const remaining = poseData.filter(
          p => !order.includes(p.poseId)
        );

        poseData = [...sorted, ...remaining];

        const heroPose = poseData.find(p => p.poseId === "HERO");

        setPoses(poseData);
        setSelectedImage(heroPose?.imageUrl || poseData[0].imageUrl || null);

        setLoading(false);
      } catch (err) {
        console.error("Lookbook error:", err);
        setError("Lookbook generation failed");
        setLoading(false);
      }
    };

    generateLookbook();
  }, [heroImageUrl, backHeroImageUrl]);

  /* Upload detail */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result as string;

      setPoses(prev => [
        ...prev,
        { poseId: "DETAIL", imageUrl: image },
      ]);

      setSelectedImage(image);
    };

    reader.readAsDataURL(file);
  };

  /* Export ZIP */
const resizeImage = (base64: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");

      const targetWidth = 1080;
      const targetHeight = 1920;

      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext("2d");

      const ratio = Math.max(
        targetWidth / img.width,
        targetHeight / img.height
      );

      const newWidth = img.width * ratio;
      const newHeight = img.height * ratio;

      const x = (targetWidth - newWidth) / 2;
      const y = (targetHeight - newHeight) / 2;

      ctx?.drawImage(img, x, y, newWidth, newHeight);

      resolve(canvas.toDataURL("image/jpeg", 0.9));
    };
  });
};

const handleExport = async () => {
  if (!poses.length) return;

  try {
    const token = localStorage.getItem("token");

    // ✅ Normalize ONLY uploaded images
    const processedImages = await Promise.all(
      poses
        .filter(p => p.imageUrl)
        .map(async (p) => {
          if (p.poseId === "DETAIL" && p.imageUrl?.startsWith("data:")) {
            return await resizeImage(p.imageUrl);
          }
          return p.imageUrl;
        })
    );

    const res = await fetch(`${API_BASE}/api/p2m/lookbook/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        images: processedImages,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Export failed:", text);
      alert("Export failed");
      return;
    }

    const blob = await res.blob();

    if (!blob || blob.size === 0) {
      alert("Empty file received");
      return;
    }

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "magicreel-lookbook.zip";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error("Export error:", err);
    alert("Download failed");
  }
};

  /* ✅ REEL GENERATION (ADDED ONLY THIS) */
  const handleGenerateReel = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
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

      const data = await res.json();

      if (data?.reelVideoUrl) {
        window.open(data.reelVideoUrl, "_blank");
      } else {
        alert("Reel generation failed");
      }

    } catch (err) {
      console.error("Reel error:", err);
      alert("Reel generation failed");
    }
  };

  const detailCount = poses.filter(p => p.poseId === "DETAIL").length;

  return (
    <div className="lookbook-page">
      {/* HEADER */}
      <div className="lookbook-header">
        <div className="header-left">
          MagicReel Lookbook
        </div>

        <div className="header-right">
          <button className="export-btn" onClick={handleExport}>
            Download Lookbook
          </button>
        </div>
      </div>

      <div className="lookbook-main">
        {/* HERO */}
        <div className="hero-column">
          <div style={{ marginBottom: 12, fontWeight: 600 }}>
            Main Preview
          </div>

          <div className="hero-frame">
            {loading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <div className="loading-title">
                  Creating your lookbook
                </div>
                <div className="loading-steps">
                  <div>• Generating poses</div>
                  <div>• Styling compositions</div>
                  <div>• Finalizing images</div>
                </div>
                <div className="loading-subtext">
                  This may take up to 2–3 minutes
                </div>
              </div>
            ) : (
              selectedImage && <img src={selectedImage} alt="Preview" />
            )}
          </div>

          {/* ✅ REEL BUTTON (ADDED ONLY THIS) */}
          <div className="hero-actions">
            <button className="reel-btn" onClick={handleGenerateReel}>
              ▶ Create Reel
            </button>
          </div>
        </div>

        {/* GRID */}
        <div className="thumbnail-panel">
          <div style={{ marginBottom: 18 }}>
            <div style={{ fontSize: 20, fontWeight: 600 }}>
              Lookbook Shots
            </div>
            <div style={{ fontSize: 13, color: "#666" }}>
              Generated poses + detail frames
            </div>
          </div>

          {error && <div>{error}</div>}

          <div className="thumbnail-grid">
            {poses.map((pose) => (
              <div
                key={pose.poseId + (pose.imageUrl || "")}
                className={`thumb-card ${
                  selectedImage === pose.imageUrl ? "selected" : ""
                }`}
                onClick={() => {
                  if (!pose.imageUrl) return;
                  setSelectedImage(pose.imageUrl);
                }}
              >
                <img src={pose.imageUrl || ""} alt={pose.poseId} />
                <div className="pose-label">{pose.poseId}</div>
              </div>
            ))}

            {detailCount < 3 && (
              <div
                className="thumb-card upload-card"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="upload-title">Add Close-Up Shot</div>
                <div className="upload-subtext">
                  Fabric, logo or stitching
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
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