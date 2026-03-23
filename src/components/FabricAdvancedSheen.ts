// C.8.9 — Silk Sheen, Fresnel Rimlight & Subsurface Glow Shader Pass

export function applyAdvancedFabricSheen(
  base: ImageData,
  curvature: ImageData,
  lighting: ImageData
): ImageData {
  const w = base.width;
  const h = base.height;

  const out = new ImageData(w, h);

  // CONFIG (fine-tuned for bridal dupatta silk)
  const fresnelStrength = 0.7;
  const sheenStrength = 0.45;
  const sssStrength = 0.25;

  for (let i = 0; i < base.data.length; i += 4) {
    const r = base.data[i];
    const g = base.data[i + 1];
    const b = base.data[i + 2];
    const a = base.data[i + 3];

    // Approx curvature = local contrast gradient
    const c = curvature.data[i] / 255;

    // Lighting intensity from previous pass
    const lit = lighting.data[i] / 255;

    // -------------------------------------------
    // 1) SILK SHEEN (strong highlight on folds)
    // -------------------------------------------
    const sheen = Math.pow(c, 2.2) * sheenStrength;

    // -------------------------------------------
    // 2) FRESNEL RIMLIGHT (edges glow brighter)
    // -------------------------------------------
    const idx = i / 4;
    const x = idx % w;
    const y = Math.floor(idx / w);

    // Distance to fabric edge
    const nx = (x / w) * 2 - 1;
    const ny = (y / h) * 2 - 1;
    const fresnel = Math.pow(Math.abs(nx) + Math.abs(ny), 1.5) * fresnelStrength;

    // -------------------------------------------
    // 3) SUBSURFACE SCATTERING (light through cloth)
    // -------------------------------------------
    const sss = Math.pow(lit, 2) * sssStrength;

    // Combine all effects
    let nr = r + sheen * 255 + fresnel * 90 + sss * 50;
    let ng = g + sheen * 255 + fresnel * 90 + sss * 50;
    let nb = b + sheen * 255 + fresnel * 90 + sss * 50;

    // Tone-map to avoid blowing out highlights
    nr = Math.min(255, nr);
    ng = Math.min(255, ng);
    nb = Math.min(255, nb);

    out.data[i] = nr;
    out.data[i + 1] = ng;
    out.data[i + 2] = nb;
    out.data[i + 3] = a;
  }

  return out;
}
