import type { GarmentCategory } from "../magicreel/config/garments";

export async function uploadGarment(data: {
  frontImageUrl: string;
  backImageUrl?: string;
  category: GarmentCategory;
}) {
  const res = await fetch("/api/garment/upload", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to upload garment");
  }

  return res.json();
}