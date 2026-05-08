import { useState } from "react";

const editorialWorlds = [
  {
    id: "dark-aristocracy",
    title: "Dark Aristocracy",
  },

  {
    id: "poetic-nature",
    title: "Poetic Nature",
  },

  {
    id: "museum-couture",
    title: "Museum Couture",
  },

  {
    id: "urban-luxury-cinema",
    title: "Urban Luxury Cinema",
  },
];

export default function SocialCampaignPage() {
  const [, setHeroImage] =
    useState<File | null>(null);

  const [heroPreview, setHeroPreview] =
    useState<string | null>(null);

  const [, setLogoImage] =
    useState<File | null>(null);

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [selectedWorld, setSelectedWorld] =
    useState<(typeof editorialWorlds)[0] | null>(
      null
    );

    const [loadingRecommendation, setLoadingRecommendation] =
    useState(false);

  async function analyzeCampaign() {
  try {
    setLoadingRecommendation(true);

    const response = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/api/editorial/recommend`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          category:
            "black evening gown",

          western: true,
        }),
      }
    );

    const data = await response.json();

    if (
      data?.success &&
      data?.recommendation
    ) {
      const matchedWorld =
        editorialWorlds.find(
          (world) =>
            world.title ===
            data.recommendation
              .primaryWorld
        );

      if (matchedWorld) {
        setSelectedWorld(
          matchedWorld
        );
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingRecommendation(false);
  }
}

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: 12,
            }}
          >
            MagicReel V3
          </div>

          <h1
            style={{
              fontSize: 54,
              fontWeight: 300,
              margin: 0,
            }}
          >
            Social Campaign
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: 18,
              lineHeight: 1.7,
              opacity: 0.7,
              maxWidth: 900,
            }}
          >
            Upload a luxury fashion hero image and
            generate a cinematic multi-asset campaign
            with AI editorial intelligence.
          </p>
        </div>

        {/* UPLOAD SECTION */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24,
            marginBottom: 40,
          }}
        >
          {/* HERO IMAGE */}

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",

              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Hero Image
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Campaign Hero
            </div>

            <div
              style={{
                opacity: 0.7,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Upload the primary luxury fashion
              campaign image.
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] || null;

                setHeroImage(file);

                if (file) {
                  setHeroPreview(
                    URL.createObjectURL(file)
                  );

                  analyzeCampaign();
                }
              }}
            />

            {heroPreview && (
              <img
                src={heroPreview}
                alt="Hero Preview"
                style={{
                  marginTop: 20,
                  width: "100%",
                  borderRadius: 20,
                  objectFit: "cover",
                  maxHeight: 340,
                }}
              />
            )}
          </div>

          {/* LOGO */}

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",

              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Brand Logo
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Logo (Optional)
            </div>

            <div
              style={{
                opacity: 0.7,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Add brand identity for campaign-ready
              luxury compositions.
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file =
                  e.target.files?.[0] || null;

                setLogoImage(file);

                if (file) {
                  setLogoPreview(
                    URL.createObjectURL(file)
                  );
                }
              }}
            />

            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{
                  marginTop: 20,
                  width: 140,
                  borderRadius: 14,
                  background: "white",
                  padding: 12,
                  objectFit: "contain",
                }}
              />
            )}
          </div>
        </div>

        {/* AI RECOMMENDATION */}

        <div
          style={{
            marginBottom: 40,
            padding: 32,
            borderRadius: 30,
            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: 20,
            }}
          >
            AI Editorial Recommendation
          </div>

{loadingRecommendation && (
  <div
    style={{
      marginBottom: 20,
      opacity: 0.7,
    }}
  >
    Analyzing cinematic campaign DNA...
  </div>
)}

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            {editorialWorlds.map((world) => {
              const active =
                selectedWorld?.id === world.id;

              return (
                <button
                  key={world.id}
                  onClick={() =>
                    setSelectedWorld(world)
                  }
                  style={{
                    padding: "14px 22px",
                    borderRadius: 999,
                    border: active
                      ? "1px solid white"
                      : "1px solid rgba(255,255,255,0.08)",

                    background: active
                      ? "white"
                      : "transparent",

                    color: active
                      ? "black"
                      : "white",

                    cursor: "pointer",

                    fontSize: 14,
                  }}
                >
                  {world.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* OUTPUTS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",

              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 20,
              }}
            >
              Campaign Outputs
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <label>
                <input type="checkbox" defaultChecked />{" "}
                Hero Campaign
              </label>

              <label>
                <input type="checkbox" defaultChecked />{" "}
                Instagram Post
              </label>

              <label>
                <input type="checkbox" /> Story Asset
              </label>

              <label>
                <input type="checkbox" /> Reel
              </label>
            </div>
          </div>

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",

              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 20,
              }}
            >
              Campaign DNA
            </div>

            <div
              style={{
                marginBottom: 20,
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 300,
                  marginBottom: 12,
                }}
              >
                {selectedWorld?.title ||
                  "Awaiting AI Analysis"}
              </div>

              <div
                style={{
                  opacity: 0.7,
                  lineHeight: 1.7,
                }}
              >
                {selectedWorld
                  ? "AI-recommended editorial world based on cinematic garment analysis."
                  : "Upload a hero image to generate editorial recommendations."}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: 0.7,
              }}
            >
              <div>• Cinematic coherence</div>

              <div>• Editorial restraint</div>

              <div>• Luxury atmosphere</div>

              <div>• Fashion-house direction</div>

              <div>• Campaign continuity</div>
            </div>
          </div>
        </div>

        {/* GENERATE */}

        <div
          style={{
            padding: 32,
            borderRadius: 30,
            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Generation
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 300,
              }}
            >
              Build Luxury Campaign
            </div>
          </div>

          <button
            style={{
              padding: "16px 34px",
              borderRadius: 999,
              border: "1px solid white",
              background: "white",
              color: "black",
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}