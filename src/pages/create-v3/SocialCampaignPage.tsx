

import { useEffect, useRef, useState } from "react";
import CampaignHeroPickerModal from "../campaign/CampaignHeroPickerModal";
import {
  useAuthStore,
} from "../../store/authStore";

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
    id: "sculpted-riviera",

title: "Sculpted Riviera",

subtitle:
  "Contemporary Mediterranean architecture with sculptural luxury, refined coastal minimalism and timeless editorial elegance.",

category: "Coastal Luxury",

    featured: false,

    active: true,

    order: 6,

    thumbnail:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
  },

  {
    id: "lago-eleganza",

    title: "Lago Eleganza",

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
    id: "chromatic-glamour",

    title: "Chromatic Glamour",

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
    id: "alpine-nomad",

    title: "Alpine Nomad",

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

    const [selectedOutput, setSelectedOutput] =
  useState("instagram-post");

  const [generatedAssets, setGeneratedAssets] =
    useState<any[]>([]);

  const [generating, setGenerating] =
    useState(false);

  const [generationSeconds, setGenerationSeconds] =
  useState(0);

  const timerRef = useRef<number | null>(null);

const generationMessages = [
  "Analyzing Hero Composition...",
  "Building Editorial Narrative...",
  "Styling Luxury Fashion Scene...",
  "Balancing Cinematic Lighting...",
  "Refining Editorial Mood...",
  "Rendering Final Editorial..."
];

const [generationMessage, setGenerationMessage] =
  useState(generationMessages[0]);

  const [pickerOpen, setPickerOpen] =
  useState(false);

const [pickerTarget, setPickerTarget] =
  useState<
    "hero" |
    "asset1" |
    "asset2" |
    "asset3" |
    "asset4"
  >("hero");

const [assetPreviews, setAssetPreviews] =
  useState<(string | null)[]>([
    null,
    null,
    null,
    null,
  ]);

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

useEffect(() => {
  if (generating) {
    timerRef.current = window.setInterval(() => {
      setGenerationSeconds((prev) => {
        const next = prev + 1;

        setGenerationMessage(
          generationMessages[
            Math.min(
              Math.floor(next / 5),
              generationMessages.length - 1
            )
          ]
        );

        return next;
      });
    }, 1000);
  } else {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  return () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };
}, [generating]);

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

      setGenerationSeconds(0);

      setGeneratedAssets([]);

      const token =
  localStorage.getItem("token");

      const response =
        await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/editorial/generate-campaign`,
          {
            method: "POST",

            headers: {
  "Content-Type":
    "application/json",

  Authorization:
    `Bearer ${token}`,
},

            body: JSON.stringify({
  editorialWorld: selectedWorld.id,

  heroImageUrl: heroCloudinaryUrl,

  logoImageUrl: logoCloudinaryUrl,

  additionalImageUrls:
    assetPreviews.filter(Boolean),

  output: selectedOutput,
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

console.log(
  "EDITORIAL RESPONSE:",
  data
);

if (data?.success) {

useAuthStore
  .getState()
  .refreshCredits();

  localStorage.setItem(
  "magicreel-editorial-output",
  JSON.stringify({
    assets: data.assets || [],
    world: selectedWorld,

    output: {
  id: selectedOutput.id,
  imageUrl: data.assets?.[0]?.imageUrl,
  prompt: data.assets?.[0]?.prompt,
  format: data.assets?.[0]?.output,
},

    heroImage: heroPreview,
    generatedAt: Date.now(),
  })
);

window.open(
  "/editorial/output",
  "_blank"
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






















        {/* =========================
    UPLOADS
========================= */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
    gap: 28,
    marginBottom: 56,
    alignItems: "start",
  }}
>
  {/* ==========================================================
      CAMPAIGN HERO
  ========================================================== */}

  <div
    style={{
      padding: 30,
      borderRadius: 34,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
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
      Upload the primary fashion image used
      to generate your editorial campaign.
    </div>

    <button
  type="button"
  onClick={() => {
    setPickerTarget("hero");
    setPickerOpen(true);
  }}
  style={{
    width: "100%",
    padding: "16px",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,.12)",
    background: "rgba(255,255,255,.05)",
    color: "white",
    fontSize: 16,
    cursor: "pointer",
    marginBottom: 20,
  }}
>
  Choose Hero
</button>

    {heroPreview && (
      <img
        src={heroPreview}
        alt="Hero Preview"
        style={{
          marginTop: 22,
          width: "100%",
          height: 720,
          objectFit: "contain",
          background: "#101010",
          padding: 6,
          borderRadius: 24,
        }}
      />
    )}
  </div>

  {/* ==========================================================
      EDITORIAL ASSETS
  ========================================================== */}

  <div
    style={{
      padding: 30,
      borderRadius: 34,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
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
      Supporting Fashion Models (Optional)
    </div>

    <div
      style={{
        fontSize: 32,
        fontWeight: 300,
        marginBottom: 14,
      }}
    >
      Additional Fashion Models
    </div>

    <div
      style={{
        opacity: 0.68,
        lineHeight: 1.8,
        marginBottom: 24,
      }}
    >
      Add up to four additional Fashion Models from your portfolio
      to create a luxury editorial campaign featuring multiple models.
      Each selected Fashion Model will retain their identity, garments and styling.
    </div>

    <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
  }}
>
  {[1, 2, 3, 4].map((asset) => (
    <button
      key={asset}
      type="button"
      onClick={() => {
        setPickerTarget(
          `asset${asset}` as
            | "asset1"
            | "asset2"
            | "asset3"
            | "asset4"
        );

        setPickerOpen(true);
      }}
      style={{
        aspectRatio: "2 / 3",
        borderRadius: 22,
        border:
          "1px dashed rgba(255,255,255,.18)",
        background:
          "rgba(255,255,255,.02)",
        overflow: "hidden",
        cursor: "pointer",
        padding: 0,
        transition: "all .2s ease",
      }}
    >
      {assetPreviews[asset - 1] ? (
        <img
          src={assetPreviews[asset - 1]!}
          alt={`Asset ${asset}`}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 46,
            fontWeight: 200,
            color:
              "rgba(255,255,255,.75)",
          }}
        >
          +
        </div>
      )}
    </button>
  ))}
</div>

    <div
      style={{
        marginTop: 22,
        opacity: 0.6,
        fontSize: 15,
        lineHeight: 1.7,
      }}
    >
      Maximum 4 creative assets.
    </div>
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
                        height: 280,
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


        {/* ==========================================================
    OUTPUT CONFIGURATION + GENERATE
========================================================== */}

<div
  style={{
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: 28,
    marginBottom: 40,
  }}
>
  {/* OUTPUT FORMAT */}

  <div
    style={{
      padding: 30,
      borderRadius: 34,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        fontSize: 12,
        letterSpacing: 3,
        textTransform: "uppercase",
        opacity: 0.5,
        marginBottom: 18,
      }}
    >
      Output Format
    </div>

    <div
      style={{
        fontSize: 32,
        fontWeight: 300,
        marginBottom: 28,
      }}
    >
      Choose Final Output
    </div>

    <div
      style={{
        display: "flex",
        gap: 18,
        flexWrap: "wrap",
      }}
    >
      {[
  {
    label: "16:9",
    id: "landscape-16-9",
    previewWidth: 54,
    previewHeight: 30,
  },
  {
    label: "2:3",
    id: "portrait-2-3",
    previewWidth: 36,
    previewHeight: 54,
  },
  {
    label: "4:5",
    id: "portrait-4-5",
    previewWidth: 40,
    previewHeight: 50,
  },
  {
    label: "1:1",
    id: "square-1-1",
    previewWidth: 48,
    previewHeight: 48,
  },
  {
    label: "9:16",
    id: "portrait-9-16",
    previewWidth: 30,
    previewHeight: 54,
  },
].map((format) => (
        <button
          key={format.label}
          onClick={() =>
            setSelectedOutput(format.id)
          }
          style={{
            width: 88,
            height: 120,
            borderRadius: 18,
            border:
              selectedOutput === format.id
                ? "1px solid #D4AF37"
                : "1px solid rgba(255,255,255,.10)",
            background:
              selectedOutput === format.id
                ? "rgba(212,175,55,.08)"
                : "transparent",
            color: "white",
            cursor: "pointer",

            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: format.previewWidth,
              height: format.previewHeight,

              borderRadius: 4,

              border:
                selectedOutput === format.id
                  ? "2px solid #D4AF37"
                  : "2px solid rgba(255,255,255,.72)",

              background:
                selectedOutput === format.id
                  ? "rgba(212,175,55,.10)"
                  : "rgba(255,255,255,.03)",

              boxSizing: "border-box",
            }}
          />

          <div
            style={{
              marginTop: 14,
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            {format.label}
          </div>
        </button>
      ))}
    </div>
  </div>

  {/* BRANDING */}

  <div
    style={{
      padding: 30,
      borderRadius: 34,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.08)",
    }}
  >
    <div
      style={{
        fontSize: 12,
        letterSpacing: 3,
        textTransform: "uppercase",
        opacity: 0.5,
        marginBottom: 18,
      }}
    >
      Branding
    </div>

    <div
      style={{
        fontSize: 30,
        fontWeight: 300,
        marginBottom: 24,
      }}
    >
      Brand Logo
    </div>

    <label
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        fontSize: 18,
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
      />

      Include Brand Logo (Coming Soon)
    </label>

    <div
      style={{
        marginTop: 24,
        opacity: 0.65,
        lineHeight: 1.8,
      }}
    >
      Brand Logo support will be available in a future update.
      Once available, you will be able to automatically apply
      your Brand Logo to Editorial Creatives generated by MagicReel.

      <br />

    </div>
  </div>
</div>

{/* ==========================================================
    GENERATE
========================================================== */}

<div
  style={{
    padding: 34,
    borderRadius: 34,
    background:
      "linear-gradient(90deg,#241B2C,#38263D)",
    border:
      "1px solid rgba(212,175,55,.18)",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 30,
    flexWrap: "wrap",
  }}
>
  <div>
    <div
      style={{
        fontSize: 34,
        fontWeight: 300,
        marginBottom: 8,
      }}
    >
      Ready to Create Editorial?
    </div>

    <div
      style={{
        opacity: 0.68,
      }}
    >
      Hero, Editorial World and Output Settings are ready.
    </div>
  </div>

  <button
    onClick={generateCampaign}
    disabled={
      generating ||
      !heroCloudinaryUrl
    }
    style={{
      padding: "18px 42px",
      borderRadius: 999,
      border: "none",
      background: "#D4AF37",
      color: "#111",
      fontSize: 15,
      fontWeight: 600,
      cursor: "pointer",
    }}
  >
    {generating ? (
  <>
    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        lineHeight: 1.15,
      }}
    >
      Generating • {String(
        Math.floor(generationSeconds / 60)
      ).padStart(2, "0")}:
      {String(
        generationSeconds % 60
      ).padStart(2, "0")}
    </div>

    <div
      style={{
        marginTop: 4,
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.78,
      }}
    >
      1 ⚡ · ~2–3 min
    </div>
  </>
) : (
  <>
    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        lineHeight: 1.15,
      }}
    >
      Generate Editorial
    </div>

    <div
      style={{
        marginTop: 4,
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.78,
      }}
    >
      1 ⚡ · ~2–3 min
    </div>
  </>
)}
  </button>
</div>
      </div>
    <CampaignHeroPickerModal
  open={pickerOpen}
  onClose={() => setPickerOpen(false)}
  allowVideos={false}

  onSelect={(url) => {
  if (pickerTarget === "hero") {
    setHeroPreview(url);
    setHeroCloudinaryUrl(url);
  } else {
    const updated = [...assetPreviews];

    switch (pickerTarget) {
      case "asset1":
        updated[0] = url;
        break;

      case "asset2":
        updated[1] = url;
        break;

      case "asset3":
        updated[2] = url;
        break;

      case "asset4":
        updated[3] = url;
        break;
    }

    setAssetPreviews(updated);
  }

  setPickerOpen(false);
}}
/>

    </div>
  );
}

