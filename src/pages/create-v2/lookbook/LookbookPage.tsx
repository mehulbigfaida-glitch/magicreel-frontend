import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "./lookbook.css";

import { API_BASE } from "../../../config/api";

type Pose = {
  poseId: string;
  imageUrl?: string;
  loading?: boolean;
};

const DEV_MODE = false; // 🔥 set false in production

export default function LookbookPage() {
  const location = useLocation();
  [{
	"resource": "/d:/magicreel-root/magicreel-tryon-frontend/src/pages/create-v2/lookbook/LookbookPage.tsx",
	"owner": "typescript",
	"code": "6133",
	"severity": 4,
	"message": "'navigate' is declared but its value is never read.",
	"source": "ts",
	"startLineNumber": 17,
	"startColumn": 9,
	"endLineNumber": 17,
	"endColumn": 17,
	"modelVersionId": 59,
	"tags": [
		1
	],
	"origin": "extHost1"
}]

  const heroImageUrl = location.state?.heroImageUrl as string | undefined;
  const backHeroImageUrl = location.state?.backHeroImageUrl as string | undefined;

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const hasGenerated = useRef(false);

    /* Lock body scroll */
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

  /* ================= DEV MODE ================= */
  if (DEV_MODE) {
    const mockImage =
      "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?w=800";

    const finalImage = heroImageUrl || mockImage;

    const mockPoses: Pose[] = [
      { poseId: "HERO", imageUrl: finalImage },
      { poseId: "P1", imageUrl: finalImage },
      { poseId: "P2", imageUrl: finalImage },
      { poseId: "P3", imageUrl: finalImage },
      { poseId: "P4", imageUrl: finalImage },
    ];

    const ordered = ["HERO", "P1", "P2", "P3", "P4"];

const sortedPoses = ordered
  .map(id => mockPoses.find(p => p.poseId === id))
  .filter(Boolean);

setPoses(sortedPoses as Pose[]);
    const heroPose = mockPoses.find(p => p.poseId === "HERO");
setSelectedImage(heroPose?.imageUrl || finalImage);
    setLoading(false);

    return;
  }

  /* ================= API ================= */
const generateLookbook = async () => {
  try {
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Authentication required. Please login again.");
      setLoading(false);
      return;
    }

    if (!heroImageUrl) {
      setError("Missing hero image.");
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
    const poseData: Pose[] = data?.poses || [];

    if (!poseData.length) {
      setError("No poses generated");
      setLoading(false);
      return;
    }

    // 🔥 Ensure HERO is selected first
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

      setPoses((prev) => [...prev, newPose]);
      setSelectedImage(image);
    };

    reader.readAsDataURL(file);
  };

  /* Create Reel */
  const handleGenerateReel = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          images: poses
            .filter((p) => p.imageUrl)
            .map((p) => p.imageUrl),
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

  const detailCount = poses.filter((p) => p.poseId === "DETAIL").length;

const handleExport = async () => {
  if (!poses.length) return;

  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/p2m/lookbook/export`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        images: poses
          .filter((p) => p.imageUrl)
          .map((p) => p.imageUrl),
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

    {/* MAIN */}
    <div className="lookbook-main">
      {/* HERO */}
      <div className="hero-column">
        <div style={{ marginBottom: 12, fontWeight: 600 }}>
          Main Preview
        </div>

        <div className="hero-frame">
          {selectedImage && (
            <img src={selectedImage} alt="Preview" />
          )}
        </div>

        {/* 🔥 FIXED REEL BUTTON */}
        <div className="hero-actions">
          <button className="reel-btn" onClick={handleGenerateReel}>
            ▶ Create Reel
          </button>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="thumbnail-panel">
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 20, fontWeight: 600 }}>
            Lookbook Shots
          </div>
          <div style={{ fontSize: 13, color: "#666" }}>
            Generated poses + detail frames
          </div>
        </div>

        {loading && <div>Generating...</div>}
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
              {pose.loading ? (
                <div className="loading-skeleton" />
              ) : (
                <img src={pose.imageUrl || ""} alt={pose.poseId} />
              )}

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
  Show fabric, logo or stitching
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