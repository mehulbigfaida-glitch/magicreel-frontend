import React, { useRef, useState } from "react";
import { useViewStore } from "../../store/viewStore";

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const MAX_SCALE = 2;
const MIN_SCALE = 1;

const CanvasViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const {
    images,
    activeImageId,
    mode,
    updateFraming,
    resetFraming,
  } = useViewStore();

  const activeImage = images.find((img) => img.id === activeImageId);
  const framing = activeImage?.framing;

  const [dragging, setDragging] = useState(false);
  const [start, setStart] = useState<{ x: number; y: number } | null>(null);

  if (!activeImage || !framing) return null;

  /* ---------------- Mouse Handlers ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    if (mode === "view") return;
    setDragging(true);
    setStart({ x: e.clientX, y: e.clientY });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !start) return;

    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;

    updateFraming(activeImage.id, {
      offsetX: framing.offsetX + dx,
      offsetY: framing.offsetY + dy,
    });

    setStart({ x: e.clientX, y: e.clientY });
  };

  const onMouseUp = () => {
    setDragging(false);
    setStart(null);
  };

  /* ---------------- Zoom Controls ---------------- */

  const zoomIn = () => {
    updateFraming(activeImage.id, {
      scale: clamp(framing.scale + 0.1, MIN_SCALE, MAX_SCALE),
    });
  };

  const zoomOut = () => {
    updateFraming(activeImage.id, {
      scale: clamp(framing.scale - 0.1, MIN_SCALE, MAX_SCALE),
    });
  };

  const reset = () => {
    resetFraming(activeImage.id);
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        background: "#fafafa",
        borderRadius: 12,
        cursor: mode === "view" ? "default" : dragging ? "grabbing" : "grab",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      {/* IMAGE */}
      <img
        ref={imgRef}
        src={activeImage.src}
        alt="Lookbook"
        draggable={false}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: `
            translate(-50%, -50%)
            translate(${framing.offsetX}px, ${framing.offsetY}px)
            scale(${framing.scale})
          `,
          transformOrigin: "center",
          userSelect: "none",
          pointerEvents: "none",
          maxWidth: "100%",
          maxHeight: "100%",
        }}
      />

      {/* CONTROLS */}
      {mode !== "view" && (
        <div
          style={{
            position: "absolute",
            bottom: 12,
            right: 12,
            display: "flex",
            gap: 8,
            background: "rgba(255,255,255,0.9)",
            borderRadius: 8,
            padding: "6px 8px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <button className="secondary-btn" onClick={zoomOut}>
            −
          </button>
          <button className="secondary-btn" onClick={zoomIn}>
            +
          </button>
          <button className="secondary-btn" onClick={reset}>
            Reset
          </button>
        </div>
      )}
    </div>
  );
};

export default CanvasViewer;
