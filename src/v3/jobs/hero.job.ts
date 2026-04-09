import { API_BASE } from "../../config/api";
import axios from "axios";

export async function runHeroJob(payload: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  const api = axios.create({
    baseURL: API_BASE,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const generateRes = await api.post(
    `/api/p2m/hero/generate-v2`,
    payload
  );

  const { frontRunId, backRunId } = generateRes.data;

  if (!frontRunId && !backRunId) {
    throw new Error("No runId received");
  }

  let frontResult: any = null;
  let backResult: any = null;

  for (let i = 0; i < 30; i++) {
    if (frontRunId && !frontResult) {
      const res = await api.get(`/api/p2m/hero/poll/${frontRunId}`);
      const data = res.data;

      if (data.status === "completed") frontResult = data;
      if (data.status === "failed") throw new Error("Front hero failed");
    }

    if (backRunId && !backResult) {
      const res = await api.get(`/api/p2m/hero/poll/${backRunId}`);
      const data = res.data;

      if (data.status === "completed") backResult = data;
      if (data.status === "failed") throw new Error("Back hero failed");
    }

    if (
      (frontRunId ? frontResult : true) &&
      (backRunId ? backResult : true)
    ) {
      window.dispatchEvent(new Event("creditsUpdated"));
      return { front: frontResult, back: backResult };
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Timeout waiting for hero result");
}