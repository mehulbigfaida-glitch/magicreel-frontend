// src/pages/create-project/PoseStep.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


type Pose = {
  id: string;
  label: string;
};

const POSES: Pose[] = [
  { id: "front", label: "Front" },
  { id: "back", label: "Back" },
  { id: "walk", label: "Walk" },
  { id: "side", label: "Side" },
];

const PoseStep: React.FC = () => {
  const navigate = useNavigate();
  
  
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);

  useEffect(() => {
    if (!selectedPose) {
      setSelectedPose(POSES[0]);
    }
  }, [selectedPose]);

  
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <div>
          <h2 style={{ margin: "0 0 4px 0" }}>Select pose</h2>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280" }}>
            Choose how the avatar should stand
          </p>
        </div>
        <button
          className="primary-btn"
          onClick={() => navigate("/create/view")}
        >
          Continue
        </button>
      </div>

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          gap: 20,
          overflow: "hidden",
        }}
      >
        {/* LEFT — Pose cards */}
        <div style={{ overflowY: "auto", paddingRight: 4 }}>
          {POSES.map((pose) => {
            const isSelected = selectedPose?.id === pose.id;
            return (
              <div
                key={pose.id}
                onClick={() => setSelectedPose(pose)}
                style={{
                  cursor: "pointer",
                  border: isSelected
                    ? "2px solid #2563eb"
                    : "1px solid #d1d5db",
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 10,
                  background: isSelected ? "#eff6ff" : "#fff",
                }}
              >
                <strong>{pose.label}</strong>
              </div>
            );
          })}
        </div>

        {/* RIGHT — Pose preview */}
        <div
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            background: "#fafafa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                width: 220,
                height: 320,
                background: "#e5e7eb",
                borderRadius: 8,
                marginBottom: 12,
              }}
            />
            <strong>{selectedPose?.label} pose</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PoseStep;
