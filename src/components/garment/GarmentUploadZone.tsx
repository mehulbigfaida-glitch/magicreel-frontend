import UploadFrame from "./UploadFrame";
import { useCreateFlowStore } from "../../store/createFlowStore";

export default function GarmentUploadZone() {
  const { category, subCategory, style, sleeve } = useCreateFlowStore();

  const isReady =
    category !== null &&
    subCategory !== null &&
    style !== null &&
    sleeve !== null;

  if (!isReady) {
    console.warn(
      "Upload blocked: select garment, style and sleeve from sidebar first"
    );
  }

  return (
    <UploadFrame
      label="Front view"
      required
    />
  );
}