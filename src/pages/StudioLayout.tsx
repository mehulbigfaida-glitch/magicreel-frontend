import type { ReactNode } from "react";
import "./StudioLayout.css";

export default function StudioLayout({
  left,
  front,
  back,
  selectorRow,
  preview,
}: {
  left: ReactNode;
  front: ReactNode;
  back: ReactNode;
  selectorRow?: ReactNode;
  preview: ReactNode;
}) {
  return (
    <div className="mr-studio-root">
      <aside className="mr-studio-left">{left}</aside>

      <main className="mr-studio-main">
        {selectorRow && (
          <div className="mr-studio-selector">{selectorRow}</div>
        )}

        <div className="mr-studio-canvas">
          <div className="mr-canvas front">{front}</div>
          <div className="mr-canvas back">{back}</div>
          <div className="mr-preview-column">{preview}</div>
        </div>
      </main>
    </div>
  );
}
