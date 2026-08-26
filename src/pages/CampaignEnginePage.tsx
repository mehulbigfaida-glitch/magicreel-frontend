import React, { useState } from "react";
import AssetPickerModal from "./publish/AssetPickerModal";
import FeatureLockedModal from "../components/FeatureLockedModal";

type CampaignType =
  | "new-arrival"
  | "sale"
  | "festival"
  | "occasion"
  | "category"
  | "event";

type BackgroundStrategy =
  | "keep"
  | "remove"
  | "generate"
  | "upload";

const campaignTypes = [
  {
    id: "new-arrival",
    title: "🆕 New Arrival",
    subtitle:
      "Launch fresh collections and announce newly arrived products.",
  },

  {
    id: "sale",
    title: "🏷️ Sale Campaign",
    subtitle:
      "Promotions, discounts and limited-time offers.",
  },

  {
    id: "festival",
    title: "🎉 Festival Campaign",
    subtitle:
      "Diwali, Eid, Christmas, Navratri and seasonal celebrations.",
  },

  {
    id: "occasion",
    title: "💍 Occasion Campaign",
    subtitle:
      "Wedding, engagement, reception and celebration wear.",
  },

  {
    id: "category",
    title: "👗 Category Spotlight",
    subtitle:
      "Highlight sarees, kurtas, lehengas or specific collections.",
  },

  {
    id: "event",
    title: "📅 Event Invitation",
    subtitle:
      "Store launches, exhibitions and fashion events.",
  },
];

const backgroundStyles = [
  "Royal Wedding",
  "Luxury Ballroom",
  "Garden Wedding",
  "Luxury Boutique",
  "Festive Celebration",
  "Fashion Exhibition",
  "Premium Retail Store",
  "Heritage Palace",
];

export default function CampaignEnginePage() {
  const [heroPreview, setHeroPreview] =
    useState<string | null>(null);

  const [heroImageUrl, setHeroImageUrl] =
    useState("");

  const [logoPreview, setLogoPreview] =
    useState<string | null>(null);

  const [logoImageUrl, setLogoImageUrl] =
    useState("");

  const [
    backgroundPreview,
    setBackgroundPreview,
  ] = useState<string | null>(null);

  const [
    backgroundImageUrl,
    setBackgroundImageUrl,
  ] = useState("");

  const [
    selectedCampaign,
    setSelectedCampaign,
  ] = useState<CampaignType>(
    "new-arrival"
  );

  const [
    backgroundStrategy,
    setBackgroundStrategy,
  ] =
    useState<BackgroundStrategy>(
      "keep"
    );

  const [backgroundStyle, setBackgroundStyle] =
    useState("Royal Wedding");

  const [headline, setHeadline] =
    useState("NEW ARRIVALS");

  const [subheadline, setSubheadline] =
    useState(
      "Discover the latest collection."
    );

  const [cta, setCta] =
    useState("Shop Now");

    const [
    generating,
    setGenerating,
  ] = useState(false);

  const [
    lockedFeature,
    setLockedFeature,
  ] = useState<string | null>(null);

  const [
    showAssetPicker,
    setShowAssetPicker,
  ] = useState(false);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #171717 0%, #050505 60%)",
        color: "white",
        padding:
          "70px 22px 120px",
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
            Campaign
            <br />
            Engine
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
            Create high-converting fashion
            marketing campaigns from a
            single hero image.
          </p>
        </div>

        {/* HERO + LOGO */}

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
              Hero Image
            </div>

            <div
              style={{
                opacity: 0.68,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Upload a hero image or
              select an existing MagicReel
              asset.
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file =
                    e.target
                      .files?.[0];

                  if (!file) return;

                  setHeroPreview(
                    URL.createObjectURL(
                      file
                    )
                  );

                  const uploadedUrl =
                    await uploadToCloudinary(
                      file
                    );

                  setHeroImageUrl(
                    uploadedUrl
                  );
                }}
              />

              <button
                onClick={() =>
                  setShowAssetPicker(
                    true
                  )
                }
                style={{
                  padding:
                    "12px 18px",
                  borderRadius: 999,
                  border:
                    "1px solid rgba(255,255,255,0.2)",
                  background:
                    "transparent",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Select Existing Asset
              </button>
            </div>

            {heroPreview && (
              <img
                src={heroPreview}
                alt="Hero Preview"
                style={{
                  width: "100%",
                  height: 460,
                  borderRadius: 24,
                  objectFit:
                    "contain",
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
              Brand Logo
            </div>

            <div
              style={{
                opacity: 0.68,
                lineHeight: 1.8,
                marginBottom: 24,
              }}
            >
              Upload your logo for campaign
              branding.
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file =
                  e.target
                    .files?.[0];

                if (!file) return;

                setLogoPreview(
                  URL.createObjectURL(
                    file
                  )
                );

                const uploadedUrl =
                  await uploadToCloudinary(
                    file
                  );

                setLogoImageUrl(
                  uploadedUrl
                );
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
                }}
              />
            )}
          </div>
        </div>

                {/* CAMPAIGN TYPES */}

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
            What Do You Want To Communicate?
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
            }}
          >
            {campaignTypes.map(
              (campaign) => {
                const active =
                  selectedCampaign ===
                  campaign.id;

                return (
                  <button
                    key={campaign.id}
                    onClick={() =>
                      setSelectedCampaign(
                        campaign.id as CampaignType
                      )
                    }
                    style={{
                      textAlign:
                        "left",

                      padding: 28,

                      borderRadius: 28,

                      cursor:
                        "pointer",

                      background:
                        active
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(255,255,255,0.03)",

                      border:
                        active
                          ? "1px solid rgba(255,255,255,0.30)"
                          : "1px solid rgba(255,255,255,0.08)",

                      color:
                        "white",

                      transition:
                        "all 0.2s ease",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight:
                          300,
                        marginBottom: 12,
                      }}
                    >
                      {
                        campaign.title
                      }
                    </div>

                    <div
                      style={{
                        opacity:
                          0.72,

                        lineHeight:
                          1.8,

                        fontSize: 14,
                      }}
                    >
                      {
                        campaign.subtitle
                      }
                    </div>
                  </button>
                );
              }
            )}
          </div>
        </div>

        {/* BACKGROUND STRATEGY */}

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
            Background Strategy
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 20,
            }}
          >
            {[
              {
                id: "keep",
                title:
                  "Keep Existing Background",
              },

              {
                id: "remove",
                title:
                  "Remove Background",
              },

              {
                id: "generate",
                title:
                  "Generate AI Background",
              },

              {
                id: "upload",
                title:
                  "Upload Background",
              },
            ].map((item) => {
              const active =
                backgroundStrategy ===
                item.id;

              return (
                <button
                  key={item.id}
                  onClick={() =>
                    setBackgroundStrategy(
                      item.id as BackgroundStrategy
                    )
                  }
                  style={{
                    padding: 24,

                    borderRadius: 24,

                    textAlign:
                      "left",

                    cursor:
                      "pointer",

                    background:
                      active
                        ? "rgba(255,255,255,0.08)"
                        : "rgba(255,255,255,0.03)",

                    border:
                      active
                        ? "1px solid rgba(255,255,255,0.28)"
                        : "1px solid rgba(255,255,255,0.08)",

                    color:
                      "white",
                  }}
                >
                  <div
                    style={{
                      fontSize: 22,
                      fontWeight:
                        300,
                    }}
                  >
                    {item.title}
                  </div>
                </button>
              );
            })}
          </div>

          {/* AI BG */}

          {backgroundStrategy ===
            "generate" && (
            <div
              style={{
                marginTop: 28,
              }}
            >
              <label
                style={{
                  display:
                    "block",
                  marginBottom: 12,
                  opacity: 0.7,
                }}
              >
                Background Style
              </label>

              <select
                value={
                  backgroundStyle
                }
                onChange={(e) =>
                  setBackgroundStyle(
                    e.target.value
                  )
                }
                style={{
                  width: "100%",
                  padding: 18,
                  borderRadius: 18,
                  border:
                    "1px solid rgba(255,255,255,0.12)",
                  background:
                    "#101010",
                  color:
                    "white",
                }}
              >
                {backgroundStyles.map(
                  (
                    style
                  ) => (
                    <option
                      key={
                        style
                      }
                    >
                      {style}
                    </option>
                  )
                )}
              </select>
            </div>
          )}

          {/* UPLOAD BG */}

          {backgroundStrategy ===
            "upload" && (
            <div
              style={{
                marginTop: 28,
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={async (
                  e
                ) => {
                  const file =
                    e.target
                      .files?.[0];

                  if (
                    !file
                  )
                    return;

                  setBackgroundPreview(
                    URL.createObjectURL(
                      file
                    )
                  );

                  const uploadedUrl =
                    await uploadToCloudinary(
                      file
                    );

                  setBackgroundImageUrl(
                    uploadedUrl
                  );
                }}
              />

              {backgroundPreview && (
                <img
                  src={
                    backgroundPreview
                  }
                  alt="Background"
                  style={{
                    width:
                      "100%",
                    marginTop: 20,
                    borderRadius: 24,
                    maxHeight:
                      400,
                    objectFit:
                      "cover",
                  }}
                />
              )}
            </div>
          )}
        </div>

        {/* CAMPAIGN COPY */}

        <div
          style={{
            marginBottom: 60,

            padding: 34,

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
              marginBottom: 24,
            }}
          >
            Campaign Copy
          </div>

          <InputLabel>
            Headline
          </InputLabel>

          <Input
            value={headline}
            onChange={(e) =>
              setHeadline(
                e.target.value
              )
            }
          />

          <InputLabel>
            Subheadline
          </InputLabel>

          <Input
            value={
              subheadline
            }
            onChange={(e) =>
              setSubheadline(
                e.target.value
              )
            }
          />

          <InputLabel>
            Call To Action
          </InputLabel>

          <Input
            value={cta}
            onChange={(e) =>
              setCta(
                e.target.value
              )
            }
          />

          <button
            style={{
              marginTop: 24,

              padding:
                "14px 24px",

              borderRadius:
                999,

              border:
                "1px solid rgba(255,255,255,0.15)",

              background:
                "transparent",

              color:
                "white",

              cursor:
                "pointer",
            }}
          >
            🔄 Regenerate Copy
          </button>
        </div>

       {/* GENERATE */}

        <div
          style={{
            textAlign: "center",
            marginBottom: 80,
          }}
        >
          <button
            disabled={false}
            onClick={async () => {
              try {
                setGenerating(true);

                console.log(
  "STATE BEFORE PAYLOAD",
  {
    heroImageUrl,
    logoImageUrl,
    heroPreview,
    logoPreview,
  }
);

                const payload = {


                    assetType:
                    "campaign",

                  heroImageUrl,

                  logoImageUrl,

                  campaignType:
                    selectedCampaign,

                  backgroundStrategy,

                  backgroundStyle,

                  backgroundImageUrl,

                  headline,

                  subheadline,

                  cta,

                  };

console.log(
  "PAYLOAD ABOUT TO SEND",
  payload
);

                alert("STEP A");

console.log(
  "CAMPAIGN PAYLOAD",
  payload
);

alert("STEP B");

console.log("STEP 1");

const token =
  localStorage.getItem("token");

console.log("STEP 2", token);

const BACKEND_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL;

console.log("STEP 3", BACKEND_URL);

console.log("STEP 4");

const response =
  await fetch(
    `${BACKEND_URL}/api/campaigns/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",

        Authorization:
          `Bearer ${token}`,
      },

      body: JSON.stringify(
        payload
      ),
    }
  );

const data =
  await response.json();

console.log(
  "CAMPAIGN RESPONSE",
  data
);

if (
  data?.error === "Insufficient credits" ||
  data?.error === "No credits left"
) {
  setGenerating(false);

  setLockedFeature("Campaign Generation");

  return;
}

if (!response.ok) {
  throw new Error(
    data?.error ||
      "Campaign generation failed"
  );
}

if (
  data?.campaignId
) {

  window.open(
    `/campaign/${data.campaignId}`,
    "_blank"
  );

} else {

  throw new Error(
    "Campaign ID missing"
  );

}
                /*
                FUTURE

                const token =
                  localStorage.getItem(
                    "token"
                  );

                const response =
                  await fetch(
                    `${API_BASE}/api/campaign-engine/generate`,
                    {
                      method: "POST",

                      headers: {
                        "Content-Type":
                          "application/json",

                        Authorization:
                          `Bearer ${token}`,
                      },

                      body:
                        JSON.stringify(
                          payload
                        ),
                    }
                  );

                const data =
                  await response.json();

                navigate(
                  `/predictions/${data.id}`
                );
                */
              } catch (err) {
                console.error(err);

                alert(
                  "Failed to generate campaign."
                );
              } finally {
                setGenerating(false);
              }
            }}
            style={{
              padding:
                "20px 42px",

              borderRadius:
                999,

              border: "none",

              fontSize: 18,

              fontWeight: 600,

              cursor: "pointer",

              background:
                "white",

              color:
                "black",

              minWidth: 280,
            }}
          >
            {generating
              ? "Generating Campaign..."
              : "Generate Campaign Creative"}
          </button>

          <FeatureLockedModal
            open={lockedFeature !== null}
            title={
              lockedFeature === "Campaign Generation"
                ? "Insufficient Credit"
                : "Upgrade Required"
            }
            description={
              lockedFeature === "Campaign Generation"
                ? "You don't have enough credits to generate this Campaign. Upgrade your plan or add credits to continue."
                : "This feature is available on higher plans. Upgrade your subscription to unlock premium AI content packs."
            }
            featureName={
              lockedFeature === "Campaign Generation"
                ? undefined
                : lockedFeature ?? undefined
            }
            primaryLabel={
              lockedFeature === "Campaign Generation"
                ? "Upgrade / Add Credit"
                : "Upgrade Plan"
            }
            onClose={() => setLockedFeature(null)}
          />

          <div
            style={{
              marginTop: 16,
              opacity: 0.55,
              fontSize: 14,
            }}
          >
            1 ⚡
          </div>
        </div>

        </div>

      {/* ASSET PICKER */}

      <AssetPickerModal
  open={showAssetPicker}
  allowVideos={false}
  onClose={() =>
    setShowAssetPicker(
      false
    )
  }
        onSelect={(
          url,
          _type,
          heroUrl
        ) => {
          setHeroPreview(
            heroUrl || url
          );

          setHeroImageUrl(
            heroUrl || url
          );

          setShowAssetPicker(
            false
          );
        }}
      />
    </div>
  );
}

/* ---------------------------------- */
/* Helpers                            */
/* ---------------------------------- */

function InputLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 18,
        marginBottom: 10,
        opacity: 0.72,
        fontSize: 14,
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
        padding: 18,
        borderRadius: 18,
        border:
          "1px solid rgba(255,255,255,0.12)",
        background:
          "#101010",
        color: "white",
        fontSize: 15,
      }}
    />
  );
}