import React from "react";

interface Props {
  onSeal: () => void;
}

const SealBanner: React.FC<Props> = ({ onSeal }) => {
  return (
    <div className="seal-banner">
      <p>
        Once sealed, this look cannot be edited.
      </p>
      <button className="primary-btn" onClick={onSeal}>
        Seal Look
      </button>
    </div>
  );
};

export default SealBanner;
