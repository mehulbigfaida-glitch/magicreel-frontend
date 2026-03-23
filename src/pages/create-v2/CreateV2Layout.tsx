// frontend/src/pages/create-v2/CreateV2Layout.tsx
// 🔒 MAGICREEL — CREATE V2 CANVAS (FINAL STABLE LAYOUT)

import React from "react";

type Props = {
  breadcrumb: React.ReactNode;
  pills?: React.ReactNode | null;
  frontFrame: React.ReactNode;
  backFrame: React.ReactNode;
  avatars?: React.ReactNode | null;
  cta: React.ReactNode;
};

export default function CreateV2Layout({
  breadcrumb,
  pills,
  frontFrame,
  backFrame,
  avatars,
  cta,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 18,
        width: "100%",
        overflowY: "auto",
        paddingBottom: 40,
      }}
    >
      {/* TOP SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {breadcrumb}
        {pills}
      </div>

      {/* MIDDLE SECTION (UPLOAD AREA) */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
          alignItems: "start",
        }}
      >
        {frontFrame}
        {backFrame}
      </div>

      {/* OPTIONAL AVATARS */}
      {avatars && <div style={{ marginTop: 8 }}>{avatars}</div>}

      {/* CTA – CENTERED + ALWAYS VISIBLE */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: 16,
          paddingBottom: 20,
        }}
      >
        {cta}
      </div>
    </div>
  );
}