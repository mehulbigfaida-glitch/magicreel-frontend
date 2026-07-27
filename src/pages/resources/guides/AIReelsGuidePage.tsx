import { Link } from "react-router-dom";
import {
  BookOpen,
  Clapperboard,
  PlayCircle,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function AIReelsGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <Clapperboard size={16} />
          GUIDE
        </div>

        <h1>AI Reels Guide</h1>

        <p>
          Learn how to transform your AI fashion images into
          engaging short-form videos for Instagram, Facebook,
          TikTok and other social media platforms.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>What are AI Reels?</h2>

          <p>
            AI Reels convert your generated fashion assets into
            dynamic videos that showcase garments with natural
            movement. They help brands create engaging content
            for marketing campaigns without traditional video
            production.
          </p>

          <ul className="welcome-list">

            <li>Create professional fashion videos in minutes.</li>

            <li>Reuse AI Heroes and Lookbooks.</li>

            <li>Produce content for social media campaigns.</li>

            <li>Generate consistent brand visuals at scale.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          AI REELS WORKFLOW
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>AI Reels Workflow</h2>

          <p>
            Follow these steps to generate engaging AI-powered
            fashion videos.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Create an AI Hero</h3>

            <p>
              Begin with a high-quality AI Hero that accurately
              represents your garment.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Generate a Lookbook</h3>

            <p>
              Produce multiple fashion poses to provide rich
              visual content for your reel.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Create the AI Reel</h3>

            <p>
              MagicReel transforms your images into a smooth,
              engaging promotional fashion video.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          BEST PRACTICES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>AI Reel Best Practices</h2>

          <p>
            High-quality source images produce smoother and more
            realistic AI-generated fashion videos.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <Sparkles size={26} />

            <h3>Start with a Strong AI Hero</h3>

            <p>
              Generate a clean, well-lit AI Hero before creating
              your Reel. Better Hero images lead to better video
              quality.
            </p>

          </div>

          <div className="learn-card">

            <PlayCircle size={26} />

            <h3>Review Before Publishing</h3>

            <p>
              Watch the complete Reel before publishing to ensure
              movement, garment appearance and pacing meet your
              expectations.
            </p>

          </div>

          <div className="learn-card">

            <Clapperboard size={26} />

            <h3>Use Professional Source Images</h3>

            <p>
              High-quality Hero and Lookbook images help the AI
              create more natural motion and cleaner transitions.
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

            <li>Creating a Reel from a low-quality AI Hero.</li>

            <li>Skipping the Lookbook generation step.</li>

            <li>Publishing videos without reviewing the final output.</li>

            <li>Using poor-quality garment photographs as the starting point.</li>

            <li>Ignoring minor visual issues before sharing the Reel.</li>

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
            Learn how high-quality garment photographs improve
            every AI generation in MagicReel.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/image-quality"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: Image Quality Guide</h3>

            <p>
              Discover the photography guidelines that produce
              the best AI Heroes, Lookbooks and AI Reels.
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
            AI Reels bring your fashion products to life by
            transforming high-quality AI Heroes and Lookbooks
            into engaging promotional videos. Starting with
            excellent garment photographs and following the
            recommended workflow will consistently produce
            professional results suitable for e-commerce,
            advertising and social media campaigns.
          </p>

        </div>

      </section>

    </div>
  );
}