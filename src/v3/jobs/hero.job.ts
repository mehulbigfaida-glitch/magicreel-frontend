import type { Job } from "./job.types";
import { generateHero } from "../api/hero.api";

type RunHeroJobInput = {
  payload: any;
  token: string;
};

const delay = (ms: number) =>
  new Promise((res) => setTimeout(res, ms));

export async function runHeroJob(
  input: RunHeroJobInput
): Promise<Job<{ frontImage?: string; backImage?: string }>> {
  const { payload, token } = input;

  const job: Job<{
    frontImage?: string;
    backImage?: string;
  }> = {
    id: "",
    type: "hero",
    status: "queued",
    createdAt: Date.now(),
  };

  try {
    /* ================= GENERATE ================= */
    const data = await generateHero(payload, token);

    const frontRunId = data.frontRunId;
    const backRunId = data.backRunId;

    job.id = frontRunId || backRunId;
    job.status = "processing";

    let frontImage: string | undefined;
    let backImage: string | undefined;

    /* ================= SMART POLLING ================= */

    // 🔥 Phase 1 — WAIT (no useless calls)
    await delay(20000); // 20 sec buffer

    let attempts = 0;
    const MAX_ATTEMPTS = 25;

    while (attempts < MAX_ATTEMPTS) {
      attempts++;

      let frontDone = false;
      let backDone = false;

      try {
        /* ---------- FRONT ---------- */
        if (frontRunId && !frontImage) {
          const res = await fetch(
            `http://localhost:5003/api/p2m/hero/poll/${frontRunId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();

            if (data.status === "completed") {
              frontImage = data.imageUrl;
              frontDone = true;
            }
          }
        } else if (frontImage) {
          frontDone = true;
        }

        /* ---------- BACK ---------- */
        if (backRunId && !backImage) {
          const res = await fetch(
            `http://localhost:5003/api/p2m/hero/poll/${backRunId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const data = await res.json();

            if (data.status === "completed") {
              backImage = data.imageUrl;
              backDone = true;
            }
          }
        } else if (!backRunId || backImage) {
          backDone = true;
        }

        /* ---------- COMPLETE ---------- */
        if (frontDone && backDone) {
          job.status = "completed";
          job.output = {
            frontImage,
            backImage,
          };

          return job;
        }
      } catch (err: any) {
        if (err.message?.includes("429")) {
          console.warn("Rate limited — backing off...");
          await delay(8000);
        } else {
          throw err;
        }
      }

      /* 🔥 Adaptive delay */
      if (attempts < 5) {
        await delay(6000); // early phase (slow)
      } else {
        await delay(4000); // normal phase
      }
    }

    throw new Error("Polling timeout");
  } catch (err: any) {
    job.status = "failed";
    job.error = err.message;

    return job;
  }
}