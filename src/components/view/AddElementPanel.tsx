import React from "react";
import { useViewStore } from "../../store/viewStore";
import type { OverlayElement } from "../../store/viewStore";

/**
 * Preset demo elements
 * Replace with real accessory assets later
 */
const PRESET_ELEMENTS = [
  {
    id: "bag",
    label: "Handbag",
    src: "https://via.placeholder.com/200x200?text=Bag",
  },
  {
    id: "sunglasses",
    label: "Sunglasses",
    src: "https://via.placeholder.com/200x200?text=Glasses",
  },
  {
    id: "earrings",
    label: "Earrings",
    src: "https://via.placeholder.com/200x200?text=Earrings",
  },
];

const AddElementPanel: React.FC = () => {
  const {
    images,
    activeImageId,
    addElement,
    removeElement,
    updateElement,
    resetElements,
  } = useViewStore();

  const activeImage = images.find((img) => img.id === activeImageId);
  if (!activeImage) return null;

  const onAddPreset = (src: string) => {
    const element: OverlayElement = {
      id: `${Date.now()}`,
      src,
      x: 0,
      y: 0,
      scale: 1,
      rotation: 0,
    };
    addElement(activeImage.id, element);
  };

  return (
    <div
      style={{
        width: 260,
        borderLeft: "1px solid #e5e7eb",
        padding: 12,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ marginTop: 0 }}>Add Element</h3>

      {/* PRESETS */}
      <div style={{ marginBottom: 16 }}>
        {PRESET_ELEMENTS.map((el) => (
          <button
            key={el.id}
            className="secondary-btn"
            style={{ width: "100%", marginBottom: 8 }}
            onClick={() => onAddPreset(el.src)}
          >
            + {el.label}
          </button>
        ))}
      </div>

      {/* ELEMENT LIST */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {activeImage.elements.map((el) => (
          <div
            key={el.id}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: 6,
              padding: 8,
              marginBottom: 8,
            }}
          >
            <div style={{ fontSize: 12, marginBottom: 6 }}>
              Element
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button
                className="secondary-btn"
                onClick={() =>
                  updateElement(activeImage.id, el.id, {
                    scale: el.scale + 0.1,
                  })
                }
              >
                +
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  updateElement(activeImage.id, el.id, {
                    scale: Math.max(0.5, el.scale - 0.1),
                  })
                }
              >
                −
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  updateElement(activeImage.id, el.id, {
                    rotation: el.rotation + 15,
                  })
                }
              >
                ⟳
              </button>
              <button
                className="secondary-btn"
                onClick={() =>
                  removeElement(activeImage.id, el.id)
                }
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* RESET */}
      {activeImage.elements.length > 0 && (
        <button
          className="secondary-btn"
          style={{ marginTop: 8 }}
          onClick={() => resetElements(activeImage.id)}
        >
          Reset Elements
        </button>
      )}
    </div>
  );
};

export default AddElementPanel;
