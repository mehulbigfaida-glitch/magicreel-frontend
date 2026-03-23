import React from "react";

const ReplaceGarmentPanel: React.FC = () => {
  return (
    <div className="edit-panel">
      <h3>Replace garment</h3>
      <p>Upload a new garment to replace the current one.</p>

      <button className="secondary-btn">
        Upload replacement
      </button>
    </div>
  );
};

export default ReplaceGarmentPanel;
