import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import AssetPickerModal
from "./AssetPickerModal";
import "./PublishPage.css";
import PublishToolbar
from "./PublishToolbar";
import FeatureLockedModal from "../../components/FeatureLockedModal";
import StatusModal from "../../components/StatusModal";
const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5003";

export default function PublishPage() {

  const [params] = useSearchParams();

  const assetUrl =
  params.get("assetUrl") || "";

  const heroImageUrl =
  params.get("heroImageUrl") || "";

const [assetType, setAssetType] =
useState(
  params.get("assetType") ||
  params.get("type") ||
  "image"
);

  const [caption, setCaption] =
    useState("");

  const [hashtags, setHashtags] =
    useState("");

  const [loadingAI, setLoadingAI] =
    useState(false);

  const [previewUrl, setPreviewUrl] =
  useState(assetUrl);

const [aiImageUrl, setAiImageUrl] =
  useState(
    heroImageUrl || assetUrl
  );

const [
  showAssetPicker,
  setShowAssetPicker
] = useState(false);

  const [publishing, setPublishing] =
  useState(false);

  const [platforms, setPlatforms] = useState({
  instagram: true,
  facebook: false,
});

const [
  showUpgradeModal,
  setShowUpgradeModal
] = useState(false);

const [
  showStatusModal,
  setShowStatusModal
] = useState(false);

const [
  statusTitle,
  setStatusTitle
] = useState("");

const [
  statusDescription,
  setStatusDescription
] = useState("");

  async function handleGenerateAI() {


    try {

      setLoadingAI(true);


      const response =
        await fetch(

          `${API_BASE}/api/publish/generate-content`,

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json"

            },

            body: JSON.stringify({

  imageUrl: aiImageUrl,

  assetType,

  platform:
    "instagram",

  garmentType:
    "fashion",

  tone:
    "luxury"

})

          }

        );

      const data =
        await response.json();

      if (!data.success) {

        throw new Error(
          data.error ||
          "Failed to generate content"
        );

      }

      setCaption(
        data.caption || ""
      );

      setHashtags(
        data.hashtags || ""
      );

    } catch (err: any) {

      console.error(
        "AI CONTENT ERROR:",
        err
      );

      alert(
        err.message ||
        "Failed to generate content"
      );

    } finally {

      setLoadingAI(false);

    }

  }

async function handlePublish() {

  try {

    setPublishing(true);

    const selectedPlatforms: ("instagram" | "facebook")[] = [];

    if (platforms.instagram) {
      selectedPlatforms.push("instagram");
    }

    if (platforms.facebook) {
      selectedPlatforms.push("facebook");
    }

    if (selectedPlatforms.length === 0) {
      throw new Error("Please select at least one platform.");
    }

    const publishAssetType =
      assetType === "video" ||
      assetType === "reel"
        ? "video"
        : "image";

    console.log("PUBLISH DEBUG", {
      assetType,
      publishAssetType,
      previewUrl,
      selectedPlatforms,
    });

    const token = localStorage.getItem("token");

    for (const platform of selectedPlatforms) {

      const response = await fetch(
        `${API_BASE}/api/publish/publish`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({

            platform,

            assetUrl: previewUrl,

            assetType: publishAssetType,

            caption:
              caption +
              "\n\n" +
              hashtags,

          }),

        }
      );

      const data = await response.json();

      if (!data.success) {

  if (
    data.error === "PUBLISHING_SUBSCRIPTION_REQUIRED" ||
    data.error === "PLAN_NOT_ALLOWED"
  ) {
    setShowUpgradeModal(true);
    return;
  }

  throw new Error(
    `${platform}: ${data.error || "Publish failed"}`
  );
}

    }

    setStatusTitle("Published Successfully");

setStatusDescription(
  `Your content has been published to ${selectedPlatforms.join(" & ")}.`
);

setShowStatusModal(true);

  } catch (err: any) {

    console.error(
      "PUBLISH ERROR:",
      err
    );

    if (
  err?.message?.includes("PUBLISHING_SUBSCRIPTION_REQUIRED") ||
  err?.message?.includes("PLAN_NOT_ALLOWED")
) {
  setShowUpgradeModal(true);
} else {
  alert(
    err.message ||
    "Publish failed"
  );
}

  } finally {

    setPublishing(false);

  }

}

  return (

    <div className="publish-page">

      <div className="publish-container">

        <h1>
          Publish To Social Media
        </h1>

        <div className="publish-preview">

          {
  assetType === "video" ||
  assetType === "reel"
  ? (
    <video
      src={previewUrl}
      controls
      playsInline
      style={{
        width: "100%",
        borderRadius: "12px",
      }}
    />
  )
  : (
    <img
      src={previewUrl}
      alt="Publish Preview"
    />
  )
}

        </div>

<PublishToolbar
  onReplaceMedia={() =>
    setShowAssetPicker(true)
  }
/>

        <div className="publish-platforms publish-destinations">

  <div className="publish-destinations-header">

    <div>

      <div className="publish-destinations-eyebrow">
        PUBLISH DESTINATIONS
      </div>

      <h2>
        Choose where to publish
      </h2>

      <p>
        Select one or more social platforms for your content.
      </p>

    </div>

    <div className="publish-destinations-count">
      {Object.values(platforms).filter(Boolean).length}
      {" selected"}
    </div>

  </div>


  <div className="publish-destination-grid">

    <button
      type="button"
      className={
        "publish-destination-card " +
        (
          platforms.instagram
            ? "publish-destination-active"
            : ""
        )
      }
      aria-pressed={platforms.instagram}
      onClick={() =>
        setPlatforms({
          ...platforms,
          instagram: !platforms.instagram,
        })
      }
    >

      <div className="publish-destination-top">

        <div className="publish-destination-brand instagram-brand">
          ◎
        </div>

        <div
          className={
            "publish-destination-check " +
            (
              platforms.instagram
                ? "publish-destination-check-active"
                : ""
            )
          }
        >
          {platforms.instagram ? "✓" : ""}
        </div>

      </div>


      <div className="publish-destination-content">

        <div className="publish-destination-name">
          Instagram
        </div>

        <div className="publish-destination-description">
          Reels, posts and visual stories
        </div>

      </div>


      <div className="publish-destination-footer">

        <span>
          {platforms.instagram
            ? "READY TO PUBLISH"
            : "SELECT DESTINATION"}
        </span>

      </div>

    </button>


    <button
      type="button"
      className={
        "publish-destination-card " +
        (
          platforms.facebook
            ? "publish-destination-active"
            : ""
        )
      }
      aria-pressed={platforms.facebook}
      onClick={() =>
        setPlatforms({
          ...platforms,
          facebook: !platforms.facebook,
        })
      }
    >

      <div className="publish-destination-top">

        <div className="publish-destination-brand facebook-brand">
          f
        </div>

        <div
          className={
            "publish-destination-check " +
            (
              platforms.facebook
                ? "publish-destination-check-active"
                : ""
            )
          }
        >
          {platforms.facebook ? "✓" : ""}
        </div>

      </div>


      <div className="publish-destination-content">

        <div className="publish-destination-name">
          Facebook
        </div>

        <div className="publish-destination-description">
          Posts, campaigns and social content
        </div>

      </div>


      <div className="publish-destination-footer">

        <span>
          {platforms.facebook
            ? "READY TO PUBLISH"
            : "SELECT DESTINATION"}
        </span>

      </div>

    </button>


    <div className="publish-destination-card publish-destination-coming">

      <div className="publish-destination-top">

        <div className="publish-destination-brand more-brand">
          +
        </div>

        <div className="publish-destination-soon">
          SOON
        </div>

      </div>


      <div className="publish-destination-content">

        <div className="publish-destination-name">
          More destinations
        </div>

        <div className="publish-destination-description">
          More channels are coming to MagicReel.
        </div>

      </div>


      <div className="publish-destination-footer">

        <span>
          EXPANDING ECOSYSTEM
        </span>

      </div>

    </div>

  </div>

</div>

        <div className="publish-ai">

          <button
            onClick={
              handleGenerateAI
            }
            disabled={
              loadingAI
            }
          >

            {
              loadingAI
                ? "✨ Analyzing Garment..."
                : "Generate Caption & Hashtags"
            }

          </button>

        </div>

        <textarea
          placeholder="Caption"
          rows={6}
          value={caption}
          onChange={(e) =>
            setCaption(
              e.target.value
            )
          }
        />

        <div className="publish-counter">

          {caption.length}
          {" / 2200"}

        </div>

        <textarea
          placeholder="Hashtags"
          rows={4}
          value={hashtags}
          onChange={(e) =>
            setHashtags(
              e.target.value
            )
          }
        />

        {
          hashtags && (

            <div
              style={{
                marginTop: 12,
                fontSize: 13,
                color: "#666"
              }}
            >

              {
                hashtags
                  .split(",")
                  .filter(Boolean)
                  .length
              }
              {" hashtags generated"}

            </div>

          )
        }

        <div className="publish-footer">

  <button
    onClick={handlePublish}
    disabled={publishing}
  >

    {
      publishing
        ? "Publishing..."
        : "Publish Now"
    }

  </button>

</div>

      </div>
<AssetPickerModal
  open={showAssetPicker}
  onClose={() =>
    setShowAssetPicker(false)
  }
  onSelect={(url,type,heroUrl)=>{

  setPreviewUrl(url);

  setAssetType(type);

  setAiImageUrl(
    heroUrl || url
  );

  setShowAssetPicker(false);

}}
/>

<FeatureLockedModal
  open={showUpgradeModal}
  title="Publishing Is Not Activated"
  description="Your account does not have an active Publishing subscription. Activate Publishing to connect your social accounts and publish your MagicReel content."
  featureName="Social Publishing"
  primaryLabel="Activate Publishing"
  onClose={() =>
    setShowUpgradeModal(false)
  }
/>

<StatusModal
  open={showStatusModal}
  type="success"
  title={statusTitle}
  description={statusDescription}
  onClose={() => setShowStatusModal(false)}
/>

</div>

   );

}
