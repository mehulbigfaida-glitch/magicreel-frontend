import React from "react";

interface Props {
    queuePosition: number | null;
}

const GPUQueueIndicator: React.FC<Props> = ({ queuePosition }) => {
    if (queuePosition === null) return null;

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "10px 20px",
                background: "#003cff10",
                border: "1px solid #003cff",
                borderRadius: "8px",
                color: "#003cff",
                fontWeight: 600,
                width: "fit-content"
            }}
        >
            GPU Queue: {queuePosition === 0 ? "Processing…" : queuePosition}
        </div>
    );
};

export default GPUQueueIndicator;
