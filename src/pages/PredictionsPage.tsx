import { useEffect, useState } from "react";
import "./Predictions.css";
import { API_BASE } from "../config/api";
import SharePanel from "../components/SharePanel";
import { QRCodeCanvas } from "qrcode.react";

type PredictionType = "hero" | "reel" | "lookbook";

type Prediction = {
  runId: string;
  type: PredictionType;
  heroImageUrl: string | null;
  reelUrl?: string | null;
  lookbookImages?: string[];
  status: string;
  createdAt: string;
  creditsUsed: number;
};

export default function PredictionsPage() {
  const [jobs, setJobs] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareData, setShareData] = useState<any>(null);
  
  // ✅ DOWNLOAD FUNCTION
  const handleDownload = (url: string | null) => {
    if (!url) return;

    const link = document.createElement("a");
    link.href = url;
    link.download = "magicreel";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async (job: Prediction) => {
  try {
    let media: { url: string }[] = [];

    if (job.type === "hero" && job.heroImageUrl) {
      media = [{ url: job.heroImageUrl }];
    }

    if (job.type === "lookbook") {
      const hero = job.heroImageUrl;

      const poses =
        job.lookbookImages?.filter((url) => url && url !== hero) || [];

      media = [
        ...(hero ? [{ url: hero }] : []),
        ...poses.map((url) => ({ url })),
      ];
    }

    if (job.type === "reel" && job.reelUrl) {
      media = [{ url: job.reelUrl }];
    }

    // 🔥 CREATE SHARE ASSET (BACKEND)
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

    const data = await res.json();

    const shareId = data?.asset?.id || data?.id;

    // 🔥 GENERATE SHARE URL
    const shareUrl = `${window.location.origin}/share/${shareId}`;

    // 🔥 SET DATA FOR MODAL
    setShareData({
      media,
      shareUrl,
    });

  } catch (err) {
    console.error("Share error:", err);
  }
};

  const loadPredictions = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/predictions`);
      const data = await res.json();

      const jobsData: Prediction[] = (data || []).map((job: any) => {
        const mediaUrl = job.mediaUrl ?? null;

        if (job.type === "lookbook") {
          return {
            runId: job.id,
            type: "lookbook",
            heroImageUrl: job.heroImageUrl || null,
            lookbookImages: job.lookbookImages || [],
            status: job.status ?? "completed",
            createdAt: job.createdAt,
            creditsUsed: 2,
          };
        }

        if (job.type === "reel") {
          return {
            runId: job.id,
            type: "reel",
            heroImageUrl: null,
            reelUrl: mediaUrl,
            status: job.status ?? "completed",
            createdAt: job.createdAt,
            creditsUsed: 3,
          };
        }

        return {
          runId: job.id,
          type: "hero",
          heroImageUrl: mediaUrl,
          status: job.status ?? "completed",
          createdAt: job.createdAt,
          creditsUsed: 1,
        };
      });

      setJobs(jobsData);

      return jobsData.some((job) => {
        const status = (job.status || "").toLowerCase().trim();

        const createdTime = new Date(job.createdAt).getTime();
        const now = Date.now();

        const isRecent = now - createdTime < 5 * 60 * 1000;

        return (
          isRecent &&
          ["running", "processing", "pending", "queued"].includes(status)
        );
      });

    } catch (err) {
      console.error("Predictions fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    const startPolling = async () => {
      const hasRunningJobs = await loadPredictions();

      if (hasRunningJobs) {
        interval = setInterval(async () => {
          const stillRunning = await loadPredictions();

          if (!stillRunning && interval) {
            clearInterval(interval);
            interval = null;
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

  return (
    <div className="predictions-page">
      <h1 className="predictions-title">Predictions</h1>

      <div className="predictions-grid">
        {jobs.map((job) => {
          const status = (job.status || "").toLowerCase().trim();

          const mainUrl =
            job.type === "hero"
              ? job.heroImageUrl
              : job.type === "lookbook"
              ? job.lookbookImages?.[0]
              : job.reelUrl;

          return (
            <div className="prediction-card" key={job.runId}>

              <div className="prediction-image">
                {status === "failed" && (
                  <div className="prediction-placeholder">❌ Failed</div>
                )}

                {status !== "failed" && job.type === "hero" && job.heroImageUrl && (
                  <img src={job.heroImageUrl} alt="Hero" />
                )}

                {status !== "failed" && job.type === "reel" && (
                  job.reelUrl ? (
                    <video src={job.reelUrl} controls />
                  ) : (
                    <div className="prediction-placeholder">Processing...</div>
                  )
                )}

                {status !== "failed" && job.type === "lookbook" && (
                  job.lookbookImages?.length ? (
                    <img src={job.lookbookImages[0]} alt="Lookbook" />
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
    {/* CLOSE BUTTON */}
    <button
      onClick={() => setShareData(null)}
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        zIndex: 10000,
        background: "#000",
        color: "#fff",
        border: "none",
        padding: "10px 14px",
        borderRadius: 6,
        cursor: "pointer",
      }}
    >
      ✕ Close
    </button>

    {/* 🔥 QR SECTION */}
    {shareData?.shareUrl && (
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <p style={{ color: "#fff", marginBottom: 10 }}>
          Scan to open on mobile
        </p>

        <QRCodeCanvas value={shareData.shareUrl} size={180} />

        <p style={{ color: "#aaa", marginTop: 10, fontSize: 12 }}>
          {shareData.shareUrl}
        </p>
      </div>
    )}

    {/* SHARE CONTENT */}
    <SharePanel data={shareData} />
  </div>
)}
    </div>
  );
}