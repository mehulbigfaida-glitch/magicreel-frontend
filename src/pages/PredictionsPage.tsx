import { useEffect, useState } from "react";
import "./Predictions.css";
import SharePanel from "../components/SharePanel";

type Prediction = {
  id: string;
  type: "hero" | "lookbook" | "reel";
  status: string;
  createdAt: string;
  mediaUrl?: string | null;
  mediaUrls?: string[];
  creditsUsed?: number;
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<any>(null);

  const API_BASE = "https://magicreel-backend-production.up.railway.app";

  // ================= FETCH =================
const loadPredictions = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/predictions`, {
      credentials: "include",
    });

    const data = await res.json();

    const mapped: Prediction[] = (data || []).map((job: any) => ({
      id: job.id,
      type: job.type,
      status: job.status ?? "completed",
      createdAt: job.createdAt,
      mediaUrl: job.mediaUrl ?? null,
      mediaUrls: job.mediaUrls ?? [],
      creditsUsed: job.creditsUsed ?? 1,
    }));

    setJobs(mapped);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  loadPredictions();
}, []);

  // ================= SHARE =================
  const handleShare = async (job: Prediction) => {
    try {
      let media: { url: string }[] = [];

      if ((job.type === "hero" || job.type === "reel") && job.mediaUrl) {
        media = [{ url: job.mediaUrl }];
      }

      if (job.type === "lookbook") {
        media = (job.mediaUrls || [])
          .filter((u) => u)
          .map((u) => ({ url: u }));
      }

      if (!media.length) {
        alert("No images to share");
        return;
      }

      console.log("🚀 FINAL SHARE MEDIA:", media);

      const res = await fetch(`${API_BASE}/api/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: job.type,
          media,
        }),
      });

      const json = await res.json();
      const shareId = json?.asset?.id;

      if (!shareId) throw new Error("Share failed");

      setShareData({
        media,
        shareUrl: `${window.location.origin}/s/${shareId}`,
      });

    } catch (err) {
      console.error("Share error:", err);
      alert("Share failed");
    }
  };

  // ================= DOWNLOAD =================
  const handleDownload = (url: string | null) => {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "magicreel";
    a.click();
  };

  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const preview =
            job.type === "lookbook"
              ? job.mediaUrls?.[0] || job.mediaUrl
              : job.mediaUrl;

          const status = job.status?.toLowerCase();

          return (
            <div className="prediction-card" key={job.id}>
              
              {/* IMAGE */}
              <div className="prediction-image">
                {status === "failed" ? (
                  <div className="prediction-placeholder">❌ Failed</div>
                ) : preview ? (
                  job.type === "reel" ? (
                    <video src={preview} controls />
                  ) : (
                    <img src={preview} alt="preview" />
                  )
                ) : (
                  <div className="prediction-placeholder">⏳ Processing...</div>
                )}
              </div>

              {/* ACTIONS */}
              <div className="prediction-actions">
                <button onClick={() => handleShare(job)}>📤 Share</button>

                <button onClick={() => handleDownload(preview || null)}>
                  ⬇️ Download
                </button>

                <button>🔍 View</button>
              </div>

              {/* META */}
              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()} •{" "}
                  {job.creditsUsed} credit
                </span>

                <span className={`status ${status}`}>
                  {status === "completed"
                    ? "✅ Ready"
                    : ["running", "processing", "pending"].includes(status)
                    ? "⏳ Processing"
                    : "❌ Failed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SHARE MODAL ================= */}
      {shareData && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            overflowY: "auto",
            padding: 20,
          }}
        >
          <button
            onClick={() => setShareData(null)}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              background: "#000",
              color: "#fff",
              padding: 10,
              borderRadius: 6,
            }}
          >
            ✕ Close
          </button>

          {/* PREVIEW */}
          <div style={{ maxWidth: 600, margin: "40px auto" }}>
            <SharePanel data={{ asset: { media: shareData.media } }} />
          </div>
        </div>
      )}
    </div>
  );
}