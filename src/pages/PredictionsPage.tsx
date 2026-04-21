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
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);
  
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

      const shareUrl = `${window.location.origin}/share/${shareId}`;

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

      {/* 🔥 SHARE MODAL */}
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
    {/* CLOSE */}
    <button
      onClick={() => {
        setShareData(null);
        setShowInstagram(false);
        setShowWhatsApp(false);
      }}
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

    {/* QR */}
    <div style={{ textAlign: "center", marginBottom: 30 }}>
      <p style={{ color: "#fff" }}>Scan to open on mobile</p>
      <QRCodeCanvas value={shareData.shareUrl} size={180} />
      <p style={{ color: "#aaa", fontSize: 12 }}>
        {shareData.shareUrl}
      </p>
    </div>

    {/* ACTION BUTTONS */}
    <div style={{ textAlign: "center", marginBottom: 20 }}>
      
      {/* WHATSAPP */}
      <button
        onClick={() => {
          setShowWhatsApp(true);
          setShowInstagram(false);
        }}
        style={{ margin: 5, padding: "10px 16px", background: "#25D366", color: "#fff", borderRadius: 8 }}
      >
        💬 WhatsApp
      </button>

      {/* COPY */}
      <button
        onClick={() => {
          navigator.clipboard.writeText(shareData.shareUrl);
          alert("Link copied!");
        }}
        style={{ margin: 5, padding: "10px 16px", background: "#333", color: "#fff", borderRadius: 8 }}
      >
        🔗 Copy Link
      </button>

      {/* INSTAGRAM */}
      <button
        onClick={() => {
          setShowInstagram(true);
          setShowWhatsApp(false);
        }}
        style={{ margin: 5, padding: "10px 16px", background: "#E1306C", color: "#fff", borderRadius: 8 }}
      >
        📸 Instagram
      </button>
    </div>

    {/* DEFAULT PREVIEW */}
    {!showInstagram && !showWhatsApp && (
      <SharePanel data={shareData} />
    )}

    {/* 🔥 WHATSAPP PANEL */}
    {showWhatsApp && (
      <div style={{ background: "#fff", padding: 20, borderRadius: 12 }}>
        <h3>💬 WhatsApp Assistant</h3>

        <textarea
          id="wa-msg"
          defaultValue={`🔥 New Collection Alert!

Check this look 👇
${shareData.shareUrl}

Perfect for your next outfit 💫`}
          style={{ width: "100%", minHeight: 120 }}
        />

        <div style={{ marginTop: 10 }}>
          <button onClick={() => {
            const text = (document.getElementById("wa-msg") as HTMLTextAreaElement).value;
            navigator.clipboard.writeText(text);
            alert("Copied!");
          }}>
            📋 Copy Message
          </button>

          <button onClick={() => {
            const text = (document.getElementById("wa-msg") as HTMLTextAreaElement).value;
            window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
          }}>
            💬 Open WhatsApp
          </button>
        </div>
      </div>
    )}

    {/* 🔥 INSTAGRAM PANEL */}
    {showInstagram && (
      <div style={{ background: "#fff", padding: 20, borderRadius: 12, marginTop: 20 }}>
        <h3>📸 Instagram Assistant</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: 10 }}>
          {shareData.media.map((item: any, i: number) => (
            <div key={i}>
              <img src={item.url} style={{ width: "100%" }} />
              <small>{i === 0 ? "Cover" : `Slide ${i + 1}`}</small>
            </div>
          ))}
        </div>

        <textarea
          id="ig-caption"
          defaultValue={`✨ New Look Drop!

Swipe to explore all styles 👇

#fashion #style #ootd #lookbook`}
          style={{ width: "100%", marginTop: 10, minHeight: 120 }}
        />

        <div style={{ marginTop: 10 }}>
          <button onClick={() => {
            const text = (document.getElementById("ig-caption") as HTMLTextAreaElement).value;
            navigator.clipboard.writeText(text);
            alert("Copied!");
          }}>
            📋 Copy Caption
          </button>

          <button onClick={async () => {
            for (let i = 0; i < shareData.media.length; i++) {
              const res = await fetch(shareData.media[i].url);
              const blob = await res.blob();
              const url = window.URL.createObjectURL(blob);

              const a = document.createElement("a");
              a.href = url;
              a.download = `look-${i + 1}.jpg`;
              a.click();
            }
          }}>
            ⬇️ Download All
          </button>

          <button onClick={() => window.open("https://instagram.com", "_blank")}>
            📸 Open Instagram
          </button>
        </div>

        <div style={{ marginTop: 10, fontSize: 14 }}>
          <b>Steps:</b>
          <ol>
            <li>Download images</li>
            <li>Copy caption</li>
            <li>Open Instagram</li>
            <li>Create post → select multiple images</li>
            <li>Paste caption → Post 🚀</li>
          </ol>
        </div>
      </div>
    )}
  </div>
)}
    </div>
  );
}