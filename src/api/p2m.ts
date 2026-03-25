import { API_BASE } from "../config/api";

export interface StartP2MResponse {
  success: boolean;
  jobId: string;
}

export interface P2MJob {
  status: "pending" | "running" | "completed" | "failed";
  output?: string[];
  error?: string;
}

export async function startP2M(input: {
  productImageUrl: string;
  modelImageUrl: string;
  avatarGender: "male" | "female";
  category: string; // 🔓 UNLOCKED
  attributes: {
    pattern?: "striped" | "checked" | "printed" | "solid";
    tuck?: "tucked" | "untucked";
    rolledSleeves?: boolean;
  };
}): Promise<StartP2MResponse> {
  console.log("[START P2M PAYLOAD]", input); // 🔍 proof

  const res = await fetch(`${API_BASE}/api/p2m/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to start P2M: ${text}`);
  }

  return res.json();
}

export async function pollP2M(jobId: string): Promise<P2MJob> {
  const res = await fetch(
    `${API_BASE}/api/p2m/status/${jobId}`
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to poll P2M: ${text}`);
  }

  const data = await res.json();
  return data.job as P2MJob;
}
