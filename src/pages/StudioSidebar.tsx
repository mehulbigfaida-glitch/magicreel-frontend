// frontend/src/pages/StudioSidebar.tsx
// 🔒 MAGICREEL — ACCORDION SIDEBAR (SEALED V1)

import "./StudioSidebar.css";
import { useState } from "react";
import type {
  GarmentCategory,
  GarmentSubType,
} from "../magicreel/config/garments";
import { GARMENTS } from "../magicreel/config/garments";

export type AvatarType =
  | "female"
  | "female_plus"
  | "male"
  | "male_plus"
  | "kids";

export type SceneStyle = "ecommerce";

type Props = {
  activeCategory: GarmentCategory | null;
  activeSubType: GarmentSubType | null;
  activeAvatar: AvatarType | null;
  activeSceneStyle: SceneStyle;

  onCategoryChange: (c: GarmentCategory) => void;
  onSubTypeChange: (s: GarmentSubType) => void;
  onAvatarChange: (a: AvatarType) => void;
  onSceneStyleChange: (s: SceneStyle) => void;
};

export default function StudioSidebar({
  activeCategory,
  activeSubType,
  activeAvatar,
  activeSceneStyle,
  onCategoryChange,
  onSubTypeChange,
  onAvatarChange,
  onSceneStyleChange,
}: Props) {
  const [openSection, setOpenSection] = useState<
    "garment" | "avatar" | "scene" | null
  >("garment");

  return (
    <div className="mr-sidebar">
      {/* HEADER */}
      <div className="mr-sidebar-header">
        MagicReel
      </div>

      {/* ================= GARMENT ================= */}
      <div className="mr-accordion">
        <button
          className="mr-accordion-header"
          onClick={() =>
            setOpenSection(
              openSection === "garment" ? null : "garment"
            )
          }
        >
          Select Garment
          <span>
            {openSection === "garment" ? "▾" : "▸"}
          </span>
        </button>

        {openSection === "garment" && (
          <div className="mr-accordion-body">
            {(["Women", "Men", "Kids"] as GarmentCategory[]).map(
              (cat) => (
                <div key={cat}>
                  <button
                    className={`mr-accordion-item ${
                      activeCategory === cat ? "active" : ""
                    }`}
                    onClick={() => onCategoryChange(cat)}
                  >
                    {cat}
                    <span>
                      {activeCategory === cat ? "▾" : "▸"}
                    </span>
                  </button>

                  {activeCategory === cat && (
                    <div className="mr-sublist">
                      {GARMENTS[cat].map((g) => (
                        <button
                          key={g.key}
                          className={`mr-subitem ${
                            activeSubType === g.key
                              ? "active"
                              : ""
                          }`}
                          onClick={() =>
                            onSubTypeChange(g.key)
                          }
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* ================= AVATAR ================= */}
      <div className="mr-accordion">
        <button
          className="mr-accordion-header"
          onClick={() =>
            setOpenSection(
              openSection === "avatar" ? null : "avatar"
            )
          }
        >
          Select Avatar
          <span>
            {openSection === "avatar" ? "▾" : "▸"}
          </span>
        </button>

        {openSection === "avatar" && (
          <div className="mr-accordion-body">
            {([
              { key: "female", label: "Female" },
              {
                key: "female_plus",
                label: "Female Plus Size",
              },
              { key: "male", label: "Male" },
              {
                key: "male_plus",
                label: "Male Plus Size",
              },
              { key: "kids", label: "Kids" },
            ] as {
              key: AvatarType;
              label: string;
            }[]).map((a) => (
              <button
                key={a.key}
                className={`mr-accordion-item ${
                  activeAvatar === a.key ? "active" : ""
                }`}
                onClick={() => onAvatarChange(a.key)}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ================= SCENE STYLE ================= */}
      <div className="mr-accordion">
        <button
          className="mr-accordion-header"
          onClick={() =>
            setOpenSection(
              openSection === "scene" ? null : "scene"
            )
          }
        >
          Scene Style
          <span>
            {openSection === "scene" ? "▾" : "▸"}
          </span>
        </button>

        {openSection === "scene" && (
          <div className="mr-accordion-body">

            <button
              className={`mr-accordion-item ${
                activeSceneStyle === "ecommerce"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                onSceneStyleChange("ecommerce")
              }
            >
              E-Commerce
            </button>

            <div className="mr-style-desc">
              Clean studio product photography
            </div>

          </div>
        )}
      </div>
    </div>
  );
}