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

  const [copyMessage, setCopyMessage] = useState("");

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

async function copyText(value: string, label: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(textarea);
      if (!copied) throw new Error("Clipboard access is unavailable.");
    }

    setCopyMessage(`${label} copied.`);
  } catch (err) {
    console.error("COPY ERROR:", err);
    setCopyMessage("Copy was blocked by the browser. Please select and copy the text manually.");
  }
}

function handleDownloadMedia() {
  if (!previewUrl) {
    setCopyMessage("Select an image or video first.");
    return;
  }

  const link = document.createElement("a");
  link.href = previewUrl;
  link.download = assetType === "video" || assetType === "reel"
    ? "magicreel-instagram-video"
    : "magicreel-instagram-image";
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setCopyMessage("Download requested. If the file opens instead, use your browser's Save or Download option.");
}

async function handlePublish() {
  if (!platforms.instagram) {
    alert("For this Instagram handoff test, select Instagram only.");
    return;
  }

  if (platforms.facebook) {
    alert("This experimental test supports Instagram handoff only. Please unselect Facebook. The original Zernio publishing flow remains available on the production version.");
    return;
  }

  if (!previewUrl) {
    alert("Please select an image or video first.");
    return;
  }

  setPublishing(true);
  setCopyMessage("");

  const shareText = [caption.trim(), hashtags.trim()]
    .filter(Boolean)
    .join("\n\n");

  try {
    const response = await fetch(previewUrl);
    if (!response.ok) {
      throw new Error("The media file could not be downloaded for sharing.");
    }

    const blob = await response.blob();
    const fallbackType = assetType === "video" || assetType === "reel"
      ? "video/mp4"
      : "image/jpeg";
    const mimeType = blob.type || fallbackType;
    const extension = mimeType.includes("video")
      ? "mp4"
      : mimeType.includes("png")
        ? "png"
        : mimeType.includes("webp")
          ? "webp"
          : "jpg";
    const file = new File([blob], `magicreel-instagram.${extension}`, {
      type: mimeType,
    });

    const canShareFile = typeof navigator.share === "function"
      && typeof navigator.canShare === "function"
      && navigator.canShare({ files: [file] });

    if (!canShareFile) {
      handleDownloadMedia();
      setStatusTitle("Media Ready to Share");
      setStatusDescription("Your media download has been requested. Open Instagram using the Open Instagram button below, upload the downloaded file, and use Copy Caption or Copy All if the text did not transfer.");
      setShowStatusModal(true);
      return;
    }

    await navigator.share({
      files: [file],
      ...(shareText ? { text: shareText } : {}),
      title: "MagicReel Instagram",
    });

    setStatusTitle("Instagram Share Sheet Opened");
    setStatusDescription("Choose Instagram in your device's share sheet if it is available. Instagram may not accept the caption or hashtags automatically, so use the copy buttons on MagicReel if needed. This handoff does not publish automatically.");
    setShowStatusModal(true);
  } catch (err: any) {
    if (err?.name === "AbortError") {
      setCopyMessage("Sharing was cancelled. Your media and edited text are still available here.");
      return;
    }

    console.error("INSTAGRAM HANDOFF ERROR:", err);
    handleDownloadMedia();
    setStatusTitle("Manual Instagram Share");
    setStatusDescription("Direct sharing was unavailable, often because of browser or media-host permissions. Your download has been requested. Open Instagram, upload the downloaded media, and use the copy buttons for your caption and hashtags.");
    setShowStatusModal(true);
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

        <div className="publish-copy-actions" aria-label="Caption and hashtag copy tools">
          <button type="button" onClick={() => copyText(caption, "Caption")}>Copy Caption</button>
          <button type="button" onClick={() => copyText(hashtags, "Hashtags")}>Copy Hashtags</button>
          <button
            type="button"
            onClick={() => copyText([caption.trim(), hashtags.trim()].filter(Boolean).join("\n\n"), "Caption and hashtags")}
          >
            Copy All
          </button>
          <button type="button" onClick={handleDownloadMedia}>Download Media</button>
          <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
            Open Instagram
          </a>
        </div>
        {copyMessage && <p className="publish-copy-message" role="status">{copyMessage}</p>}

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
