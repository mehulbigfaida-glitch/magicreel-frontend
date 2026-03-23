import type { GarmentSubType } from "./garments";

/* =========================
   SUB-CATEGORY → PILLS
========================= */

export const CATEGORY_PILLS: Record<GarmentSubType, string[]> = {

  /* WOMEN */

  top: ["UNTUCKED", "TUCKED"],

  tshirt: ["UNTUCKED", "TUCKED"],

  shirt: ["UNTUCKED", "TUCKED"],

  one_piece: ["SLEEVELESS", "SLEEVED"],

  ethnic_set: ["SLEEVELESS", "SLEEVED"],

  saree: ["SLEEVELESS", "SLEEVED"],

  lehenga: ["SLEEVELESS", "SLEEVED"],

  overlay: ["OPEN", "BUTTONED"],

  bottoms: ["SHORTS", "CROPPED", "FULL_LENGTH"],


  /* MEN */

  kurta: ["CASUAL", "FORMAL"],

  kurta_set: ["PLAIN_SET", "WITH_BUNDI"],

  sherwani: ["CLASSIC", "INDO_WESTERN"],
};