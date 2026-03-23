import React from "react";
import styles from "./UploadFrame.module.css";

export type UploadStatus =
  | "idle"
  | "uploading"
  | "validating"
  | "success"
  | "error";

interface Props {
  label: string;
  imageUrl?: string | null;
  onUpload: (url: string) => void;
  optional?: boolean;
  status: UploadStatus;
}

const UploadFrame: React.FC<Props> = ({
  label,
  imageUrl,
  onUpload,
  optional,
  status,
}) => {
  return (
    <div className={styles.frame}>
      {!imageUrl ? (
        <label className={styles.empty}>
          <div className={styles.text}>
            <strong>{label}</strong>
            {optional && <span className={styles.optional}>Optional</span>}
          </div>

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const url = URL.createObjectURL(file);
              onUpload(url);
            }}
          />

          <span className={styles.cta}>Click to upload</span>
        </label>
      ) : (
        <div className={styles.preview}>
          <img src={imageUrl} alt={label} />

          {status === "success" && (
            <div className={styles.badge}>✓</div>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadFrame;
