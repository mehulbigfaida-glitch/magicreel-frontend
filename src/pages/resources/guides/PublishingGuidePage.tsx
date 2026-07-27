import { Link } from "react-router-dom";
import {
  BookOpen,
  Share2,
  Rocket,
  CheckCircle,
} from "lucide-react";

import "../Resources.css";

export default function PublishingGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <Share2 size={16} />
          GUIDE
        </div>

        <h1>Publishing Guide</h1>

        <p>
          Learn how to publish your AI-generated fashion content
          directly from MagicReel to your connected social media
          platforms and streamline your marketing workflow.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Publishing with MagicReel</h2>

          <p>
            After generating AI Heroes, Lookbooks and AI Reels,
            you can publish approved content directly to your
            connected social media accounts without leaving
            MagicReel.
          </p>

          <ul className="welcome-list">

            <li>Publish content from one central location.</li>

            <li>Generate AI-assisted captions and hashtags.</li>

            <li>Review content before publishing.</li>

            <li>Maintain a consistent brand presence.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          PUBLISHING WORKFLOW
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Publishing Workflow</h2>

          <p>
            Follow these steps to publish your content
            successfully.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Select Approved Content</h3>

            <p>
              Choose the AI Hero, Lookbook or AI Reel that you
              want to publish.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Review Caption</h3>

            <p>
              Verify the AI-generated caption and hashtags, and
              make any changes before publishing.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Publish</h3>

            <p>
              Publish your approved content to the connected
              social media platforms with a single click.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          PUBLISHING BEST PRACTICES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Publishing Best Practices</h2>

          <p>
            Review your content carefully before publishing to
            maintain a professional and consistent brand image.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <CheckCircle size={26} />

            <h3>Review Before Publishing</h3>

            <p>
              Verify every image, Lookbook or AI Reel before it
              goes live. A quick review helps catch minor issues
              and ensures the final content represents your
              brand professionally.
            </p>

          </div>

          <div className="learn-card">

            <Rocket size={26} />

            <h3>Refine AI Captions</h3>

            <p>
              AI-generated captions provide an excellent starting
              point. Edit them when needed to better match your
              brand voice and campaign objectives.
            </p>

          </div>

          <div className="learn-card">

            <Share2 size={26} />

            <h3>Stay Brand Consistent</h3>

            <p>
              Maintain consistent messaging, visual quality and
              publishing frequency across all connected social
              media platforms.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          COMMON PUBLISHING ISSUES
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Common Publishing Issues</h2>

          <ul className="welcome-list">

            <li>Publishing content without reviewing the final output.</li>

            <li>Using captions that don't match your brand voice.</li>

            <li>Publishing unfinished or unapproved AI assets.</li>

            <li>Forgetting to connect the required social media account.</li>

            <li>Ignoring platform-specific image or video requirements.</li>

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
            Understand how MagicReel credits are consumed across
            AI Hero generation, Lookbooks, AI Reels and other
            features.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/credits"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: Credits Guide</h3>

            <p>
              Learn how credits work, how they are consumed and
              how to manage your available balance efficiently.
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
            Publishing is the final step in the MagicReel
            workflow. By reviewing your AI-generated assets,
            refining captions and ensuring your social media
            accounts are properly connected, you can publish
            professional fashion content quickly and
            consistently across your marketing channels.
          </p>

        </div>

      </section>

    </div>
  );
}