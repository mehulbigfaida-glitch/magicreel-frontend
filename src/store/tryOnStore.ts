import { create } from "zustand";

interface TryOnState {
  garmentImageUrl: string | null;
  setGarmentImageUrl: (url: string) => void;
  reset: () => void;
}

export const useTryOnStore = create<TryOnState>((set) => ({
  garmentImageUrl: null,

  setGarmentImageUrl: (url) =>
    set({ garmentImageUrl: url }),

  reset: () => set({ garmentImageUrl: null }),
}));
