// frontend/src/services/p2mService.ts
// 🔒 Transport-only P2M service (no state logic)

const API_BASE = "http://localhost:5003";

export interface P2MStartRequest {
  productImageUrl: string;
  modelImageUrl: string;
  avatarGender: "male" | "female";
  category: string;
  attributes: Record<string, any>;
}

export interface P2MStatusResponse {
  status: "running" | "completed" | "failed";
  resultImageUrl?: string | null;
  error?: string;
}

/* =========================
   Start Product-to-Model
========================= */
export async function startProductToModel(
  payload: P2MStartRequest
): Promise<any> {
  console.log("[P2M START PAYLOAD]", payload);

  const response = await fetch(`${API_BASE}/api/p2m/run`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.error || `Backend error: ${response.status}`
    );
  }

  return json;
}

/* =========================
   Poll Product-to-Model
========================= */
export async function pollProductToModel(
  jobId: string
): Promise<P2MStatusResponse> {
  const response = await fetch(
    `${API_BASE}/api/p2m/status/${jobId}`
  );

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.error || `Backend error: ${response.status}`
    );
  }

  return json as P2MStatusResponse;
}
