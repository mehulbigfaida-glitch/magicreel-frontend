export async function classifyGarment(_: string): Promise<string> {
  console.warn("[GarmentClassifier] Disabled – returning 'dress' fallback.");
  return "dress";
}
