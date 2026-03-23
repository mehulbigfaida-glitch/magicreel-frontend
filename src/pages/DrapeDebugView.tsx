import { useState } from "react";
import DressDrapeCorrector from "../components/DressDrapeCorrector";

export default function DrapeDebugView() {
  const [url, setUrl] = useState("");

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <h2>MagicReel Dress Engine – Debug Preview</h2>

      <div style={{ marginBottom: "20px" }}>
        <label>Enter Try-On Result Image URL:</label>
        <input
          type="text"
          placeholder="Paste Fashn resultImageUrl here"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            fontSize: "14px",
            marginTop: "8px",
            borderRadius: "8px",
          }}
        />
      </div>

      {url && (
        <div>
          <h3>1️⃣ Original Fashn Output</h3>
          <img
            src={url}
            alt="Original"
            style={{ width: "100%", marginBottom: "30px" }}
          />

          <h3>2️⃣ MagicReel Dress Engine Output</h3>
          <DressDrapeCorrector
            src={url}
            waistRatio={0.45}
            maxHemScale={1.25}
          />
        </div>
      )}
    </div>
  );
}
