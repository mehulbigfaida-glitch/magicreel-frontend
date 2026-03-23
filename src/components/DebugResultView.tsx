// src/components/DebugResultView.tsx

export default function DebugResultView({ result }: { result: any }) {
  const finalImage = result.finalImageUrl;
  const intermediate = result.intermediate || {};

  const fashnOutput =
    intermediate.rawTryOnResults?.[0]?.imageUrl || "N/A";
  const enhancedGarment = intermediate.enhancedGarment?.imageUrl;
  const enhancedModel = intermediate.enhancedModel?.imageUrl;

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>MagicBoost Final Output</h3>
      <img src={finalImage} width={300} />

      <h3>Comparison</h3>
      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Raw Fashn Output</h4>
          <img src={fashnOutput} width={250} />
        </div>

        <div>
          <h4>MagicBoost Final</h4>
          <img src={finalImage} width={250} />
        </div>
      </div>

      <hr />

      <h3>Intermediate Debug</h3>

      <p><b>Enhanced Garment</b></p>
      <img src={enhancedGarment} width={200} />

      <p><b>Enhanced Model</b></p>
      <img src={enhancedModel} width={200} />

      <pre style={{ background: "#111", color: "#0f0", padding: "15px" }}>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  );
}
