export function computeLighting(width: number, height: number): ImageData {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(width, height);

  const lightX = -0.6;
  const lightY = -1.0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * 2 - 1;
      const ny = (y / height) * 2 - 1;

      const dot = Math.max(0, nx * lightX + ny * lightY + 1.2);
      const bright = Math.pow(dot, 1.6);

      const i = (y * width + x) * 4;
      img.data[i] = bright * 255;
      img.data[i + 1] = bright * 255;
      img.data[i + 2] = bright * 255;
      img.data[i + 3] = 255;
    }
  }

  return img;
}
