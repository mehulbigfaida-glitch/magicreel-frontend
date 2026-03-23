import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GarmentUploadZone from "../../components/garment/GarmentUploadZone";
import GarmentBackUpload from "../../components/garment/GarmentBackUpload";
import { usePoseStore } from "../../store/poseStore";
import { useCreateFlowStore } from "../../store/createFlowStore";
import "./GarmentStep.css";

export default function GarmentStep() {
  const navigate = useNavigate();
  const { setHasFrontImage, setHasBackImage } = usePoseStore();

  const {
    category,
    subCategory,
    style,
    sleeve,
  } = useCreateFlowStore();

  // 🔒 Guard: must have garment path selected
  useEffect(() => {
    if (!category || !subCategory || !style) {
      navigate("/create");
    }
  }, [category, subCategory, style, navigate]);

  function handleFrontUpload(url: string) {
    console.log("Front image uploaded:", url);
    setHasFrontImage(true);
  }

  function handleBackUpload(url: string) {
    console.log("Back image uploaded:", url);
    setHasBackImage(true);
  }

  if (!category || !subCategory || !style) return null;

  return (
    <div className="mr-garment-page">
      {/* Selection breadcrumb */}
      <div className="mr-garment-breadcrumb">
        {category.toUpperCase()} &gt;{" "}
        {subCategory.toUpperCase()} &gt;{" "}
        {style.replace("-", " ")}{" "}
        {sleeve ? `> ${sleeve} sleeve` : ""}
      </div>

      <div className="mr-garment-hint">
        Upload garment images matching the selected configuration.
      </div>

      {/* Upload zones */}
      <div className="mr-garment-upload-fixed">
        <GarmentUploadZone onUpload={handleFrontUpload} />
        <GarmentBackUpload onUpload={handleBackUpload} />
      </div>
    </div>
  );
}
