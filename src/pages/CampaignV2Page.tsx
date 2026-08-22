// CampaignV2Page.tsx

import { useCallback, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

import {
  generateCampaign as generateCampaignApi,
} from "../services/campaignService";

import {
  Upload,
  ImagePlus,
  Sparkles,
  Loader2,
  ChevronRight,
  X,
} from "lucide-react";

import { uploadToCloudinary } from "../api/cloudinary";

import "./CampaignV2Page.css";

import CampaignHeroPickerModal from "./campaign/CampaignHeroPickerModal";

type Asset = {
  id: string;
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
};

export default function CampaignV2Page() {

  // const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

const [campaignReady, setCampaignReady] =
  useState(false);

const [generatedCampaignId, setGeneratedCampaignId] =
  useState("");

const [popupBlocked, setPopupBlocked] =
  useState(false);

const [assetModalOpen, setAssetModalOpen] =
  useState(false);

const [pickerTarget, setPickerTarget] =
  useState<"hero" | "asset">("asset");

/**
 * Upload states
 */

const [heroUploading, setHeroUploading] =
  useState(false);

const [logoUploading, setLogoUploading] =
  useState(false);

/**
 * Preview render states
 */

const [heroImageLoaded, setHeroImageLoaded] =
  useState(false);

const [logoImageLoaded, setLogoImageLoaded] =
  useState(false);

/**
 * Images
 */

const [heroImageUrl, setHeroImageUrl] =
  useState("");

const [logoUrl, setLogoUrl] =
  useState("");

/**
 * Supporting Assets
 */

const [
  supportingAssets,
  setSupportingAssets,
] = useState<Asset[]>([]);

/**
 * Campaign Copy
 */

const [headline, setHeadline] =
  useState("");

const [subheadline, setSubheadline] =
  useState("");

const [cta, setCta] =
  useState("");
  /**
   * Validation
   */

  const canGenerate = useMemo(() => {

    return (
      heroImageUrl.length > 0 &&
      headline.trim().length > 0 &&
      cta.trim().length > 0 &&
      !loading
    );

  }, [
    heroImageUrl,
    headline,
    cta,
    loading,
  ]);

  /**
   * Upload Hero
   */

  const uploadHero = useCallback(

    async (file: File) => {

      setHeroUploading(true);
      setHeroImageLoaded(false);

      try {

        const url =
          await uploadToCloudinary(file);

        setHeroImageUrl(url);

      } catch (err) {

        setHeroUploading(false);

        throw err;

      }

    },

    []

  );

  /**
   * Upload Logo
   */

  const uploadLogo = useCallback(

    async (file: File) => {

      setLogoUploading(true);
      setLogoImageLoaded(false);

      try {

        const url =
          await uploadToCloudinary(file);

        setLogoUrl(url);

      } catch (err) {

        setLogoUploading(false);

        throw err;

      }

    },

    []

  );

  /**
   * Hero Change
   */

  const onHeroChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (loading) return;

    const file =
      e.target.files?.[0];

    if (!file) return;

    await uploadHero(file);

  };

  /**
   * Logo Change
   */

  const onLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    if (loading) return;

    const file =
      e.target.files?.[0];

    if (!file) return;

    await uploadLogo(file);

  };

  /**
   * Remove Asset
   */

  const removeAsset = (
    id: string
  ) => {

    if (loading) return;

    setSupportingAssets(prev =>
      prev.filter(
        asset => asset.id !== id
      )
    );

  };

  /**
 * Asset Picker
 */

const openAssetPicker = () => {

  if (loading) return;

  setPickerTarget("asset");
  setAssetModalOpen(true);

};

const onAssetsSelected = (
  url: string,
  _type: string,
  _heroUrl?: string
) => {

  if (loading) {

    setAssetModalOpen(false);

    return;

  }

  setSupportingAssets(prev => {

    if (prev.length >= 4)
      return prev;

    return [

      ...prev,

      {
        id: crypto.randomUUID(),
        url,
      },

    ];

  });

  setAssetModalOpen(false);

};

const onHeroSelected = (
  url: string,
  _type: string,
  _heroUrl?: string
) => {

  if (loading) {

    setAssetModalOpen(false);

    return;

  }

  setHeroUploading(true);

  setHeroImageLoaded(false);

  setHeroImageUrl(url);

  setPickerTarget("asset");

  setAssetModalOpen(false);

};

  /**
   * Generate Campaign
   */

  const generateCampaign = async () => {

  if (!canGenerate)
    return;

  try {

    setLoading(true);

    setCampaignReady(false);
    setPopupBlocked(false);
    setGeneratedCampaignId("");

    const response =
      await generateCampaignApi({

        heroImageUrl,

        supportingHeroUrls:
          supportingAssets.map(
            asset => asset.url
          ),

        logoUrl,

        headline,

        subheadline,

        cta,

      });

    const campaignId =
      response.data.campaignId;

    setGeneratedCampaignId(campaignId);
    setCampaignReady(true);

    const newTab = window.open(
      `/campaign/${campaignId}`,
      "_blank"
    );

    if (!newTab) {
      setPopupBlocked(true);
    }

  } catch (error) {

    console.error(
      "Campaign generation failed:",
      error
    );

  } finally {

    setLoading(false);

  }

};

  return (

    <div className="campaign-page">

      <div className="campaign-container">

        <div className="campaign-header">

          <div className="campaign-title-area">

            <div className="campaign-badge">
              <Sparkles size={18} />
              <span>Campaign Studio</span>
            </div>

            <h1>Create Campaign</h1>

            <p>
              Upload your Hero image, supporting assets and campaign copy
              to generate a complete AI marketing campaign.
            </p>

          </div>

        </div>

        <div className="campaign-body">

          {/* ===========================
              LEFT COLUMN
          ============================ */}

          <div className="campaign-left">

            {/* ===========================
                MASTER HERO
            ============================ */}

            <div className="campaign-card">

              <h2 className="mb-6 text-xl font-semibold text-white">
                Master Hero
              </h2>

              {heroImageUrl ? (

                <>

                  <div
                    className="campaign-hero-preview"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >

                    <img
                      src={heroImageUrl}
                      alt="Master Hero"
                      className="campaign-hero-image"
                      style={{
                        opacity: heroImageLoaded ? 1 : 0,
                        transition: "opacity .35s ease",
                      }}
                      onLoad={() => {
                        setHeroImageLoaded(true);
                        setHeroUploading(false);
                      }}
                      onError={() => {
                        setHeroUploading(false);
                      }}
                    />

                    {(heroUploading || !heroImageLoaded) && (

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(12,14,18,.82)",
                          backdropFilter: "blur(8px)",
                          zIndex: 10,
                          gap: 14,
                        }}
                      >

                        <Loader2
                          size={34}
                          className="animate-spin text-violet-400"
                        />

                        <div
                          style={{
                            color: "#fff",
                            fontWeight: 600,
                          }}
                        >
                          Preparing Hero Preview
                        </div>

                        <div
                          style={{
                            color: "#98a2b3",
                            fontSize: 13,
                          }}
                        >
                          Rendering high quality preview...
                        </div>

                      </div>

                    )}

                  </div>

                  <button
  type="button"
  className="campaign-replace-button"
  disabled={loading}
  onClick={() => {

    if (loading) return;

    setPickerTarget("hero");

    setAssetModalOpen(true);

  }}
  style={{
    pointerEvents: loading ? "none" : "auto",
    opacity: loading ? 0.5 : 1,
  }}
>

  Replace Hero

</button>

                </>

              ) : (

                <div
  className="campaign-upload-box"
  onClick={() => {

    if (loading) return;

    setPickerTarget("hero");

    setAssetModalOpen(true);

  }}
  style={{
    cursor: loading ? "default" : "pointer",
  }}
>

                  {heroUploading ? (

                    <Loader2
                      className="h-10 w-10 animate-spin text-violet-400"
                    />

                  ) : (

                    <Upload
                      className="h-12 w-12 text-violet-400"
                    />

                  )}

                  <div className="campaign-upload-title">

                    {heroUploading
                      ? "Uploading Hero..."
                      : "Upload Master Hero"}

                  </div>

                  <div className="campaign-upload-subtitle">

                    {heroUploading
                      ? "Preparing preview..."
                      : "JPG, PNG or WEBP"}

                  </div>

                  

                </div>

              )}

            </div>

            {/* ===========================
                SUPPORTING ASSETS
            ============================ */}

            <div className="campaign-card">

              <div className="campaign-card-header">

                <div>

                  <h2>
                    Supporting Assets
                  </h2>

                  <p className="campaign-card-subtitle">
                    Maximum 4 assets
                  </p>

                </div>

                <button
                  onClick={openAssetPicker}
                  disabled={loading}
                  className="campaign-button"
                >

                  <ImagePlus className="mr-2 h-4 w-4" />

                  Select Assets

                </button>

              </div>

              <div className="campaign-thumbnail-strip">

                {supportingAssets.length === 0 && (

                  <div className="campaign-empty-assets">
                    No supporting assets selected • Maximum 4 assets
                  </div>

                )}

                {supportingAssets.map(asset => (

                  <div
                    key={asset.id}
                    className="campaign-thumbnail"
                  >

                    <img
                      src={asset.thumbnailUrl || asset.url}
                      className="campaign-thumbnail-image"
                    />

                    <button
                      className="campaign-remove-button"
                      disabled={loading}
                      onClick={() => removeAsset(asset.id)}
                    >
                      <X size={12} />
                    </button>

                  </div>

                ))}

              </div>

            </div>

            {/* ===========================
                BRAND LOGO
            ============================ */}

            <div className="campaign-card">

              <h2 className="mb-6 text-xl font-semibold text-white">
                Brand Logo
              </h2>

              {logoUrl ? (

                <>

                  <div
                    className="campaign-logo-preview"
                    style={{
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >

                    <img
                      src={logoUrl}
                      alt="Brand Logo"
                      className="campaign-logo-image"
                      style={{
                        opacity: logoImageLoaded ? 1 : 0,
                        transition: "opacity .35s ease",
                      }}
                      onLoad={() => {
                        setLogoImageLoaded(true);
                        setLogoUploading(false);
                      }}
                      onError={() => {
                        setLogoUploading(false);
                      }}
                    />

                    {(logoUploading || !logoImageLoaded) && (

                      <div
                        style={{
                          position: "absolute",
                          inset: 0,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          gap: 14,
                          background: "rgba(12,14,18,.82)",
                          backdropFilter: "blur(8px)",
                          zIndex: 10,
                        }}
                      >

                        <Loader2
                          size={30}
                          className="animate-spin text-violet-400"
                        />

                        <div
                          style={{
                            color: "#ffffff",
                            fontWeight: 600,
                          }}
                        >
                          Preparing Logo Preview
                        </div>

                        <div
                          style={{
                            color: "#98a2b3",
                            fontSize: 13,
                          }}
                        >
                          Rendering high quality preview...
                        </div>

                      </div>

                    )}

                  </div>

                  <label
                    className="campaign-replace-button"
                    style={{
                      pointerEvents: loading ? "none" : "auto",
                      opacity: loading ? .5 : 1,
                    }}
                  >

                    Replace Logo

                    <input
                      hidden
                      type="file"
                      accept="image/*"
                      onChange={onLogoChange}
                      disabled={loading}
                    />

                  </label>

                </>

              ) : (

                <label className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-zinc-700 py-14 transition hover:border-violet-500">

                  {logoUploading ? (

                    <Loader2 className="h-9 w-9 animate-spin text-violet-400" />

                  ) : (

                    <Upload className="h-10 w-10 text-violet-400" />

                  )}

                  <div className="mt-4 text-lg font-semibold text-white">

                    {logoUploading
                      ? "Uploading Logo..."
                      : "Upload Brand Logo"}

                  </div>

                  <div
                    style={{
                      marginTop: 8,
                      color: "#9ca3af",
                      fontSize: 14,
                    }}
                  >

                    {logoUploading
                      ? "Preparing preview..."
                      : "PNG recommended"}

                  </div>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onLogoChange}
                    disabled={loading}
                  />

                </label>

              )}

            </div>

          </div>

          {/* ===========================
              RIGHT COLUMN
          ============================ */}

          <div className="campaign-right">

            <div className="campaign-card">

              <h2 className="mb-6 text-xl font-semibold text-white">
                Campaign Copy
              </h2>

              <div className="campaign-form">

                <div className="campaign-field">

                  <label className="campaign-label">
                    Headline
                  </label>

                  <input
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="campaign-input"
                    placeholder="Summer Collection Starts Here"
                    disabled={loading}
                  />

                </div>

                <div className="campaign-field">

                  <label className="campaign-label">
                    Subheadline
                  </label>

                  <textarea
                    rows={5}
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    className="campaign-textarea"
                    placeholder="Discover timeless fashion designed for every occasion."
                    disabled={loading}
                  />

                </div>

                <div className="campaign-field">

                  <label className="campaign-label">
                    CTA
                  </label>

                  <input
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    className="campaign-input"
                    placeholder="Shop Now"
                    disabled={loading}
                  />

                </div>

                <div style={{ width: "100%" }}>

                  <button
                    onClick={generateCampaign}
                    disabled={!canGenerate || loading}
                    className="campaign-button"
                    style={{ width: "100%" }}
                  >

                    {loading ? (

  <>
    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
    Generating Campaign...
  </>

) : (

  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      lineHeight: 1.15,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        fontSize: 15,
        fontWeight: 700,
      }}
    >
      Generate Campaign
      <ChevronRight className="ml-2 h-5 w-5" />
    </div>

    <div
      style={{
        marginTop: 4,
        fontSize: 11,
        fontWeight: 500,
        opacity: 0.78,
      }}
    >
      1 ⚡
    </div>
  </div>

)}

                  </button>

                  {loading && (

                    <div
                      style={{
                        marginTop: 18,
                        padding: 22,
                        borderRadius: 18,
                        border: "1px solid #313847",
                        background:
                          "linear-gradient(180deg,#1b1f27,#171a20)",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 12,
                          marginBottom: 18,
                        }}
                      >

                        <Loader2
                          className="animate-spin text-violet-400"
                          size={24}
                        />

                        <div>

                          <div
                            style={{
                              color: "#fff",
                              fontWeight: 700,
                              fontSize: 17,
                            }}
                          >
                            AI Campaign Generation
                          </div>

                          <div
                            style={{
                              color: "#9ca3af",
                              fontSize: 13,
                            }}
                          >
                            Estimated completion time 3–5 minutes
                          </div>

                        </div>

                      </div>

                      <div
                        style={{
                          display: "grid",
                          gap: 14,
                        }}
                      >

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-400"
                          />
                          <span style={{ color: "#d1d5db" }}>
                            Analysing Master Hero
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-400"
                          />
                          <span style={{ color: "#d1d5db" }}>
                            Understanding supporting assets
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-400"
                          />
                          <span style={{ color: "#d1d5db" }}>
                            Detecting brand identity
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-400"
                          />
                          <span style={{ color: "#d1d5db" }}>
                            Building premium campaign layouts
                          </span>
                        </div>

                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                          }}
                        >
                          <Loader2
                            size={16}
                            className="animate-spin text-violet-400"
                          />
                          <span style={{ color: "#d1d5db" }}>
                            Rendering high-resolution creatives
                          </span>
                        </div>

                      </div>

                      <div
                        style={{
                          marginTop: 22,
                          paddingTop: 18,
                          borderTop: "1px solid #2d3441",
                          color: "#98a2b3",
                          fontSize: 13,
                          lineHeight: 1.7,
                        }}
                      >
                        Your campaign will automatically open in a
                        new tab as soon as generation is completed.

                        <br />
                        <br />

                        You may keep this page open while MagicReel
                        finishes generating your campaign.
                      </div>

                    </div>

                  )}

{campaignReady && popupBlocked && (

  <div
    style={{
      marginTop: 18,
      padding: 20,
      borderRadius: 18,
      background: "#182028",
      border: "1px solid #2d5b8a",
    }}
  >

    <div
      style={{
        color: "#ffffff",
        fontWeight: 700,
        fontSize: 18,
        marginBottom: 8,
      }}
    >
      ✅ Campaign Generated Successfully
    </div>

    <div
      style={{
        color: "#b7c0cc",
        lineHeight: 1.7,
        marginBottom: 20,
      }}
    >
      Your browser blocked the automatic opening of
      the campaign in a new tab.
    </div>

    <button
      className="campaign-button"
      style={{
        width: "100%",
        marginBottom: 12,
      }}
      onClick={() =>
        window.open(
          `/campaign/${generatedCampaignId}`,
          "_blank"
        )
      }
    >
      Open Campaign
    </button>

    <button
      className="campaign-button"
      style={{
        width: "100%",
      }}
      onClick={() =>
        navigator.clipboard.writeText(
          `${window.location.origin}/campaign/${generatedCampaignId}`
        )
      }
    >
      Copy Campaign Link
    </button>

  </div>

)}

                </div>

              </div>

            </div>

          </div>

        </div>

        <CampaignHeroPickerModal
          open={assetModalOpen}
          onClose={() => setAssetModalOpen(false)}
          onSelect={
  pickerTarget === "hero"
    ? onHeroSelected
    : onAssetsSelected
}
        />

      </div>

    </div>

  );

}