import { create } from "zustand";

/* ----------------------------------
   Plan types (self-serve only)
---------------------------------- */
export type PlanType = "basic" | "pro" | "advanced";

/* ----------------------------------
   Plan configuration (single source)
---------------------------------- */
export const PLAN_CONFIG = {
  basic: {
    price: 9,
    lookbooks: 1,
    reels: 1,
    reelDuration: 5,
    resolution: "4k",
    allowUserUpload: false,
  },
  pro: {
    price: 29,
    lookbooks: 3,
    reels: 3,
    reelDuration: 10,
    resolution: "4k",
    allowUserUpload: true,
  },
  advanced: {
    price: 59,
    lookbooks: 6,
    reels: 6,
    reelDuration: 15,
    resolution: "4k",
    allowUserUpload: true,
  },
} as const;

/* ----------------------------------
   Store state
---------------------------------- */
interface PlanState {
  plan: PlanType | null;

  setPlan: (plan: PlanType) => void;
  resetPlan: () => void;
}

export const usePlanStore = create<PlanState>((set) => ({
  plan: null,

  setPlan: (plan) => set({ plan }),
  resetPlan: () => set({ plan: null }),
}));
