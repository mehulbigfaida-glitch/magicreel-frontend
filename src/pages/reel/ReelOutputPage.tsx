import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL;

export default function ReelOutputPage() {

  const { renderId } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [videoUrl, setVideoUrl] =
    useState("");

  useEffect(() => {

    async function loadReel() {

      try {

        const res =
          await fetch(
            `${API_BASE}/api/p2m/reel/${renderId}`
          );

        const data =
          await res.json();

        console.log(
          "REEL DATA:",
          data
        );

        setVideoUrl(
          data.reelVideoUrl || ""
        );

      } catch (err) {

        console.error(
          "REEL LOAD ERROR:",
          err
        );

      }

      setLoading(false);

    }

    loadReel();

  }, [renderId]);

  async function handleCopyLink() {

    try {

      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        "Link copied"
      );

    } catch (err) {

      console.error(
        "COPY LINK ERROR:",
        err
      );

    }

  }

  if (loading) {

    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#000",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Loading Reel...
      </div>
    );

  }

  return (

    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "60px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >

        <div
          style={{
            textAlign: "center",
            marginBottom: "24px",
          }}
        >

          <div
            style={{
              color: "#8b5cf6",
              letterSpacing: "8px",
              fontSize: "12px",
              marginBottom: "20px",
            }}
          >
            MAGICREEL AI STUDIO
          </div>

          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              margin: 0,
            }}
          >
            CAROUSEL REEL
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "15px",
            }}
          >
            Fashion Reel Generated
          </p>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "16px",
              marginTop: "30px",
              flexWrap: "wrap",
            }}
          >

            <button
              onClick={() =>
                window.open(
                  videoUrl,
                  "_blank"
                )
              }
              style={{
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Download Reel
            </button>

            <button
              style={{
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Publish
            </button>

            <button
              onClick={
                handleCopyLink
              }
              style={{
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                border:
                  "1px solid rgba(255,255,255,0.08)",
                background: "#111",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Copy Preview Link
            </button>

            <button
              onClick={() =>
                navigate(-1)
              }
              style={{
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                border: "none",
                background:
                  "linear-gradient(135deg,#7c3aed,#a855f7)",
                color: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Back To Pack
            </button>

          </div>

        </div>

        <div
          style={{
            maxWidth: "420px",
            margin: "24px auto 0",
          }}
        >

          <video
            src={videoUrl}
            controls
            style={{
              width: "100%",
              maxHeight: "80vh",
              borderRadius: "20px",
              objectFit: "contain",
              display: "block",
            }}
          />

        </div>

        <div
          style={{
            marginTop: "30px",
            textAlign: "center",
            color: "#777",
          }}
        >
          Render ID: {renderId}
        </div>

      </div>
    </div>

  );

}