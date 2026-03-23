import { create } from "zustand";

export type EditMode =
  | "none"
  | "replace"
  | "add_element"
  | "fit_length";

interface EditState {
  mode: EditMode;
  setMode: (mode: EditMode) => void;
  reset: () => void;
}

export const useEditStore = create<EditState>()((set) => ({
  mode: "none",
  setMode: (mode) => set({ mode }),
  reset: () => set({ mode: "none" }),
}));
