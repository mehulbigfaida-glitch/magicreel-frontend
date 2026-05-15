import { create } from "zustand";

export interface Muse {
  id: string;
  name: string;
  image: string;
}

interface CreateAIStore {
  muses: Muse[];
  selectedMuse: Muse | null;

  setSelectedMuse: (muse: Muse) => void;
}

export const useCreateAIStore =
  create<CreateAIStore>((set) => ({
    muses: [
      {
        id: "aananya",
        name: "Aananya",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
      },
      {
        id: "arjun",
        name: "Arjun",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      },
    ],

    selectedMuse: null,

    setSelectedMuse: (muse: Muse) =>
      set({
        selectedMuse: muse,
      }),
  }));