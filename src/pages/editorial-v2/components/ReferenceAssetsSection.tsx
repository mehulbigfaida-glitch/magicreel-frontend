import React from "react";

const ReferenceAssetsSection: React.FC = () => {
  return (
    <section className="editorial-card reference-assets-section">

      <div className="section-heading">

        <div>

          <span className="section-label">
            STEP 3
          </span>

          <h2>
            Creative References
          </h2>

          <p>
            Optional supporting assets that help preserve garments,
            fabrics, accessories and styling details.
          </p>

        </div>

      </div>

      <div className="reference-upload-card">

        <div className="reference-upload-placeholder">

          <div className="reference-upload-icon">
            +
          </div>

          <h3>Add Reference Assets</h3>

          <p>
            Upload up to four supporting images.
          </p>

        </div>

      </div>

      <div className="reference-preview-grid">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="reference-preview-tile"
          >
            <span>Preview {item}</span>
          </div>
        ))}

      </div>

    </section>
  );
};

export default ReferenceAssetsSection;