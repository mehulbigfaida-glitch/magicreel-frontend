import UploadFrame from "./UploadFrame";
import { useCreateFlowStore } from "../../store/createFlowStore";

export default function GarmentBackUpload({
  onUpload,
}: {
  onUpload: (url: string) => void;
}) {
  const { category, subCategory, style, sleeve } = useCreateFlowStore();

  const isReady =
    category !== null &&
    subCategory !== null &&
    style !== null &&
    sleeve !== null;

  return (
    <UploadFrame
      label="Back view"
      onUpload={(url: string) => {
        if (!isReady) {
          console.warn(
            "Upload blocked: select garment, style and sleeve from sidebar first"
          );
          return false;
        }

        onUpload(url);
        return true;
      }}
    />
  );
}
