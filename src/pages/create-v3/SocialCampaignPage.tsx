

import { useState } from "react";

const editorialWorlds = [
  {
    id: "dark-aristocracy",

    title: "Dark Aristocracy",

    subtitle:
      "Emotionally restrained aristocratic cinematic world with sculptural darkness and palace silence.",

    category: "Couture Darkness",

    featured: true,

    active: true,

    order: 1,

    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "garden-nostalgia",

    title: "Garden Nostalgia",

    subtitle:
      "Fading romantic memory landscapes with melancholic botanical stillness.",

    category: "Romantic Editorial",

    featured: true,

    active: true,

    order: 2,

    thumbnail:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "celestial-silence",

    title: "Celestial Silence",

    subtitle:
      "Reflective cinematic minimalism with midnight atmosphere and emotional silence.",

    category: "Surreal Minimalism",

    featured: true,

    active: true,

    order: 3,

    thumbnail:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "mediterranean-heirloom",

    title: "Mediterranean Heirloom",

    subtitle:
      "Golden-hour European luxury with heritage architecture and maison editorial energy.",

    category: "Resort Maison",

    featured: true,

    active: true,

    order: 4,

    thumbnail:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "runway-silence",

    title: "Runway Silence",

    subtitle:
      "Backstage editorial stillness with controlled luxury tension and fashion restraint.",

    category: "Runway Editorial",

    featured: false,

    active: true,

    order: 5,

    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "urban-luxury-cinema",

    title: "Urban Luxury Cinema",

    subtitle:
      "Modern metropolitan cinematic realism with luxury night atmosphere.",

    category: "Luxury Cinema",

    featured: false,

    active: true,

    order: 6,

    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "museum-couture",

    title: "Museum Couture",

    subtitle:
      "Architectural editorial framing with sculptural stillness and gallery silence.",

    category: "Architectural Couture",

    featured: false,

    active: true,

    order: 7,

    thumbnail:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "heritage-romance",

    title: "Heritage Romance",

    subtitle:
      "Emotionally layered heirloom storytelling with timeless romantic luxury.",

    category: "Heritage Editorial",

    featured: false,

    active: true,

    order: 8,

    thumbnail:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "noir-couture",

    title: "Noir Couture",

    subtitle:
      "Monochrome cinematic elegance with psychological darkness and restrained glamour.",

    category: "Noir Fashion",

    featured: false,

    active: true,

    order: 9,

    thumbnail:
      "https://images.unsplash.com/photo-1495385794356-15371f348c31?q=80&w=1200&auto=format&fit=crop",
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
    if (generating) {
      return;
    }

    try {
      if (
        !selectedWorld ||
        !heroCloudinaryUrl
      ) {
        return;
      }

      setGenerating(true);

      setGeneratedAssets([]);

      const response =
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/editorial/generate-campaign`,
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
            }),
          }
        );

      if (!response.ok) {
        throw new Error(
          "Campaign generation failed"
        );
      }

      const data =
        await response.json();

      if (data?.success) {
        setGeneratedAssets(
          data.assets || []
        );
      }
    } catch (error) {
      console.error(
        "Generate campaign error:",
        error
      );
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #171717 0%, #050505 60%)",
        color: "white",
        padding: "70px 22px 120px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1320,
          margin: "0 auto",
        }}
      >
        {/* HEADER */}

        <div
          style={{
            textAlign: "center",
            marginBottom: 70,
          }}
        >
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform:
                "uppercase",

              opacity: 0.45,
              marginBottom: 18,
            }}
          >
            MagicReel AI Studio
          </div>

          <h1
            style={{
              fontSize:
                "clamp(52px, 8vw, 86px)",
              lineHeight: 0.92,
              letterSpacing: -4,
              fontWeight: 300,
              margin: 0,
              marginBottom: 26,
            }}
          >
            Editorial
            <br />
            Campaign Studio
          </h1>

          <p
            style={{
              maxWidth: 760,
              margin: "0 auto",
              fontSize: 18,
              lineHeight: 1.9,
              opacity: 0.68,
            }}
          >
            Build emotionally authored
            cinematic luxury campaigns
            inspired by iconic editorial
            worlds and fashion-house
            storytelling systems.
          </p>
        </div>

        {/* UPLOADS */}

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",

            gap: 24,
            marginBottom: 54,
          }}
        >
          {/* HERO */}

          <div
            style={{
              padding: 28,
              borderRadius: 34,

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
                fontSize: 32,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Hero Image
            </div>

            <div
              style={{
                opacity: 0.68,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Upload the primary fashion
              image used to transform the
              cinematic editorial world.
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
                  borderRadius: 24,
                  objectFit:
                    "contain",

                  height: 460,
                  background:
                    "#101010",

                  padding: 12,
                }}
              />
            )}
          </div>

          {/* LOGO */}

          <div
            style={{
              padding: 28,
              borderRadius: 34,

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
                fontSize: 32,
                fontWeight: 300,
                marginBottom: 14,
              }}
            >
              Upload Brand Logo
            </div>

            <div
              style={{
                opacity: 0.68,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Optional logo integration for
              cinematic luxury campaign
              placement.
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
                  width: 180,
                  borderRadius: 20,
                  background:
                    "white",

                  padding: 18,
                  objectFit:
                    "contain",
                }}
              />
            )}
          </div>
        </div>

        {/* WORLDS */}

        <div
          style={{
            marginBottom: 60,
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
            Cinematic Worlds
          </div>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",

              gap: 24,
            }}
          >
            {editorialWorlds
  .filter((world) => world.active)
  .sort((a, b) => a.order - b.order)
  .map(
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
                      overflow:
                        "hidden",

                      borderRadius: 30,

                      cursor:
                        "pointer",

                      border:
                        active
                          ? "1px solid rgba(255,255,255,0.34)"
                          : "1px solid rgba(255,255,255,0.08)",

                      background:
                        "rgba(255,255,255,0.03)",

                      padding: 0,

                      color:
                        "white",

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        height: 260,
                        position:
                          "relative",
                        overflow:
                          "hidden",
                      }}
                    >
                      <img
                        src={world.thumbnail}
                        alt={world.title}
                        style={{
                          width:
                            "100%",
                          height:
                            "100%",
                          objectFit:
                            "cover",
                        }}
                      />

                      <div
                        style={{
                          position:
                            "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(to top, rgba(0,0,0,0.85), rgba(0,0,0,0.08))",
                        }}
                      />

                      {active && (
                        <div
                          style={{
                            position:
                              "absolute",
                            top: 18,
                            right: 18,
                            background:
                              "white",
                            color:
                              "black",
                            borderRadius: 999,
                            padding:
                              "8px 14px",
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: 1,
                          }}
                        >
                          SELECTED
                        </div>
                      )}

                      <div
                        style={{
                          position:
                            "absolute",
                          left: 24,
                          right: 24,
                          bottom: 24,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 30,
                            fontWeight:
                              300,
                            marginBottom: 10,
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
                              0.78,
                          }}
                        >
                          {
                            world.subtitle
                          }
                        </div>
                      </div>
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* OUTPUTS */}

        {generatedAssets.length >
          0 && (
          <div
            style={{
              marginBottom: 60,
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
              Generated Editorials
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
                      alt="Editorial"
                      style={{
                        width:
                          "100%",
                        display:
                          "block",
                      }}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}

        {/* GENERATE */}

        <div
          style={{
            padding: 36,
            borderRadius: 36,

            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            display: "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap: 30,

            flexWrap: "wrap",
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
                marginBottom: 12,
              }}
            >
              Generate Campaign
            </div>

            <div
              style={{
                fontSize: 42,
                fontWeight: 300,
              }}
            >
              Build Editorial Universe
            </div>
          </div>

          <button
            onClick={
              generateCampaign
            }
            disabled={
              generating ||
              !heroCloudinaryUrl
            }
            style={{
              padding:
                "18px 36px",

              borderRadius: 999,

              border:
                "1px solid white",

              background:
                generating
                  ? "#777"
                  : "white",

              color:
                "black",

              fontSize: 13,

              letterSpacing: 2,

              textTransform:
                "uppercase",

              cursor:
                generating
                  ? "not-allowed"
                  : "pointer",
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

