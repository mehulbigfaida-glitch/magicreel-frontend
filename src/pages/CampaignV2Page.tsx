// PART 1
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

  const [assetModalOpen, setAssetModalOpen] = useState(false);

  const [heroUploading, setHeroUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  const [heroImageUrl, setHeroImageUrl] = useState("");
  const [logoUrl, setLogoUrl] = useState("");

  const [supportingAssets, setSupportingAssets] = useState<Asset[]>([]);

  const [headline, setHeadline] = useState("");
  const [subheadline, setSubheadline] = useState("");
  const [cta, setCta] = useState("");
  
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

  const uploadHero = useCallback(
    async (file: File) => {
      setHeroUploading(true);

      try {
        const url = await uploadToCloudinary(file);

        setHeroImageUrl(url);
      } finally {
        setHeroUploading(false);
      }
    },
    []
  );

  const uploadLogo = useCallback(
    async (file: File) => {
      setLogoUploading(true);

      try {
        const url = await uploadToCloudinary(file);

        setLogoUrl(url);
      } finally {
        setLogoUploading(false);
      }
    },
    []
  );

  const onHeroChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await uploadHero(file);
  };

  const onLogoChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    await uploadLogo(file);
  };

  const removeAsset = (id: string) => {
    setSupportingAssets((prev) =>
      prev.filter((a) => a.id !== id)
    );
  };

  const openAssetPicker = () => {
    setAssetModalOpen(true);
  };

  const onAssetsSelected = (
  url: string,
  _type: string,
  _heroUrl?: string
) => {
  setSupportingAssets((prev) => {
    if (prev.length >= 4) return prev;

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

  const generateCampaign = async () => {
  if (!canGenerate) return;

  const outputWindow = window.open(
    "/campaign/generating",
    "_blank"
  );

  try {
    setLoading(true);

    const response = await generateCampaignApi({
      heroImageUrl,
      supportingHeroUrls: supportingAssets.map(
        (asset) => asset.url
      ),
      logoUrl,
      headline,
      subheadline,
      cta,
    });

    console.log(response);

    const campaignId = response.data.campaignId;

if (
  outputWindow &&
  !outputWindow.closed
) {
  outputWindow.location.replace(
    `/campaign/${campaignId}`
  );
}

  } catch (error) {

    console.error(
      "Campaign generation failed:",
      error
    );

    if (
      outputWindow &&
      !outputWindow.closed
    ) {
      outputWindow.close();
    }

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
            <Sparkles size={18}/>
            <span>Campaign Studio</span>
        </div>

        <h1>Create Campaign</h1>

        <p>
            Upload your Hero image, supporting assets and campaign copy
            to generate a complete marketing campaign.
        </p>

    </div>

    
</div>

        <div className="campaign-body">

    <div className="campaign-left">

        <div className="campaign-card">

              <h2 className="mb-6 text-xl font-semibold text-white">
                Master Hero
              </h2>

              {heroImageUrl ? (

    <>
    <div className="campaign-hero-preview">

        <img
            src={heroImageUrl}
            alt="Master Hero"
            className="campaign-hero-image"
        />

    </div>

    <label className="campaign-replace-button">

        Replace Hero

        <input
            hidden
            type="file"
            accept="image/*"
            onChange={onHeroChange}
        />

    </label>
</>

) : (
                <label className="campaign-upload-box">

                  {heroUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-violet-400" />
                  ) : (
                    <Upload className="h-12 w-12 text-violet-400" />
                  )}

                  <div className="campaign-upload-title">
                    Upload Master Hero
                  </div>

                  <div className="campaign-upload-subtitle">
                    JPG, PNG or WEBP
                  </div>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onHeroChange}
                  />

                </label>
              )}

            </div>

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

                {supportingAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className="campaign-thumbnail"
                  >
                    <img
                      src={asset.thumbnailUrl || asset.url}
                      className="campaign-thumbnail-image"
                    />

                    <button
                      onClick={() => removeAsset(asset.id)}
                      className="campaign-remove-button"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="campaign-card">

              <h2 className="mb-6 text-xl font-semibold text-white">
                Brand Logo
              </h2>

              {logoUrl ? (

    <>
    <div className="campaign-logo-preview">

        <img
            src={logoUrl}
            alt="Brand Logo"
            className="campaign-logo-image"
        />

    </div>

    <label className="campaign-replace-button">

        Replace Logo

        <input
            hidden
            type="file"
            accept="image/*"
            onChange={onLogoChange}
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
                    Upload Brand Logo
                  </div>

                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={onLogoChange}
                  />

                </label>
              )}

            </div>

          </div>

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
        />

    </div>

                <button
                  onClick={generateCampaign}
                  disabled={!canGenerate}
                  className="campaign-button"
                  style={{ width: "100%" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating Campaign...
                    </>
                  ) : (
                    <>
                      Generate Campaign
                      <ChevronRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>

              </div>

            </div>

          </div>

        </div>

        <CampaignHeroPickerModal
  open={assetModalOpen}
  onClose={() => setAssetModalOpen(false)}
  onSelect={onAssetsSelected}
/>

      </div>
  </div>
  );
}