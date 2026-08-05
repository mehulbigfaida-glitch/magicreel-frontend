import React from "react";

import "./EditorialStudio.css";

import HeroSection from "./components/HeroSection";
import EditorialWorldSection from "./components/EditorialWorldSection";
import ReferenceAssetsSection from "./components/ReferenceAssetsSection";
import OutputFormatSection from "./components/OutputFormatSection";
import BrandSettingsSection from "./components/BrandSettingsSection";
import GenerateSection from "./components/GenerateSection";

const EditorialStudio: React.FC = () => {
  return (
    <main className="editorial-studio-page">
      <div className="editorial-studio-container">

        {/* =======================================================
            PAGE HEADER
        ======================================================= */}

        <section className="editorial-page-header">

          <div className="editorial-header-content">

            <span className="editorial-badge">
              MAGICREEL • FASHION INTELLIGENCE ENGINE
            </span>

            <h1 className="editorial-title">
              Editorial Studio
            </h1>

            <p className="editorial-description">
              Create luxury fashion editorials from your
              production-approved Hero assets using MagicReel's
              Fashion Intelligence Engine.
            </p>

          </div>

        </section>

        {/* =======================================================
    HERO
======================================================= */}

<HeroSection />

{/* =======================================================
    CREATIVE REFERENCES
======================================================= */}

<ReferenceAssetsSection />

{/* =======================================================
    EDITORIAL WORLDS
======================================================= */}

<EditorialWorldSection />

{/* =======================================================
    OUTPUT FORMAT
======================================================= */}

<OutputFormatSection />

        {/* =======================================================
            BRAND SETTINGS
        ======================================================= */}

        <BrandSettingsSection />

        {/* =======================================================
            GENERATE
        ======================================================= */}

        <GenerateSection />

      </div>
    </main>
  );
};

export default EditorialStudio;