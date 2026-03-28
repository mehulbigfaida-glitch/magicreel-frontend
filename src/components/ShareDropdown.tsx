import { useState } from "react";

type Props = {
  onDownload: () => void;
};

export default function ShareDropdown({ onDownload }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="share-wrapper">
      <button
        className="export-btn"
        onClick={() => setOpen((prev) => !prev)}
      >
        Share ▾
      </button>

      {open && (
        <div className="share-dropdown">
          <div className="share-item" onClick={onDownload}>
            Download
          </div>

          <div className="share-item disabled">
            Instagram (Coming soon)
          </div>

          <div className="share-item disabled">
            WhatsApp (Coming soon)
          </div>
        </div>
      )}
    </div>
  );
}