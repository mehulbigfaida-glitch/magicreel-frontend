import { API_BASE } from "../../config/api";

/* ----------------------------------
   GENERATE REEL
---------------------------------- */
export async function generateReel(
  jobId: string,
  heroPreviewUrl: string,
  token: string
) {
  const res = await fetch(`${API_BASE}/api/p2m/reel/generate-v1`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      jobId,
      heroPreviewUrl,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Reel generation failed");
  }

  return data;
}

/* ----------------------------------
   POLL REEL STATUS
---------------------------------- */
export async function pollReel(jobId: string, token: string) {
  const res = await fetch(
    `${API_BASE}/api/p2m/reel/status/${jobId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error || "Polling failed");
  }

  return data;
}