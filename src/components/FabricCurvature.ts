// Computes curvature map from base fabric texture (for silk sheen highlights)

export function computeCurvature(
  base: ImageData
): ImageData {
  const w = base.width;
  const h = base.height;

  const out = new ImageData(w, h);

  const brightness = (r: number, g: number, b: number) =>
    0.299 * r + 0.587 * g + 0.114 * b;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = (y * w + x) * 4;

      const b0 =
        brightness(
          base.data[(y * w + (x - 1)) * 4],
          base.data[(y * w + (x - 1)) * 4 + 1],
          base.data[(y * w + (x - 1)) * 4 + 2]
        );

      const b1 =
        brightness(
          base.data[(y * w + (x + 1)) * 4],
          base.data[(y * w + (x + 1)) * 4 + 1],
          base.data[(y * w + (x + 1)) * 4 + 2]
        );

      const curvature = Math.abs(b1 - b0) / 255;

      out.data[i] = curvature * 255;
      out.data[i + 1] = curvature * 255;
      out.data[i + 2] = curvature * 255;
      out.data[i + 3] = 255;
    }
  }

  return out;
}
