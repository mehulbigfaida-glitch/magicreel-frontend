import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./FeatureLockedModal.css";

export interface FeatureLockedModalProps {
  open: boolean;
  title: string;
  description: string;
  featureName?: string;
  primaryLabel?: string;
  onClose: () => void;
}

export default function FeatureLockedModal({
  open,
  title,
  description,
  featureName,
  primaryLabel = "Upgrade Plan",
  onClose,
}: FeatureLockedModalProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleUpgrade = () => {
    onClose();
    navigate("/plans");
  };

  const handleBackdropClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="feature-locked-backdrop"
      onClick={handleBackdropClick}
      role="presentation"
    >
      <div
        className="feature-locked-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feature-locked-title"
        aria-describedby="feature-locked-description"
      >
        <div
          className="feature-locked-icon"
          aria-hidden="true"
        >
          🔒
        </div>

        <h2 id="feature-locked-title">{title}</h2>

        <p id="feature-locked-description">{description}</p>

        {featureName && (
          <div className="feature-locked-feature">
            <span>Feature</span>
            <strong>{featureName}</strong>
          </div>
        )}

        <div className="feature-locked-actions">
          <button
            type="button"
            className="primary"
            onClick={handleUpgrade}
          >
            {primaryLabel}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={onClose}
          >
            Not Now
          </button>
        </div>
      </div>
    </div>
  );
}
