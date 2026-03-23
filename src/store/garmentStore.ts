// frontend/src/store/garmentStore.ts
// 🔒 FULL REPLACEMENT — CONFIRM CLOUDINARY URL IS STORED

import { create } from "zustand";

interface GarmentStore {
  frontImageUrl: string | null;
  backImageUrl: string | null;
  setFrontImage: (url: string) => void;
  setBackImage: (url: string) => void;
  reset: () => void;
}

export const useGarmentStore = create<GarmentStore>((set) => ({
  frontImageUrl: null,
  backImageUrl: null,

  setFrontImage: (url) =>
    set({ frontImageUrl: url }),

  setBackImage: (url) =>
    set({ backImageUrl: url }),

  reset: () =>
    set({
      frontImageUrl: null,
      backImageUrl: null,
    }),
}));
