import { useEffect, useMemo, useState } from "react";

import {
  useParams
} from "react-router-dom";

import "./ecomOutput.css";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL;

export default function EcomOutputPage() {

  const { id } = useParams();
  
  const [loading, setLoading] =
  useState(true);

const [generatingReel, setGeneratingReel] =
  useState(false);

const [poses, setPoses] =
  useState<any[]>([]);

  useEffect(() => {

  let cancelled = false;
  let timer:
    ReturnType<typeof setTimeout> | null = null;

  async function load() {

    if (!id) {
      setLoading(false);
      return;
    }

    try {

      const res =
        await fetch(
          `${API_BASE}/api/p2m/lookbook/${id}`
        );

      const data =
        await res.json();

      if (cancelled) {
        return;
      }

      if (!res.ok) {
        throw new Error(
          data.error ||
          "Failed to load Lookbook"
        );
      }

      setPoses(
        data.poses || []
      );

      if (
        data.status === "completed"
      ) {

        setLoading(false);
        return;

      }

      if (
        data.status === "failed"
      ) {

        console.error(
          "❌ Lookbook generation failed"
        );

        setLoading(false);
        return;

      }

      // Still processing.
      setLoading(true);

      timer =
        setTimeout(
          load,
          5000
        );

    } catch (err) {

      if (!cancelled) {

        console.error(
          "LOOKBOOK POLL ERROR:",
          err
        );

        timer =
          setTimeout(
            load,
            5000
          );

      }

    }

  }

  load();

  return () => {

    cancelled = true;

    if (timer) {
      clearTimeout(timer);
    }

  };

}, [id]);

  const heroImages =
    useMemo(
      () =>
        poses.filter(
          (p) =>
            p.poseId === "hero" ||
            p.poseId === "back"
        ),
      [poses]
    );

  const lookbookImages =
  useMemo(
    () =>
      poses.filter(
        (p) =>
          p.poseId !== "hero" &&
          p.poseId !== "back" &&
          p.poseId !== "REEL" &&
          p.imageUrl
      ),
    [poses]
  );

  async function handleExportZip() {

    try {
      
      const images =
        poses.map(
          (p) => p.imageUrl
        );

      const token =
        localStorage.getItem(
          "token"
        );

      const res =
        await fetch(

          `${API_BASE}/api/p2m/lookbook-v1/export`,

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body:
              JSON.stringify({

                images

              })

          }

        );

      if (!res.ok) {

        console.error(
          "Export failed"
        );

        return;

      }

      const blob =
        await res.blob();

      const url =
        window.URL.createObjectURL(
          blob
        );

      const a =
        document.createElement(
          "a"
        );

      a.href = url;

      a.download =
        "magicreel-lookbook.zip";

      document.body.appendChild(
        a
      );

      a.click();

      a.remove();

      window.URL.revokeObjectURL(
        url
      );

    } catch (err) {

      console.error(
        "ZIP ERROR:",
        err
      );

    }

  }

  async function handleShare() {

    try {

      const url =

        `${window.location.origin}/pack/ecom/output/${id}`;

      await navigator.clipboard.writeText(
        url
      );

      alert(
        "Link copied"
      );

    } catch (err) {

      console.error(
        "SHARE ERROR:",
        err
      );

    }

  }

function handlePublish() {

  console.log("PUBLISH CLICKED");

  console.log(
    "HERO IMAGES:",
    heroImages
  );

  console.log(
    "FIRST HERO:",
    heroImages[0]
  );

  const hero =
    heroImages[0]?.imageUrl;

  console.log(
    "HERO URL:",
    hero
  );

  if (!hero) {

    alert(
      "No hero image found"
    );

    return;

  }

  const publishUrl =
  `/publish?assetUrl=${encodeURIComponent(hero)}&type=image`;

window.open(
  publishUrl,
  "_blank"
);

}

  async function handleCarouselReel() {

  try {

    setGeneratingReel(true);

      if (!id) {

        alert(
          "Lookbook not found"
        );

        return;

      }
      const response =
  await fetch(
    `${API_BASE}/api/p2m/reel/carousel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lookbookId: id,
      }),
    }
  );

      const data =
        await response.json();

      if (!data.success) {

        throw new Error(
          data.error ||
          "Reel generation failed"
        );

      }

      if (!data.reelId) {

        throw new Error(
          "No reelId returned from backend"
        );

      }

      console.log(
  "REEL NAVIGATION TEST",
  data.reelId
);

window.location.href =
  `/reel/${data.reelId}`;

    } catch (err: any) {

      console.error(
        "CAROUSEL REEL ERROR:",
        err
      );

    setGeneratingReel(false);

      alert(
        err.message ||
        "Failed to generate reel"
      );

    }

  }

  if (loading) {

    return (

      <div className="ecom-loading">

        Loading Lookbook...

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

            PURE STUDIO PACK

          </h1>

          <p>

            {lookbookImages.length}
            Images Generated

          </p>

          <div className="ecom-actions">

            <button
              onClick={
                handleExportZip
              }
            >

              Export ZIP

            </button>

            <button
  onClick={handlePublish}
>
  Publish
</button>

            <button
              onClick={
                handleShare
              }
            >

              Copy Preview Link

            </button>

            <button
  className="primary"
  onClick={
    handleCarouselReel
  }
  disabled={
    generatingReel
  }
>

  {
    generatingReel
      ? "🎬 Rendering Reel..."
      : "Carousel Reel ✨"
  }

</button>

          </div>

        </div>

        <section>

          <h2>

            Generated Looks

          </h2>

          <div className="look-grid">

            {lookbookImages.map((p) => (

              <div
                key={p.poseId}
                className="look-card"
              >

                <img
                  src={p.imageUrl}
                />

                <div className="overlay">

                  <button>

                    Download

                  </button>

                </div>

              </div>

            ))}

          </div>

        </section>

        {heroImages.length > 0 && (

          <section>

            <h2>

              Hero Assets

            </h2>

            <div

              className={

                heroImages.length === 1

                  ?

                  "hero-grid single"

                  :

                  "hero-grid"

              }

            >

              {heroImages.map((hero) => (

                <div
                  key={hero.poseId}
                  className="hero-card"
                >

                  <img
                    src={hero.imageUrl}
                  />

                  <div className="hero-footer">

                    <button>

                      Download

                    </button>

                  </div>

                </div>

              ))}

            </div>

          </section>

        )}

      </div>

    </div>

  );

}