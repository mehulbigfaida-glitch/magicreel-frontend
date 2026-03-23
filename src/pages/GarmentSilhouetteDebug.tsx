import { useState } from "react";

export default function GarmentSilhouetteDebug() {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  async function analyze() {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("http://localhost:5001/api/silhouette/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl }),
      });

      const data = await res.json();

      if (!data.ok) {
        setError(data.error || "Unknown error");
        return;
      }

      setResult(data);
    } catch (err) {
      setError("Failed to connect to backend.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24 }}>
      <h2>Garment Silhouette Debug</h2>

      <input
        type="text"
        placeholder="Enter garment image URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        style={{ width: "80%", padding: 8, marginBottom: 12 }}
      />

      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze Silhouette"}
      </button>

      {error && (
        <p style={{ color: "red", marginTop: 20 }}>
          <b>Error:</b> {error}
        </p>
      )}

      {result && (
        <div style={{ marginTop: 32 }}>
          <h3>Silhouette Summary</h3>
          <ul>
            <li>Top Width: {result.silhouette.topWidth.toFixed(2)}%</li>
            <li>Mid Width: {result.silhouette.midWidth.toFixed(2)}%</li>
            <li>Bottom Width: {result.silhouette.bottomWidth.toFixed(2)}%</li>
            <li>Total Height Rows: {result.silhouette.height}</li>
          </ul>

          <h3>Dress Correction Analysis</h3>

          <p>
            <b>Category:</b> {result.dressAnalysis.category}
          </p>

          <h4>Distortion Metrics</h4>
          <ul>
            <li>Horizontal: {result.dressAnalysis.distortion.horizontal.toFixed(3)}</li>
            <li>Vertical: {result.dressAnalysis.distortion.vertical.toFixed(3)}</li>
            <li>Asymmetry: {result.dressAnalysis.distortion.asymmetry.toFixed(3)}</li>
            <li>Sleeve Alignment: {result.dressAnalysis.distortion.sleeveAlignment.toFixed(3)}</li>
            <li>Hemline: {result.dressAnalysis.distortion.hemline.toFixed(3)}</li>
          </ul>

          <h4>Correction Flags</h4>
          <ul>
            <li>Horizontal Stretch Fix: {result.dressAnalysis.correction.applyHorizontalStretch ? "YES" : "no"}</li>
            <li>Vertical Stretch Fix: {result.dressAnalysis.correction.applyVerticalStretch ? "YES" : "no"}</li>
            <li>Asymmetry Fix: {result.dressAnalysis.correction.applyAsymmetryFix ? "YES" : "no"}</li>
            <li>Hem Fix: {result.dressAnalysis.correction.applyHemFix ? "YES" : "no"}</li>
          </ul>

          <p>
            <b>Notes:</b> {result.dressAnalysis.correction.notes}
          </p>
        </div>
      )}
    </div>
  );
}
