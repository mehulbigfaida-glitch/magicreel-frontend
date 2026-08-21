import type { GarmentSubType } from "./garments";

/* =========================
   SUB-CATEGORY → PILLS
========================= */

export const CATEGORY_PILLS: Partial<
  Record<GarmentSubType, string[]>
> = {

  /* WOMEN */

  top: ["UNTUCKED", "TUCKED"],

  tshirt: ["UNTUCKED", "TUCKED"],

  shirt_blouse: ["UNTUCKED", "TUCKED"],

  one_piece: ["SLEEVELESS", "SLEEVED"],

  saree: ["SLEEVELESS", "SLEEVED"],

  overlay_jacket: ["OPEN", "BUTTONED"],

  bottoms: ["SHORTS", "CROPPED", "FULL_LENGTH"],

  top_bottom: ["COORDINATED", "CONTRAST"],

  /* ETHNIC SET */

  kurta_sets: ["SLEEVELESS", "SLEEVED"],

  sharara_sets: ["SLEEVELESS", "SLEEVED"],

  lehenga_set: ["SLEEVELESS", "SLEEVED"],

  dhoti_kurta: ["SLEEVELESS", "SLEEVED"],

  anarkali: ["SLEEVELESS", "SLEEVED"],

  /* MEN */

  shirt: ["UNTUCKED", "TUCKED"],

  kurta: ["CASUAL", "FORMAL"],

  kurta_set: ["PLAIN_SET", "WITH_BUNDI"],

  sherwani: ["CLASSIC", "INDO_WESTERN"],
};