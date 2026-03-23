import React, { useEffect, useRef, useState } from "react";
import FabricRenderer from "./FabricRenderer";

interface DrapeOverlayProps {
  imageUrl: string;
  drape: {
    rawConfig: any;
    name: string;
    shortCode: string;
  };
  pose: any;
  mask: ImageData | null;
  physics: any;
}

const DrapeOverlay: React.FC<DrapeOverlayProps> = ({
  imageUrl,
  drape,
  pose: _unusedPose, // <-- renamed to avoid unused var error
  mask,
  physics,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [imgSize, setImgSize] = useState({
    width: 1,
    height: 1,
  });

  const [drapeSegments, setDrapeSegments] = useState<{
    front: { x: number; y: number }[];
    back: { x: number; y: number }[];
    trail: { x: number; y: number }[];
  }>({
    front: [],
    back: [],
    trail: [],
  });

  const { rawConfig } = drape;

  // ----------------------------------
  // GET IMAGE SIZE WHEN LOADED
  // ----------------------------------
  useEffect(() => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => {
      setImgSize({
        width: img.width,
        height: img.height,
      });
    };
  }, [imageUrl]);

  // ----------------------------------
  // Helper: Normalize coordinates
  // ----------------------------------
  const rel = (lm: any) => ({ x: lm.x, y: lm.y });

  // ----------------------------------
  // GENERATE LAYERS (FRONT / BACK / TRAIL)
  // Pose landmarks now use `_unusedPose`
  // ----------------------------------
  useEffect(() => {
    if (!_unusedPose?.landmarks) return;

    const landmarks = _unusedPose.landmarks[0];

    const entryLM = rawConfig.anchorPattern?.entry || "right_shoulder";
    const exitLM = rawConfig.anchorPattern?.exit || "back_mid";

    const map: Record<string, number> = {
      right_shoulder: 12,
      left_shoulder: 11,
      back_mid: 24,
      right_hip: 24,
      left_hip: 23,
    };

    const entryIndex = map[entryLM] ?? 12;
    const exitIndex = map[exitLM] ?? 24;

    const entry = rel(landmarks[entryIndex]);
    const exit = rel(landmarks[exitIndex]);

    // FRONT curve
    const front = [];
    for (let t = 0; t <= 1; t += 0.1) {
      front.push({
        x: entry.x * (1 - t) + exit.x * t,
        y: entry.y * (1 - t) + (exit.y + 0.1) * t,
      });
    }

    // BACK curve
    const back = front.map((p) => ({
      x: p.x - 0.015,
      y: p.y + 0.02,
    }));

    // TRAIL curve
    const trailEnd = {
      x: exit.x + 0.02,
      y: Math.min(exit.y + 0.4, 0.95),
    };

    const trail = [];
    for (let t = 0; t <= 1; t += 0.08) {
      trail.push({
        x: exit.x * (1 - t) + trailEnd.x * t,
        y: exit.y * (1 - t) + trailEnd.y * t,
      });
    }

    setDrapeSegments({ front, back, trail });
  }, [_unusedPose, rawConfig]);

  // ----------------------------------
  // RENDER UI
  // ----------------------------------
  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "420px",
        marginTop: "20px",
      }}
    >
      {/* Base Image */}
      <img
        src={imageUrl}
        alt="tryon"
        style={{
          width: "100%",
          display: "block",
          borderRadius: "8px",
        }}
      />

      {/* BACK LAYER */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <FabricRenderer
          width={imgSize.width}
          height={imgSize.height}
          segments={drapeSegments.back}
          fabricUrl="/assets/fabrics/default_fabric.png"
          mask={mask}
          physics={physics}
        />
      </div>

      {/* FRONT LAYER */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <FabricRenderer
          width={imgSize.width}
          height={imgSize.height}
          segments={drapeSegments.front}
          fabricUrl="/assets/fabrics/default_fabric.png"
          mask={mask}
          physics={physics}
        />
      </div>

      {/* TRAIL LAYER */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <FabricRenderer
          width={imgSize.width}
          height={imgSize.height}
          segments={drapeSegments.trail}
          fabricUrl="/assets/fabrics/default_fabric.png"
          mask={mask}
          physics={physics}
        />
      </div>

      {/* LABEL */}
      <div
        style={{
          position: "absolute",
          top: "8px",
          left: "8px",
          background: "rgba(0,0,0,0.5)",
          color: "white",
          padding: "6px 10px",
          borderRadius: "6px",
          fontSize: "12px",
        }}
      >
        {drape.shortCode} — {drape.name}
      </div>
    </div>
  );
};

export default DrapeOverlay;
