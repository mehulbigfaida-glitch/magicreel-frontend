// src/v3/jobs/hero.job.ts
// 🔒 UPDATED: token handled internally, no external dependency

import { API_BASE } from "../../config/api";
import axios from "axios";

/* ----------------------------------
   HERO GENERATION JOB
---------------------------------- */

export async function runHeroJob(payload: any) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not authenticated");
  }

  /* ----------------------------------
     STEP 1: GENERATE HERO
  ---------------------------------- */

  const generateRes = await axios.post(
    `${API_BASE}/api/p2m/hero/generate-v2`,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const { frontRunId, backRunId } = generateRes.data;

  if (!frontRunId && !backRunId) {
    throw new Error("No runId received");
  }

  /* ----------------------------------
     STEP 2: POLLING
  ---------------------------------- */

  let frontResult: any = null;
  let backResult: any = null;

  for (let i = 0; i < 30; i++) {
    /* -------- FRONT -------- */

    if (frontRunId && !frontResult) {
      const res = await axios.get(
        `${API_BASE}/api/p2m/hero/poll/${frontRunId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data.status === "completed") {
        frontResult = data;
      }

      if (data.status === "failed") {
        throw new Error("Front hero failed");
      }
    }

    /* -------- BACK -------- */

    if (backRunId && !backResult) {
      const res = await axios.get(
        `${API_BASE}/api/p2m/hero/poll/${backRunId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;

      if (data.status === "completed") {
        backResult = data;
      }

      if (data.status === "failed") {
        throw new Error("Back hero failed");
      }
    }

    /* -------- COMPLETE -------- */

    if (
      (frontRunId ? frontResult : true) &&
      (backRunId ? backResult : true)
    ) {
      return {
        front: frontResult,
        back: backResult,
      };
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error("Timeout waiting for hero result");
}