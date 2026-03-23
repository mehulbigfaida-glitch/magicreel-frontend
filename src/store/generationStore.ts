import { create } from "zustand";

type GenerationStatus =
  | "idle"
  | "previewing"
  | "accepted"
  | "generating"
  | "completed";

interface GenerationState {
  status: GenerationStatus;

  setStatus: (status: GenerationStatus) => void;
  reset: () => void;
}

export const useGenerationStore = create<GenerationState>((set) => ({
  status: "idle",

  setStatus: (status) => set({ status }),

  reset: () =>
    set({
      status: "idle",
    }),
}));
