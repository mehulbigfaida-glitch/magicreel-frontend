import { Link } from "react-router-dom";
import {
  BookOpen,
  Sparkles,
  Image,
  Clapperboard,
  Rocket,
} from "lucide-react";

import "./Resources.css";

export default function DocumentationPage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <BookOpen size={16} />
          Help Center
        </div>

        <h1>Documentation</h1>

        <p>
          Learn every part of MagicReel—from uploading garments
          and creating AI Heroes to generating Lookbooks,
          AI Reels, publishing content and managing credits.
        </p>

        <p>
          Whether you're launching your first campaign or
          scaling fashion content production, our documentation
          guides you through every feature with practical,
          step-by-step instructions.
        </p>

      </section>

      {/* ======================================================
          WELCOME
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Welcome to the MagicReel Help Center</h2>

          <p>
            Everything you need to learn MagicReel is organized
            into simple guides. Start with Getting Started if
            you're new, then continue through the AI Hero,
            Lookbook and AI Reel documentation.
          </p>

          <ul className="welcome-list">

            <li>Learn the recommended MagicReel workflow.</li>

            <li>Discover best practices for AI generation.</li>

            <li>Avoid common mistakes before generating assets.</li>

            <li>Understand credits, publishing and troubleshooting.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          QUICK START
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Quick Start Guides</h2>

          <p>
            Begin with these essential guides before exploring
            the advanced features.
          </p>

        </div>

        <div className="quick-start-grid">

          <Link
            to="/docs/getting-started"
            className="quick-card"
          >

            <BookOpen size={26} />

            <h3>Getting Started</h3>

            <p>
              Learn the complete MagicReel workflow from garment
              upload to AI content generation.
            </p>

          </Link>

          <Link
            to="/docs/hero"
            className="quick-card"
          >

            <Sparkles size={26} />

            <h3>AI Hero Guide</h3>

            <p>
              Generate high-quality AI fashion model images from
              your garment photographs.
            </p>

          </Link>

          <Link
            to="/docs/lookbook"
            className="quick-card"
          >

            <Image size={26} />

            <h3>Lookbook Guide</h3>

            <p>
              Convert AI Heroes into premium fashion lookbooks
              ready for e-commerce and marketing.
            </p>

          </Link>

          <Link
            to="/docs/reels"
            className="quick-card"
          >

            <Clapperboard size={26} />

            <h3>AI Reels Guide</h3>

            <p>
              Create engaging AI-powered fashion reels for social
              media and advertising campaigns.
            </p>

          </Link>

        </div>

      </section>

            {/* ======================================================
          MORE GUIDES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>More Documentation</h2>

          <p>
            Explore additional guides to improve content quality,
            understand credits, publish campaigns and resolve
            common issues.
          </p>

        </div>

        <div className="learning-grid">

          <Link
            to="/docs/image-quality"
            className="learn-card"
          >

            <Image size={26} />

            <h3>Image Quality Guide</h3>

            <p>
              Learn how to photograph garments for the highest
              quality AI generation results.
            </p>

          </Link>

          <Link
            to="/docs/publishing"
            className="learn-card"
          >

            <Rocket size={26} />

            <h3>Publishing Guide</h3>

            <p>
              Publish your AI-generated content directly to
              connected social media platforms.
            </p>

          </Link>

          <Link
            to="/docs/credits"
            className="learn-card"
          >

            <BookOpen size={26} />

            <h3>Credits Guide</h3>

            <p>
              Understand how credits are consumed across Hero,
              Lookbook and AI Reel generation.
            </p>

          </Link>

          <Link
            to="/docs/troubleshooting"
            className="learn-card"
          >

            <Sparkles size={26} />

            <h3>Troubleshooting Guide</h3>

            <p>
              Resolve common upload, generation and publishing
              issues with practical solutions.
            </p>

          </Link>

          <Link
            to="/docs/faq"
            className="learn-card"
          >

            <BookOpen size={26} />

            <h3>Frequently Asked Questions</h3>

            <p>
              Find answers to the most frequently asked questions
              about MagicReel and its AI workflow.
            </p>

          </Link>

        </div>

      </section>

      {/* ======================================================
          RECOMMENDED LEARNING PATH
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Recommended Learning Path</h2>

          <p>
            Follow this sequence to become productive with
            MagicReel as quickly as possible.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Getting Started</h3>

            <p>
              Understand the complete MagicReel workflow and
              platform navigation.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Create AI Heroes</h3>

            <p>
              Generate high-quality fashion model images from
              garment photographs.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Generate Lookbooks & AI Reels</h3>

            <p>
              Produce marketing-ready fashion assets for your
              online store and social channels.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">4</div>

            <h3>Publish Your Content</h3>

            <p>
              Share AI-generated campaigns directly to connected
              social media platforms.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          NEED MORE HELP
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Need More Help?</h2>

          <p>
            If you cannot find the answer you're looking for,
            continue exploring our documentation or visit the
            FAQ and Troubleshooting guides for detailed
            explanations and solutions.
          </p>

          <ul className="welcome-list">

            <li>Read detailed step-by-step documentation.</li>

            <li>Learn best practices for AI fashion generation.</li>

            <li>Improve output quality with recommended workflows.</li>

            <li>Resolve common issues quickly using troubleshooting guides.</li>

          </ul>

        </div>

      </section>

    </div>
  );
}