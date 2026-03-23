/**
 * Temporary pose detection placeholder.
 * Later this will use TF.js or MediaPipe to detect real pose.
 *
 * Accepts base64 string or image URL.
 * Returns: "front" | "three_quarter" | "side" | "unknown"
 */

export async function detectPose(_image: string): Promise<string> {
  try {
    // For now, return "front" as default pose.
    // Upgrade later to real pose detection using MediaPipe or tfjs.
    return "front";
  } catch (err) {
    console.error("Pose detection error:", err);
    return "unknown";
  }
}
