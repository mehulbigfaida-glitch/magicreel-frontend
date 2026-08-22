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

const [exportingZip, setExportingZip] =
  useState(false);


const [sharing, setSharing] =
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

  console.log(
    "LOOKBOOK POLL:",
    {
      status: data.status,
      poses: data.poses?.length || 0,
    }
  );

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

      setExportingZip(true);

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

    } finally {

      setExportingZip(false);

    }

  }

  async function handleShare() {

    try {

      setSharing(true);

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

    } finally {

      setSharing(false);

    }

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

  const generatedCount =
    poses.filter(
      (p) =>
        p.poseId !== "REEL" &&
        p.imageUrl
    ).length;

  const expectedImages =
    heroImages.length > 0
      ? 4
      : 4;

  const progress =
    Math.min(
      100,
      Math.round(
        (generatedCount /
          expectedImages) *
          100
      )
    );

  return (

    <div
      className="ecom-page"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "28px 18px",
      }}
    >

      <div
        style={{
          width: "100%",
          maxWidth: 620,

          padding:
            "42px 28px",

          borderRadius: 30,

          background:
            "linear-gradient(145deg, rgba(20,20,20,.98), rgba(9,9,9,.98))",

          border:
            "1px solid rgba(255,255,255,.09)",

          boxShadow:
            "0 30px 90px rgba(0,0,0,.45)",

          textAlign: "center",

          position: "relative",
          overflow: "hidden",
        }}
      >

        <div
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,.18), transparent 70%)",
            top: -120,
            left: "50%",
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
          }}
        >

          <div
            style={{
              width: 82,
              height: 82,
              margin:
                "0 auto 24px",

              borderRadius: "50%",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",

              background:
                "linear-gradient(135deg,#7c3aed,#ec4899)",

              boxShadow:
                "0 0 45px rgba(168,85,247,.28)",

              animation:
                "pulse 2.4s ease-in-out infinite",
            }}
          >

            <div
              style={{
                width: 58,
                height: 58,

                borderRadius: "50%",

                border:
                  "3px solid rgba(255,255,255,.18)",

                borderTopColor:
                  "#fff",

                animation:
                  "spin 1.1s linear infinite",
              }}
            />

          </div>


          <div
            style={{
              fontSize: 12,
              letterSpacing: ".28em",
              opacity: .5,
              marginBottom: 12,
            }}
          >
            MAGICREEL AI STUDIO
          </div>


          <h1
            style={{
              margin: 0,

              fontSize:
                "clamp(28px, 6vw, 42px)",

              lineHeight: 1.05,

              fontWeight: 500,

              letterSpacing: "-.02em",
            }}
          >
            Creating Your
            <br />
            Lookbook
          </h1>


          <p
            style={{
              margin:
                "18px auto 0",

              maxWidth: 430,

              fontSize: 15,

              lineHeight: 1.6,

              color:
                "rgba(255,255,255,.68)",
            }}
          >
            MagicReel is creating
            premium fashion poses
            from your Hero image.
          </p>


          <div
            style={{
              marginTop: 28,

              display: "inline-flex",

              alignItems: "center",

              gap: 10,

              padding:
                "10px 16px",

              borderRadius: 999,

              background:
                "rgba(255,255,255,.05)",

              border:
                "1px solid rgba(255,255,255,.07)",

              fontSize: 13,

              color:
                "rgba(255,255,255,.75)",
            }}
          >
            <span>⏱</span>

            Usually 7–8 minutes

          </div>


          <div
            style={{
              marginTop: 30,
              textAlign: "left",
            }}
          >

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",

                marginBottom: 10,

                fontSize: 13,
              }}
            >

              <span
                style={{
                  color:
                    "rgba(255,255,255,.58)",
                }}
              >
                Generating fashion images
              </span>

              <span
                style={{
                  fontWeight: 700,
                }}
              >
                {generatedCount} /{" "}
                {expectedImages}
              </span>

            </div>


            <div
              style={{
                height: 8,

                borderRadius: 999,

                background:
                  "rgba(255,255,255,.07)",

                overflow: "hidden",
              }}
            >

              <div
                style={{
                  width:
                    `${progress}%`,

                  height: "100%",

                  borderRadius: 999,

                  background:
                    "linear-gradient(90deg,#7c3aed,#ec4899)",

                  transition:
                    "width .6s ease",
                }}
              />

            </div>

          </div>


          <div
            style={{
              marginTop: 28,

              display: "grid",

              gridTemplateColumns:
                "repeat(4,1fr)",

              gap: 10,
            }}
          >

            {[
              "Front",
              "Pose 1",
              "Pose 2",
              "Pose 3",
            ].map(
              (label, index) => {

                const done =
                  generatedCount >
                  index;

                return (

                  <div
                    key={label}

                    style={{
                      padding:
                        "12px 6px",

                      borderRadius: 14,

                      background:
                        done
                          ? "rgba(168,85,247,.12)"
                          : "rgba(255,255,255,.035)",

                      border:
                        done
                          ? "1px solid rgba(168,85,247,.24)"
                          : "1px solid rgba(255,255,255,.06)",

                      transition:
                        "all .35s ease",
                    }}
                  >

                    <div
                      style={{
                        fontSize: 16,
                        marginBottom: 5,
                      }}
                    >
                      {done
                        ? "✓"
                        : "○"}
                    </div>

                    <div
                      style={{
                        fontSize: 11,

                        color:
                          done
                            ? "#fff"
                            : "rgba(255,255,255,.42)",
                      }}
                    >
                      {label}
                    </div>

                  </div>

                );

              }
            )}

          </div>


          <p
            style={{
              marginTop: 24,

              marginBottom: 0,

              fontSize: 12,

              lineHeight: 1.5,

              color:
                "rgba(255,255,255,.42)",
            }}
          >
            Please keep this tab open.
            Your images will appear automatically
            when they are ready.
          </p>

        </div>

      </div>

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
              onClick={handleExportZip}
              disabled={exportingZip}
              className={
                exportingZip
                  ? "ecom-action-active"
                  : ""
              }
            >
              {
                exportingZip
                  ? "Exporting..."
                  : "Export ZIP"
              }
            </button>

            <button
              onClick={handleShare}
              disabled={sharing}
              className={
                sharing
                  ? "ecom-action-active"
                  : ""
              }
            >
              {
                sharing
                  ? "Copied ✓"
                  : "Copy Preview Link"
              }
            </button>

            <button
              className={
                generatingReel
                  ? "primary ecom-action-active"
                  : "primary"
              }
              onClick={handleCarouselReel}
              disabled={generatingReel}
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