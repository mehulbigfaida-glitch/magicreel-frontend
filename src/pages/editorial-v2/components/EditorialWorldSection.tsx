import React from "react";

const editorialWorlds = [

  "Dark Aristocracy",

  "Garden Nostalgia",

  "Celestial Silence",

  "Mediterranean Heirloom",

  "Runway Silence",

  "Urban Luxury Cinema",

  "Museum Couture",

  "Heritage Romance",

  "Noir Couture",

];

const EditorialWorldSection: React.FC = () => {
  return (
  <section className="editorial-card editorial-world-section">

    <div className="world-step-layout">

      {/* LEFT */}

      <aside className="world-step-info">

        <div className="step-number">
          2
        </div>

        <h3 className="step-title">
          Editorial
          <br />
          World
        </h3>

        <p className="step-description">
          Select the editorial environment that defines the mood,
          lighting and storytelling for your campaign.
        </p>

      </aside>

      {/* RIGHT */}

      <div className="world-main-content">

        <div className="world-carousel">

          {editorialWorlds.map((world, index) => (

  <button
    key={world}
    type="button"
    className={`editorial-world-card ${index === 0 ? "selected" : ""}`}
  >

    <div className="editorial-world-image">

      {/* Temporary image placeholder */}

      <div className="editorial-world-photo">

        <span className="editorial-world-photo-icon">
          ✦
        </span>

      </div>

      {/* Bottom Gradient */}

      <div className="editorial-world-overlay">

        <h3>
          {world}
        </h3>

        <p>
          Editorial World
        </p>

      </div>

      {/* Selected */}

      {index === 0 && (

        <div className="editorial-world-selected">

          ✓

        </div>

      )}

    </div>

  </button>

))}

        </div>

      </div>

    </div>

  </section>
);
};

export default EditorialWorldSection;