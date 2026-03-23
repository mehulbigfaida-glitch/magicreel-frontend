import { create } from "zustand";
import {
  startProductToModel,
  pollProductToModel,
} from "../services/p2mService";
import { useAvatarStore } from "./avatarStore";

type P2MStatus =
  | "idle"
  | "running"
  | "completed"
  | "failed"
  | "prompt_only";

interface P2MState {
  productImageUrl: string | null;
  category: string | null;

  jobId: string | null;
  status: P2MStatus;
  resultImageUrl: string | null;
  error: string | null;

  prompt: string | null;
  registryKey: string | null;

  setProductImageUrl: (url: string) => void;
  setCategory: (category: string) => void;
  startP2M: (productImageUrlOverride?: string) => Promise<void>;
  reset: () => void;
}

export const useP2MStore = create<P2MState>((set, get) => ({
  productImageUrl: null,
  category: null,

  jobId: null,
  status: "idle",
  resultImageUrl: null,
  error: null,

  prompt: null,
  registryKey: null,

  setProductImageUrl: (url) =>
    set({ productImageUrl: url }),

  setCategory: (category) =>
    set({ category }),

  startP2M: async (productImageUrlOverride?: string) => {
    const productImageUrl =
      productImageUrlOverride ?? get().productImageUrl;
    const category = get().category;

    if (!productImageUrl) {
      throw new Error("Product image missing");
    }
    if (!category) {
      throw new Error("Garment category missing");
    }

    const avatar = useAvatarStore.getState().selectedAvatar;
    if (!avatar) {
      throw new Error("Avatar not selected");
    }

    if (avatar.gender === "kids") {
      throw new Error("Kids avatars not supported for P2M yet");
    }

    try {
      set({
        status: "running",
        error: null,
        resultImageUrl: null,
        prompt: null,
        registryKey: null,
      });

      const res: any = await startProductToModel({
        productImageUrl,
        modelImageUrl: avatar.modelImage,
        avatarGender: avatar.gender,
        category,
        attributes: {}, // pills later
      });

      // 🔒 PROMPT-ONLY MODE
      if (res?.mode === "PROMPT_ONLY") {
        console.log("🟡 PROMPT VALIDATION RESULT", res);

        set({
          status: "prompt_only",
          prompt: res.prompt,
          registryKey: res.registryKey ?? null,
        });

        return;
      }

      const { jobId } = res;
      if (!jobId) throw new Error("No jobId returned");

      set({ jobId });

      const poll = async () => {
        const { jobId } = get();
        if (!jobId) return;

        const res = await pollProductToModel(jobId);

        if (res.status === "completed") {
          set({
            status: "completed",
            resultImageUrl: res.resultImageUrl ?? null,
          });
          return;
        }

        if (res.status === "failed") {
          set({
            status: "failed",
            error: res.error ?? "P2M failed",
          });
          return;
        }

        setTimeout(poll, 2000);
      };

      poll();
    } catch (err: any) {
      set({
        status: "failed",
        error: err?.message || "Failed to start P2M",
      });
    }
  },

  reset: () =>
    set({
      productImageUrl: null,
      category: null,
      jobId: null,
      status: "idle",
      resultImageUrl: null,
      error: null,
      prompt: null,
      registryKey: null,
    }),
}));
