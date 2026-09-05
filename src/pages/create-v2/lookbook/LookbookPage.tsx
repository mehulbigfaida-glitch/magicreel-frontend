import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "./lookbook.css";
import { API_BASE } from "../../../config/api";

type Pose = { poseId: string; imageUrl?: string };
type AspectRatio = "2:3" | "3:4" | "4:5" | "1:1";

const ASPECT_RATIOS: AspectRatio[] = ["2:3", "3:4", "4:5", "1:1"];
const POLL_MS = 4000;
const MAX_POLLS = 120;

export default function LookbookPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const state = (location.state || {}) as Record<string, any>;

  const heroImageUrl = state.heroImageUrl || params.get("hero") || undefined;
  const backHeroImageUrl = state.backHeroImageUrl || params.get("back") || undefined;
  const category = state.category || state.subType || params.get("category") || "shirt";
  const gender = state.gender || state.avatarGender || params.get("gender") || "unisex";
  const world = state.lookbookWorld || state.worldId || params.get("world") || "ecom-clean";

  const initialRatio = params.get("ar") as AspectRatio | null;
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(
    initialRatio && ASPECT_RATIOS.includes(initialRatio) ? initialRatio : "2:3"
  );
  const [runId, setRunId] = useState<string | null>(params.get("runId"));
  const [shareId, setShareId] = useState<string | null>(null);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(heroImageUrl || null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("Ready to create your Lookbook");
  const [error, setError] = useState<string | null>(null);

  const fetchLookbook = async (id: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}/api/p2m/lookbook-v1/status/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Unable to fetch Lookbook status");
    return res.json();
  };

  useEffect(() => {
    if (!runId) return;
    let cancelled = false;
    let polls = 0;

    const poll = async () => {
      if (cancelled) return;
      try {
        const data = await fetchLookbook(runId);
        if (cancelled) return;

        const nextPoses: Pose[] = (data?.poses || []).map((p: any) => ({
          poseId: String(p.poseId || "").toLowerCase(),
          imageUrl: p.imageUrl || p.resultImageUrl || undefined,
        }));
        if (nextPoses.length) {
          setPoses(nextPoses);
          setSelectedImage((current) => current || nextPoses[0]?.imageUrl || null);
        }
        if (data?.shareId) setShareId(data.shareId);
        if (data?.aspectRatio && ASPECT_RATIOS.includes(data.aspectRatio)) {
          setAspectRatio(data.aspectRatio);
        }

        if (data?.status === "completed") {
          setLoading(false);
          setStatus(`Lookbook ready — ${nextPoses.length} images`);
          return;
        }
        if (data?.status === "failed") {
          setLoading(false);
          setError("Lookbook generation failed");
          return;
        }

        polls += 1;
        if (polls >= MAX_POLLS) {
          setLoading(false);
          setError("Lookbook generation timed out. Please try again.");
          return;
        }
        window.setTimeout(poll, POLL_MS);
      } catch (err) {
        if (!cancelled) {
          console.error("Lookbook polling error:", err);
          polls += 1;
          if (polls < MAX_POLLS) window.setTimeout(poll, POLL_MS);
          else {
            setLoading(false);
            setError("Unable to retrieve Lookbook results.");
          }
        }
      }
    };

    setLoading(true);
    setStatus("Creating your Lookbook...");
    poll();
    return () => { cancelled = true; };
  }, [runId]);

  const handleStartGeneration = async () => {
    setError(null);
    setPoses([]);
    setShareId(null);
    setSelectedImage(heroImageUrl || null);
    setLoading(true);
    setStatus("Starting Lookbook generation...");

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login again");
      if (!heroImageUrl) throw new Error("Missing hero image");

      const res = await fetch(`${API_BASE}/api/p2m/lookbook-v1/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ heroImageUrl, backHeroImageUrl, lookbookWorld: world, gender, category, aspectRatio }),
      });
      const data = await res.json();
      if (res.status === 403) { window.location.href = "/plans"; return; }
      if (!res.ok) throw new Error(data?.error || "Lookbook generation failed");
      setRunId(data.runId);
      window.history.replaceState(null, "", `${window.location.pathname}?${new URLSearchParams({
        hero: heroImageUrl,
        ...(backHeroImageUrl ? { back: backHeroImageUrl } : {}),
        category,
        gender,
        world,
        ar: aspectRatio,
        runId: data.runId,
      }).toString()}`);
      window.dispatchEvent(new Event("creditsUpdated"));
    } catch (err: any) {
      console.error("Lookbook generation error:", err);
      setLoading(false);
      setError(err?.message || "Lookbook generation failed");
    }
  };

  const handleExport = async () => {
    if (!poses.length) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE}/api/p2m/lookbook-v1/export`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ images: poses.map((p) => p.imageUrl).filter(Boolean) }),
      });
      if (!res.ok) throw new Error("Export failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "magicreel-lookbook.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Download failed");
    }
  };

  const handleShare = () => {
    if (!shareId) return;
    const shareUrl = `${window.location.origin}/share/${shareId}`;
    window.open(shareUrl, "_blank");
  };

  if (!runId && !loading && !poses.length) {
    return (
      <div className="lookbook-entry">
        {heroImageUrl && <img src={heroImageUrl} className="lookbook-preview" />}
        <h2>✨ Ready to create your Lookbook</h2>
        <div style={{ width: "min(520px, 90vw)" }}>
          <div style={{ fontWeight: 600, marginBottom: 10 }}>Aspect Ratio</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
            {ASPECT_RATIOS.map((ratio) => (
              <button key={ratio} type="button" onClick={() => setAspectRatio(ratio)} style={{ padding: "10px 8px", borderRadius: 10, border: aspectRatio === ratio ? "2px solid #111" : "1px solid #d0d5dd", background: aspectRatio === ratio ? "#111" : "#fff", color: aspectRatio === ratio ? "#fff" : "#111", fontWeight: 600, cursor: "pointer" }}>
                {ratio}
              </button>
            ))}
          </div>
        </div>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button disabled={loading} onClick={handleStartGeneration}>{loading ? "Generating..." : "Generate Lookbook"}</button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="lookbook-loading-full">
        <div className="loader-spinner" />
        <p>✨ {status}</p>
        {poses.length > 0 && <p>{poses.length} images completed so far</p>}
      </div>
    );
  }

  return (
    <div className="lookbook-page">
      <div className="lookbook-header">
        <div className="header-left">MagicReel Lookbook</div>
        <div className="header-right"><button className="export-btn" onClick={handleExport}>Download Lookbook</button></div>
      </div>
      <div className="lookbook-main">
        <div className="hero-column">
          <div style={{ marginBottom: 12, fontWeight: 600 }}>Main Preview · {aspectRatio}</div>
          <div className="hero-frame">{selectedImage && <img src={selectedImage} alt="Lookbook preview" />}</div>
          <div className="hero-actions"><button className="reel-btn" onClick={handleShare} disabled={!shareId}>🔗 Share Lookbook</button></div>
        </div>
        <div className="thumbnail-panel">
          {error && <div style={{ color: "red", marginBottom: 12 }}>{error}</div>}
          <div className="lookbook-section-title">{status}</div>
          <div className="thumbnail-grid">
            {poses.map((pose, index) => (
              <div key={`${pose.poseId}-${index}-${pose.imageUrl || ""}`} className={`thumb-card ${selectedImage === pose.imageUrl ? "selected" : ""}`} onClick={() => pose.imageUrl && setSelectedImage(pose.imageUrl)}>
                <img src={pose.imageUrl || ""} alt={pose.poseId} />
                <div className="pose-label">{pose.poseId.replace("_", " ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
