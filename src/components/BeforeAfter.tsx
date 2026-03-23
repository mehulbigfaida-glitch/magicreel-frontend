import React from "react";

interface Props {
    before: string | null;
    after: string | null;
}

const BeforeAfter: React.FC<Props> = ({ before, after }) => {
    if (!before && !after) return null;

    return (
        <div style={{ display: "flex", gap: "20px", marginTop: "30px" }}>
            {before && (
                <div>
                    <h4>Before</h4>
                    <img
                        src={before}
                        style={{
                            width: "260px",
                            borderRadius: "10px",
                            border: "2px solid #ccc",
                        }}
                    />
                </div>
            )}

            {after && (
                <div>
                    <h4>After</h4>
                    <img
                        src={after}
                        style={{
                            width: "260px",
                            borderRadius: "10px",
                            border: "2px solid #ccc",
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default BeforeAfter;
