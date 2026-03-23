import React, { useRef, useState } from "react";

export interface ZoomImageModalProps {
  imageUrl: string;
  label?: string;
  onClose: () => void;
}

const ZoomImageModal: React.FC<ZoomImageModalProps> = ({
  imageUrl,
  label,
  onClose,
}) => {
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  /* ---------------- ZOOM ---------------- */

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setScale((s) => Math.min(3, Math.max(1, s + delta)));
  };

  /* ---------------- PAN ---------------- */

  const onMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    dragStart.current = {
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const onMouseUp = () => setDragging(false);

  /* ---------------- RESET ---------------- */

  const reset = () => {
    setScale(1);
    setOffset({ x: 0, y: 0 });
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onClose}
      onMouseUp={onMouseUp}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        style={{
          cursor: dragging ? "grabbing" : "grab",
          overflow: "hidden",
          maxWidth: "90vw",
          maxHeight: "90vh",
          position: "relative",
        }}
      >
        <img
          src={imageUrl}
          draggable={false}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
            transition: dragging ? "none" : "transform 0.15s ease-out",
            maxWidth: "100%",
            maxHeight: "100%",
            userSelect: "none",
          }}
        />

        {label && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.6)",
              padding: "6px 12px",
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {label}
          </div>
        )}
      </div>

      {/* Controls */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          display: "flex",
          gap: 12,
        }}
      >
        <button onClick={reset}>Reset</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ZoomImageModal;
