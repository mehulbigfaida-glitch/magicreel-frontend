import React from "react";

const GenerateSection: React.FC = () => {
  return (
    <section className="editorial-card generate-section">

      <div className="generate-content">

        <span className="section-label">
          READY
        </span>

        <h2>
          Ready to Create
        </h2>

        <p>
          Your Hero, Editorial World and creative settings are ready.
          Generate your luxury editorial with a single click.
        </p>

      </div>

      <div className="generate-summary">

        <div className="summary-item">
          <span>✓</span>
          <span>Production Hero Selected</span>
        </div>

        <div className="summary-item">
          <span>✓</span>
          <span>Editorial World Selected</span>
        </div>

        <div className="summary-item">
          <span>✓</span>
          <span>Output Format Ready</span>
        </div>

        <div className="summary-item">
          <span>✓</span>
          <span>Brand Settings Applied</span>
        </div>

      </div>

      <div className="generate-actions">

        <button
          type="button"
          className="generate-editorial-button"
        >
          Generate Editorial
        </button>

        <div className="credit-information">

          <span className="credit-badge">
            1 Credit
          </span>

          <p>
            Your account will be charged only after generation begins.
          </p>

        </div>

      </div>

    </section>
  );
};

export default GenerateSection;