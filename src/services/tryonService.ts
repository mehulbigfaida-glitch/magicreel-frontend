// src/services/tryonService.ts

const API_BASE = "http://localhost:5001";

export interface TryOnRequest {
  modelImageUrl: string;
  garmentImageUrl: string;
  category?: string;
  segmentationFree?: boolean;
  mode?: string;
  avatarId?: string;
}

export interface TryOnResponse {
  success: boolean;
  finalImageUrl: string | null;
  intermediate?: any;
  error?: string;
}

export async function runTryOn(
  payload: TryOnRequest
): Promise<TryOnResponse> {
  const requestBody = {
    modelImageUrl: payload.modelImageUrl,
    garmentImageUrl: payload.garmentImageUrl,
    category: payload.category ?? "auto",
    metadata: {
      segmentationFree: payload.segmentationFree ?? true,
      mode: payload.mode ?? "quality",
      avatarId: payload.avatarId ?? null,
    },
  };

  const response = await fetch(`${API_BASE}/api/tryon`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.details || json?.error || `Backend error: ${response.status}`
    );
  }

  return json as TryOnResponse;
}
