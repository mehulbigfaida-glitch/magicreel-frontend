import React from "react";

interface Props {
    engine: string | null;
    category: string;
    adjustments: any;
}

const EngineDebugPanel: React.FC<Props> = ({ engine, category, adjustments }) => {
    if (!engine) return null;

    return (
        <div
            style={{
                marginTop: "20px",
                background: "#f4f4f4",
                padding: "15px",
                borderRadius: "10px",
                border: "1px solid #ddd",
            }}
        >
            <h4>Engine Debug</h4>
            <p><strong>Engine:</strong> {engine}</p>
            <p><strong>Category:</strong> {category}</p>

            <h5>Adjustments</h5>
            <pre
                style={{
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                }}
            >
{JSON.stringify(adjustments, null, 2)}
            </pre>
        </div>
    );
};

export default EngineDebugPanel;
