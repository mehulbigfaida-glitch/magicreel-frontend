import React from "react";

const ERROR_COPY: Record<string, string> = {
  too_dark: "Image is too dark",
  edges_unclear: "Garment edges are unclear",
  background_complex: "Background is too complex",
  invalid_view: "Front view not detected",
};

const GarmentErrorMessage: React.FC<{ reason: string }> = ({ reason }) => {
  return (
    <div className="error-box">
      {ERROR_COPY[reason] || "Invalid garment image"}
    </div>
  );
};

export default GarmentErrorMessage;
