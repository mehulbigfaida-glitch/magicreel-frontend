// src/pages/GarmentPresets.tsx
import "./GarmentPresets.css";

const DEFAULT_TOP_PRESETS = [
  "Solid Shirt",
  "Printed Shirt",
  "Striped Shirt",
  "Mandarin Shirt",
  "Crew Neck T-Shirt",
  "Oversized T-Shirt",
];

export default function GarmentPresets({
  title = "Choose Top Style",
  presets = DEFAULT_TOP_PRESETS,
  onSelect,
}: {
  title?: string;
  presets?: string[];
  onSelect: (v: string) => void;
}) {
  return (
    <div className="mr-preset-row">
      <div className="mr-preset-title">{title}</div>

      <div className="mr-preset-items">
        {presets.map((p) => (
          <div
            key={p}
            className="mr-preset-pill"
            onClick={() => onSelect(p)}
          >
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}
