import React from "react";

const outputFormats = [
  {
    title: "Cinematic",
    ratio: "16:9",
    recommended: true,
  },
  {
    title: "Editorial",
    ratio: "2:3",
  },
  {
    title: "Instagram",
    ratio: "4:5",
  },
  {
    title: "Square",
    ratio: "1:1",
  },
  {
    title: "Story",
    ratio: "9:16",
  },
];

const OutputFormatSection: React.FC = () => {
  return (
    <section className="editorial-card output-format-section">

      <div className="section-heading">

        <div>

          <span className="section-label">
            STEP 4
          </span>

          <h2>
            Output Format
          </h2>

          <p>
            Choose the final format for your editorial. The selected
            format determines the composition and framing of the output.
          </p>

        </div>

      </div>

      <div className="output-format-grid">

        {outputFormats.map((format) => (
          <button
            key={format.title}
            type="button"
            className="output-format-card"
          >

            <div className={`output-frame ${format.ratio.replace(":", "-")}`}>

              <div className="frame-outline" />

            </div>

            <div className="output-format-content">

              <h3>{format.title}</h3>

              <span>{format.ratio}</span>

              {format.recommended && (
                <div className="recommended-badge">
                  ★ Recommended
                </div>
              )}

            </div>

          </button>
        ))}

      </div>

    </section>
  );
};

export default OutputFormatSection;