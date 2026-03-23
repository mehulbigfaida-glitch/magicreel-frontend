import axios from "axios";

/**
 * MUST match StudioSidebar GarmentSubType exactly
 */
export type GarmentCategory =
  | "shirt"
  | "tshirt"
  | "top"
  | "one_piece"
  | "ethnic_set"
  | "saree"
  | "lehenga"
  | "kurta"
  | "kurta_set"
  | "sherwani"
  | "bandhgala"
  | "bottoms";

export async function uploadGarment(params: {
  frontImageUrl: string;
  backImageUrl?: string;
  category: GarmentCategory;
}) {
  const res = await axios.post("/api/garment/upload", {
    frontImageUrl: params.frontImageUrl,
    backImageUrl: params.backImageUrl,
    category: params.category,
  });

  return res.data;
}
