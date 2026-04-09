// FILE: src/pages/create-v2/GenerateHeroButton.tsx (FULL REPLACEMENT)

type GenerateHeroButtonProps = {
  canGenerate: boolean;
  generate: () => Promise<void>;
};

export default function GenerateHeroButton({
  canGenerate,
  generate,
}: GenerateHeroButtonProps) {
  const handleClick = async () => {
    if (!canGenerate) return;
    await generate();
  };

  return (
    <div className="mr-generate-wrapper">
      <button
        onClick={handleClick}
        disabled={!canGenerate}
        className={`mr-generate-btn ${
          !canGenerate ? "disabled" : ""
        }`}
      >
        {canGenerate ? "Generate Hero Image" : "Generating…"}
      </button>
    </div>
  );
}