// src/pages/TryOnPage.tsx

import { useEffect, useState } from "react";
import UploadFrame from "../components/UploadFrame";
import { runTryOn } from "../services/tryonService";
import { generateLookbook } from "../services/lookbookService";

/* ------------------------------
   Types & avatars
------------------------------ */

type AvatarId = "riya" | "pooja";

interface AvatarConfig {
  id: AvatarId;
  name: string;
  tag: string;
  description: string;
  thumbnail: string;
  modelImageUrl: string;
}

/* ---------------------------------
   MASTER AVATARS (FINAL 2048x2048)
--------------------------------- */

const AVATARS: AvatarConfig[] = [
  {
    id: "riya",
    name: "Riya",
    tag: "Standard / Western",
    description: "General purpose avatar. Works for tops, dresses, indo-western.",
    thumbnail:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1765348877/riya_final_sgwwtm.png",
    modelImageUrl:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1765348877/riya_final_sgwwtm.png",
  },
  {
    id: "pooja",
    name: "Pooja",
    tag: "Standard / Ethnic",
    description: "Great for sarees, lehengas, gowns & ethnic silhouettes.",
    thumbnail:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1765348878/Pooja_final_qwnrir.png",
    modelImageUrl:
      "https://res.cloudinary.com/duaqfspwa/image/upload/v1765348878/Pooja_final_qwnrir.png",
  },
];

interface UploadState {
  remoteUrl: string | null;
}

interface DebugIntermediate {
  rawTryOnResults?: { imageUrl?: string }[];
  enhancedGarment?: { imageUrl?: string };
  enhancedModel?: { imageUrl?: string };
  dressCorrection?: { correctedImageUrl?: string };
  fusion?: { finalImageUrl?: string };
}

/* ------------------------------
   Theme helpers
------------------------------ */

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("mr-theme");
  if (stored === "light" || stored === "dark") return stored;

  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "dark";
}

/* ------------------------------
   Component Start
------------------------------ */

export default function TryOnPage() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const [garment, setGarment] = useState<UploadState>({ remoteUrl: null });

  // Default avatar = Riya
  const [selectedAvatarId, setSelectedAvatarId] =
    useState<AvatarId>("riya");

  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);
  const [loadingTryOn, setLoadingTryOn] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [debugData, setDebugData] = useState<DebugIntermediate | null>(null);

  // LOOKBOOK
  const [loadingLookbook, setLoadingLookbook] = useState(false);
  const [lookbookError, setLookbookError] = useState<string | null>(null);
  const [lookbook, setLookbook] = useState<
    { poseId: string; poseLabel: string; imageUrl: string }[]
  >([]);

  const selectedAvatar =
    AVATARS.find((a) => a.id === selectedAvatarId) || AVATARS[0];

  const canRunTryOn =
    !!garment.remoteUrl &&
    !!selectedAvatar &&
    guidelinesAccepted &&
    !loadingTryOn;

  const canGenerateLookbook =
    !!resultUrl && !loadingTryOn && !loadingLookbook;

  /* Apply theme */
  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.setAttribute("data-theme", theme);
      window.localStorage.setItem("mr-theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  /* ------------------------------
     Try-On Handler
  ------------------------------ */

  const handleRunTryOn = async () => {
    if (!canRunTryOn || !garment.remoteUrl) return;

    setLoadingTryOn(true);
    setTryOnError(null);
    setResultUrl(null);
    setDebugData(null);
    setLookbook([]);

    try {
      const response = await runTryOn({
        modelImageUrl: selectedAvatar.modelImageUrl,
        garmentImageUrl: garment.remoteUrl,
        category: "auto",
        segmentationFree: true,
        mode: "quality",
        avatarId: selectedAvatar.id,
      });

      setResultUrl(response.finalImageUrl ?? null);
      setDebugData((response as any).intermediate ?? null);
    } catch (err: any) {
      console.error("Try-on error:", err);
      setTryOnError(err?.message || "Try-on failed.");
    } finally {
      setLoadingTryOn(false);
    }
  };

  /* ------------------------------
     Lookbook Handler
  ------------------------------ */

  const handleGenerateLookbook = async () => {
    if (!resultUrl) return;

    setLoadingLookbook(true);
    setLookbookError(null);

    try {
      const response = await generateLookbook({
        avatarId: selectedAvatarId,
        garmentImageUrl: garment.remoteUrl!,
        baseTryOnImageUrl: resultUrl!,
      });

      setLookbook(response.lookbook);
    } catch (err: any) {
      console.error("Lookbook error:", err);
      setLookbookError(err?.message || "Lookbook generation failed.");
    } finally {
      setLoadingLookbook(false);
    }
  };

  /* ------------------------------
     RENDER UI
  ------------------------------ */

  return (
    <div className="magicreel-page">

      {/* HEADER */}
      <header className="magicreel-header">
        <div className="magicreel-title-block">
          <h1>
            Turn a single garment photo
            <br />
            into a{" "}
            <span className="headline-gradient">
              virtual fitting room.
            </span>
          </h1>
          <p>Upload garment → choose avatar → generate try-on.</p>
        </div>

        <button type="button" className="theme-toggle" onClick={toggleTheme}>
          <span>{theme === "dark" ? "🌙" : "☀️"}</span>
          <span>{theme === "dark" ? "Dark mode" : "Light mode"}</span>
        </button>
      </header>

      <div className="tryon-layout">

        {/* LEFT SIDE */}
        <div className="tryon-left">

          {/* STEP 1 — UPLOAD */}
          <section className="mr-card">
            <h2 className="mr-card-title">Upload garment image</h2>
            <UploadFrame
  label="Primary garment image"
  imageUrl={garment.remoteUrl}
  status={garment.remoteUrl ? "success" : "idle"}
  onUpload={(url: string) =>
    setGarment((prev) => ({ ...prev, remoteUrl: url }))
  }
/>
          </section>

          {/* STEP 2 — AVATAR */}
          <section className="mr-card">
            <h2 className="mr-card-title">Choose avatar</h2>

            <label className="mr-checkbox-row">
              <input
                type="checkbox"
                checked={guidelinesAccepted}
                onChange={(e) => setGuidelinesAccepted(e.target.checked)}
              />
              <span>I confirm the garment follows the guidelines.</span>
            </label>

            <div className="avatar-grid">
              {AVATARS.map((avatar) => {
                const selected = avatar.id === selectedAvatarId;

                return (
                  <button
                    key={avatar.id}
                    type="button"
                    disabled={!guidelinesAccepted || !garment.remoteUrl}
                    className={
                      "avatar-card" + (selected ? " avatar-card--selected" : "")
                    }
                    onClick={() => setSelectedAvatarId(avatar.id)}
                  >
                    <img src={avatar.thumbnail} className="avatar-thumb" />
                    <div className="avatar-name-row">
                      <span className="avatar-name">{avatar.name}</span>
                      <span className="avatar-tag">{avatar.tag}</span>
                    </div>
                    <p className="avatar-description">
                      {avatar.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </section>

          {/* STEP 3 — RUN TRY-ON */}
          <section className="mr-card">
            <h2 className="mr-card-title">Run AI Try-On</h2>

            {tryOnError && <p className="error">{tryOnError}</p>}

            <button
              type="button"
              className="mr-btn-primary"
              onClick={handleRunTryOn}
              disabled={!canRunTryOn}
            >
              {loadingTryOn ? "Generating…" : "Run AI Try-On"}
            </button>
          </section>

          {/* STEP 4 — LOOKBOOK */}
          {resultUrl && (
            <section className="mr-card">
              <h2 className="mr-card-title">Generate Lookbook</h2>

              {lookbookError && <p className="error">{lookbookError}</p>}

              <button
                type="button"
                className="mr-btn-primary"
                onClick={handleGenerateLookbook}
                disabled={!canGenerateLookbook}
              >
                {loadingLookbook
                  ? "Generating Lookbook…"
                  : "Generate Lookbook"}
              </button>

              {lookbook.length > 0 && (
                <div className="lookbook-grid">
                  {lookbook.map((item) => (
                    <div key={item.poseId} className="lookbook-card">
                      <img src={item.imageUrl} className="lookbook-img" />
                      <p className="lookbook-label">{item.poseLabel}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* RIGHT PREVIEW */}
        <div className="tryon-right">
          <section className="mr-card preview-card">
            <h2 className="mr-card-title">Preview</h2>

            <div className="preview-grid">
              {/* Garment */}
              <div className="preview-column">
                <h4>Garment</h4>
                <div className="preview-frame">
                  {garment.remoteUrl ? (
                    <img src={garment.remoteUrl} className="preview-image" />
                  ) : (
                    <div className="preview-placeholder">
                      Upload garment first.
                    </div>
                  )}
                </div>
              </div>

              {/* Avatar */}
              <div className="preview-column">
                <h4>Avatar</h4>
                <div className="preview-frame">
                  <img
                    src={selectedAvatar.thumbnail}
                    className="preview-image"
                  />
                </div>
              </div>

              {/* Try-on */}
              <div className="preview-column">
                <h4>Try-On</h4>
                <div className="preview-frame">
                  {loadingTryOn ? (
                    <div className="preview-placeholder">
                      Generating…
                    </div>
                  ) : resultUrl ? (
                    <img src={resultUrl} className="preview-image" />
                  ) : (
                    <div className="preview-placeholder">
                      Try-on result appears here.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Debug */}
          {debugData && (
            <section className="mr-card debug-panel">
              <h2 className="mr-card-title">Engine Debug</h2>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
