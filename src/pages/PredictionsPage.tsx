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
  

  // DOWNLOAD
  const handleDownload = (url: string | null) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = "magicreel";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // SHARE
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

      console.log("🚀 FINAL SHARE MEDIA:", media);

      if (!media.length) {
        alert("No images found for sharing");
        return;
      }

      const res = await fetch(
        "https://magicreel-backend-production.up.railway.app/api/share",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: job.type,
            media,
          }),
        }
      );

      const json = await res.json();

      if (!json?.asset?.id) {
        throw new Error("Share creation failed");
      }

      const shareUrl = `https://magicreel-frontend.vercel.app/s/${json.asset.id}`;

      // ✅ FIXED
      setShareData({
        media,
        shareUrl,
      });

    } catch (err) {
      console.error("❌ SHARE ERROR:", err);
      alert("Failed to create share");
    }
  };

  // FETCH
  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`, {
  cache: "no-store",
}).catch((err) => {
  console.warn("⚠️ Ignoring fetch error:", err);
  return null;
});

if (!res) return false;
      const data = await res.json();

      // ✅ FIXED MAPPING
      const jobsData: Prediction[] = (data || []).map((job: any) => ({
  id: job.id,
  type: job.type,
  status: job.status ?? "completed",
  createdAt: job.createdAt,

  // ✅ BACK TO WORKING STRUCTURE
  mediaUrl:
    job.type === "hero"
      ? job.heroImageUrl
      : job.type === "reel"
      ? job.reelUrl
      : null,

  mediaUrls:
    job.type === "lookbook"
      ? job.lookbookImages || []
      : [],

  creditsUsed: job.creditsUsed ?? 1,
}));

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

console.log("🧠 POLLING CHECK:", jobsData.map(j => j.status));

return hasRunningJobs;

    } catch (err) {
      console.error("Predictions fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  let interval: ReturnType<typeof setInterval> | null = null;

  const MAX_POLL_TIME = 30000; // 30 seconds
  const startTime = Date.now();

  const startPolling = async () => {
    const hasRunningJobs = await loadPredictions();

    if (hasRunningJobs) {
      interval = setInterval(async () => {
        const stillRunning = await loadPredictions();

        const elapsed = Date.now() - startTime;

        console.log("⏱️ Polling time:", elapsed);

        // ✅ STOP CONDITIONS
        if (!stillRunning || elapsed > MAX_POLL_TIME) {
          console.log("🛑 STOP POLLING (done or timeout)");

          if (interval) {
            clearInterval(interval);
            interval = null;
          }
        }
      }, 4000);
    }
  };

  startPolling();

  return () => {
    if (interval) {
      clearInterval(interval);
    }
  };
}, []);

  if (loading) {
    return <div className="predictions-loading">Loading predictions...</div>;
  }

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const status = (job.status || "").toLowerCase().trim();

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

                {status !== "failed" && job.type === "hero" && job.mediaUrl && (
                  <img src={job.mediaUrl} alt="Hero" />
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
                    <img src={job.mediaUrls[0]} alt="Lookbook" />
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
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.9)",
            zIndex: 9999,
            overflowY: "auto",
            padding: "40px 20px",
          }}
        >
          <button
            onClick={() => {
  setShareData(null);
}}
            style={{
              position: "fixed",
              top: 20,
              right: 20,
              zIndex: 10000,
              background: "#000",
              color: "#fff",
              padding: "10px 14px",
              borderRadius: 6,
            }}
          >
            ✕ Close
          </button>

          <div style={{ textAlign: "center", marginBottom: 30 }}>
            <p style={{ color: "#fff" }}>Scan to open on mobile</p>
            <QRCodeCanvas value={shareData.shareUrl} size={180} />
            <p style={{ color: "#aaa", fontSize: 12 }}>
              {shareData.shareUrl}
            </p>
          </div>

          <SharePanel data={shareData} />
        </div>
      )}
    </div>
  );
}