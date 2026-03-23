import React from "react";
import ExportCard from "./ExportCard";

const ExportOptions: React.FC = () => {
  return (
    <div className="export-options">
      <ExportCard
        title="Images"
        description="Front and back images"
        onClick={() => alert("Export Images")}
      />
      <ExportCard
        title="Lookbook"
        description="Grid-ready catalog layout"
        onClick={() => alert("Export Lookbook")}
      />
      <ExportCard
        title="Reel"
        description="Short video for social"
        onClick={() => alert("Export Reel")}
      />
      <ExportCard
        title="Share Link"
        description="Send to team or client"
        onClick={() => alert("Share Link")}
      />
    </div>
  );
};

export default ExportOptions;
