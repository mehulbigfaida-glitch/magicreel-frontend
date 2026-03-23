import type { ReactNode } from "react";
import { useState } from "react";
import "./CreateWorkspaceLayout.css";
import "./GarmentExplorer.css";

type Tree = {
  [key: string]: Tree | string[];
};

const GARMENT_TREE: Tree = {
  Top: {
    Shirt: {
      Pattern: ["Solid", "Printed", "Striped"],
      Sleeve: ["Half Sleeve", "Full Sleeve"],
    },
    "T-Shirt": {
      Pattern: ["Solid", "Printed"],
      Fit: ["Regular", "Oversized"],
    },
  },
  Bottom: {
    Jeans: {
      Fit: ["Slim", "Regular"],
      Rise: ["Mid-rise", "High-rise"],
    },
  },
  Ethnic: {
    Saree: {
      Drape: ["Nivi", "Modern"],
    },
  },
};

function GarmentExplorer({
  onLeafSelected,
}: {
  onLeafSelected: (path: string[]) => void;
}) {
  const [path, setPath] = useState<string[]>([]);

  function handleSelect(depth: number, value: string) {
    const next = [...path.slice(0, depth), value];
    setPath(next);
    onLeafSelected(next);
  }

  function renderNode(node: Tree | string[], depth = 0) {
    if (Array.isArray(node)) {
      return node.map((leaf) => (
        <div
          key={leaf}
          className={`mr-tree-node leaf ${
            path[depth] === leaf ? "active" : ""
          }`}
          style={{ paddingLeft: 16 + depth * 16 }}
          onClick={() => handleSelect(depth, leaf)}
        >
          {leaf}
        </div>
      ));
    }

    return Object.keys(node).map((key) => {
      const isOpen = path[depth] === key;
      return (
        <div key={key}>
          <div
            className={`mr-tree-node ${isOpen ? "open" : ""}`}
            style={{ paddingLeft: 16 + depth * 16 }}
            onClick={() => handleSelect(depth, key)}
          >
            <span className="mr-tree-arrow">{isOpen ? "▾" : "▸"}</span>
            {key}
          </div>
          {isOpen && renderNode(node[key] as Tree | string[], depth + 1)}
        </div>
      );
    });
  }

  return (
    <div className="mr-tree">
      <div className="mr-tree-title">Garment</div>
      {renderNode(GARMENT_TREE)}
    </div>
  );
}

export default function CreateWorkspaceLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [leafPath, setLeafPath] = useState<string[]>([]);

  const garmentReady = leafPath.length >= 4;

  return (
    <div className="mr-workspace-root">
      {/* LEFT EXPLORER */}
      <aside className="mr-sidebar">
        <div className="mr-sidebar-brand">
          <div className="mr-logo">MR</div>
          <span>MagicReel</span>
        </div>

        <GarmentExplorer onLeafSelected={setLeafPath} />

        <div className="mr-sidebar-divider" />

        <div className="mr-sidebar-actions">
          <div className={`mr-action ${garmentReady ? "active" : "locked"}`}>
            Upload Garment
          </div>
          <div className={`mr-action ${garmentReady ? "" : "locked"}`}>
            Select Avatar
          </div>
          <div className={`mr-action ${garmentReady ? "" : "locked"}`}>
            Generate
          </div>
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="mr-workspace-main">
        {children}

        {garmentReady && (
          <div style={{ marginTop: 24, color: "#b8b8c5" }}>
            Selected:&nbsp;
            <strong>{leafPath.join(" › ")}</strong>
          </div>
        )}
      </main>
    </div>
  );
}
