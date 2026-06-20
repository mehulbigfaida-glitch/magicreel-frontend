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

  onSelect: (
    url:string,
    type:string,
    heroUrl?:string
  )=>void;
}

export default function AssetPickerModal({
  open,
  onClose,
  onSelect
}: Props) {

  const [assets, setAssets] =
    useState<Prediction[]>([]);

  useEffect(() => {

    if (!open) return;

    async function load() {

      const token =
        localStorage.getItem("token");

      const res =
        await fetch(
          "https://magicreel-backend-production.up.railway.app/api/predictions",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const json =
        await res.json();

      const predictions =
        Array.isArray(json)
          ? json
          : json.data || [];

      setAssets(predictions);
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
        overflow: "auto"
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          padding: 20
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
            marginTop: 20
          }}
        >
          {assets.map(item => {

            const url =
              item.heroImageUrl ||
              item.mediaUrl ||
              item.lookbookImages?.[0];

            if (!url) return null;

            const isVideo =
              item.type === "reel" ||
              url.includes(".mp4");

            return (
              <div
                key={item.id}
                style={{
                  cursor: "pointer"
                }}
                onClick={() =>
  onSelect(
    url,
    isVideo
      ? "video"
      : "image",
    item.heroImageUrl || url
  )
}
              >
                {isVideo ? (
                  <video
                    src={url}
                    style={{
                      width: "100%"
                    }}
                  />
                ) : (
                  <img
                    src={url}
                    style={{
                      width: "100%"
                    }}
                  />
                )}

                <div>
                  {item.type}
                </div>
              </div>
            );

          })}
        </div>
      </div>
    </div>
  );
}