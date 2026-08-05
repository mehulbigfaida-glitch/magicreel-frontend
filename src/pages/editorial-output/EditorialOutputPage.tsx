import { useEffect, useState } from "react";
import "./EditorialOutputPage.css";

type EditorialWorld = {
  id?: string;
  name: string;
  description?: string;
};

type EditorialOutput = {
  imageUrl?: string;
  url?: string;
  format?: string;
  prompt?: string;
};

type EditorialStorage = {
  assets?: any[];
  world?: EditorialWorld;
  output?: EditorialOutput;
  heroImage?: string;
  generatedAt?: string;
};

export default function EditorialOutputPage() {
  const [data, setData] = useState<EditorialStorage | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(
        "magicreel-editorial-output"
      );

      if (!raw) {
        return;
      }

      setData(JSON.parse(raw));
    } catch (err) {
      console.error(
        "EDITORIAL OUTPUT LOAD ERROR:",
        err
      );
    }
  }, []);

  const previewImage =
    data?.output?.imageUrl ||
    data?.output?.url ||
    data?.heroImage ||
    "";

   const aspectRatioMap: Record<string, string> = {
  "landscape-16-9": "16 / 9",
  "portrait-2-3": "2 / 3",
  "portrait-4-5": "4 / 5",
  "square-1-1": "1 / 1",
  "portrait-9-16": "9 / 16",
};

const previewRatio =
  aspectRatioMap[
    data?.output?.format ?? "portrait-4-5"
  ] ?? "4 / 5";

  async function handleDownload() {
  if (!previewImage) return;

  try {
    const response = await fetch(previewImage);

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `magicreel-editorial-${Date.now()}.png`;

    document.body.appendChild(a);

    a.click();

    a.remove();

    window.URL.revokeObjectURL(url);

  } catch (err) {
    console.error(
      "Download failed",
      err
    );
  }
}

  function handlePublish() {
    if (!previewImage) {
      alert("No editorial image found");
      return;
    }

    const publishUrl =
      `/publish?assetUrl=${encodeURIComponent(
        previewImage
      )}&type=image`;

    window.open(
      publishUrl,
      "_blank"
    );
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert("Link copied");
    } catch (err) {
      console.error(
        "COPY LINK ERROR:",
        err
      );
    }
  }

  function handleCinematicReel() {
    alert(
      "Cinematic Reel will be available in a future update."
    );
  }

  if (!data) {
    return (
      <div className="ecom-loading">
        Loading Editorial...
      </div>
    );
  }

  return (
    <div className="ecom-page">
      <div className="ecom-container">

        <div className="ecom-header">

          <div className="ecom-badge">
            MAGICREEL AI STUDIO
          </div>

          <h1>
            EDITORIAL
          </h1>

          <p>
            {data.world?.name}
          </p>

          <div className="ecom-actions">

            <button
              onClick={handleDownload}
            >
              Download
            </button>

            <button
              onClick={handlePublish}
            >
              Publish
            </button>

            <button
              onClick={handleCopyLink}
            >
              Copy Link
            </button>

            <button
              className="primary"
              onClick={
                handleCinematicReel
              }
            >
              Cinematic Reel ✨
            </button>

          </div>

        </div>

                <section>

          <div
            className={
              previewImage
                ? "hero-grid single"
                : "hero-grid"
            }
          >

            {previewImage && (

  <div className="hero-card">

    <div
      className="hero-preview"
      style={{
        aspectRatio: previewRatio,
      }}
    >

      <img
        src={previewImage}
        alt={
          data.world?.name ||
          "Editorial Output"
        }
      />

    </div>

    <div className="editorial-caption">
      EDITORIAL • {data.world?.title || data.world?.name}
    </div>

  </div>

)}

 </div>

        </section>

      </div>

    </div>

  );

}