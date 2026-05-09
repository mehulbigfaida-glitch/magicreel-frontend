import { useState } from "react";

const editorialWorlds = [
  {
    id: "dark-aristocracy",

    title: "Dark Aristocracy",

    subtitle:
      "Museum-grade couture portraiture with sculptural darkness and emotional restraint.",
  },

  {
    id: "poetic-nature",

    title: "Poetic Nature",

    subtitle:
      "Cinematic environmental luxury with emotional bridal storytelling and natural stillness.",
  },

  {
    id: "museum-couture",

    title: "Museum Couture",

    subtitle:
      "Architectural editorial framing where fashion is presented as timeless luxury artifact.",
  },

  {
    id: "noir-couture",

    title: "Noir Couture",

    subtitle:
      "Vintage Vogue-inspired monochrome couture with cinematic jewelry styling and dramatic restraint.",
  },

  {
    id: "heritage-romance",

    title: "Heritage Romance",

    subtitle:
      "Heirloom bridal storytelling with emotional embroidery narratives and antique romantic palettes.",
  },

  {
    id: "runway-editorial",

    title: "Runway Editorial",

    subtitle:
      "Luxury fashion-week atmosphere with backstage cinematic energy and editorial runway stillness.",
  },

  {
    id: "urban-luxury-cinema",

    title: "Urban Luxury Cinema",

    subtitle:
      "Gucci and LV-inspired cinematic nightlife editorial with modern luxury mood.",
  },
];

export default function SocialCampaignPage() {
  const [heroPreview, setHeroPreview] =
    useState<string | null>(null);

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [heroCloudinaryUrl, setHeroCloudinaryUrl] =
    useState("");

  const [logoCloudinaryUrl, setLogoCloudinaryUrl] =
    useState("");

  const [selectedWorld, setSelectedWorld] =
    useState(editorialWorlds[0]);

  const [generatedAssets, setGeneratedAssets] =
    useState<any[]>([]);

  const [generating, setGenerating] =
    useState(false);

  async function uploadToCloudinary(
    file: File
  ) {
    const formData =
      new FormData();

    formData.append(
      "file",
      file
    );

    formData.append(
      "upload_preset",
      "magicreel_unsigned"
    );

    const response =
      await fetch(
        "https://api.cloudinary.com/v1_1/duaqfspwa/image/upload",

        {
          method: "POST",

          body: formData,
        }
      );

    const data =
      await response.json();

    return data.secure_url;
  }

  async function generateCampaign() {
    try {
      if (
        !selectedWorld ||
        !heroCloudinaryUrl
      ) {
        return;
      }

      setGenerating(true);

      const response =
        await fetch(
          "http://localhost:5050/api/editorial/generate-campaign",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              editorialWorld:
                selectedWorld.id,

              heroImageUrl:
                heroCloudinaryUrl,

              logoImageUrl:
                logoCloudinaryUrl,

              outputs: [
                "instagram-post",
                "story",
              ],
            }),
          }
        );

      const data =
        await response.json();

      if (data?.success) {
        setGeneratedAssets(
          data.assets || []
        );
      }
    } catch (error) {
      console.error(error);
    } finally {
      setGenerating(false);
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
        {/* HEADER */}

        <div style={{ marginBottom: 50 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform:
                "uppercase",

              opacity: 0.5,
              marginBottom: 14,
            }}
          >
            MagicReel V3
          </div>

          <h1
            style={{
              fontSize: 56,
              fontWeight: 300,
              margin: 0,
              marginBottom: 18,
            }}
          >
            Editorial Campaign Studio
          </h1>

          <p
            style={{
              maxWidth: 900,
              fontSize: 18,
              lineHeight: 1.8,
              opacity: 0.7,
            }}
          >
            Build cinematic luxury fashion
            campaigns inspired by iconic
            editorial worlds, heritage
            fashion houses, and premium
            fashion storytelling systems.
          </p>
        </div>

        {/* UPLOADS */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(340px, 1fr))",

            gap: 24,
            marginBottom: 40,
          }}
        >
          {/* HERO */}

          <div
            style={{
              padding: 28,
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
                textTransform:
                  "uppercase",

                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Campaign Hero
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Hero Image
            </div>

            <div
              style={{
                opacity: 0.7,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Upload the primary luxury
              fashion campaign image used
              to generate the editorial
              universe.
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file =
                  e.target
                    .files?.[0];

                if (file) {
                  setHeroPreview(
                    URL.createObjectURL(
                      file
                    )
                  );

                  const uploadedUrl =
                    await uploadToCloudinary(
                      file
                    );

                  setHeroCloudinaryUrl(
                    uploadedUrl
                  );
                }
              }}
            />

            {heroPreview && (
              <img
                src={heroPreview}
                alt="Hero Preview"
                style={{
                  marginTop: 22,
                  width: "100%",
                  borderRadius: 22,
                  objectFit:
                    "contain",

                  height: 420,
                  background:
                    "#111",

                  padding: 12,
                }}
              />
            )}
          </div>

          {/* LOGO */}

          <div
            style={{
              padding: 28,
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
                textTransform:
                  "uppercase",

                opacity: 0.5,
                marginBottom: 16,
              }}
            >
              Brand Identity
            </div>

            <div
              style={{
                fontSize: 30,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Brand Logo
            </div>

            <div
              style={{
                opacity: 0.7,
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              Add logo placement for
              luxury campaign
              compositions and cinematic
              brand storytelling.
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file =
                  e.target
                    .files?.[0];

                if (file) {
                  setLogoPreview(
                    URL.createObjectURL(
                      file
                    )
                  );

                  const uploadedUrl =
                    await uploadToCloudinary(
                      file
                    );

                  setLogoCloudinaryUrl(
                    uploadedUrl
                  );
                }
              }}
            />

            {logoPreview && (
              <img
                src={logoPreview}
                alt="Logo Preview"
                style={{
                  marginTop: 22,
                  width: 150,
                  borderRadius: 16,
                  background:
                    "white",

                  padding: 14,
                  objectFit:
                    "contain",
                }}
              />
            )}
          </div>
        </div>

        {/* EDITORIAL WORLDS */}

        <div
          style={{
            marginBottom: 40,
            padding: 32,
            borderRadius: 32,

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
              textTransform:
                "uppercase",

              opacity: 0.5,
              marginBottom: 24,
            }}
          >
            Editorial World
          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",

              gap: 18,
            }}
          >
            {editorialWorlds.map(
              (world) => {
                const active =
                  selectedWorld.id ===
                  world.id;

                return (
                  <button
                    key={world.id}
                    onClick={() =>
                      setSelectedWorld(
                        world
                      )
                    }
                    style={{
                      padding: 24,
                      borderRadius: 26,

                      textAlign:
                        "left",

                      cursor:
                        "pointer",

                      border:
                        active
                          ? "1px solid white"
                          : "1px solid rgba(255,255,255,0.08)",

                      background:
                        active
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.02)",

                      color:
                        "white",

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 26,
                        fontWeight:
                          300,

                        marginBottom: 14,
                      }}
                    >
                      {
                        world.title
                      }
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight:
                          1.7,

                        opacity:
                          0.7,
                      }}
                    >
                      {
                        world.subtitle
                      }
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* GENERATED ASSETS */}

        {generatedAssets.length >
          0 && (
          <div
            style={{
              marginBottom: 50,
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform:
                  "uppercase",

                opacity: 0.5,
                marginBottom: 24,
              }}
            >
              Generated Campaign
              Assets
            </div>

            <div
              style={{
                display: "grid",

                gridTemplateColumns:
                  "repeat(auto-fit, minmax(320px, 1fr))",

                gap: 24,
              }}
            >
              {generatedAssets.map(
                (
                  asset,
                  index
                ) => (
                  <div
                    key={index}
                    style={{
                      overflow:
                        "hidden",

                      borderRadius: 28,

                      background:
                        "rgba(255,255,255,0.03)",

                      border:
                        "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <img
                      src={
                        asset.imageUrl
                      }
                      alt={
                        asset.output
                      }
                      style={{
                        width:
                          "100%",

                        display:
                          "block",
                      }}
                    />

                    <div
                      style={{
                        padding: 18,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 12,

                          letterSpacing: 2,

                          textTransform:
                            "uppercase",

                          opacity:
                            0.5,

                          marginBottom: 10,
                        }}
                      >
                        {
                          asset.output
                        }
                      </div>

                      <div
                        style={{
                          fontSize: 18,

                          fontWeight:
                            300,
                        }}
                      >
                        Campaign
                        Asset
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* GENERATE */}

        <div
          style={{
            padding: 34,
            borderRadius: 32,

            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform:
                  "uppercase",

                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Generate Campaign
            </div>

            <div
              style={{
                fontSize: 38,
                fontWeight: 300,
              }}
            >
              Build Editorial
              Universe
            </div>
          </div>

          <button
            onClick={
              generateCampaign
            }
            style={{
              padding:
                "16px 34px",

              borderRadius: 999,

              border:
                "1px solid white",

              background:
                "white",

              color:
                "black",

              fontSize: 13,

              letterSpacing: 2,

              textTransform:
                "uppercase",

              cursor:
                "pointer",
            }}
          >
            {generating
              ? "Generating..."
              : "Generate"}
          </button>
        </div>
      </div>
    </div>
  );
}