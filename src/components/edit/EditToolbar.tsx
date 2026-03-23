import React from "react";
import type { EditMode } from "../../store/editStore";

interface Props {
  activeMode: EditMode;
  onChange: (mode: EditMode) => void;
}

const EditToolbar: React.FC<Props> = ({ activeMode, onChange }) => {
  return (
    <div className="edit-toolbar">
      <button
        className={activeMode === "replace" ? "active" : ""}
        onClick={() => onChange("replace")}
      >
        Replace Garment
      </button>

      <button
        className={activeMode === "add_element" ? "active" : ""}
        onClick={() => onChange("add_element")}
      >
        Add Element
      </button>

      <button
        className={activeMode === "fit_length" ? "active" : ""}
        onClick={() => onChange("fit_length")}
      >
        Fit / Length
      </button>
    </div>
  );
};

export default EditToolbar;
