// magicreel-tryon-frontend/src/api/p2m/hero.ts
// 🔒 FRONTEND HERO GENERATION API (FIXED - USES API_BASE)

import axios from "axios";
import { API_BASE } from "../../config/api";

export type GenerateHeroV2Payload = {
  categoryKey: string;
  avatarGender: "male" | "female";

  avatarFaceImageUrl: string;
  garmentFrontImageUrl: string;

  fit?: "TUCKED" | "UNTUCKED";
  sleeve?: "SLEEVELESS" | "HALF_SLEEVE" | "FULL_SLEEVE";
};

export async function generateHeroV2(
  payload: GenerateHeroV2Payload
): Promise<{ runId: string }> {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API_BASE}/api/p2m/hero/generate-v2`, // ✅ FIXED
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
}