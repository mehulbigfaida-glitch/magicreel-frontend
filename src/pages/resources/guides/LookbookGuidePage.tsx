import { Link } from "react-router-dom";
import {
  BookOpen,
  Image,
  Sparkles,
  LayoutGrid,
} from "lucide-react";

import "../Resources.css";

export default function LookbookGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <BookOpen size={16} />
          GUIDE
        </div>

        <h1>Lookbook Guide</h1>

        <p>
          Learn how to transform AI Heroes into premium fashion
          lookbooks suitable for e-commerce, marketplaces,
          catalogs and social media campaigns.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>What is a Lookbook?</h2>

          <p>
            A Lookbook is a collection of professionally styled
            fashion images generated from your AI Hero. It
            showcases your garment from multiple poses and
            angles, helping customers visualize the product more
            effectively.
          </p>

          <ul className="welcome-list">

            <li>Create multiple editorial-style poses automatically.</li>

            <li>Generate consistent model photography.</li>

            <li>Produce assets for e-commerce and catalogs.</li>

            <li>Use the generated images for campaigns and AI Reels.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          LOOKBOOK WORKFLOW
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Lookbook Workflow</h2>

          <p>
            Follow this recommended workflow for the best
            results.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Create AI Hero</h3>

            <p>
              Begin with a high-quality AI Hero generated from
              your garment photographs.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Generate Lookbook</h3>

            <p>
              MagicReel creates multiple fashion poses while
              maintaining garment consistency.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Review Results</h3>

            <p>
              Inspect every generated pose before downloading or
              publishing your content.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          BEST PRACTICES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Lookbook Best Practices</h2>

          <p>
            Following these recommendations helps produce
            consistent, professional-quality fashion imagery.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <Sparkles size={26} />

            <h3>Start with a Great AI Hero</h3>

            <p>
              The quality of every Lookbook depends on the Hero
              image. Spend time generating the best possible
              Hero before creating your Lookbook.
            </p>

          </div>

          <div className="learn-card">

            <LayoutGrid size={26} />

            <h3>Review Every Pose</h3>

            <p>
              Check each generated pose to ensure garment fit,
              styling and overall appearance meet your quality
              standards.
            </p>

          </div>

          <div className="learn-card">

            <Image size={26} />

            <h3>Use High Resolution Downloads</h3>

            <p>
              Download the highest quality version for use in
              e-commerce stores, catalogs and marketing
              campaigns.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          COMMON MISTAKES
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Common Mistakes to Avoid</h2>

          <ul className="welcome-list">

            <li>Generating a Lookbook before creating a high-quality AI Hero.</li>

            <li>Using low-resolution garment photographs.</li>

            <li>Ignoring minor garment alignment issues in the Hero image.</li>

            <li>Publishing without reviewing all generated poses.</li>

            <li>Using incomplete garment images during Hero generation.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          CONTINUE LEARNING
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Continue Learning</h2>

          <p>
            Once your Lookbook is complete, the next step is
            generating engaging AI-powered fashion videos.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/reels"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: AI Reels Guide</h3>

            <p>
              Learn how to convert your fashion assets into
              AI-generated promotional reels for social media
              and advertising.
            </p>

          </Link>

        </div>

      </section>

            {/* ======================================================
          SUMMARY
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Summary</h2>

          <p>
            A high-quality AI Hero is the foundation of every
            successful Lookbook. By following the recommended
            workflow, reviewing generated poses and using
            high-quality garment images, you can create
            professional fashion content ready for e-commerce,
            marketing and social media.
          </p>

        </div>

      </section>

    </div>
  );
}