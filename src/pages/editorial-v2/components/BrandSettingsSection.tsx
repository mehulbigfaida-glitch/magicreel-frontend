import React from "react";

const BrandSettingsSection: React.FC = () => {
  return (
    <section className="editorial-card brand-settings-section">

      <div className="section-heading">

        <div>

          <span className="section-label">
            STEP 5
          </span>

          <h2>
            Brand Settings
          </h2>

          <p>
            Apply your workspace branding to the generated editorial.
          </p>

        </div>

      </div>

      <div className="brand-settings-card">

        <label className="brand-toggle">

          <input
            type="checkbox"
            defaultChecked
          />

          <div className="brand-toggle-content">

            <h3>
              Include Brand Logo
            </h3>

            <p>
              Your workspace logo will automatically be applied to the
              generated editorial when branding is enabled.
            </p>

          </div>

        </label>

      </div>

    </section>
  );
};

export default BrandSettingsSection;