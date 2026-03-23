import React, { useEffect, useRef } from "react";

interface DressDrapeCorrectorProps {
  /** Final try-on image URL (from Fashn resultImageUrl) */
  src: string;

  /** Where the dress starts vertically (0–1 of image height).
   *  0.0 = very top, 1.0 = very bottom. Default ~0.45 (just below waist).
   */
  waistRatio?: number;

  /** How much wider the hem should be at the very bottom.
   *  1.0 = no change, 1.3 = 30% wider, etc. Default 1.25
   */
  maxHemScale?: number;

  /** Optional CSS class for sizing/layout */
  className?: string;
}

/**
 * DressDrapeCorrector
 *
 * v1 – Simple, deterministic canvas warp:
 * - Copy the top part of the image untouched.
 * - For rows below the "waist line", expand each scanline a bit more towards the bottom.
 * - Produces a more natural straight/flare fall instead of a body-hugging narrow tube.
 *
 * This does NOT change the original image on disk – it only renders a corrected view.
 */
const DressDrapeCorrector: React.FC<DressDrapeCorrectorProps> = ({
  src,
  waistRatio = 0.45,
  maxHemScale = 1.25,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!src) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    // Cloudinary supports CORS, this allows canvas usage
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      const width = img.width;
      const height = img.height;

      canvas.width = width;
      canvas.height = height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // 1) Draw top (0 -> waistY) without modification
      const waistY = Math.floor(height * waistRatio);

      if (waistY > 0) {
        ctx.drawImage(
          img,
          0,          // sx
          0,          // sy
          width,      // sWidth
          waistY,     // sHeight
          0,          // dx
          0,          // dy
          width,      // dWidth
          waistY      // dHeight
        );
      }

      // 2) For each scanline from waistY to bottom:
      //    gradually increase width from 1.0 → maxHemScale
      const bottomStart = waistY;
      const bottomHeight = height - bottomStart;
      if (bottomHeight <= 0) return;

      for (let y = bottomStart; y < height; y++) {
        const localY = y - bottomStart;
        const t = localY / bottomHeight; // 0 at waist, 1 at bottom

        // Quadratic easing for smoother flare: slow at start, faster near hem
        const scale = 1 + (maxHemScale - 1) * t * t;

        const destWidth = width * scale;
        const destX = (width - destWidth) / 2;

        // Take a 1px tall slice from the original image at row y
        // and stretch it horizontally.
        ctx.drawImage(
          img,
          0,        // sx
          y,        // sy
          width,    // sWidth
          1,        // sHeight
          destX,    // dx (centered)
          y,        // dy (same y)
          destWidth,// dWidth
          1         // dHeight
        );
      }
    };

    img.onerror = (err) => {
      console.error("[DressDrapeCorrector] Image load error:", err);
    };
  }, [src, waistRatio, maxHemScale]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: "block",
        maxWidth: "100%",
        height: "auto",
      }}
    />
  );
};

export default DressDrapeCorrector;
