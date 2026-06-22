import { useSearchParams } from "react-router-dom";
import { useState } from "react";
import AssetPickerModal
from "./AssetPickerModal";
import "./PublishPage.css";
import PublishToolbar
from "./PublishToolbar";

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
  params.get("type") || "image"
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

  const [platform, setPlatform] =
  useState<"instagram" | "facebook">(
    "instagram"
  );

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

    const publishAssetType =
      assetType === "video" ||
      assetType === "reel"
        ? "video"
        : "image";

    console.log(
      "PUBLISH DEBUG",
      {
        assetType,
        publishAssetType,
        previewUrl,
      }
    );

    const token =
      localStorage.getItem("token");

    const response =
      await fetch(
        `${API_BASE}/api/publish/publish`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({

            platform,

            assetUrl:
              previewUrl,

            assetType:
              publishAssetType,

            caption:
              caption +
              "\n\n" +
              hashtags,

          }),

        }
      );

    const data =
      await response.json();

    if (!data.success) {

      throw new Error(
        data.error ||
        "Publish failed"
      );

    }

    alert(
      "🎉 Published Successfully"
    );

  } catch (err: any) {

    console.error(
      "PUBLISH ERROR:",
      err
    );

    alert(
      err.message ||
      "Publish failed"
    );

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

        <div className="publish-platforms">

  <label>

    <input
      type="radio"
      checked={
        platform === "instagram"
      }
      onChange={() =>
        setPlatform(
          "instagram"
        )
      }
    />

    Instagram

  </label>

  <label>

    <input
      type="radio"
      checked={
        platform === "facebook"
      }
      onChange={() =>
        setPlatform(
          "facebook"
        )
      }
    />

    Facebook

  </label>

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
                : "✨ AI Social Assistant"
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
    </div>

  );

}