import { AVATAR_PRESET_CONFIG } from "../components/avatar/avatarPresetConfig";

import { API_BASE } from "../config/api";

export interface StartTryOnResponse {
  success: boolean;
  jobId: string;
}

export interface TryOnJob {
  status:
    | "created"
    | "fashn_running"
    | "post_processing"
    | "completed"
    | "failed";
  finalImageUrl?: string;
  error?: string;
}

function resolveAvatarModelImage(avatarId: string | null): string | null {
  if (!avatarId) return null;

  const allPresets = [
    ...AVATAR_PRESET_CONFIG.male,
    ...AVATAR_PRESET_CONFIG.female,
    ...AVATAR_PRESET_CONFIG.plus,
    ...AVATAR_PRESET_CONFIG.kids,
  ];

  const match = allPresets.find(
    (p) => p.id === avatarId && p.status === "live"
  );

  return match?.modelImage ?? null;
}

export async function startTryOn(
  garmentImageUrl: string,
  selectedAvatarId: string | null
) {
  const avatarImageUrl = resolveAvatarModelImage(selectedAvatarId);

  const res = await fetch(`${API_BASE}/api/tryon/v2/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      garmentImageUrl,
      avatarImageUrl,
    }),
  });

  if (!res.ok) throw new Error("Failed to start try-on");

  return (await res.json()) as StartTryOnResponse;
}

export async function pollTryOn(jobId: string) {
  const res = await fetch(`${API_BASE}/api/tryon/v2/status/${jobId}`);
  if (!res.ok) throw new Error("Failed to poll try-on");
  const data = await res.json();
  return data.job as TryOnJob;
}
