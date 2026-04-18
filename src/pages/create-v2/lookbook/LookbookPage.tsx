// ✅ NEW IMPORT
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

  const [shareId, setShareId] = useState<string | null>(null);

  const params = new URLSearchParams(location.search);

    // 🔥 STEP 1: runId STATE (SOURCE OF TRUTH)
  const [runId, setRunId] = useState<string | null>(
    params.get("runId") || null
  );

  const heroImageUrl =
    location.state?.heroImageUrl ||
    params.get("hero") ||
    undefined;

  const backHeroImageUrl =
    location.state?.backHeroImageUrl ||
    params.get("back") ||
    undefined;

  const [poses, setPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hasStarted, setHasStarted] = useState(false);

  // 🔥 STEP 2: DEBUG (optional but useful)
  // 🔥 DEBUG
useEffect(() => {
  if (runId) {
    console.log("✅ Lookbook runId:", runId);
  }
}, [runId]);

// 🔥 FETCH EXISTING LOOKBOOK (ADD THIS BLOCK)
useEffect(() => {
  if (!runId) return;

  const fetchLookbook = async () => {
    try {
      const res = await fetch(
        `${API_BASE}/api/p2m/lookbook/${runId}`
      );

      const data = await res.json();

// 🔥 STORE runId (existing)
if (data.runId) {
  setRunId(data.runId);
  console.log("✅ runId stored:", data.runId);
}

// 🔥 STORE shareId (NEW)
if (data.shareId) {
  setShareId(data.shareId);
  console.log("✅ shareId stored:", data.shareId);
}

      if (data?.poses?.length) {
  // ✅ NORMALIZE poseId (CRITICAL FIX)
  const normalized = data.poses.map((p: any) => ({
    ...p,
    poseId: (p.poseId || "").toUpperCase(),
  }));

  setPoses(normalized);

  const heroPose = normalized.find(
    (p: any) => p.poseId === "HERO"
  );

  setSelectedImage(
    heroPose?.imageUrl || normalized[0].imageUrl
  );

  setHasStarted(true);
}
    } catch (err) {
      console.error("Failed to fetch lookbook:", err);
    }
  };

  fetchLookbook();
}, [runId]);

  // 🔥 SHARE STATE
  

  /* Lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

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

  /* Resize helper */
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

  /* Export ZIP */
  const handleExport = async () => {
    if (!poses.length) return;

    try {
      const token = localStorage.getItem("token");

      const processedImages = await Promise.all(
        poses.map(async (p) => {
          const poseAny = p as any;

          const img =
            poseAny.resultImageUrl ||
            poseAny.imageUrl || null;

          if (!img) return null;

          if (poseAny.poseId === "DETAIL" && img.startsWith("data:")) {
            return await resizeImage(img);
          }

          return img;
        })
      );

      const finalImages = processedImages.filter(Boolean);

      const res = await fetch(`${API_BASE}/api/p2m/lookbook/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          images: finalImages,
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
      alert("Download failed");
    }
  };

  const handleStartGeneration = async () => {
  try {
    if (DEV_MODE) return;

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

    // ✅ ONLY ONE PARSE
    const data = await res.json();

    // 🔥 STORE runId FOR SHARE
    if (data.runId) {
      setRunId(data.runId);
      console.log("✅ runId stored:", data.runId);
    }

    if (!res.ok) {
      setError("Lookbook generation failed");
      setLoading(false);
      return;
    }

    window.dispatchEvent(new Event("creditsUpdated"));

    let poseData: Pose[] = data?.poses || [];

// ❌ No data guard
if (!poseData.length) {
  setError("No poses generated");
  setLoading(false);
  return;
}

// ✅ STEP 1: Normalize poseId (CRITICAL FIX)
poseData = poseData.map((p) => ({
  ...p,
  poseId: (p.poseId || "").toLowerCase(),
}));

// ✅ STEP 2: Define correct order (lowercase)
const order = [
  "hero",
  "back",
  "front",
  "walking",
  "angle",
  "dynamic",
  "cropped",
];

// ✅ STEP 3: Sort poses
poseData.sort((a, b) => {
  const indexA = order.indexOf(a.poseId);
  const indexB = order.indexOf(b.poseId);

  return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
});

// ✅ STEP 4: Ensure hero is selected
const heroPose = poseData.find((p) => p.poseId === "hero");

// ✅ STEP 5: Apply state
setPoses(poseData);
setSelectedImage(
  heroPose?.imageUrl || poseData[0]?.imageUrl || null
);

setLoading(false);

  } catch (err) {
    console.error("Lookbook error:", err);
    setError("Lookbook generation failed");
    setLoading(false);
  }
};

  // 🔥 NEW SHARE HANDLER
  const handleShareLookbook = () => {
  if (!shareId) {
    alert("Share not ready yet. Please generate lookbook again.");
    return;
  }

  window.open(`/s/${shareId}`, "_blank");
};

  const detailCount = poses.filter(p => p.poseId === "DETAIL").length;

  if (!hasStarted) {
    return (
      <div className="lookbook-entry">
        {heroImageUrl && (
          <img
            src={heroImageUrl}
            className="lookbook-preview"
          />
        )}

        <h2>✨ Ready to create your Lookbook</h2>

        <button
          disabled={loading}
          onClick={() => {
            setHasStarted(true);
            handleStartGeneration();
          }}
        >
          {loading ? "Generating..." : "Generate Lookbook"}
        </button>
      </div>
    );
  }

  if (loading && hasStarted) {
    return (
      <div className="lookbook-loading-full">
        <div className="loader-spinner" />
        <p>✨ Creating your Lookbook...</p>
      </div>
    );
  }

  return (
    <div className="lookbook-page">
      <div className="lookbook-header">
        <div className="header-left">MagicReel Lookbook</div>
        <div className="header-right">
          <button className="export-btn" onClick={handleExport}>
            Download Lookbook
          </button>
        </div>
      </div>

      <div className="lookbook-main">
        <div className="hero-column">
          <div style={{ marginBottom: 12, fontWeight: 600 }}>
            Main Preview
          </div>

          <div className="hero-frame">
            {selectedImage && <img src={selectedImage} />}
          </div>

          {/* 🔥 REPLACED BUTTON */}
          <div className="hero-actions">
            <button className="reel-btn" onClick={handleShareLookbook}>
              🔗 Share Lookbook
            </button>
          </div>
        </div>

        <div className="thumbnail-panel">

          {error && (
            <div style={{ color: "red", marginBottom: 12 }}>
              {error}
            </div>
          )}

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
                <img src={pose.imageUrl || ""} />
                <div className="pose-label">{pose.poseId}</div>
              </div>
            ))}

            {detailCount < 3 && (
              <div
                className="thumb-card upload-card"
                onClick={() => fileInputRef.current?.click()}
              >
                Add Close-Up Shot
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