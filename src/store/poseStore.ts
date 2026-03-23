import { create } from "zustand";

/* ----------------------------------
   ALL pose keys used in the app
---------------------------------- */
export type PoseKey =
  | "front"
  | "back"
  | "side"
  | "walk"
  | "hero"
  | "fit"
  | "angle";

/* ----------------------------------
   Store state
---------------------------------- */
type PoseState = {
  /* Garment upload state */
  hasFrontImage: boolean;
  hasBackImage: boolean;

  /* Pose selection state */
  selected: PoseKey[];

  /* Garment actions */
  setHasFrontImage: (v: boolean) => void;
  setHasBackImage: (v: boolean) => void;
  resetGarmentImages: () => void;

  /* Pose actions */
  togglePose: (pose: PoseKey) => void;
  resetPoses: () => void;
};

/* ----------------------------------
   Store implementation
---------------------------------- */
export const usePoseStore = create<PoseState>((set, get) => ({
  /* Garment state */
  hasFrontImage: false,
  hasBackImage: false,

  /* Pose state */
  selected: ["front"], // front is always default & essential

  /* Garment actions */
  setHasFrontImage: (v) => set({ hasFrontImage: v }),
  setHasBackImage: (v) => set({ hasBackImage: v }),

  resetGarmentImages: () =>
    set({
      hasFrontImage: false,
      hasBackImage: false,
    }),

  /* Pose actions */
  togglePose: (pose) => {
    const current = get().selected;

    // front pose is mandatory
    if (pose === "front") return;

    if (current.includes(pose)) {
      set({
        selected: current.filter((p) => p !== pose),
      });
    } else {
      set({
        selected: [...current, pose],
      });
    }
  },

  resetPoses: () =>
    set({
      selected: ["front"],
    }),
}));
