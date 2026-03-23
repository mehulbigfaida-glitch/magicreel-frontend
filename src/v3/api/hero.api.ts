export type GenerateHeroPayload = {
  categoryKey: string;
  avatarGender: string;
  avatarFaceImageUrl: string;
  garmentFrontImageUrl: string;
  avatarBackImageUrl?: string;
  garmentBackImageUrl?: string;
  styling?: string | null;
};

const BASE_URL = "http://localhost:5003/api";

export async function generateHero(
  payload: GenerateHeroPayload,
  token: string
) {
  const res = await fetch(`${BASE_URL}/p2m/hero/generate-v2`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Hero generation failed");
  }

  return data;
}

export async function pollHero(runId: string, token: string) {
  const res = await fetch(
    `${BASE_URL}/p2m/hero/poll/${runId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Polling failed");
  }

  return res.json();
}