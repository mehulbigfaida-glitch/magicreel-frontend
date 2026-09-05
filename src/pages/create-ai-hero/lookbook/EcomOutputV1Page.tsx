import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE } from "../../../config/api";
import "./ecomOutput.css";

type Pose = {
  poseId: string;
  imageUrl?: string;
};

const POLL_MS = 4000;
const MAX_POLLS = 120;

export default function EcomOutputV1Page() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [aspectRatio, setAspectRatio] = useState("2:3");
  const [shareId, setShareId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [polls, setPolls] = useState(0);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Lookbook run not found");
      return;
    }

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const load = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_BASE}/api/p2m/lookbook-v1/status/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (cancelled) return;

        if (!res.ok) throw new Error(data?.error || "Failed to load Lookbook");

        const nextPoses: Pose[] = (data?.poses || []).map((p: any) => ({
          poseId: String(p.poseId || "").toLowerCase(),
          imageUrl: p.imageUrl || p.resultImageUrl || undefined,
        }));
        setPoses(nextPoses);
        if (nextPoses[0]?.imageUrl) setSelectedImage((current) => current || nextPoses[0].imageUrl!);
        if (data?.aspectRatio) setAspectRatio(String(data.aspectRatio));
        if (data?.shareId) setShareId(String(data.shareId));

        if (data?.status === "completed") {
          setLoading(false);
          return;
        }
        if (data?.status === "failed") {
          setLoading(false);
          setError("Lookbook generation failed");
          return;
        }

        const nextPolls = polls + 1;
        setPolls(nextPolls);
        if (nextPolls >= MAX_POLLS) {
          setLoading(false);
          setError("Lookbook generation timed out. Please try again.");
          return;
        }
        timer = setTimeout(load, POLL_MS);
      } catch (err: any) {
        if (cancelled) return;
        const nextPolls = polls + 1;
        setPolls(nextPolls);
        if (nextPolls >= MAX_POLLS) {
          setLoading(false);
          setError(err?.message || "Unable to retrieve Lookbook results.");
          return;
        }
        timer = setTimeout(load, POLL_MS);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [id, polls]);

  const imagePoses = useMemo(() => poses.filter((p) => p.imageUrl), [poses]);

  const handleExport = async () => {
    if (!imagePoses.length) return;
    setExporting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/p2m/lookbook-v1/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ images: imagePoses.map((p) => p.imageUrl).filter(Boolean) }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "magicreel-lookbook.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Lookbook export error", err);
      alert("Download failed");
    } finally {
      setExporting(false);
    }
  };

  const handleShare = () => {
    if (!shareId) return;
    window.open(`${window.location.origin}/share/${shareId}`, "_blank");
  };

  if (loading) {
    const progress = Math.min(100, Math.round((imagePoses.length / 8) * 100));
    return (
      <div className="ecom-page" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "min(620px, 92vw)", padding: 42, borderRadius: 30, background: "#0b0b0d", color: "white", textAlign: "center", boxShadow: "0 30px 90px rgba(0,0,0,.45)" }}>
          <div style={{ fontSize: 12, letterSpacing: ".28em", opacity: .5 }}>MAGICREEL AI STUDIO</div>
          <h1 style={{ margin: "16px 0 10px", fontSize: "clamp(30px, 6vw, 44px)", fontWeight: 600 }}>Creating Your Lookbook</h1>
          <p style={{ color: "rgba(255,255,255,.68)", lineHeight: 1.6 }}>Creating 2 Hero images + 6 commercial Lookbook poses, including a close-in product detail.</p>
          <div style={{ marginTop: 28, textAlign: "left" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 9, fontSize: 13 }}><span>Assets completed</span><strong>{imagePoses.length} / 8</strong></div>
            <div style={{ height: 8, borderRadius: 99, background: "rgba(255,255,255,.08)", overflow: "hidden" }}><div style={{ width: `${progress}%`, height: "100%", background: "linear-gradient(90deg,#7c3aed,#ec4899)", transition: "width .4s ease" }} /></div>
          </div>
          <p style={{ marginTop: 24, fontSize: 12, color: "rgba(255,255,255,.42)" }}>Please keep this tab open. Images will appear automatically when ready.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="lookbook-page">
      <div className="lookbook-header">
        <div className="header-left">MagicReel Lookbook · {aspectRatio}</div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="reel-btn" onClick={handleShare} disabled={!shareId}>🔗 Share</button>
          <button className="export-btn" onClick={handleExport} disabled={exporting}>{exporting ? "Exporting..." : "Download ZIP"}</button>
        </div>
      </div>

      <div className="lookbook-main">
        <div className="hero-column">
          <div style={{ marginBottom: 12, fontWeight: 600 }}>Lookbook Preview · {aspectRatio}</div>
          <div className="hero-frame">
            {selectedImage && <img src={selectedImage} alt="Lookbook preview" />}
          </div>
        </div>

        <div className="thumbnail-panel">
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
          <div className="lookbook-section-title">{imagePoses.length} Images Generated</div>
          <div className="thumbnail-grid">
            {imagePoses.map((pose, index) => (
              <div key={`${pose.poseId}-${index}`} className={`thumb-card ${selectedImage === pose.imageUrl ? "selected" : ""}`} onClick={() => pose.imageUrl && setSelectedImage(pose.imageUrl)}>
                <img src={pose.imageUrl || ""} alt={pose.poseId} />
                <div className="pose-label">{pose.poseId.replace(/_/g, " ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
