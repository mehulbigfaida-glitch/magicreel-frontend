// magicreel-tryon-frontend/src/api/p2m/hero.ts
// 🔒 FRONTEND HERO GENERATION API (CANONICAL)

import axios from "axios";

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
  const res = await axios.post(
    "/api/p2m/hero/generate-v2",
    payload
  );

  return res.data;
}
