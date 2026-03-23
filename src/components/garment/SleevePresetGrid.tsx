import { useCreateFlowStore } from "../../store/createFlowStore";

type SleeveOption = {
  id: "full" | "half" | "rolled";
  label: string;
  icon: string;
};

const SLEEVES: SleeveOption[] = [
  {
    id: "full",
    label: "Full Sleeve",
    icon: "🧥",
  },
  {
    id: "half",
    label: "Half Sleeve",
    icon: "👕",
  },
  {
    id: "rolled",
    label: "Rolled-up Sleeve",
    icon: "🌀",
  },
];

export default function SleevePresetGrid() {
  const { sleeve, setSleeve } = useCreateFlowStore();

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          marginBottom: 16,
          color: "#E5E7EB",
        }}
      >
        Choose Sleeve Style
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}
      >
        {SLEEVES.map((s) => {
          const active = sleeve === s.id;

          return (
            <div
              key={s.id}
              onClick={() => setSleeve(s.id)}
              style={{
                padding: 20,
                borderRadius: 16,
                cursor: "pointer",
                textAlign: "center",
                background: active
                  ? "linear-gradient(135deg, rgba(139,92,246,0.45), rgba(59,130,246,0.35))"
                  : "rgba(255,255,255,0.04)",
                border: active
                  ? "1px solid rgba(255,255,255,0.25)"
                  : "1px solid rgba(255,255,255,0.08)",
                transition: "all 160ms ease",
              }}
            >
              <div style={{ fontSize: 32, marginBottom: 10 }}>
                {s.icon}
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: "#E5E7EB",
                }}
              >
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
