import React from "react";

interface Props {
  imageUrl: string;
}

const GarmentPreviewCard: React.FC<Props> = ({ imageUrl }) => {
  return (
    <div className="garment-preview">
      <img src={imageUrl} alt="Garment preview" />
      <span className="success-badge">✔ Garment validated</span>
    </div>
  );
};

export default GarmentPreviewCard;
