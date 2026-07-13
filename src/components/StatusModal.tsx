import "./StatusModal.css";

type StatusModalProps = {
  open: boolean;
  type?: "success" | "error" | "warning" | "info";
  title: string;
  description: string;
  onClose: () => void;
};

export default function StatusModal({
  open,
  type = "success",
  title,
  description,
  onClose,
}: StatusModalProps) {
  if (!open) return null;

  const icon =
    type === "success"
      ? "🎉"
      : type === "error"
      ? "❌"
      : type === "warning"
      ? "⚠️"
      : "ℹ️";

  return (
    <div className="status-modal-overlay">
      <div className="status-modal">
        <div className="status-modal-icon">
          {icon}
        </div>

        <h2>{title}</h2>

        <p>{description}</p>

        <button onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}