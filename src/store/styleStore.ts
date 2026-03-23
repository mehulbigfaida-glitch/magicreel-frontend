import { create } from "zustand";

/* ---------------- BACKGROUND TYPES ---------------- */

export type PresetBackgroundId =
  | "studio-white"
  | "beige"
  | "editorial-grey";

export type AiBackgroundPreset =
  | "luxury"
  | "fashion"
  | "clean";

export type BackgroundStyle =
  | { type: "preset"; id: PresetBackgroundId }
  | { type: "ai"; preset: AiBackgroundPreset }
  | { type: "upload"; imageUrl: string };

/* ---------------- LOGO TYPES ---------------- */

export type LogoPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type LogoSize = "small" | "medium" | "large";

export interface LogoStyle {
  imageUrl: string;
  position: LogoPosition;
  size: LogoSize;
  opacity: number; // 0.1 – 1.0
}

/* ---------------- STORE ---------------- */

interface StyleState {
  background: BackgroundStyle | null;
  logo: LogoStyle | null;

  /* Background */
  setPresetBackground: (id: PresetBackgroundId) => void;
  setAiBackground: (preset: AiBackgroundPreset) => void;
  setUploadedBackground: (url: string) => void;

  /* Logo */
  setLogoImage: (url: string) => void;
  setLogoPosition: (pos: LogoPosition) => void;
  setLogoSize: (size: LogoSize) => void;
  setLogoOpacity: (opacity: number) => void;
  removeLogo: () => void;

  resetStyle: () => void;
}

export const useStyleStore = create<StyleState>((set, get) => ({
  background: null,
  logo: null,

  /* ---------- Background ---------- */

  setPresetBackground: (id) =>
    set({ background: { type: "preset", id } }),

  setAiBackground: (preset) =>
    set({ background: { type: "ai", preset } }),

  setUploadedBackground: (url) =>
    set({ background: { type: "upload", imageUrl: url } }),

  /* ---------- Logo ---------- */

  setLogoImage: (url) =>
    set({
      logo: {
        imageUrl: url,
        position: "bottom-right",
        size: "medium",
        opacity: 0.9,
      },
    }),

  setLogoPosition: (position) =>
    set({
      logo: get().logo
        ? { ...get().logo!, position }
        : null,
    }),

  setLogoSize: (size) =>
    set({
      logo: get().logo
        ? { ...get().logo!, size }
        : null,
    }),

  setLogoOpacity: (opacity) =>
    set({
      logo: get().logo
        ? { ...get().logo!, opacity }
        : null,
    }),

  removeLogo: () => set({ logo: null }),

  resetStyle: () =>
    set({
      background: null,
      logo: null,
    }),
}));
