import React from "react";

const FitLengthPanel: React.FC = () => {
  return (
    <div className="edit-panel">
      <h3>Fit & Length</h3>

      <label>
        Length
        <input type="range" min={-10} max={10} />
      </label>

      <label>
        Fit
        <input type="range" min={-10} max={10} />
      </label>
    </div>
  );
};

export default FitLengthPanel;
