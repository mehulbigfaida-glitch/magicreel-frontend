import React from "react";
import type { Pose } from "../../store/poseStore";
import PoseCard from "./PoseCard";

interface Props {
  poses: Pose[];
  selectedId?: string;
  onSelect: (pose: Pose) => void;
}

const PoseGrid: React.FC<Props> = ({ poses, selectedId, onSelect }) => {
  return (
    <div className="pose-grid">
      {poses.map((pose) => (
        <PoseCard
          key={pose.id}
          pose={pose}
          selected={pose.id === selectedId}
          onSelect={() => onSelect(pose)}
        />
      ))}
    </div>
  );
};

export default PoseGrid;
