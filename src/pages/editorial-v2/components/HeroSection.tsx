import React from "react";
import {
  CalendarDays,
  Image,
  Hash,
  CheckCircle2,
} from "lucide-react";

const HeroSection: React.FC = () => {
  return (
    <section className="editorial-card hero-section">

      {/* ==========================================
          STEP 1
      ========================================== */}

      <div className="hero-step-layout">

        {/* ==========================================
            LEFT STEP INFO
        ========================================== */}

        <aside className="hero-step-info">

          <div className="step-number">
            1
          </div>

          <h3 className="step-title">
            Choose
            <br />
            Hero
          </h3>

          <p className="step-description">
            Select an existing production Hero from your
            MagicReel Assets.
          </p>

        </aside>

        {/* ==========================================
            HERO CONTENT
        ========================================== */}

        <div className="hero-main-card">

          {/* Hero Preview */}

          <div className="hero-preview">

            <div className="hero-image-placeholder">

              <div className="hero-placeholder-content">

                <div className="hero-preview-icon">
                  ✦
                </div>

                <h3>Hero Preview</h3>

                <p>Selected Production Hero</p>

              </div>

            </div>

          </div>

          {/* Hero Details */}

          <div className="hero-details">

            <div className="hero-title-row">

              <h2>
                Hero Name
              </h2>

              </div>

            <div className="hero-meta">

              <div className="hero-meta-row">

                <CalendarDays size={18} />

                <span>
                  Created Date
                </span>

              </div>

              <div className="hero-meta-row">

                <Image size={18} />

                <span>
                  Resolution
                </span>

              </div>

              <div className="hero-meta-row">

                <Hash size={18} />

                <span>
                  Asset ID
                </span>

              </div>

            </div>

            <button
              type="button"
              className="change-hero-button"
            >
              Change Hero
            </button>

          </div>

          {/* About Hero */}

          <div className="hero-about-card">

            <h3>
              About Hero Asset
            </h3>

            <p>
              This production Hero will be used
              throughout your editorial.
            </p>

            <ul>

              <li>
                <CheckCircle2 size={18} />
                Production approved
              </li>

              <li>
                <CheckCircle2 size={18} />
                Editorial Ready
              </li>

              <li>
                <CheckCircle2 size={18} />
                High Resolution
              </li>

              <li>
                <CheckCircle2 size={18} />
                Available in Hero Library
              </li>

            </ul>

          </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;