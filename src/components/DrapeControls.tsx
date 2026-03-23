import React from "react";

export interface DrapeControlValues {
  windStrength: number;
  windSpeed: number;
  gravitySag: number;
  sheen: number;
  fresnel: number;
  sss: number;
  opacity: number;
  animation: boolean;
}

interface Props {
  values: DrapeControlValues;
  onChange: (v: DrapeControlValues) => void;
}

const DrapeControls: React.FC<Props> = ({ values, onChange }) => {
  const update = (key: keyof DrapeControlValues, val: number | boolean) => {
    onChange({ ...values, [key]: val });
  };

  return (
    <div
      style={{
        width: "280px",
        padding: "20px",
        background: "#111",
        color: "white",
        borderRadius: "12px",
        fontFamily: "sans-serif",
        position: "absolute",
        top: "20px",
        right: "20px",
        zIndex: 50,
      }}
    >
      <h3 style={{ marginTop: 0 }}>Drape Controls</h3>

      {/* Animation Toggle */}
      <label style={{ display: "block", margin: "12px 0" }}>
        <input
          type="checkbox"
          checked={values.animation}
          onChange={(e) => update("animation", e.target.checked)}
          style={{ marginRight: "8px" }}
        />
        Enable Animation
      </label>

      {/* Wind Strength */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Wind Strength: {values.windStrength.toFixed(1)}
      </label>
      <input
        type="range"
        min={0}
        max={30}
        step={0.5}
        value={values.windStrength}
        onChange={(e) => update("windStrength", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Wind Speed */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Wind Speed: {values.windSpeed.toFixed(1)}
      </label>
      <input
        type="range"
        min={0.2}
        max={4}
        step={0.1}
        value={values.windSpeed}
        onChange={(e) => update("windSpeed", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Gravity Sag */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Gravity Sag: {values.gravitySag.toFixed(1)}
      </label>
      <input
        type="range"
        min={0}
        max={20}
        step={0.5}
        value={values.gravitySag}
        onChange={(e) => update("gravitySag", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Silk Sheen */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Silk Sheen: {values.sheen.toFixed(1)}
      </label>
      <input
        type="range"
        min={0}
        max={3}
        step={0.1}
        value={values.sheen}
        onChange={(e) => update("sheen", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Fresnel Rimlight */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Fresnel Rimlight: {values.fresnel.toFixed(1)}
      </label>
      <input
        type="range"
        min={0}
        max={3}
        step={0.1}
        value={values.fresnel}
        onChange={(e) => update("fresnel", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Subsurface Scattering */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Subsurface Glow: {values.sss.toFixed(1)}
      </label>
      <input
        type="range"
        min={0}
        max={2}
        step={0.1}
        value={values.sss}
        onChange={(e) => update("sss", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />

      {/* Opacity */}
      <label style={{ display: "block", marginTop: "14px" }}>
        Opacity: {values.opacity.toFixed(2)}
      </label>
      <input
        type="range"
        min={0.1}
        max={1}
        step={0.01}
        value={values.opacity}
        onChange={(e) => update("opacity", parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default DrapeControls;
