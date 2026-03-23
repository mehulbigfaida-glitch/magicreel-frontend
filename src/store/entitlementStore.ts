import { create } from "zustand";

interface EntitlementState {
  /* Totals granted after payment / referral / top-up */
  lookbooksTotal: number;
  reelsTotal: number;

  /* Consumption */
  lookbooksUsed: number;
  reelsUsed: number;

  /* Derived helpers */
  remainingLookbooks: () => number;
  remainingReels: () => number;

  /* Initialization */
  initEntitlements: (params: {
    lookbooks: number;
    reels: number;
  }) => void;

  /* Consumption actions */
  consumeLookbook: () => boolean;
  consumeReel: () => boolean;

  /* Reset (logout / new project later) */
  resetEntitlements: () => void;
}

export const useEntitlementStore = create<EntitlementState>((set, get) => ({
  lookbooksTotal: 0,
  reelsTotal: 0,

  lookbooksUsed: 0,
  reelsUsed: 0,

  remainingLookbooks: () =>
    get().lookbooksTotal - get().lookbooksUsed,

  remainingReels: () =>
    get().reelsTotal - get().reelsUsed,

  initEntitlements: ({ lookbooks, reels }) =>
    set({
      lookbooksTotal: lookbooks,
      reelsTotal: reels,
      lookbooksUsed: 0,
      reelsUsed: 0,
    }),

  consumeLookbook: () => {
    const { lookbooksUsed, lookbooksTotal } = get();

    if (lookbooksUsed >= lookbooksTotal) {
      return false; // ❌ not allowed
    }

    set({ lookbooksUsed: lookbooksUsed + 1 });
    return true; // ✅ consumed
  },

  consumeReel: () => {
    const { reelsUsed, reelsTotal } = get();

    if (reelsUsed >= reelsTotal) {
      return false; // ❌ not allowed
    }

    set({ reelsUsed: reelsUsed + 1 });
    return true; // ✅ consumed
  },

  resetEntitlements: () =>
    set({
      lookbooksTotal: 0,
      reelsTotal: 0,
      lookbooksUsed: 0,
      reelsUsed: 0,
    }),
}));
