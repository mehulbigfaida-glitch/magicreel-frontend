import { useEffect, useRef, useState } from "react";
import "../CreatePage.css";
import { useAuth } from "../../context/AuthContext";
import AppShell from "../../layout/AppShell";
import StudioSidebar from "../StudioSidebar";
import CreateV2Layout from "./CreateV2Layout";
import CreateBreadcrumb from "./CreateBreadcrumb";
import HeroPreviewPanel from "./HeroPreviewPanel";
import GenerateHeroButton from "./GenerateHeroButton";
import AvatarPickerDrawer from "./AvatarPickerDrawer";
import { useNavigate } from "react-router-dom";
import type {
  GarmentCategory,
  GarmentSubType,
} from "../../magicreel/config/garments";

import type { AvatarType } from "../StudioSidebar";

import { CATEGORY_PILLS } from "../../magicreel/config/categoryPills";
import { useAvatarStore } from "../../store/avatarStore";
import { API_BASE } from "../../config/api";

type Selection = {
  category: GarmentCategory | null;
  subType: GarmentSubType | null;
  pill: string | null;
};

const initialSelection: Selection = {
  category: null,
  subType: null,
  pill: null,
};

export default function CreateV2Page() {

  const [selection, setSelection] =
    useState<Selection>(initialSelection);

  const [avatarCategory, setAvatarCategory] =
    useState<AvatarType | null>(null);

  const [sceneStyle, setSceneStyle] =
    useState<"ecommerce">("ecommerce");

  const { refreshUser } = useAuth();

  const { selectedAvatar, setCategory } =
    useAvatarStore();

  const [isAvatarDrawerOpen, setIsAvatarDrawerOpen] =
    useState(false);

  const [productImageUrl, setProductImageUrl] =
    useState<string | null>(null);

  const [backImageUrl, setBackImageUrl] =
    useState<string | null>(null);

  const [frontUploading, setFrontUploading] =
    useState(false);

  const [backUploading, setBackUploading] =
    useState(false);

  const [frontRunId, setFrontRunId] =
    useState<string | null>(null);

  const [backRunId, setBackRunId] =
    useState<string | null>(null);

  const [frontHeroImageUrl, setFrontHeroImageUrl] =
    useState<string | null>(null);

  const [backHeroImageUrl, setBackHeroImageUrl] =
    useState<string | null>(null);

  const [activeHeroView, setActiveHeroView] =
    useState<"front" | "back">("front");

  const [heroLoading, setHeroLoading] =
    useState(false);

  const [heroError, setHeroError] =
    useState<string | null>(null);

  const pollRef = useRef<number | null>(null);

  const navigate = useNavigate();

  /* ---------------- Avatar Drawer ---------------- */

  useEffect(() => {
    if (avatarCategory) {
      setCategory(avatarCategory);
      setIsAvatarDrawerOpen(true);
    }
  }, [avatarCategory, setCategory]);

  /* ================= PILL SYSTEM ================= */

  const pills =
    selection.subType &&
    CATEGORY_PILLS[selection.subType]
      ? (
        <div className="mr-pill-grid">
          {CATEGORY_PILLS[selection.subType].map((p) => (
            <button
              key={p}
              className={`mr-pill ${
                selection.pill === p ? "active" : ""
              }`}
              onClick={() =>
                setSelection((prev) => ({
                  ...prev,
                  pill: p,
                }))
              }
            >
              {p}
            </button>
          ))}
        </div>
      )
      : null;

  useEffect(() => {
    if (!selection.subType) return;

    const pillOptions = CATEGORY_PILLS[selection.subType];

    if (pillOptions && !selection.pill) {
      setSelection((prev) => ({
        ...prev,
        pill: pillOptions[0],
      }));
    }
  }, [selection.subType]);

  /* ================= IMAGE UPLOAD ================= */

  const uploadImage = async (file: File) => {
    const { uploadToCloudinary } = await import(
      "../../api/cloudinary"
    );
    return uploadToCloudinary(file);
  };

  const handleFrontUpload = async (file: File) => {
    setFrontUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setProductImageUrl(uploadedUrl);
    } catch {
      alert("Front image upload failed");
    } finally {
      setFrontUploading(false);
    }
  };

  const handleBackUpload = async (file: File) => {
    setBackUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      setBackImageUrl(uploadedUrl);
    } catch {
      alert("Back image upload failed");
    } finally {
      setBackUploading(false);
    }
  };

  const canGenerate =
    !!selection.subType &&
    !!selection.pill &&
    !!selectedAvatar &&
    !!productImageUrl &&
    !frontUploading &&
    !backUploading;

  /* ================= HERO GENERATION ================= */

  const generateHero = async () => {

    if (heroLoading) return;

    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }

    try {

      setHeroError(null);
      setHeroLoading(true);

      setFrontHeroImageUrl(null);
      setBackHeroImageUrl(null);

      const token = localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/p2m/hero/generate-v2`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            categoryKey: selection.subType!,
            avatarGender: selectedAvatar!.gender,
            avatarFaceImageUrl: selectedAvatar!.modelImage,
            garmentFrontImageUrl: productImageUrl,
            avatarBackImageUrl: backImageUrl
              ? selectedAvatar!.backModelImage
              : undefined,
            garmentBackImageUrl: backImageUrl || undefined,
            styling: selection.pill || null,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Hero failed");
      }

      setFrontRunId(data.frontRunId);
      setBackRunId(data.backRunId || null);

      await refreshUser();

    } catch (err: any) {

      setHeroError(err.message);
      setHeroLoading(false);

    }

  };

  /* ================= HERO POLLING (CONTROLLED) ================= */

useEffect(() => {

  if (!frontRunId && !backRunId) return;

  let cancelled = false;
  let attempts = 0;
  const MAX = 25; // ~100 sec max

  const poll = async () => {

    if (cancelled) return;

    if (attempts >= MAX) {
      setHeroError("Timeout");
      setHeroLoading(false);
      return;
    }

    attempts++;

    try {

      const token = localStorage.getItem("token");

      let frontDone = false;
      let backDone = false;

      /* ---------------- FRONT ---------------- */

      if (frontRunId && !frontHeroImageUrl) {

        const res = await fetch(
          `${API_BASE}/api/p2m/hero/poll/${frontRunId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 429) {
          console.warn("Front rate limited → slowing down");
          setTimeout(poll, 6000);
          return;
        }

        if (res.ok) {
          const d = await res.json();

          if (d.status === "completed") {
            setFrontHeroImageUrl(d.imageUrl);
            frontDone = true;
          }

          if (d.status === "failed") {
            setHeroError("Front failed");
            frontDone = true;
          }
        }

      } else {
        frontDone = true;
      }

      /* ---------------- BACK ---------------- */

      if (backRunId && !backHeroImageUrl) {

        const res = await fetch(
          `${API_BASE}/api/p2m/hero/poll/${backRunId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.status === 429) {
          console.warn("Back rate limited → slowing down");
          setTimeout(poll, 6000);
          return;
        }

        if (res.ok) {
          const d = await res.json();

          if (d.status === "completed") {
            setBackHeroImageUrl(d.imageUrl);
            backDone = true;
          }

          if (d.status === "failed") {
            setHeroError("Back failed");
            backDone = true;
          }
        }

      } else {
        backDone = true;
      }

      /* ---------------- COMPLETE ---------------- */

      if (frontDone && backDone) {
        setHeroLoading(false);
        return;
      }

    } catch (err) {
      console.warn("Polling error:", err);
    }

    /* 🔥 NORMAL POLL DELAY */
    setTimeout(poll, 4000);

  };

  /* 🔥 INITIAL DELAY (VERY IMPORTANT) */
  const timer = setTimeout(poll, 8000);

  return () => {
    cancelled = true;
    clearTimeout(timer);
  };

}, [frontRunId, backRunId, frontHeroImageUrl, backHeroImageUrl]);
  /* ================= UI ================= */

  return (
    <>
      <AppShell
        sidebar={
          <StudioSidebar
            activeCategory={selection.category}
            activeSubType={selection.subType}
            activeAvatar={avatarCategory}
            activeSceneStyle={sceneStyle}
            onSceneStyleChange={setSceneStyle}
            onCategoryChange={(c) =>
              setSelection({
                category: c,
                subType: null,
                pill: null,
              })
            }
            onSubTypeChange={(s) =>
              setSelection((prev) => ({
                ...prev,
                subType: s,
                pill: null,
              }))
            }
            onAvatarChange={(a) =>
              setAvatarCategory(a)
            }
          />
        }

        canvas={
          <CreateV2Layout
            breadcrumb={
              <CreateBreadcrumb
                category={selection.category}
                subType={selection.subType}
                pill={selection.pill}
                avatarCategory={avatarCategory}
                selectedAvatar={
                  selectedAvatar
                    ? {
                        id: selectedAvatar.id,
                        image:
                          selectedAvatar.previewImage ||
                          selectedAvatar.modelImage,
                      }
                    : null
                }
                onAvatarClick={() =>
                  setIsAvatarDrawerOpen(true)
                }
              />
            }

            pills={pills}

            frontFrame={
              <label className="upload-frame-box">

                <input
                  type="file"
                  accept="image/*"
                  disabled={frontUploading}
                  onChange={(e) =>
                    e.target.files &&
                    handleFrontUpload(e.target.files[0])
                  }
                />

                {productImageUrl && <img src={productImageUrl} />}

                {frontUploading && (
                  <div className="uploading-text">
                    Uploading Front Garment...
                  </div>
                )}

                {!productImageUrl && !frontUploading && (
                  <div className="upload-placeholder-advanced">

                    <div className="upload-icon">⬆</div>

                    <div className="upload-title">
                      Upload Front Garment Image
                    </div>

                    <div className="upload-subtitle">
                      Click or drag to upload
                    </div>

                    <div className="upload-format">
                      Supports JPG / PNG
                    </div>

                    <div
  className="upload-guidelines"
  onClick={() => navigate("/docs/image-quality")}
>
  <span className="guideline-icon">📘</span>
  <span>Image Quality Guidelines</span>
</div>

                  </div>
                )}

              </label>
            }

            backFrame={
              <label className="upload-frame-box">

                <input
                  type="file"
                  accept="image/*"
                  disabled={backUploading}
                  onChange={(e) =>
                    e.target.files &&
                    handleBackUpload(e.target.files[0])
                  }
                />

                {backImageUrl && <img src={backImageUrl} />}

                {backUploading && (
                  <div className="uploading-text">
                    Uploading Back Garment...
                  </div>
                )}

                {!backImageUrl && !backUploading && (
                  <div className="upload-placeholder-advanced">

                    <div className="upload-icon">⬆</div>

                    <div className="upload-title">
                      Upload Back Garment Image (Optional)
                    </div>

                    <div className="upload-subtitle">
                      Click or drag to upload
                    </div>

                    <div className="upload-format">
                      Supports JPG / PNG
                    </div>

                    <div
  className="upload-guidelines"
  onClick={() => navigate("/docs/image-quality")}
>
  <span className="guideline-icon">📘</span>
  <span>Image Quality Guidelines</span>
</div>

                  </div>
                )}

              </label>
            }

            cta={
              <GenerateHeroButton
                canGenerate={canGenerate && !heroLoading}
                generate={generateHero}
              />
            }

          />
        }

        preview={
          <HeroPreviewPanel
            categoryKey={selection.subType}
            heroImageUrl={
              activeHeroView === "front"
                ? frontHeroImageUrl
                : backHeroImageUrl
            }
            backHeroImageUrl={backHeroImageUrl}
            loading={heroLoading}
            error={heroError}
            avatarFaceImageUrl={
              selectedAvatar?.modelImage || ""
            }
            garmentFrontImageUrl={
              productImageUrl || ""
            }
            showToggle={
              !!frontHeroImageUrl &&
              !!backHeroImageUrl
            }
            activeView={activeHeroView}
            onToggle={setActiveHeroView}
          />
        }
      />

      <AvatarPickerDrawer
        open={isAvatarDrawerOpen}
        onClose={() => setIsAvatarDrawerOpen(false)}
      />
    </>
  );

}