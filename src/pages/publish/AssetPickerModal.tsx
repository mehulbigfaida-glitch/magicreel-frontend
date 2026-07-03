import { useEffect, useState } from "react";

interface Prediction {
  id: string;
  type: string;
  mediaUrl?: string;
  heroImageUrl?: string;
  lookbookImages?: string[];
  createdAt: string;
}

interface Props {
  open: boolean;
  onClose: () => void;

  allowVideos?: boolean;

  onSelect: (
    url: string,
    type: string,
    heroUrl?: string
  ) => void;
}

export default function AssetPickerModal({
  open,
  onClose,
  onSelect,
  allowVideos = true,
}: Props) {
  const [assets, setAssets] =
    useState<Prediction[]>([]);

  useEffect(() => {
    if (!open) return;

    async function load() {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "https://magicreel-backend-production.up.railway.app/api/predictions",
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

        setAssets(predictions);
      } catch (err) {
        console.error(
          "Failed loading assets",
          err
        );
      }
    }

    load();
  }, [open]);

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "rgba(0,0,0,.7)",
        zIndex: 9999,
        padding: 40,
        overflow: "auto",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h2>Select Asset</h2>

        <button
          onClick={onClose}
        >
          Close
        </button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(220px,1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {assets.map((item) => {

  let thumbnailUrl = "";
  let selectedUrl = "";
  let assetType:
    | "image"
    | "video" = "image";

    if (
  item.type?.toLowerCase() ===
    "reel" &&
  !allowVideos
) {
  return null;
}
  
            // -----------------------
            // REEL
            // -----------------------
            if (
              item.type?.toLowerCase() ===
              "reel"
            ) {
              thumbnailUrl =
                item.heroImageUrl ||
                item.mediaUrl ||
                "";

              selectedUrl =
                item.mediaUrl ||
                thumbnailUrl;

              assetType = "video";
            }

            // -----------------------
            // LOOKBOOK
            // -----------------------
            else if (
              item.type?.toLowerCase() ===
              "lookbook"
            ) {
              thumbnailUrl =
                item.heroImageUrl ||
                item.lookbookImages?.[0] ||
                "";

              selectedUrl =
                thumbnailUrl;

              assetType = "image";
            }

            // -----------------------
            // HERO
            // -----------------------
            else {
              thumbnailUrl =
                item.mediaUrl ||
                item.heroImageUrl ||
                "";

              selectedUrl =
                thumbnailUrl;

              assetType = "image";
            }

            if (!thumbnailUrl)
              return null;

            return (
              <div
                key={item.id}
                style={{
                  cursor: "pointer",
                  border:
                    "1px solid #ddd",
                  borderRadius: 10,
                  overflow:
                    "hidden",
                  background:
                    "#fff",
                }}
                onClick={() =>
  onSelect(
    selectedUrl,
    assetType,
    item.heroImageUrl || thumbnailUrl
  )
}
              >
                <img
  src={thumbnailUrl}
  alt={item.type}
  onError={(e) => {

    const target =
      e.currentTarget;

    target.onerror = null;

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
          <rect width="100%"
                height="100%"
                fill="#f3f4f6"/>
          <text x="50%"
                y="50%"
                text-anchor="middle"
                dominant-baseline="middle"
                font-size="22"
                fill="#666">
            Reel
          </text>
        </svg>
      `);

  }}
  style={{
    width: "100%",
    aspectRatio: "4 / 5",
    objectFit: "cover",
    display: "block",
  }}
/>

                <div
                  style={{
                    padding: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    textTransform:
                      "capitalize",
                  }}
                >
                  {item.type}

                  {assetType ===
                    "video" && (
                    <span>
                      {" "}
                      🎬
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}