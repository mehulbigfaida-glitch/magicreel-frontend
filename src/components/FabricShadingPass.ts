// src/components/FabricShadingPass.ts

export function applyFabricShading(
  canvas: HTMLCanvasElement,
  mask: ImageData | null,
  physics: {
    windStrength: number;
    windSpeed: number;
    gravitySag: number;
    sheen: number;
    fresnel: number;
    sss: number;
    opacity: number;
    animation: boolean;
  }
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Extract pixel data
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data; // Uint8ClampedArray

  // --------------------------------------------
  // 1. APPLY FABRIC LIGHTING MODEL
  // --------------------------------------------

  const { sheen, fresnel, sss } = physics;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Basic luminance
    let lum = (r + g + b) / 3;

    // Add sheen (silk shine) → boosts highlights
    lum += sheen * 30;

    // Fresnel rimlight → brightens edges
    const fres = fresnel * 40;

    // Subsurface scattering → slight soft glow
    const glow = sss * 20;

    const final = Math.min(255, lum + fres + glow);

    data[i] = final;
    data[i + 1] = final;
    data[i + 2] = final;

    // If mask exists → fade areas near body
    if (mask) {
      const maskVal = mask.data[i + 3] / 255; // alpha channel
      const fade = 1 - maskVal * 0.5;
      data[i] *= fade;
      data[i + 1] *= fade;
      data[i + 2] *= fade;
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
