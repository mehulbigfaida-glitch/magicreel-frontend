import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../../config/api";
import LookbookHeroPickerModal from "../create-ai-hero/LookbookHeroPickerModal";
import FeatureLockedModal from "../../components/FeatureLockedModal";

export default function Create360ReelPage() {

  const navigate = useNavigate();

  const [frontAsset, setFrontAsset] =
    useState("");

  const [backAsset, setBackAsset] =
    useState("");

  const [pickerOpen, setPickerOpen] =
    useState(false);

  const [pickerTarget, setPickerTarget] =
    useState<"front" | "back">(
      "front"
    );

  const [generating, setGenerating] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    lockedFeature,
    setLockedFeature,
  ] = useState<string | null>(null);

  function openPicker(
    target: "front" | "back"
  ) {

    setPickerTarget(target);
    setPickerOpen(true);
    setError("");

  }

  function handleAssetSelected(
    url: string
  ) {

    if (pickerTarget === "front") {

      setFrontAsset(url);

    } else {

      setBackAsset(url);

    }

    setPickerOpen(false);

  }

  const canGenerate =
    !!frontAsset &&
    !!backAsset &&
    !generating;

  async function handleGenerate() {

    if (!canGenerate) {
      return;
    }

    try {

      setGenerating(true);
      setError("");

      const token =
        localStorage.getItem(
          "token"
        );

      const response =
        await fetch(
          `${API_BASE}/api/p2m/reels360/generate`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                heroImageUrl:
                  frontAsset,

                backHeroImageUrl:
                  backAsset,
              }),
          }
        );

      const data =
        await response.json();

      if (
        data?.error === "INSUFFICIENT_CREDITS" ||
        data?.error === "Insufficient credits" ||
        data?.error === "No credits left"
      ) {
        setGenerating(false);

        setLockedFeature("360° Reel Generation");

        return;
      }

      if (!response.ok) {

        throw new Error(
          data?.error ||
            "360° Reel generation failed"
        );

      }

      if (!data?.runId) {

        throw new Error(
          "No 360° Reel run ID returned."
        );

      }

      window.open(
        `/reels360/${data.runId}`,
        "_blank",
        "noopener,noreferrer"
      );

    } catch (err: any) {

      console.error(
        "360° REEL ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to generate 360° Reel."
      );

    } finally {

      setGenerating(false);

    }

  }

  return (

    <div
      style={{
        minHeight:
          "100vh",

        background:
          "radial-gradient(circle at top,#141414 0%,#050505 60%)",

        color:
          "#fff",

        padding:
          "70px 22px 100px",
      }}
    >

      <div
        style={{
          maxWidth:
            1120,

          margin:
            "0 auto",
        }}
      >

        <div
          style={{
            textAlign:
              "center",

            marginBottom:
              55,
          }}
        >

          <div
            style={{
              fontSize:
                12,

              letterSpacing:
                ".32em",

              opacity:
                .5,

              marginBottom:
                14,
            }}
          >
            MAGICREEL CREATIVE STUDIO
          </div>

          <h1
            style={{
              margin:
                0,

              fontSize:
                "clamp(42px,7vw,76px)",

              lineHeight:
                .95,

              fontWeight:
                300,

              letterSpacing:
                "-.03em",
            }}
          >
            360° Reel
          </h1>

          <p
            style={{
              maxWidth:
                620,

              margin:
                "22px auto 0",

              fontSize:
                17,

              lineHeight:
                1.7,

              color:
                "rgba(255,255,255,.62)",
            }}
          >
            Create a smooth 360° fashion
            reel from your existing Hero
            or Lookbook assets.
          </p>

        </div>


        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",

            gap:
              22,
          }}
        >

          {[
            {
              key:
                "front" as const,

              title:
                "Front Asset",

              image:
                frontAsset,

              empty:
                "Select Front",
            },

            {
              key:
                "back" as const,

              title:
                "Back Asset",

              image:
                backAsset,

              empty:
                "Select Back",
            },

          ].map((slot) => (

            <div
              key={
                slot.key
              }

              style={{
                background:
                  "rgba(255,255,255,.035)",

                border:
                  "1px solid rgba(255,255,255,.08)",

                borderRadius:
                  28,

                padding:
                  18,
              }}
            >

              <div
                style={{
                  fontSize:
                    12,

                  letterSpacing:
                    ".18em",

                  textTransform:
                    "uppercase",

                  opacity:
                    .5,

                  marginBottom:
                    14,
                }}
              >
                {slot.title}
              </div>

              <div
                style={{
                  aspectRatio:
                    "4 / 5",

                  borderRadius:
                    20,

                  overflow:
                    "hidden",

                  background:
                    "#0d0d0d",

                  border:
                    "1px solid rgba(255,255,255,.06)",

                  display:
                    "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",
                }}
              >

                {slot.image ? (

                  <img
                    src={
                      slot.image
                    }

                    alt={
                      slot.title
                    }

                    style={{
                      width:
                        "100%",

                      height:
                        "100%",

                      objectFit:
                        "cover",
                    }}
                  />

                ) : (

                  <div
                    style={{
                      textAlign:
                        "center",

                      color:
                        "rgba(255,255,255,.35)",
                    }}
                  >

                    <div
                      style={{
                        fontSize:
                          42,

                        marginBottom:
                          10,
                      }}
                    >
                      +
                    </div>

                    Select an asset

                  </div>

                )}

              </div>

              <button
                type="button"

                onClick={() =>
                  openPicker(
                    slot.key
                  )
                }

                style={{
                  width:
                    "100%",

                  marginTop:
                    14,

                  padding:
                    "14px 18px",

                  borderRadius:
                    16,

                  border:
                    "1px solid rgba(255,255,255,.12)",

                  background:
                    "rgba(255,255,255,.05)",

                  color:
                    "#fff",

                  cursor:
                    "pointer",

                  fontWeight:
                    600,
                }}
              >
                {slot.image
                  ? "Change Asset"
                  : slot.empty}
              </button>

            </div>

          ))}

        </div>


        <div
          style={{
            marginTop:
              30,

            textAlign:
              "center",
          }}
        >

          <div
            style={{
              fontSize:
                12,

              opacity:
                .55,

              marginBottom:
                12,
            }}
          >
            3 ⚡ · ~4–5 min
          </div>

          <button
            type="button"

            disabled={
              !canGenerate
            }

            onClick={
              handleGenerate
            }

            style={{
              minWidth:
                290,

              minHeight:
                62,

              padding:
                "14px 26px",

              borderRadius:
                18,

              border:
                "none",

              background:
                canGenerate
                  ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                  : "#111",

              color:
                "#fff",

              fontSize:
                16,

              fontWeight:
                700,

              cursor:
                canGenerate
                  ? "pointer"
                  : "not-allowed",

              opacity:
                generating
                  ? .7
                  : 1,
            }}
          >

            {generating
              ? "Generating 360° Reel..."
              : "Generate 360° Reel"}

          </button>

          {error && (

            <div
              style={{
                marginTop:
                  16,

                color:
                  "#ef4444",

                fontSize:
                  14,
              }}
            >
              {error}
            </div>

          )}

        </div>

      </div>


      <FeatureLockedModal
        open={lockedFeature !== null}
        title={
          lockedFeature === "360° Reel Generation"
            ? "Insufficient Credit"
            : "Upgrade Required"
        }
        description={
          lockedFeature === "360° Reel Generation"
            ? "You don't have enough credits to generate this 360° Reel. Upgrade your plan or add credits to continue."
            : "This feature is available on higher plans. Upgrade your subscription to unlock premium AI content packs."
        }
        featureName={
          lockedFeature === "360° Reel Generation"
            ? undefined
            : lockedFeature ?? undefined
        }
        primaryLabel={
          lockedFeature === "360° Reel Generation"
            ? "Upgrade / Add Credit"
            : "Upgrade Plan"
        }
        onClose={() => setLockedFeature(null)}
      />

      <LookbookHeroPickerModal
        open={
          pickerOpen
        }

        onClose={() =>
          setPickerOpen(false)
        }

        allowVideos={
          false
        }

        onSelect={
          (
            url
          ) =>
            handleAssetSelected(
              url
            )
        }
      />

    </div>

  );

}
