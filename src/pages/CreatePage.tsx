// frontend/src/pages/CreatePage.tsx
// 🔒 FINAL — /create (CATEGORY-PERSISTENT GARMENT UPLOAD)

import { useEffect, useRef, useState } from "react";
import StudioLayout from "./StudioLayout";
import StudioSidebar from "./StudioSidebar";
import type { AvatarType } from "./StudioSidebar"; // 🔑 FIX
import AvatarFaceGrid from "../components/avatar/AvatarFaceGrid";

import { useAvatarStore } from "../store/avatarStore";
import { useGarmentStore } from "../store/garmentStore";
import { useGenerate } from "../context/GenerateContext";
import { uploadGarment } from "../api/garment";

import type {
  GarmentCategory,
  GarmentSubType,
} from "../magicreel/config/garments";
import { CATEGORY_PILLS } from "../magicreel/config/categoryPills";

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

export default function CreatePage() {
  const { setCanGenerate, setCategory, setAvatarGender } =
    useGenerate();

  const [selection, setSelection] =
    useState<Selection>(initialSelection);

  const [avatarCategory, setAvatarCategory] =
    useState<AvatarType | null>(null);

  const selectedAvatar = useAvatarStore((s) => s.selectedAvatar);
  const setAvatarCategoryInStore = useAvatarStore(
    (s) => s.setCategory
  );

  const {
    frontImageUrl,
    setFrontImage,
    setBackImage,
    reset,
  } = useGarmentStore();

  const [frontPreviewUrl, setFrontPreviewUrl] =
    useState<string | null>(null);
  const [backPreviewUrl, setBackPreviewUrl] =
    useState<string | null>(null);

  const [uploading, setUploading] = useState(false);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  /* ===== GENERATE GATING ===== */
  useEffect(() => {
    setCanGenerate(
      !!frontImageUrl &&
        !!selectedAvatar &&
        !!selection.subType &&
        !!selection.pill
    );
  }, [
    frontImageUrl,
    selectedAvatar,
    selection.subType,
    selection.pill,
    setCanGenerate,
  ]);

  /* ===== FRONT UPLOAD ===== */
  const handleFrontUpload = async (file: File) => {
    setFrontPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const { uploadToCloudinary } = await import(
        "../api/cloudinary"
      );

      const uploadedUrl = await uploadToCloudinary(file);

      const garment = await uploadGarment({
        frontImageUrl: uploadedUrl,
        category: selection.subType!,
      });

      setFrontImage(garment.frontImageUrl);
    } catch (err) {
      console.error(err);
      alert("Front image upload failed");
      setFrontPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  /* ===== BACK UPLOAD ===== */
  const handleBackUpload = async (file: File) => {
    setBackPreviewUrl(URL.createObjectURL(file));
    setUploading(true);

    try {
      const { uploadToCloudinary } = await import(
        "../api/cloudinary"
      );
      const backImageUrl = await uploadToCloudinary(file);
      setBackImage(backImageUrl);
    } catch (err) {
      console.error(err);
      alert("Back image upload failed");
      setBackPreviewUrl(null);
    } finally {
      setUploading(false);
    }
  };

  const pills =
    selection.subType &&
    CATEGORY_PILLS[selection.subType]
      ? CATEGORY_PILLS[selection.subType]
      : [];

  return (
    <StudioLayout
      left={
        <StudioSidebar
  activeCategory={selection.category}
  activeSubType={selection.subType}
  activeAvatar={avatarCategory}
  activeSceneStyle="ecommerce"
  onSceneStyleChange={() => {}}
  onCategoryChange={(c) => {
    setSelection({
      category: c,
      subType: null,
      pill: null,
    });

    c && setCategory(c);
    reset();
    setFrontPreviewUrl(null);
    setBackPreviewUrl(null);
  }}
  onSubTypeChange={(s) => {
    if (!s) return;

    setSelection((prev) => ({
      ...prev,
      subType: s,
      pill: null,
    }));

    setCategory(s);
  }}
  onAvatarChange={(a) => {
    setAvatarCategory(a);
    a && setAvatarCategoryInStore(a);

    // Gender only for male/female (by design)
    if (a === "male" || a === "female") {
      setAvatarGender(a);
    }
  }}
/>
      }
      selectorRow={
        pills.length ? (
          <div className="mr-variant-pill-row">
            {pills.map((p) => (
              <button
                key={p}
                className={`mr-variant-pill ${
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
        ) : null
      }
      front={
        <label className="upload-frame-box relative">
          <input
            ref={frontInputRef}
            type="file"
            className="upload-input"
            accept="image/png,image/jpeg"
            disabled={!selection.subType || uploading}
            onChange={(e) =>
              e.target.files &&
              handleFrontUpload(e.target.files[0])
            }
          />
          {frontPreviewUrl ? (
            <>
              <img
                src={frontPreviewUrl}
                className="upload-preview-image"
              />
              <button
                type="button"
                onClick={() =>
                  frontInputRef.current?.click()
                }
                className="replace-btn"
              >
                Replace?
              </button>
            </>
          ) : (
            <div className="upload-placeholder">
              ⬆ Upload image
              <div className="upload-subtext">
                PNG / JPEG
              </div>
            </div>
          )}
        </label>
      }
      back={
        <label className="upload-frame-box relative">
          <input
            ref={backInputRef}
            type="file"
            className="upload-input"
            accept="image/png,image/jpeg"
            disabled={!selection.subType || uploading}
            onChange={(e) =>
              e.target.files &&
              handleBackUpload(e.target.files[0])
            }
          />
          {backPreviewUrl ? (
            <>
              <img
                src={backPreviewUrl}
                className="upload-preview-image"
              />
              <button
                type="button"
                onClick={() =>
                  backInputRef.current?.click()
                }
                className="replace-btn"
              >
                Replace?
              </button>
            </>
          ) : (
            <div className="upload-placeholder">
              ⬆ Upload image
              <div className="upload-subtext">
                PNG / JPEG · Optional
              </div>
            </div>
          )}
        </label>
      }
      preview={
        <div>
          <div className="avatar-preview-box">
            {selectedAvatar ? (
              <img
                src={selectedAvatar.previewImage}
                style={{ height: "100%" }}
              />
            ) : (
              <span>Select an avatar category</span>
            )}
          </div>

          {avatarCategory && <AvatarFaceGrid />}
        </div>
      }
    />
  );
}
