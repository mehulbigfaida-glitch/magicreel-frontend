import React from "react";
import type { Pose } from "../../store/poseStore";

interface Props {
  pose: Pose;
  selected: boolean;
  onSelect: () => void;
}

const PoseCard: React.FC<Props> = ({ pose, selected, onSelect }) => {
  return (
    <div
      className={`pose-card ${selected ? "selected" : ""}`}
      onClick={onSelect}
    >
      <img src={pose.previewImage} alt={pose.name} />
      <div className="pose-meta">
        <strong>{pose.name}</strong>
      </div>
    </div>
  );
};

export default PoseCard;
