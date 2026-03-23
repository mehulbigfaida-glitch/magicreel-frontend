import React from "react";
import axios from "axios";
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

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/duaqfspwa/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "magicreel_unsigned";

const UploadFrame: React.FC<Props> = ({
  label,
  imageUrl,
  onUpload,
  optional,
  status,
}) => {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    const res = await axios.post(
      CLOUDINARY_UPLOAD_URL,
      formData
    );

    onUpload(res.data.secure_url);
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={styles.frame}
        onClick={() => inputRef.current?.click()}
      >
        {!imageUrl ? (
          <div className={styles.empty}>
            <strong>{label}</strong>
            {optional && (
              <span className={styles.optional}>(optional)</span>
            )}
            <span className={styles.cta}>Click to upload</span>
          </div>
        ) : (
          <>
            <img
              src={imageUrl}
              alt={label}
              className={styles.image}
            />

            <div className={styles.overlay}>
              Change image
            </div>

            {status === "success" && (
              <div className={styles.badge}>✓</div>
            )}
          </>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};

export default UploadFrame;
