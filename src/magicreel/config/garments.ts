/* =========================
   CANONICAL GARMENTS CONFIG
========================= */

export const GARMENTS = {
  Women: [
    { key: "top", label: "Top" },
    { key: "tshirt", label: "T-Shirt" },
    { key: "shirt", label: "Shirt / Blouse" },
    { key: "one_piece", label: "One-Piece" },
    { key: "ethnic_set", label: "Ethnic Set" },
    { key: "saree", label: "Saree" },
    { key: "lehenga", label: "Lehenga" },
    { key: "overlay", label: "Overlay / Jacket" },
    { key: "bottoms", label: "Bottoms" },
  ],

  Men: [
    { key: "tshirt", label: "T-Shirt" },
    { key: "shirt", label: "Shirt" },
    { key: "kurta", label: "Kurta" },
    { key: "kurta_set", label: "Kurta Set" },
    { key: "sherwani", label: "Sherwani" },
    { key: "overlay", label: "Overlay / Jacket" },
    { key: "bottoms", label: "Bottoms" },
  ],

  Kids: [
    { key: "kurta_set", label: "Boys Set" },
    { key: "lehenga", label: "Girls Set" },
    { key: "one_piece", label: "Girls One-Piece" },
  ],
} as const;

/* =========================
   DERIVED TYPES (LOCKED)
========================= */

export type GarmentCategory = keyof typeof GARMENTS;

export type GarmentSubType =
  (typeof GARMENTS)[GarmentCategory][number]["key"];