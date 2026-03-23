import { create } from "zustand";

export type ViewImage = {
  id: string;
  src: string;
};

interface ViewState {
  images: ViewImage[];
  reelVideoUrl: string | null;

  setImages: (images: ViewImage[]) => void;
  setReelVideoUrl: (url: string | null) => void;
  hydrateFromStorage: () => void;
  reset: () => void;
}

const STORAGE_KEY = "magicreel:view";

export const useViewStore = create<ViewState>((set, get) => ({
  images: [],
  reelVideoUrl: null,

  setImages: (images) => {
    set({ images });
    const state = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        images,
        reelVideoUrl: state.reelVideoUrl,
      })
    );
  },

  setReelVideoUrl: (url) => {
    set({ reelVideoUrl: url });
    const state = get();
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        images: state.images,
        reelVideoUrl: url,
      })
    );
  },

  hydrateFromStorage: () => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      set({
        images: parsed.images ?? [],
        reelVideoUrl: parsed.reelVideoUrl ?? null,
      });
    } catch {
      // ignore corrupted storage
    }
  },

  reset: () => {
    localStorage.removeItem(STORAGE_KEY);
    set({
      images: [],
      reelVideoUrl: null,
    });
  },
}));
