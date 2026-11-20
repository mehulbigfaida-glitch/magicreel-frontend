import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StatusModal from "../../components/StatusModal";
import "./Reels360OutputPage.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL;

export default function ReelOutputPage() {

  const { runId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [failed, setFailed] =
  useState(false);
  
  const [elapsedTime, setElapsedTime] =
  useState(0);

const [videoUrl, setVideoUrl] =
  useState("");

const [statusModal, setStatusModal] =
  useState({
    open: false,
    type: "success" as "success" | "error",
    title: "",
    message: ""
  });

  useEffect(() => {

  if (!runId) return;

  const start = Date.now();

  const timer = window.setInterval(() => {

    setElapsedTime(
      Math.floor(
        (Date.now() - start) / 1000
      )
    );

  }, 1000);

  const startedAt = Date.now();

  const interval = window.setInterval(

    async () => {

      try {

        if (
          Date.now() - startedAt >
          1200000
        ) {

          clearInterval(interval);
          clearInterval(timer);

          setLoading(false);

          return;

        }

        const token =
          localStorage.getItem("token");

        const res =
          await fetch(
`${API_BASE}/api/p2m/reels360/status/${runId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          });

        const data =
          await res.json();

        console.log(
          "360 STATUS",
          data
        );

        if (
          data.status ===
          "completed"
        ) {

          setVideoUrl(
            data.videoUrl
          );

          setLoading(false);

          clearInterval(interval);
          clearInterval(timer);

          return;

        }

        if (
          data.status ===
          "failed"
        ) {

          setFailed(true);

          setLoading(false);

          clearInterval(interval);
          clearInterval(timer);

          return;

        }

      }
      catch (err) {

        console.warn(
          "POLL ERROR",
          err
        );

      }

    },

    5000

  );

  return () => {

    clearInterval(interval);

    clearInterval(timer);

  };

}, [runId]);
  async function handleCopyLink() {

    try {

      await navigator.clipboard.writeText(
        window.location.href
      );

      setStatusModal({
  open: true,
  type: "success",
  title: "Link Copied",
  message:
    "The preview link has been copied to your clipboard."
});

    } catch (err) {

  console.error(
    "COPY LINK ERROR:",
    err
  );

  setStatusModal({
    open: true,
    type: "error",
    title: "Copy Failed",
    message:
      "Unable to copy the preview link. Please try again."
  });

}

  }

  if (loading) {
  return (
    <div className="reels360-loading-screen">
      <div className="reels360-loading-card">
        <div className="reels360-loading-eyebrow">MAGICREEL AI STUDIO</div>
        <h1>Creating Your 360° Reel</h1>
        <p className="reels360-loading-message">
          Your fashion reel is being carefully generated. Complex generations may take longer than usual.
          Please keep this page open while we finish creating your Reel.
        </p>
        <div className="reels360-generation-progress" role="status" aria-live="polite">
          <div className="reels360-spinner" aria-hidden="true"><span/><span/><span/></div>
          <div className="reels360-progress-copy">
            <strong>Usually takes 3–4 minutes</strong>
            <p>This generation uses 4 credits.</p>
            <span className="reels360-elapsed">Elapsed {String(Math.floor(elapsedTime/60)).padStart(2,"0")}:{String(elapsedTime%60).padStart(2,"0")}</span>
          </div>
        </div>
        <div className="reels360-poll-note">Your Reel will appear automatically when it’s ready.</div>
      </div>
    </div>
  );
}
if (failed) {

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px"
      }}
    >

      <div
        style={{
          maxWidth: "700px",
          textAlign: "center"
        }}
      >

        <h1
          style={{
            fontSize: "34px",
            marginBottom: "20px"
          }}
        >
          360° Reel Generation Failed
        </h1>

        <p
          style={{
            color: "#bdbdbd",
            lineHeight: 1.8,
            marginBottom: "36px"
          }}
        >
          We couldn't generate your 360° Reel this time.
          <br />
          Please return to the previous page and try again.
        </p>

        <button
          onClick={() => navigate(-1)}
          style={{
            padding: "14px 32px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            fontSize: "16px",
            fontWeight: 600
          }}
        >
          Back
        </button>

      </div>

    </div>

  );

}

  return (

    <div
      style={{
        background: "#000",
        minHeight: "100vh",
        color: "#fff",
        padding: "40px 0 100px",
      }}
    >

      <div
        style={{
          width: "min(1500px,95%)",
          margin: "auto",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "12px",
          }}
        >

          <div
            style={{
              fontSize: "11px",
              letterSpacing: "6px",
              color: "#b267ff",
              marginBottom: "18px",
            }}
          >
            MAGICREEL AI STUDIO
          </div>

          <h1
            style={{
              fontSize: "64px",
              fontWeight: 800,
              margin: 0,
              lineHeight: 1,
            }}
          >
            360° REEL
          </h1>

          <p
            style={{
              marginTop: "14px",
              fontSize: "18px",
              color: "#8d8d8d",
            }}
          >
            360 Degree Fashion Reel Generated
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "18px",
              marginTop: "24px",
              flexWrap: "wrap",
            }}
          >

            <button
  onClick={async () => {

    try {

      const response =
        await fetch(videoUrl);

      const blob =
        await response.blob();

      const url =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = url;

      a.download =
        "magicreel-reel.mp4";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);

    } catch (err) {

  console.error(
    "DOWNLOAD ERROR:",
    err
  );

  setStatusModal({
    open: true,
    type: "error",
    title: "Download Failed",
    message:
      "Unable to download the reel. Please try again."
  });

}

  }}
              style={{
                background: "#111",
                border:
                  "1px solid rgba(255,255,255,.08)",
                padding: "20px 42px",
                color: "white",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                minWidth: "180px",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,.02)",
              }}
            >
              Download Reel
            </button>

            <button
              style={{
                background: "#111",
                border:
                  "1px solid rgba(255,255,255,.08)",
                padding: "20px 42px",
                color: "white",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                minWidth: "180px",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,.02)",
              }}
            >
              Publish
            </button>

            <button
              onClick={
                handleCopyLink
              }
              style={{
                background: "#111",
                border:
                  "1px solid rgba(255,255,255,.08)",
                padding: "20px 42px",
                color: "white",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                minWidth: "180px",
                boxShadow:
                  "0 0 0 1px rgba(255,255,255,.02)",
              }}
            >
              Copy Preview Link
            </button>

            <button
              onClick={() =>
                navigate(-1)
              }
              style={{
                background:
                  "linear-gradient(90deg,#6927ff,#d946ef)",
                border: "none",
                padding: "20px 42px",
                color: "white",
                borderRadius: "999px",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600,
                minWidth: "180px",
              }}
            >
              Back To Pack
            </button>

          </div>

        </div>

        <div
          style={{
            width: "420px",
            maxWidth: "100%",
            margin: "0 auto",

            padding: "10px",

            background: "#111",

            borderRadius: "32px",

            boxShadow:
              "0 10px 50px rgba(0,0,0,.35)",

            border:
              "1px solid rgba(255,255,255,.05)",
          }}
        >

          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            playsInline
            style={{
              width: "100%",
              borderRadius: "22px",
              display: "block",
            }}
          />

        </div>

        <div
          style={{
            marginTop: "24px",
            textAlign: "center",
            color: "#777",
            fontSize: "13px",
          }}
        >
          Run ID: {runId}
        </div>

            </div>

      <StatusModal
        open={statusModal.open}
        type={statusModal.type}
        title={statusModal.title}
        description={statusModal.message}
        onClose={() =>
          setStatusModal(prev => ({
            ...prev,
            open: false
          }))
        }
      />

    </div>

  );

}