import { useRef, useState } from "react";
import { useTryOnStore } from "../../store/tryOnStore";
import "./UploadFrame.css";

type Status = "empty" | "uploading" | "valid" | "error";

interface UploadFrameProps {
  label: string;
  required?: boolean;
}

export default function UploadFrame({
  label,
  required,
}: UploadFrameProps) {
  const [image, setImage] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("empty");
  const fileRef = useRef<HTMLInputElement>(null);

  async function uploadToBackend(file: File): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://127.0.0.1:5001/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    const data = await res.json();
    return data.url; // 🔒 Cloudinary URL
  }

  async function handleFile(file: File) {
    setStatus("uploading");

    try {
      const cloudinaryUrl = await uploadToBackend(file);

      setImage(cloudinaryUrl);
      setStatus("valid");

      // 🔒 SINGLE SOURCE OF TRUTH
      useTryOnStore
        .getState()
        .setGarmentImageUrl(cloudinaryUrl);
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  }

  function openFilePicker() {
    fileRef.current?.click();
  }

  return (
    <div className="mr-upload-frame">
      <div className="mr-upload-header">
        <span>{label}</span>
        {!required && <span className="optional">Optional</span>}
      </div>

      <div
        className={`mr-upload-box ${status}`}
        onClick={!image ? openFilePicker : undefined}
      >
        {image ? (
          <>
            <div className="mr-image-wrap">
  <img src={image} alt="Uploaded preview" />
</div>

            <button
              className="mr-replace-btn"
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openFilePicker();
              }}
            >
              Replace?
            </button>

            {status === "valid" && (
              <div className="mr-upload-tick">✓</div>
            )}
          </>
        ) : (
          <div className="placeholder">
            Upload image
            <span>JPG or PNG</span>
          </div>
        )}

        {status === "uploading" && (
          <div className="mr-upload-loader" />
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
      </div>
    </div>
  );
}
