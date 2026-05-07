import { useEffect, useState } from "react";


type CreativeGoal =
  | "lookbook"
  | "instagram"
  | "tradeshow"
  | "sale"
  | "reel-cover";

const creativeGoals: {
  value: CreativeGoal;
  title: string;
  subtitle: string;
  accent: string;
}[] = [
  {
    value: "lookbook",
    title: "Lookbook Campaign",
    subtitle:
      "Luxury editorial fashion campaign with premium composition and storytelling.",
    accent:
      "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
  },

  {
    value: "instagram",
    title: "Instagram Promo",
    subtitle:
      "Social-first high engagement creative optimized for modern fashion brands.",
    accent:
      "linear-gradient(135deg, rgba(120,119,198,0.22), rgba(255,255,255,0.02))",
  },

  {
    value: "tradeshow",
    title: "Tradeshow Creative",
    subtitle:
      "Exhibition-ready promotional visual with branding and campaign presence.",
    accent:
      "linear-gradient(135deg, rgba(255,180,120,0.18), rgba(255,255,255,0.02))",
  },

  {
    value: "sale",
    title: "Sale Campaign",
    subtitle:
      "High-converting promotional campaign creative for launches and offers.",
    accent:
      "linear-gradient(135deg, rgba(255,80,80,0.18), rgba(255,255,255,0.02))",
  },

  {
    value: "reel-cover",
    title: "Reel Cover",
    subtitle:
      "Cinematic vertical promotional artwork optimized for reels and shorts.",
    accent:
      "linear-gradient(135deg, rgba(80,180,255,0.18), rgba(255,255,255,0.02))",
  },
];

export default function SocialPackPage() {
  /* =========================================================
     STATES
  ========================================================= */

  const [heroPreview, setHeroPreview] =
  useState<string | null>(null);

const [logoPreview, setLogoPreview] =
  useState<string | null>(null);

const [heroImageUrl, setHeroImageUrl] =
  useState("");

const [logoImageUrl, setLogoImageUrl] =
  useState("");

  const [brandName, setBrandName] =
    useState("");

  const [heading, setHeading] =
    useState("");

  const [subheading, setSubheading] =
    useState("");

  const [creativeDirection, setCreativeDirection] =
    useState("Luxury Editorial");

  const [replaceBackground, setReplaceBackground] =
    useState(false);

  const [backgroundPrompt, setBackgroundPrompt] =
    useState("");

  const [elements, setElements] = useState<
    string[]
  >([]);

  const [showAdvanced, setShowAdvanced] =
    useState(false);

  const [isGenerating, setIsGenerating] =
    useState(false);

  const [selectedGoals, setSelectedGoals] = useState<CreativeGoal[]>([]);
  const [results, setResults] = useState<Record<string, string> | null>(null);

  /* =========================================================
     HERO FROM QUERY
  ========================================================= */

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    const hero = params.get("hero");

    if (hero) {
      setHeroPreview(hero);
    }
  }, []);

  /* =========================================================
     HELPERS
  ========================================================= */

  const canGenerate = !!heroPreview && selectedGoals.length > 0;

  const toggleElement = (item: string) => {
    setElements((prev) => {
      if (prev.includes(item)) {
        return prev.filter((i) => i !== item);
      }

      return [...prev, item];
    });
  };

  /* =========================================================
   HANDLERS
========================================================= */

const uploadToCloudinary = async (
  file: File
) => {

  const formData = new FormData();

  formData.append("file", file);

  formData.append(
    "upload_preset",
    "magicreel"
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${
      import.meta.env
        .VITE_CLOUDINARY_CLOUD_NAME
    }/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  return data.secure_url;
};

const handleHeroUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  const preview =
    URL.createObjectURL(file);

  setHeroPreview(preview);

  const uploadedUrl =
    await uploadToCloudinary(file);

  setHeroImageUrl(uploadedUrl);

  console.log(
    "HERO URL:",
    uploadedUrl
  );
};

const handleLogoUpload = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  const file = e.target.files?.[0];

  if (!file) return;

  const preview =
    URL.createObjectURL(file);

  setLogoPreview(preview);

  const uploadedUrl =
    await uploadToCloudinary(file);

  setLogoImageUrl(uploadedUrl);

  console.log(
    "LOGO URL:",
    uploadedUrl
  );
};

const handleGenerate = async () => {

  try {

    setIsGenerating(true);

    const payload = {
      mode: "social-pack",

      outputs: selectedGoals,

      inputs: {
        heroImage:
          heroImageUrl,

        logo:
          logoImageUrl,

        brandName,
        heading,
        subheading,
        creativeDirection,

        replaceBackground,
        backgroundPrompt,

        elements,
      },
    };

    console.log(
      "SOCIAL PAYLOAD:",
      payload
    );

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/social-pack/generate`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify(
          payload
        ),
      }
    );

    const data =
      await response.json();

    console.log(
      "SOCIAL RESULT:",
      data
    );

    setResults(
      data.results || {}
    );

    setIsGenerating(false);

  } catch (err) {

    console.error(err);

    setIsGenerating(false);
  }
};

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #161922 0%, #0a0c12 60%)",
        color: "#fff",
        padding:
          "72px 20px 140px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 860,
          margin: "0 auto",
        }}
      >
        {/* ========================================================= */}
        {/* HERO HEADER */}
        {/* ========================================================= */}

        <div
          style={{
            textAlign: "center",
            marginBottom: 64,
          }}
        >
          <div
            style={{
              fontSize: 13,
              letterSpacing: 3,
              textTransform: "uppercase",
              opacity: 0.45,
              marginBottom: 18,
            }}
          >
            MagicReel AI Studio
          </div>

          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 74px)",
              lineHeight: 0.95,
              letterSpacing: -3,
              fontWeight: 700,
              marginBottom: 24,
            }}
          >
            Create
            <br />
            Social Pack
          </h1>

          <p
            style={{
              maxWidth: 680,
              margin: "0 auto",
              fontSize: 18,
              lineHeight: 1.9,
              opacity: 0.68,
            }}
          >
            Upload your hero image, choose a
            creative goal, and let AI generate
            premium fashion marketing visuals.
          </p>
        </div>

        {/* ========================================================= */}
        {/* HERO INPUT */}
        {/* ========================================================= */}

        <SectionCard>
          <SectionLabel>
            Hero Image
          </SectionLabel>

          <UploadZone>
            {heroPreview ? (
              <img
                src={heroPreview}
                alt="Hero"
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
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Upload Hero Image
                </div>

                <div
                  style={{
                    opacity: 0.58,
                    lineHeight: 1.8,
                    fontSize: 15,
                  }}
                >
                  Fashion model • Product •
                  Campaign visual
                </div>
              </div>
            )}
          </UploadZone>

          <div
            style={{
              marginTop: 22,
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleHeroUpload}
            />
          </div>
        </SectionCard>

        {/* ========================================================= */}
        {/* CREATIVE GOAL */}
        {/* ========================================================= */}

        <div
          style={{
            marginTop: 46,
            marginBottom: 30,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 700,
              letterSpacing: -1,
              marginBottom: 14,
            }}
          >
            What do you want to create?
          </div>

          <div
            style={{
              opacity: 0.82,
              fontSize: 16,
              lineHeight: 1.8,
              maxWidth: 680,
            }}
          >
            Select the creative outcome you
            want MagicReel AI to generate.
          </div>
        </div>

        {/* ========================================================= */}
        {/* GOAL CARDS */}
        {/* ========================================================= */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 22,
          }}
        >
          {creativeGoals.map((goal) => {
            const active = selectedGoals.includes(goal.value);

            return (
              <button
                key={goal.value}
                onClick={() => {
  setSelectedGoals((prev) => {
    if (prev.includes(goal.value)) {
      return prev.filter((g) => g !== goal.value);
    }
    return [...prev, goal.value];
  });
}}
                style={{
                  border: active
                    ? "1px solid rgba(255,255,255,0.24)"
                    : "1px solid rgba(255,255,255,0.06)",
                  background:
                    goal.accent,
                  backdropFilter:
                    "blur(10px)",
                  borderRadius: 32,
                  padding: 30,
                  textAlign: "left",
                  cursor: "pointer",
                  transition:
                    "all 0.2s ease",
                  minHeight: 220,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* GLOW */}

                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      active
                        ? "radial-gradient(circle at top right, rgba(255,255,255,0.12), transparent 45%)"
                        : "transparent",
                    pointerEvents:
                      "none",
                  }}
                />

                {/* ACTIVE PILL */}

                {active && (
                  <div
                    style={{
                      position: "absolute",
                      top: 18,
                      right: 18,
                      background: "#fff",
                      color: "#000",
                      padding:
                        "8px 12px",
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700,
                    }}
                  >
                    SELECTED
                  </div>
                )}

                {/* CONTENT */}

                <div
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      fontSize: 28,
                      fontWeight: 700,
                      color: "#fff",
                      lineHeight: 1.1,
                      letterSpacing: -1,
                      marginBottom: 16,
                    }}
                  >
                    {goal.title}
                  </div>

                  <div
                    style={{
                      opacity: 0.88,
                      color: "rgba(255,255,255,0.82)",
                      lineHeight: 1.9,
                      fontSize: 15,
                    }}
                  >
                    {goal.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* ========================================================= */}
        {/* ADVANCED */}
        {/* ========================================================= */}

        <div
          style={{
            marginTop: 54,
          }}
        >
          <button
            onClick={() =>
              setShowAdvanced(
                (prev) => !prev
              )
            }
            style={{
              width: "100%",
              border:
                "1px solid rgba(255,255,255,0.06)",
              background:
                "rgba(255,255,255,0.03)",
              borderRadius: 28,
              padding:
                "24px 26px",
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  marginBottom: 4,
                }}
              >
                Optional Creative Inputs
              </div>

              <div
                style={{
                  opacity: 0.58,
                  fontSize: 14,
                }}
              >
                Add branding, campaign text,
                styling direction, and more.
              </div>
            </div>

            <div
              style={{
                opacity: 0.45,
                fontSize: 14,
              }}
            >
              {showAdvanced
                ? "Hide"
                : "Optional"}
            </div>
          </button>

          {/* ADVANCED PANEL */}

          {showAdvanced && (
            <div
              style={{
                marginTop: 26,
                background:
                  "rgba(255,255,255,0.03)",
                border:
                  "1px solid rgba(255,255,255,0.06)",
                borderRadius: 32,
                padding: 34,
              }}
            >
              {/* BRANDING */}

              <InputLabel>
                Brand Name
              </InputLabel>

              <Input
                placeholder="Enter brand name"
                value={brandName}
                onChange={(e) =>
                  setBrandName(
                    e.target.value
                  )
                }
              />

              {/* HEADING */}

              <InputLabel>
                Heading
              </InputLabel>

              <Input
                placeholder="Campaign heading"
                value={heading}
                onChange={(e) =>
                  setHeading(
                    e.target.value
                  )
                }
              />

              {/* SUBHEADING */}

              <InputLabel>
                Subheading
              </InputLabel>

              <Input
                placeholder="Campaign subheading"
                value={subheading}
                onChange={(e) =>
                  setSubheading(
                    e.target.value
                  )
                }
              />

              {/* LOGO */}

              <InputLabel>
                Upload Logo
              </InputLabel>

              {logoPreview && (
                <div
                  style={{
                    marginBottom: 18,
                  }}
                >
                  <img
                    src={logoPreview}
                    alt="Logo"
                    style={{
                      width: 110,
                      height: 110,
                      borderRadius: 20,
                      objectFit:
                        "contain",
                      background:
                        "#fff",
                      padding: 10,
                    }}
                  />
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
              />

              {/* CREATIVE DIRECTION */}

              <InputLabel>
                Creative Direction
              </InputLabel>

              <select
                value={
                  creativeDirection
                }
                onChange={(e) =>
                  setCreativeDirection(
                    e.target.value
                  )
                }
                style={selectStyle}
              >
                <option>
                  Luxury Editorial
                </option>

                <option>
                  Streetwear
                </option>

                <option>
                  Minimal Fashion
                </option>

                <option>
                  Festive Couture
                </option>

                <option>
                  High Fashion
                </option>
              </select>

              {/* ELEMENTS */}

              <InputLabel>
                Add Elements
              </InputLabel>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                {[
                  "Handbag",
                  "Jewellery",
                  "Sunglasses",
                  "Watch",
                  "Studio Props",
                  "High Heels",
                ].map((item) => {
                  const active =
                    elements.includes(
                      item
                    );

                  return (
                    <button
                      key={item}
                      onClick={() =>
                        toggleElement(
                          item
                        )
                      }
                      style={{
                        border: "none",
                        borderRadius: 999,
                        padding:
                          "12px 18px",
                        background: active
                          ? "#fff"
                          : "#262c38",
                        color: active
                          ? "#000"
                          : "#fff",
                        cursor: "pointer",
                        fontSize: 14,
                      }}
                    >
                      {item}
                    </button>
                  );
                })}
              </div>

              {/* BACKGROUND */}

              <InputLabel>
                Background Direction
              </InputLabel>

              <label
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems:
                    "center",
                  marginBottom: 16,
                }}
              >
                <input
                  type="checkbox"
                  checked={
                    replaceBackground
                  }
                  onChange={(e) =>
                    setReplaceBackground(
                      e.target.checked
                    )
                  }
                />

                Replace Background
              </label>

              {replaceBackground && (
                <textarea
                  rows={4}
                  placeholder="Describe the desired environment..."
                  value={
                    backgroundPrompt
                  }
                  onChange={(e) =>
                    setBackgroundPrompt(
                      e.target.value
                    )
                  }
                  style={textareaStyle}
                />
              )}
            </div>
          )}
        </div>

        {/* ========================================================= */}
{/* GENERATE */}
{/* ========================================================= */}

<button
  disabled={
    !canGenerate ||
    isGenerating
  }
  onClick={handleGenerate}
  style={{
    width: "100%",
    marginTop: 52,
    border: "none",
    borderRadius: 32,
    padding: "28px 30px",
    background:
      !canGenerate ||
      isGenerating
        ? "#2d3442"
        : "#ffffff",
    color:
      !canGenerate ||
      isGenerating
        ? "#95a0b4"
        : "#000",
    fontWeight: 700,
    fontSize: 20,
    cursor:
      !canGenerate ||
      isGenerating
        ? "not-allowed"
        : "pointer",
    transition: "all 0.2s ease",
  }}
>
  {isGenerating
    ? "Generating Social Pack..."
    : `Generate ${selectedGoals.length} Creative${
        selectedGoals.length > 1 ? "s" : ""
      }`}
</button>

{/* ========================================================= */}
{/* RESULTS */}
{/* ========================================================= */}

{results && (
  <div style={{ marginTop: 60 }}>
    <h2 style={{ marginBottom: 20 }}>
      Your Social Pack
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 20,
      }}
    >
      {Object.entries(results).map(([key, url]) => (
        <div key={key}>
          <img
            src={url}
            style={{
              width: "100%",
              borderRadius: 16,
            }}
          />
          <div style={{ marginTop: 10 }}>
            {key}
          </div>
        </div>
      ))}
    </div>
  </div>
)}

      </div>
    </div>
  );
}

/* =========================================================
   HELPERS
========================================================= */

function SectionCard({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,0.03)",
        border:
          "1px solid rgba(255,255,255,0.06)",
        borderRadius: 36,
        padding: 32,
      }}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 18,
      }}
    >
      {children}
    </div>
  );
}

function UploadZone({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: "100%",
        minHeight: 420,
        borderRadius: 30,
        border:
          "1px dashed rgba(255,255,255,0.12)",
        background:
          "#0d1016",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {children}
    </div>
  );
}

function InputLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 26,
        marginBottom: 12,
        fontSize: 15,
        fontWeight: 600,
        opacity: 0.92,
      }}
    >
      {children}
    </div>
  );
}

function Input(
  props: React.InputHTMLAttributes<HTMLInputElement>
) {
  return (
    <input
      {...props}
      style={{
        width: "100%",
        background:
          "#1b212d",
        border:
          "1px solid rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 18,
        color: "#fff",
        outline: "none",
        fontSize: 15,
      }}
    />
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  background: "#1b212d",
  border:
    "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  padding: 18,
  color: "#fff",
  outline: "none",
  fontSize: 15,
};

const textareaStyle: React.CSSProperties =
  {
    width: "100%",
    background:
      "#1b212d",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: 18,
    padding: 18,
    color: "#fff",
    outline: "none",
    fontSize: 15,
    resize: "vertical",
  };