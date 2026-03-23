import React from "react";

interface Props {
  title: string;
  description: string;
  onClick: () => void;
}

const ExportCard: React.FC<Props> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div className="export-card" onClick={onClick}>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ExportCard;
