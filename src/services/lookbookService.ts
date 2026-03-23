// src/services/lookbookService.ts

export interface LookbookRequest {
  avatarId: string;
  garmentImageUrl: string;
  baseTryOnImageUrl: string;
  mode?: "basic" | "pro";
}

export interface LookbookItem {
  poseId: string;
  poseLabel: string;
  imageUrl: string;
}

export interface LookbookResponse {
  lookbook: LookbookItem[];
}

const API_BASE = "/api/lookbook";

export async function generateLookbook(
  payload: LookbookRequest
): Promise<LookbookResponse> {
  const res = await fetch(`${API_BASE}/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Failed to generate lookbook");
  }

  return res.json() as Promise<LookbookResponse>;
}
