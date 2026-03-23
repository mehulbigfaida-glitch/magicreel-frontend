// src/components/FabricRenderer.tsx

import React, { useEffect, useRef } from "react";
import { applyFabricShading } from "./FabricShadingPass";

export interface FabricRendererProps {
  width: number;
  height: number;
  segments: { x: number; y: number }[];
  fabricUrl: string;
  mask: ImageData | null;
  physics: {
    windStrength: number;
    windSpeed: number;
    gravitySag: number;
    sheen: number;
    fresnel: number;
    sss: number;
    opacity: number;
    animation: boolean;
  };
}

const FabricRenderer: React.FC<FabricRendererProps> = ({
  width,
  height,
  segments,
  fabricUrl,
  mask,
  physics,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let fabricImage = new Image();
    fabricImage.crossOrigin = "anonymous";
    fabricImage.src = fabricUrl;

    fabricImage.onload = () => {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Draw fabric segments
      segments.forEach((p) => {
        const px = p.x * width;
        const py = p.y * height;

        ctx.drawImage(
          fabricImage,
          px - 20,
          py - 20,
          40,
          40
        );
      });

      // Apply shading + SSS + Fresnel + Sheen
      applyFabricShading(canvas, mask, physics);
    };
  }, [width, height, segments, fabricUrl, mask, physics]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};

export default FabricRenderer;
