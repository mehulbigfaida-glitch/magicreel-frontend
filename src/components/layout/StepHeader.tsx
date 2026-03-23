type StepHeaderProps = {
  title: string;
  subtitle?: string;
  canContinue: boolean;
  onContinue: () => void;
};

export default function StepHeader({
  title,
  subtitle,
  canContinue,
  onContinue,
}: StepHeaderProps) {
  return (
    <div className="mr-step-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="mr-subtext">{subtitle}</p>}
      </div>

      <button
        className="mr-continue-btn"
        disabled={!canContinue}
        onClick={onContinue}
      >
        Continue
      </button>
    </div>
  );
}
