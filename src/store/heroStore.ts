import { create } from "zustand";
import type { Avatar } from "./avatarStore";

interface HeroState {
  heroPreviewUrl?: string;
  heroChangeUsed: boolean;
  generateHero: (input: {
    avatar: Avatar;
    garmentImage: string;
  }) => void;
  markChangeUsed: () => void;
}

export const useHeroStore = create<HeroState>((set) => ({
  heroPreviewUrl: undefined,
  heroChangeUsed: false,

  generateHero: async () => {
    // TEMP placeholder image
    // Replace with backend API later
    set({
      heroPreviewUrl:
        "https://via.placeholder.com/600x900?text=Hero+Try-On",
    });
  },

  markChangeUsed: () =>
    set({
      heroChangeUsed: true,
      heroPreviewUrl: undefined,
    }),
}));
