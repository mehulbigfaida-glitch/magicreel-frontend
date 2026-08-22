import { useEffect, useState } from "react";
const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Prediction {
  id: string;
  type: string;
  mediaUrl?: string;
  heroImageUrl?: string;
  lookbookImages?: string[];
  avatarGender?: string;
  categoryKey?: string;
  createdAt: string;
}

interface PickerAsset {
  id: string;
  url: string;
  label: string;
  type: "hero" | "lookbook" | "reel";
  heroUrl?: string;
  avatarGender?: string;
  categoryKey?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;

  allowVideos?: boolean;

  onSelect: (
    url: string,
    type: string,
    heroUrl?: string,
    avatarGender?: string,
    categoryKey?: string
  ) => void;
}

export default function AssetPickerModal({
  open,
  onClose,
  onSelect,
  allowVideos = true,
}: Props) {

  const [assets, setAssets] =
    useState<PickerAsset[]>([]);

  const [loadingAssets, setLoadingAssets] =
    useState(false);

  const [activeTab, setActiveTab] =
    useState<"hero" | "lookbook">(
      "hero"
    );

  useEffect(() => {

    if (!open) return;

    setActiveTab("hero");
    setLoadingAssets(true);

    async function load() {

      try {

        const token =
          localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/predictions`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const json =
          await res.json();

        const predictions =
          Array.isArray(json)
            ? json
            : json.data || [];

        const pickerAssets: PickerAsset[] = [];

        predictions.forEach(
          (item: Prediction) => {

            const type =
              item.type?.toLowerCase();

            /* =========================
               HERO
            ========================= */

            if (type === "hero") {

              const heroUrl =
                item.mediaUrl ||
                item.heroImageUrl ||
                "";

              if (!heroUrl) return;

              pickerAssets.push({
                id:
                  `hero-${item.id}`,

                url:
                  heroUrl,

                label:
                  "Hero",

                type:
                  "hero",

                heroUrl,

                avatarGender:
                  item.avatarGender,

                categoryKey:
                  item.categoryKey,
              });

              return;
            }

            /* =========================
               LOOKBOOK
            ========================= */

            if (type === "lookbook") {

              /*
               * Lookbook Hero
               */

              if (item.heroImageUrl) {

                pickerAssets.push({
                  id:
                    `lookbook-hero-${item.id}`,

                  url:
                    item.heroImageUrl,

                  label:
                    "Lookbook Hero",

                  type:
                    "lookbook",

                  heroUrl:
                    item.heroImageUrl,

                  avatarGender:
                    item.avatarGender,

                  categoryKey:
                    item.categoryKey,
                });

              }

              /*
               * Lookbook generated poses
               */

              if (
                item.lookbookImages?.length
              ) {

                item.lookbookImages.forEach(
                  (
                    imageUrl,
                    index
                  ) => {

                    if (!imageUrl) return;

                    pickerAssets.push({
                      id:
                        `lookbook-${item.id}-${index}`,

                      url:
                        imageUrl,

                      label:
                        `Pose ${index + 1}`,

                      type:
                        "lookbook",

                      heroUrl:
                        item.heroImageUrl ||
                        imageUrl,

                      avatarGender:
                        item.avatarGender,

                      categoryKey:
                        item.categoryKey,
                    });

                  }
                );

              }

              return;
            }

            /* =========================
               REEL
            ========================= */

            if (
              type === "reel"
            ) {

              if (
                !allowVideos
              ) {
                return;
              }

              const reelUrl =
                item.mediaUrl ||
                "";

              if (!reelUrl) return;

              pickerAssets.push({
                id:
                  `reel-${item.id}`,

                url:
                  reelUrl,

                label:
                  "Reel",

                type:
                  "reel",

                heroUrl:
                  item.heroImageUrl ||
                  "",
              });

            }

          }
        );

        setAssets(
          pickerAssets
        );

      } catch (err) {

        console.error(
          "Failed loading assets",
          err
        );

      } finally {

        setLoadingAssets(false);

      }

    }

    load();

  }, [
    open,
    allowVideos,
  ]);

  if (!open) return null;

  const heroAssets =
    assets.filter(
      (asset) =>
        asset.type === "hero"
    );

  const lookbookAssets =
    assets.filter(
      (asset) =>
        asset.type === "lookbook"
    );



  function renderAsset(
    asset: PickerAsset
  ) {

    return (

      <div
        key={asset.id}

        style={{
          cursor:
            "pointer",

          border:
            "1px solid #ddd",

          borderRadius: 10,

          overflow:
            "hidden",

          background:
            "#fff",

          transition:
            "transform .18s ease",
        }}

        onClick={() => {

          console.log(
            "ASSET SELECTED",
            asset
          );

          onSelect(
            asset.url,
            asset.type,
            asset.heroUrl ||
              asset.url,
            asset.avatarGender,
            asset.categoryKey
          );

        }}

      >

        <img
          src={asset.url}

          alt={
            asset.label
          }

          onError={(e) => {

            const target =
              e.currentTarget;

            target.onerror =
              null;

            target.style.background =
              "#f3f4f6";

            target.style.objectFit =
              "contain";

            target.src =
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg"
                     width="300"
                     height="450">
                  <rect
                    width="100%"
                    height="100%"
                    fill="#f3f4f6"/>
                  <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    dominant-baseline="middle"
                    font-size="20"
                    fill="#666">
                    Asset
                  </text>
                </svg>
              `);

          }}

          style={{
            width:
              "100%",

            aspectRatio:
              "4 / 5",

            objectFit:
              "cover",

            display:
              "block",
          }}

        />

        <div
          style={{
            padding:
              "10px 12px",

            fontSize:
              13,

            fontWeight:
              600,

            color:
              "#111",

            textTransform:
              "capitalize",
          }}
        >
          {asset.label}
        </div>

      </div>

    );

  }

  function renderSection(
    title: string,
    items: PickerAsset[]
  ) {

    if (!items.length)
      return null;

    return (

      <section
        style={{
          marginTop:
            28,
        }}
      >

        <h3
          style={{
            margin:
              "0 0 14px",

            fontSize:
              14,

            fontWeight:
              700,

            color:
              "#111",

            letterSpacing:
              ".04em",

            textTransform:
              "uppercase",
          }}
        >
          {title}
        </h3>

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "repeat(auto-fill,minmax(180px,1fr))",

            gap:
              16,
          }}
        >
          {items.map(
            renderAsset
          )}
        </div>

      </section>

    );

  }

  return (

    <div
      style={{
        position:
          "fixed",

        inset:
          0,

        background:
          "rgba(0,0,0,.7)",

        zIndex:
          9999,

        padding:
          40,

        overflow:
          "auto",
      }}
    >

      <div
        style={{
          background:
            "#fff",

          borderRadius:
            18,

          padding:
            24,

          maxWidth:
            1100,

          margin:
            "0 auto",

          boxShadow:
            "0 30px 80px rgba(0,0,0,.35)",
        }}
      >

        <div
          style={{
            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "space-between",

            gap:
              16,
          }}
        >

          <div>
            <h2
              style={{
                margin:
                  0,

                color:
                  "#111",

                fontSize:
                  24,
              }}
            >
              Select Asset
            </h2>

            <p
              style={{
                margin:
                  "6px 0 0",

                color:
                  "#666",

                fontSize:
                  13,
              }}
            >
              Choose from your Heroes,
              Lookbook images and Reels.
            </p>
          </div>

          <button
            onClick={
              onClose
            }

            style={{
              border:
                "none",

              background:
                "#111",

              color:
                "#fff",

              borderRadius:
                999,

              padding:
                "10px 16px",

              cursor:
                "pointer",
            }}
          >
            Close
          </button>

        </div>

        <div
          style={{
            display:
              "grid",

            gridTemplateColumns:
              "1fr 1fr",

            gap:
              6,

            marginTop:
              28,

            padding:
              6,

            borderRadius:
              14,

            background:
              "#f1f1f1",
          }}
        >

          <button
            type="button"
            onClick={() =>
              setActiveTab("hero")
            }
            style={{
              border:
                "none",

              borderRadius:
                10,

              padding:
                "13px 16px",

              background:
                activeTab === "hero"
                  ? "#111"
                  : "transparent",

              color:
                activeTab === "hero"
                  ? "#fff"
                  : "#555",

              fontWeight:
                700,

              fontSize:
                13,

              cursor:
                "pointer",

              transition:
                "all .18s ease",
            }}
          >
            Hero Assets
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("lookbook")
            }
            style={{
              border:
                "none",

              borderRadius:
                10,

              padding:
                "13px 16px",

              background:
                activeTab === "lookbook"
                  ? "#111"
                  : "transparent",

              color:
                activeTab === "lookbook"
                  ? "#fff"
                  : "#555",

              fontWeight:
                700,

              fontSize:
                13,

              cursor:
                "pointer",

              transition:
                "all .18s ease",
            }}
          >
            Lookbook Assets
          </button>

        </div>

        {activeTab === "hero" &&
          renderSection(
            "Hero Assets",
            heroAssets
          )}

        {activeTab === "lookbook" &&
          renderSection(
            "Lookbook Assets",
            lookbookAssets
          )}

        {loadingAssets ? (

          <div
            style={{
              marginTop:
                24,

              minHeight:
                220,

              display:
                "flex",

              flexDirection:
                "column",

              alignItems:
                "center",

              justifyContent:
                "center",

              textAlign:
                "center",

              color:
                "#555",

              background:
                "#f7f7f7",

              borderRadius:
                14,
            }}
          >

            <div
              style={{
                width:
                  42,

                height:
                  42,

                borderRadius:
                  "50%",

                border:
                  "4px solid #ddd",

                borderTopColor:
                  "#111",

                animation:
                  "mrAssetPickerSpin 0.9s linear infinite",

                marginBottom:
                  16,
              }}
            />

            <div
              style={{
                fontSize:
                  15,

                fontWeight:
                  700,

                color:
                  "#222",
              }}
            >
              Loading your assets…
            </div>

            <div
              style={{
                marginTop:
                  6,

                fontSize:
                  13,

                color:
                  "#777",
              }}
            >
              Fetching your latest creations
            </div>

          </div>

        ) : (

          (
            activeTab === "hero"
              ? heroAssets
              : lookbookAssets
          ).length === 0 && (

            <div
              style={{
                marginTop:
                  24,

                padding:
                  32,

                textAlign:
                  "center",

                color:
                  "#666",

                background:
                  "#f7f7f7",

                borderRadius:
                  14,
              }}
            >
              No assets available yet.
            </div>

          )

        )}

        <style>
          {`
            @keyframes mrAssetPickerSpin {
              from {
                transform: rotate(0deg);
              }
              to {
                transform: rotate(360deg);
              }
            }
          `}
        </style>

      </div>

    </div>

  );
}
