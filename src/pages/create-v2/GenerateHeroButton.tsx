// magicreel-tryon-frontend/src/pages/create-v2/GenerateHeroButton.tsx

import { useState } from "react";

type GenerateHeroButtonProps = {
  canGenerate: boolean;
  generate: () => Promise<void>;
};

export default function GenerateHeroButton({
  canGenerate,
  generate,
}: GenerateHeroButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!canGenerate || loading) return;

    try {
      setLoading(true);
      await generate();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mr-generate-wrapper">
      <button
        onClick={handleClick}
        disabled={!canGenerate || loading}
        className={`mr-generate-btn ${
          !canGenerate || loading ? "disabled" : ""
        }`}
      >
        {loading ? "Generating…" : "Generate Hero Image"}
      </button>
    </div>
  );
}