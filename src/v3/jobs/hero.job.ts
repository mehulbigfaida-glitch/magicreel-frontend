import { generateHero, pollHero } from "../api/hero.api";

export async function runHeroJob(payload: any, token: string) {
  // Step 1: trigger generation
  const { runId } = await generateHero(payload, token);

  if (!runId) {
    throw new Error("No runId received");
  }

  // Step 2: poll until done
  let result = null;

  for (let i = 0; i < 30; i++) {
    const data = await pollHero(runId, token);

    if (data.status === "completed") {
      result = data;
      break;
    }

    if (data.status === "failed") {
      throw new Error("Hero generation failed");
    }

    await new Promise((r) => setTimeout(r, 2000));
  }

  if (!result) {
    throw new Error("Timeout waiting for hero result");
  }

  return result;
}