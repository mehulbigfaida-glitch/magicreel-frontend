import { useParams } from "react-router-dom";

export default function ReelOutputPage() {
  const { renderId } = useParams();

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
            marginBottom: "50px",
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
              fontSize: "72px",
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
            <button>Download Reel</button>

            <button>Publish</button>

            <button>Copy Preview Link</button>

            <button>Back To Pack</button>
          </div>
        </div>

        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
          }}
        >
          <video
            controls
            style={{
              width: "100%",
              borderRadius: "20px",
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