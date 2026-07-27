import { Link } from "react-router-dom";
import {
  HelpCircle,
  BookOpen,
  MessageCircle,
  Lightbulb,
} from "lucide-react";

import "../Resources.css";

export default function FAQGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <HelpCircle size={16} />
          GUIDE
        </div>

        <h1>Frequently Asked Questions</h1>

        <p>
          Find answers to the questions users ask most often
          about AI Hero, Lookbooks, AI Reels, publishing,
          credits and getting the best results from MagicReel.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Quick Answers</h2>

          <p>
            This guide brings together the most common questions
            asked by MagicReel users. If you don't find your
            answer here, review the related guides in the
            documentation.
          </p>

          <ul className="welcome-list">

            <li>How do credits work?</li>

            <li>Why didn't my AI generation start?</li>

            <li>What images produce the best results?</li>

            <li>How do I publish content?</li>

            <li>Where can I troubleshoot errors?</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          POPULAR QUESTIONS
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Popular Questions</h2>

          <p>
            Here are some of the questions most frequently asked
            by new MagicReel users.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>How are credits used?</h3>

            <p>
              Credits are consumed when an AI generation begins.
              Different MagicReel features require different
              numbers of credits.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Why isn't my generation starting?</h3>

            <p>
              Check that all required inputs are provided and
              your account has enough available credits before
              retrying.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>How can I improve results?</h3>

            <p>
              Use clear, high-quality garment and model images
              that follow the recommendations in the Image
              Quality Guide.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          MORE FREQUENTLY ASKED QUESTIONS
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>More Frequently Asked Questions</h2>

          <p>
            These additional answers cover common situations you
            may encounter while using MagicReel.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <MessageCircle size={26} />

            <h3>Can I regenerate AI content?</h3>

            <p>
              Yes. You can generate content again after adjusting
              your inputs. Each new AI generation uses credits
              according to the selected feature.
            </p>

          </div>

          <div className="learn-card">

            <Lightbulb size={26} />

            <h3>How do I get better AI results?</h3>

            <p>
              Use clear, well-lit garment and model images,
              follow the Image Quality Guide and review your
              selections before generating content.
            </p>

          </div>

          <div className="learn-card">

            <HelpCircle size={26} />

            <h3>Where can I find help?</h3>

            <p>
              Explore the documentation guides for detailed
              workflows and troubleshooting steps whenever you
              need assistance.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          HELPFUL TIPS
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Helpful Tips</h2>

          <ul className="welcome-list">

            <li>Use high-quality source images for the best AI output.</li>

            <li>Review generated assets before publishing.</li>

            <li>Monitor your available credits before large generation sessions.</li>

            <li>Keep your connected social accounts up to date.</li>

            <li>Consult the Troubleshooting Guide if something doesn't work as expected.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          EXPLORE MORE GUIDES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Explore More Guides</h2>

          <p>
            Continue exploring the MagicReel documentation to
            learn more about each stage of the AI fashion
            creation workflow.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Back to Documentation</h3>

            <p>
              Return to the documentation home page to browse all
              available guides and learning resources.
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
            The Frequently Asked Questions guide provides quick
            answers to the most common questions about using
            MagicReel. For detailed workflows, best practices and
            step-by-step instructions, explore the complete
            documentation library available from the
            Documentation Home page.
          </p>

        </div>

      </section>

    </div>
  );
}