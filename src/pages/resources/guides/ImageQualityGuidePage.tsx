import { Link } from "react-router-dom";
import {
  BookOpen,
  Camera,
  Image,
  CheckCircle,
} from "lucide-react";

import "../Resources.css";

export default function ImageQualityGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <Camera size={16} />
          GUIDE
        </div>

        <h1>Image Quality Guide</h1>

        <p>
          Learn how to capture high-quality garment photographs
          that produce the best AI Heroes, Lookbooks and AI
          Reels inside MagicReel.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Why Image Quality Matters</h2>

          <p>
            Every AI generation begins with your garment
            photographs. Clear, well-lit and properly aligned
            images allow MagicReel to understand garment
            structure, colours and details more accurately,
            resulting in better AI outputs.
          </p>

          <ul className="welcome-list">

            <li>Sharper garment details produce better AI Heroes.</li>

            <li>Good lighting preserves accurate colours.</li>

            <li>Clean images improve pose consistency.</li>

            <li>Better inputs create better Lookbooks and AI Reels.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          PHOTOGRAPHY GUIDELINES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Photography Guidelines</h2>

          <p>
            Follow these recommendations before uploading your
            garment images.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Use Even Lighting</h3>

            <p>
              Photograph garments under bright, even lighting
              without harsh shadows or overexposed areas.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Capture the Entire Garment</h3>

            <p>
              Ensure the full garment is visible with no cropped
              sleeves, collars or hems.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Keep the Garment Flat</h3>

            <p>
              Minimise wrinkles and folds so the AI can correctly
              interpret the garment's shape.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          IMAGE RECOMMENDATIONS
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Recommended Image Guidelines</h2>

          <p>
            Following these recommendations helps MagicReel
            produce consistent, high-quality AI outputs across
            Heroes, Lookbooks and AI Reels.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <Image size={26} />

            <h3>Use High Resolution Images</h3>

            <p>
              Upload clear, high-resolution photographs with
              sharp garment details. Avoid compressed or blurry
              images whenever possible.
            </p>

          </div>

          <div className="learn-card">

            <Camera size={26} />

            <h3>Neutral Background</h3>

            <p>
              Photograph garments against a clean, uncluttered
              background so the garment remains the primary
              focus for AI analysis.
            </p>

          </div>

          <div className="learn-card">

            <CheckCircle size={26} />

            <h3>Natural Colours</h3>

            <p>
              Ensure garment colours closely match the actual
              product by avoiding strong colour casts and
              excessive image filters.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          COMMON MISTAKES
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Common Photography Mistakes</h2>

          <ul className="welcome-list">

            <li>Uploading blurry or low-resolution garment images.</li>

            <li>Photographing garments under uneven lighting.</li>

            <li>Cropping important garment areas such as sleeves or hems.</li>

            <li>Using cluttered or distracting backgrounds.</li>

            <li>Uploading heavily edited or colour-altered photographs.</li>

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
            Once your garment images meet the recommended
            quality standards, you're ready to publish your
            AI-generated fashion content.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/publishing"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: Publishing Guide</h3>

            <p>
              Learn how to publish your AI-generated fashion
              content to your connected social media platforms.
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
            High-quality garment photographs are the foundation
            of every successful AI generation in MagicReel.
            Clear lighting, accurate colours and well-composed
            images help produce better AI Heroes, premium
            Lookbooks and engaging AI Reels. Investing a little
            extra time in photography will consistently improve
            the quality of your final content.
          </p>

        </div>

      </section>

    </div>
  );
}