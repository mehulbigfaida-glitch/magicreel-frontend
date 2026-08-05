import { useNavigate } from "react-router-dom";

export default function EditorialOutputPage() {
  const navigate = useNavigate();

  const stored = localStorage.getItem(
    "magicreel-editorial-output"
  );

  const data = stored
    ? JSON.parse(stored)
    : {};

  const assets = data.assets || [];
  const world = data.world;
  const output = data.output;
  const outputLabels: Record<string, string> = {
  "instagram-post": "Instagram Post",
  "instagram-story": "Instagram Story",
  "facebook-post": "Facebook Post",
  "linkedin-post": "LinkedIn Post",
  "x-post": "X Post",
  "pinterest-pin": "Pinterest Pin",
};
  
  const heroImage = data.heroImage;

  const generatedImage =
    assets.length > 0
      ? assets[0].imageUrl
      : null;

  function handleDownload() {
    if (!generatedImage) return;

    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `magicreel-editorial-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function handlePublish() {
    if (!generatedImage) return;

    window.open(
      `/publish?assetUrl=${encodeURIComponent(
        generatedImage
      )}&type=image`,
      "_blank"
    );
  }

  function handleCopyLink() {
    navigator.clipboard.writeText(window.location.href);
    alert("Page link copied.");
  }

  function handleCinematicReel() {
    if (!generatedImage) return;

    alert("Cinematic Reel integration coming in next sprint.");
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top,#171717 0%,#050505 65%)",
        color: "white",
        padding: "60px 24px 100px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1500,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: 60,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 5,
              textTransform: "uppercase",
              opacity: .55,
              marginBottom: 18,
            }}
          >
            MAGICREEL AI STUDIO
          </div>

          <h1
  style={{
    fontSize:
      "clamp(60px,8vw,110px)",
    fontWeight: 200,
    lineHeight: .88,
    letterSpacing: "-3px",
    margin: 0,
  }}
>
            Editorial
            <br />
            Complete
          </h1>

          <div
  style={{
    marginTop: 34,
    fontSize: 34,
    fontWeight: 200,
    letterSpacing: ".5px",
    opacity: .92,
  }}
>
            {world?.name}
          </div>

          <p
            style={{
              marginTop: 18,
              maxWidth: 760,
              marginInline: "auto",
              fontSize: 18,
              lineHeight: 1.8,
              opacity: .65,
            }}
          >
            Your editorial masterpiece has been created.
Ready for publishing, storytelling and cinematic motion.
          </p>
        </div>

        {/* ACTION BAR */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
            marginBottom: 60,
          }}
        >
          <button
  onClick={handleDownload}
  style={{
    height: 62,
    borderRadius: 999,
    border: "none",
    background:
      "linear-gradient(90deg,#6D28D9,#C026D3)",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: ".25s",
  }}
>
  ⬇ Download
</button>

<button
  onClick={handlePublish}
  style={{
    height: 62,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.10)",
    background: "#111",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: ".25s",
  }}
>
  🚀 Publish
</button>

<button
  onClick={handleCopyLink}
  style={{
    height: 62,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.10)",
    background: "#111",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: ".25s",
  }}
>
  🔗 Copy Link
</button>

<button
  onClick={handleCinematicReel}
  style={{
    height: 62,
    borderRadius: 999,
    border: "1px solid rgba(255,255,255,.10)",
    background: "#111",
    color: "white",
    fontSize: 16,
    fontWeight: 600,
    cursor: "pointer",
    transition: ".25s",
  }}
>
  🎬 Cinematic Reel
</button>
        </div>

<div
  style={{
    textAlign: "center",
    marginBottom: 26,
    fontSize: 13,
    letterSpacing: 4,
    textTransform: "uppercase",
    opacity: 0.55,
  }}
>
  EDITORIAL PREVIEW
</div>

        {/* HERO IMAGE */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 70,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              borderRadius: 40,
              overflow: "hidden",
              background: "#101010",
              border:
                "1px solid rgba(255,255,255,.08)",
              boxShadow:
`
0 50px 140px rgba(0,0,0,.55),
0 0 0 1px rgba(255,255,255,.06)
`,
            }}
          >
            {generatedImage ? (
              <img
                src={generatedImage}
                alt="Editorial"
                style={{
  width: "100%",
  display: "block",
  aspectRatio: "2 / 3",
  objectFit: "cover",
}}
              />
            ) : (
              <div
                style={{
                  aspectRatio: "2 / 3",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: .45,
                }}
              >
                No Editorial Found
              </div>
            )}
          </div>
        </div>

        {/* DETAILS */}

        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            borderRadius: 28,
            padding: 34,
            background:
              "rgba(255,255,255,.03)",
            border:
              "1px solid rgba(255,255,255,.08)",
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: .5,
              marginBottom: 28,
            }}
          >
            Editorial Details
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(220px,1fr))",
              gap: 28,
            }}
          >
            <div>
              <div
                style={{
                  opacity: .45,
                  marginBottom: 8,
                }}
              >
                Editorial World
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 300,
                }}
              >
                {world?.name}
              </div>
            </div>

            <div>
              <div
                style={{
                  opacity: .45,
                  marginBottom: 8,
                }}
              >
                Output Format
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 300,
                }}
              >
                {outputLabels[output] || output}
              </div>
            </div>

            <div>
              <div
                style={{
                  opacity: .45,
                  marginBottom: 8,
                }}
              >
                Generated
              </div>

              <div
                style={{
                  fontSize: 22,
                  fontWeight: 300,
                }}
              >
                Just Now
              </div>
            </div>
          </div>
        </div>

        <div
  style={{
    textAlign: "center",
    marginBottom: 90,
    paddingTop: 20,
  }}
>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: "transparent",
              color: "rgba(255,255,255,.65)",
              border: "none",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            ← Back to Builder
          </button>
        </div>
      </div>
    </div>
  );
}