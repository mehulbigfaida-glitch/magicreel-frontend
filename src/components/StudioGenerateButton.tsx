import { useNavigate } from "react-router-dom";
import { useGenerate } from "../context/GenerateContext";
import { API_BASE } from "../config/api";

export default function StudioGenerateButton() {
  const {
    canGenerate,
    category,
    avatarGender,
    garmentImageUrl,
    modelImageUrl,
    attributes,
  } = useGenerate();

  const navigate = useNavigate();

  return (
    <button
      className="mr-primary-btn"
      disabled={!canGenerate}
      onClick={async () => {
        if (!canGenerate) return;

        const res = await fetch(
          `${API_BASE}/api/lookbook/lookbook/generate`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              category,
              avatarGender,
              garmentImageUrl,
              modelImageUrl,
              attributes,
            }),
          }
        );

        if (!res.ok) {
          alert("Failed to generate lookbook");
          return;
        }

        const data = await res.json();
        navigate(`/view?jobId=${data.jobId}`);
      }}
    >
      Generate Lookbook
    </button>
  );
}
