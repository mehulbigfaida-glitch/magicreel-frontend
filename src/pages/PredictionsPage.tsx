import { useEffect, useState } from "react";
import "./Predictions.css";
import { API_BASE } from "../config/api";
import SharePanel from "../components/SharePanel";
import { QRCodeCanvas } from "qrcode.react";

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

  // ================= DOWNLOAD =================
  const handleDownload = (url: string | null) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "magicreel";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= SHARE =================
  const handleShare = async (job: Prediction) => {
    try {
      let media: { url: string }[] = [];

      if (job.type === "hero" && job.mediaUrl) {
        media = [{ url: job.mediaUrl }];
      }

      if (job.type === "lookbook") {
        const images = job.mediaUrls || [];
        media = images
          .filter((url) => typeof url === "string" && url)
          .map((url) => ({ url }));
      }

      if (job.type === "reel" && job.mediaUrl) {
        media = [{ url: job.mediaUrl }];
      }

      if (!media.length) {
        alert("No media found");
        return;
      }

      const res = await fetch(
        "https://magicreel-backend-production.up.railway.app/api/share",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: job.type, media }),
        }
      );

      const json = await res.json();

      if (!json?.asset?.id) {
        throw new Error("Share failed");
      }

      const shareUrl = `https://magicreel-frontend.vercel.app/s/${json.asset.id}`;

      setShareData({ media, shareUrl });

    } catch (err) {
      console.error("Share error:", err);
      alert("Share failed");
    }
  };

  // ================= FETCH =================
  const loadPredictions = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/predictions`, {
  cache: "no-store",
});

    const data = await res.json();

    const jobsData: Prediction[] = (data || []).map((job: any) => {
  let type: "hero" | "lookbook" | "reel" = "hero";
  let mediaUrl: string | null = null;
  let mediaUrls: string[] = [];

  // ✅ DETECT TYPE CORRECTLY
  if (job.lookbook && job.lookbook.length > 0) {
    type = "lookbook";
  } else if (job.reelUrl) {
    type = "reel";
  } else {
    type = "hero";
  }

  // ✅ MAP MEDIA CORRECTLY
  if (type === "hero") {
    mediaUrl = job.outputImageUrl || job.heroImageUrl || null;
  }

  if (type === "reel") {
    mediaUrl = job.reelUrl || null;
  }

  if (type === "lookbook") {
    if (job.lookbook) {
  try {
    const parsed =
      typeof job.lookbook === "string"
        ? JSON.parse(job.lookbook)
        : job.lookbook;

    mediaUrls = Array.isArray(parsed) ? parsed : [];
  } catch {
    mediaUrls = [];
  }
}
  }

  return {
    id: job.id,
    type,
    status: job.status ?? "completed",
    createdAt: job.createdAt,

    mediaUrl,
    mediaUrls,

    creditsUsed:
      type === "lookbook" ? 2 :
      type === "reel" ? 3 : 1,
  };
});

    setJobs(jobsData);

    const hasRunningJobs = jobsData.some((job) => {
      const status = (job.status || "").toLowerCase().trim();

      return (
        status === "running" ||
        status === "processing" ||
        status === "pending" ||
        status === "queued"
      );
    });

    return hasRunningJobs;
  } catch (err) {
    console.error("Fetch error:", err);
    return false;
  } finally {
    setLoading(false);
  }
};

  // ================= POLLING =================
  useEffect(() => {
    let interval: any = null;
    const startTime = Date.now();
    const MAX_TIME = 30000;

    const startPolling = async () => {
      const hasRunning = await loadPredictions();

      if (hasRunning) {
        interval = setInterval(async () => {
          const stillRunning = await loadPredictions();
          const elapsed = Date.now() - startTime;

          if (!stillRunning || elapsed > MAX_TIME) {
            clearInterval(interval);
          }
        }, 4000);
      }
    };

    startPolling();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  // ================= UI =================
  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const status = (job.status || "").toLowerCase();

          const mainUrl =
            job.type === "hero"
              ? job.mediaUrl
              : job.type === "lookbook"
              ? job.mediaUrls?.[0]
              : job.mediaUrl;

          return (
            <div className="prediction-card" key={job.id}>
              <div className="prediction-image">

                {status === "failed" && (
                  <div className="prediction-placeholder">❌ Failed</div>
                )}

                {status !== "failed" && job.type === "hero" && (
                  job.mediaUrl ? (
                    <img src={job.mediaUrl} />
                  ) : (
                    <div className="prediction-placeholder">No Image</div>
                  )
                )}

                {status !== "failed" && job.type === "reel" && (
                  job.mediaUrl ? (
                    <video src={job.mediaUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}

                {status !== "failed" && job.type === "lookbook" && (
                  job.mediaUrls?.length ? (
                    <img src={job.mediaUrls[0]} />
                  ) : (
                    <div className="prediction-placeholder">Preparing...</div>
                  )
                )}
              </div>

              <div className="prediction-actions">
                <button onClick={() => handleShare(job)}>📤 Share</button>
                <button onClick={() => handleDownload(mainUrl || null)}>
                  ⬇️ Download
                </button>
                <button>🔍 View</button>
              </div>

              <div className="prediction-meta">
                <span>
                  {new Date(job.createdAt).toLocaleDateString()} • {job.creditsUsed} credit
                </span>

                <span className={`status ${status}`}>
                  {status === "completed"
                    ? "✅ Ready"
                    : ["running", "processing", "pending", "queued"].includes(status)
                    ? "⏳ Processing"
                    : "❌ Failed"}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* SHARE MODAL */}
      {shareData && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.9)",
          zIndex: 9999,
          overflowY: "auto",
          padding: 20,
        }}>
          <button
            onClick={() => setShareData(null)}
            style={{ position: "fixed", top: 20, right: 20 }}
          >
            ✕
          </button>

          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <QRCodeCanvas value={shareData.shareUrl} size={160} />
            <p style={{ color: "#aaa" }}>{shareData.shareUrl}</p>
          </div>

          <SharePanel data={shareData} />
        </div>
      )}
    </div>
  );
}