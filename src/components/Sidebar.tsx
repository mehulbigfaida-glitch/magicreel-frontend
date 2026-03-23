import { useState } from "react";
import { useCreateFlowStore } from "../store/createFlowStore";
import type {
  GarmentCategory,
  GarmentStyle,
} from "../store/createFlowStore";

/* ---------- UI-only open state ---------- */
type OpenLevel1 = GarmentCategory | null;
type OpenLevel2 = "shirt" | "tshirt" | "blouse" | null;

/* ---------- NON-NULL selectable values ---------- */
type StyleValue = Exclude<GarmentStyle, null>;

const STYLES: StyleValue[] = [
  "solid-shirt",
  "printed-shirt",
  "striped-shirt",
  "mandarin-shirt",
];

const label = (v: string) =>
  v.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

export default function Sidebar() {
  const {
    category,
    subCategory,
    style,
    avatar,
    setCategory,
    setSubCategory,
    setStyle,
    setAvatar,
  } = useCreateFlowStore();

  const [openL1, setOpenL1] = useState<OpenLevel1>(category);
  const [openL2, setOpenL2] = useState<OpenLevel2>(subCategory);

  return (
    <aside
      style={{
        width: 280,
        padding: "32px 20px",
        background:
          "linear-gradient(180deg, rgba(15,16,28,1), rgba(7,8,13,1))",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflowY: "auto",
      }}
    >
      {/* ================= STEP 1 ================= */}
      <StepHeader step="STEP 1" title="Upload Garment" />

      <Row
        label="Top"
        open={openL1 === "top"}
        onClick={() => {
          setCategory("top");
          setOpenL1("top");
        }}
      />

      {openL1 === "top" && (
        <div style={{ marginLeft: 16 }}>
          <Row
            label="Shirt"
            open={openL2 === "shirt"}
            onClick={() => {
              setSubCategory("shirt");
              setOpenL2("shirt");
            }}
          />

          {openL2 === "shirt" && (
            <div style={{ marginLeft: 16 }}>
              {STYLES.map((s) => (
                <Bullet
                  key={s}
                  label={label(s)}
                  active={style === s}
                  onClick={() => setStyle(s)}
                />
              ))}
            </div>
          )}

          <Row
            label="T-Shirt"
            open={openL2 === "tshirt"}
            onClick={() => {
              setSubCategory("tshirt");
              setOpenL2("tshirt");
            }}
          />

          <Row
            label="Blouse"
            open={openL2 === "blouse"}
            onClick={() => {
              setSubCategory("blouse");
              setOpenL2("blouse");
            }}
          />
        </div>
      )}

      <Row label="Bottom" open={false} onClick={() => setCategory("bottom")} />
      <Row
        label="One-Piece"
        open={false}
        onClick={() => setCategory("one-piece")}
      />
      <Row label="Ethnic" open={false} onClick={() => setCategory("ethnic")} />

      {/* ================= STEP 2 ================= */}
      <div style={{ marginTop: 34 }}>
        <StepHeader step="STEP 2" title="Select Avatar" />

        <Bullet
          label="Female"
          active={avatar === "female"}
          onClick={() => setAvatar("female")}
        />
        <Bullet
          label="Male"
          active={avatar === "male"}
          onClick={() => setAvatar("male")}
        />
        <Bullet
          label="Female +16"
          active={avatar === "female-16"}
          onClick={() => setAvatar("female-16")}
        />
        <Bullet
          label="Male +16"
          active={avatar === "male-16"}
          onClick={() => setAvatar("male-16")}
        />
      </div>
    </aside>
  );
}

/* ---------- STEP HEADER ---------- */

function StepHeader({
  step,
  title,
}: {
  step: string;
  title: string;
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "0.14em",
          color: "var(--text-secondary)",
          marginBottom: 6,
        }}
      >
        {step}
      </div>
      <div
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "#E5E7EB",
        }}
      >
        {title}
      </div>
    </div>
  );
}

/* ---------- UI PRIMITIVES (UNCHANGED) ---------- */

function Row({
  label,
  open,
  onClick,
}: {
  label: string;
  open: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        padding: "14px 16px",
        marginBottom: 10,
        borderRadius: 14,
        cursor: "pointer",
        fontSize: 14,
        color: "#fff",
        background: open
          ? "linear-gradient(135deg, rgba(139,92,246,0.55), rgba(59,130,246,0.45))"
          : "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {label}
      <span>{open ? "▾" : "▸"}</span>
    </div>
  );
}

function Bullet({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        marginBottom: 8,
        cursor: "pointer",
        color: active ? "#fff" : "var(--text-secondary)",
      }}
    >
      • {label}
    </div>
  );
}
