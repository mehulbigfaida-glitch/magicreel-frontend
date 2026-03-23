import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGenerationStore } from "../../store/generationStore";
import { useEntitlementStore } from "../../store/entitlementStore";
import "./ExportStep.css";

export default function ExportStep() {
  const navigate = useNavigate();

  const { status } = useGenerationStore();
  const { remainingLookbooks } = useEntitlementStore();

  /**
   * HARD GUARD
   * User must NOT reach Export unless generation is completed
   */
  useEffect(() => {
    if (status !== "completed") {
      navigate("/create/view");
    }
  }, [status, navigate]);

  return (
    <div className="mr-export">
      <h1>Your Lookbook is Ready</h1>

      <p className="mr-export-sub">
        Download your generated assets below.
      </p>

      {/* LOOKBOOK PREVIEW */}
      <div className="mr-export-preview">
        {/* Replace with real images */}
        <div className="mr-export-placeholder">
          Lookbook images preview
        </div>
      </div>

      {/* DOWNLOAD ACTIONS */}
      <div className="mr-export-actions">
        <button className="primary">
          Download Images (ZIP)
        </button>

        <button className="secondary">
          Download Reel
        </button>
      </div>

      {/* FOOTER INFO */}
      <div className="mr-export-footer">
        <span>
          Remaining lookbooks:{" "}
          <strong>{remainingLookbooks()}</strong>
        </span>

        <button
          className="link"
          onClick={() => navigate("/create/garment")}
        >
          Generate another lookbook
        </button>
      </div>
    </div>
  );
}
