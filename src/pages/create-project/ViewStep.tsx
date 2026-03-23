import "./ViewStep.css";

export default function ViewStep() {
  return (
    <div className="mr-view">
      <h1>Preview results</h1>
      <p className="mr-view-sub">
        Review the generated try-on visuals.
      </p>

      {/* Demo placeholder: generated output */}
      <div
        style={{
          marginTop: 24,
          padding: 24,
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          background: "#fafafa",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: 8 }}>
          Generated try-on preview will appear here.
        </p>
        <p style={{ fontSize: 12, color: "#6b7280" }}>
          (Demo mode – generation mocked)
        </p>
      </div>
    </div>
  );
}
