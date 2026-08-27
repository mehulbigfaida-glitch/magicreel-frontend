/* =========================
   CANONICAL GARMENTS CONFIG
========================= */

export const GARMENTS = {
  Women: [
    { key: "top", label: "TOP" },
    { key: "tshirt", label: "T-shirt" },
    { key: "shirt_blouse", label: "Shirt / Blouse" },
    { key: "one_piece", label: "One-Piece" },
    { key: "saree", label: "Saree" },
    { key: "overlay_jacket", label: "Overlay / Jacket" },
    { key: "bottoms", label: "Bottoms" },
    { key: "top_bottom", label: "TOP & Bottom" },
    { key: "ethnic_set", label: "Ethnic Set" },
  ],

  Men: [
    { key: "tshirt", label: "T-Shirt" },
    { key: "shirt", label: "Shirt" },
    { key: "kurta", label: "Kurta" },
    { key: "kurta_set", label: "Kurta Set" },
    { key: "sherwani", label: "Sherwani" },
    { key: "overlay_jacket", label: "Overlay / Jacket" },
    { key: "bottoms", label: "Bottoms" },
  ],

  Kids: [
    { key: "kurta_set", label: "Boys Set" },
    { key: "lehenga", label: "Girls Set" },
    { key: "one_piece", label: "Girls One-Piece" },
  ],
} as const;

/* =========================
   WOMEN — ETHNIC SET
========================= */

export const ETHNIC_SET_SUBTYPES = [
  { key: "kurta_sets", label: "Kurta Sets" },
  { key: "sharara_sets", label: "Sharara Sets" },
  { key: "lehenga_set", label: "Lehenga Set" },
  { key: "dhoti_kurta", label: "Dhoti Kurta" },
  { key: "anarkali", label: "Anarkali" },
] as const;

/* =========================
   DERIVED TYPES (LOCKED)
========================= */

export type GarmentCategory =
  keyof typeof GARMENTS;

export type GarmentSubType =
  | (typeof GARMENTS)[GarmentCategory][number]["key"]
  | (typeof ETHNIC_SET_SUBTYPES)[number]["key"];