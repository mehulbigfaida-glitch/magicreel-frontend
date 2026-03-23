// frontend/src/layout/AppShell.tsx
// 🔒 MAGICREEL — APPLICATION SHELL (FINAL, STABLE)

import React from "react";
import "./AppShell.css"; // 🔑 REQUIRED: restores layout

type Props = {
  sidebar: React.ReactNode;
  canvas: React.ReactNode;
  preview: React.ReactNode;
};

export default function AppShell({
  sidebar,
  canvas,
  preview,
}: Props) {
  return (
    <div className="mr-app-shell">
      {/* Sidebar (scrollable) */}
      <aside className="mr-app-sidebar">
        {sidebar}
      </aside>

      {/* Main canvas (fixed viewport) */}
      <main className="mr-app-canvas">
        {canvas}
      </main>

      {/* Preview (fixed viewport) */}
      <section className="mr-app-preview">
        {preview}
      </section>
    </div>
  );
}
