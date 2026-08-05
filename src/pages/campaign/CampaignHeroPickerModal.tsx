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

const [loading, setLoading] =
  useState(false);

const [loadedImages, setLoadedImages] =
  useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!open) return;

    async function load() {

  setLoading(true);

  try {

    const token =
      localStorage.getItem("token");

    const res = await fetch(
      "https://magicreel-backend-production.up.railway.app/api/predictions",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const json = await res.json();

    const predictions =
      Array.isArray(json)
        ? json
        : json.data || [];

    const heroAssets = predictions.filter(
      (item: Prediction) =>
        item.type?.toLowerCase() === "hero"
    );

    setAssets(heroAssets);

  } catch (err) {

    console.error(
      "Failed loading assets",
      err
    );

  } finally {

    setLoading(false);

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
    zIndex: 9999,

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    padding: 32,

    background: "rgba(8,10,18,.72)",
    backdropFilter: "blur(14px)",

    overflow: "hidden",
  }}
>
      <div
  style={{
    width: "min(1280px,92vw)",
    height: "min(900px,88vh)",

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",

    borderRadius: 24,

    background:
      "linear-gradient(180deg,#171b29 0%,#0f1320 100%)",

    border:
      "1px solid rgba(255,255,255,.08)",

    boxShadow:
      "0 40px 120px rgba(0,0,0,.45)",
  }}
>
        <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    padding: "24px 28px",

    borderBottom:
      "1px solid rgba(255,255,255,.06)",
  }}
>
  <div>
    <div
      style={{
        fontSize: 24,
        fontWeight: 700,
        color: "#fff",
      }}
    >
      Select Hero
    </div>

    <div
      style={{
        marginTop: 4,
        fontSize: 14,
        color: "rgba(255,255,255,.6)",
      }}
    >
      Choose an existing Hero from your library.
    </div>
  </div>

  <button
    onClick={onClose}
    style={{
      width: 42,
      height: 42,

      borderRadius: 999,

      border: "none",

      cursor: "pointer",

      fontSize: 20,

      background:
        "rgba(255,255,255,.06)",

      color: "#fff",
    }}
  >
    ✕
  </button>
</div>

        <div
  style={{
    flex: 1,

    overflowY: "auto",

    padding: 28,

    display: "grid",
            gridTemplateColumns:
  "repeat(auto-fill,minmax(200px,220px))",

justifyContent: "center",
            gap: 16,
            marginTop: 20,
          }}
        >
          {loading ? (

  <div
    style={{
      gridColumn: "1 / -1",

      minHeight: 500,

      display: "flex",
      flexDirection: "column",

      justifyContent: "center",
      alignItems: "center",

      color: "#fff",
    }}
  >

    <div
      style={{
        fontSize: 54,
        animation: "pulse 1.4s infinite",
      }}
    >
      ✨
    </div>

    <div
      style={{
        marginTop: 20,
        fontSize: 22,
        fontWeight: 700,
      }}
    >
      Loading Hero Library...
    </div>

    <div
      style={{
        marginTop: 10,
        fontSize: 15,
        color: "rgba(255,255,255,.65)",
      }}
    >
      Scanning your AI Fashion Workspace...
    </div>

  </div>

) : (

assets.map((item) => {

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
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 18,
  overflow: "hidden",
  background: "#1b2233",
  transition: "all .2s ease",
  minHeight: 370,
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
  height: 320,
  objectFit: "cover",
  objectPosition: "top center",
  display: "block",
  background: "#111827",
}}
/>

                <div
                  style={{
  padding: 14,
  fontSize: 14,
  fontWeight: 600,
  color: "#ffffff",
  textTransform: "capitalize",
  textAlign: "center",
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
                    })
)}
        </div>
      </div>
    </div>
  );
}