import { create } from "zustand";

interface ReviewState {
  sealed: boolean;
  seal: () => void;
  reset: () => void;
}

export const useReviewStore = create<ReviewState>()((set) => ({
  sealed: false,
  seal: () => set({ sealed: true }),
  reset: () => set({ sealed: false }),
}));
