import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import AssetPickerModal
from "./AssetPickerModal";
import "./PublishPage.css";
import PublishToolbar
from "./PublishToolbar";
import FeatureLockedModal from "../../components/FeatureLockedModal";
import StatusModal from "../../components/StatusModal";
import { API_BASE } from "../../config/api";

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

const [showMetaConfirm, setShowMetaConfirm] = useState(false);

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

async function executePublish() {

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
    data.error === "ACTIVE_MAGICREEL_PLAN_REQUIRED" ||
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
  err?.message?.includes("ACTIVE_MAGICREEL_PLAN_REQUIRED") ||
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

function handlePublish() {
  if (!previewUrl) {
    setStatusTitle("Choose an asset");
    setStatusDescription("Select an image or video before publishing.");
    setShowStatusModal(true);
    return;
  }
  if (!platforms.instagram || platforms.facebook) {
    setStatusTitle("Instagram only");
    setStatusDescription("Direct Meta publishing is currently available for Instagram only. Select Instagram and deselect Facebook to continue.");
    setShowStatusModal(true);
    return;
  }
  setShowMetaConfirm(true);
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
      className="publish-destination-card publish-destination-coming"
      aria-pressed={false}
      disabled
      title="Facebook publishing is not part of this release"
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
          Facebook — Coming Soon
        </div>

        <div className="publish-destination-description">
          Direct publishing is currently available for Instagram only.
        </div>

      </div>


      <div className="publish-destination-footer">

        <span>
          {"COMING SOON"}
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

<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="meta-publish-confirm-title"
  style={{
    display: showMetaConfirm ? "flex" : "none",
    position: "fixed",
    inset: 0,
    zIndex: 10000,
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(0,0,0,0.55)",
    padding: 20,
  }}
>
  <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 440, width: "100%" }}>
    <h2 id="meta-publish-confirm-title">Publish via Meta to Instagram?</h2>
    <p>Your selected content, caption and hashtags will be published to the Instagram account connected to MagicReel.</p>
    <p>No separate publishing fee or generation-credit deduction applies. Your MagicReel plan and Instagram connection must be active.</p>
    <div style={{ display: "flex", gap: 12, justifyContent: "flex-end", marginTop: 20 }}>
      <button type="button" onClick={() => setShowMetaConfirm(false)} disabled={publishing}>Cancel</button>
      <button type="button" onClick={() => { setShowMetaConfirm(false); void executePublish(); }} disabled={publishing}>
        {publishing ? "Publishing..." : "Confirm & Publish"}
      </button>
    </div>
  </div>
</div>

<FeatureLockedModal
  open={showUpgradeModal}
  title="Active MagicReel Plan Required"
  description="An active Basic, Pro, Advance or Enterprise MagicReel plan is required to publish. Renew or activate your MagicReel plan, then try again."
  featureName="Social Publishing"
  primaryLabel="View Plans"
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
