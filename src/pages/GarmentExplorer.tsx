import { useState } from "react";
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

export default function GarmentExplorer() {
  const [path, setPath] = useState<string[]>([]);

  function renderNode(node: Tree | string[], depth = 0) {
    if (Array.isArray(node)) {
      return node.map((leaf) => (
        <div
          key={leaf}
          className={`mr-tree-node leaf ${
            path[depth] === leaf ? "active" : ""
          }`}
          style={{ paddingLeft: 12 + depth * 14 }}
          onClick={() => setPath((p) => [...p.slice(0, depth), leaf])}
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
            style={{ paddingLeft: 12 + depth * 14 }}
            onClick={() => setPath((p) => [...p.slice(0, depth), key])}
          >
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
