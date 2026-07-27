import { Link } from "react-router-dom";
import {
  Wrench,
  BookOpen,
  AlertTriangle,
  Search,
} from "lucide-react";

import "../Resources.css";

export default function TroubleshootingGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <Wrench size={16} />
          GUIDE
        </div>

        <h1>Troubleshooting Guide</h1>

        <p>
          Learn how to resolve the most common issues you may
          encounter while using MagicReel, from uploads and AI
          generation to publishing and account management.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Before You Begin</h2>

          <p>
            Many issues can be resolved by checking your inputs,
            internet connection and account status before trying
            the operation again.
          </p>

          <ul className="welcome-list">

            <li>Ensure your internet connection is stable.</li>

            <li>Verify that uploaded images meet the recommended quality guidelines.</li>

            <li>Confirm you have sufficient credits available.</li>

            <li>Review any error messages shown during generation.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          COMMON TROUBLESHOOTING WORKFLOW
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Troubleshooting Workflow</h2>

          <p>
            Follow these simple steps before retrying an operation.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Identify the Problem</h3>

            <p>
              Read the error message carefully and determine
              whether the issue relates to uploads, generation,
              publishing or your account.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Review Requirements</h3>

            <p>
              Confirm that images, settings and account
              prerequisites meet the requirements for the
              selected feature.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Try Again</h3>

            <p>
              Correct the identified issue and retry the
              operation. Most temporary problems are resolved
              after fixing the underlying cause.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          COMMON ISSUES
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Common Issues and Solutions</h2>

          <p>
            Most problems can be resolved quickly by checking the
            inputs, account status and feature requirements.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <AlertTriangle size={26} />

            <h3>Upload Problems</h3>

            <p>
              Ensure your garment and model images are clear,
              supported by MagicReel and fully uploaded before
              starting AI generation.
            </p>

          </div>

          <div className="learn-card">

            <Search size={26} />

            <h3>Generation Doesn't Start</h3>

            <p>
              Verify that all required inputs are present and
              your account has enough available credits before
              generating AI content.
            </p>

          </div>

          <div className="learn-card">

            <Wrench size={26} />

            <h3>Publishing Issues</h3>

            <p>
              Confirm your social media account is connected,
              the generated asset is approved and the selected
              platform is available.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          QUICK CHECKLIST
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Quick Troubleshooting Checklist</h2>

          <ul className="welcome-list">

            <li>Check your internet connection.</li>

            <li>Verify image quality and supported file formats.</li>

            <li>Ensure all required fields are completed.</li>

            <li>Confirm you have sufficient credits.</li>

            <li>Refresh the page and retry if a temporary error occurs.</li>

            <li>Reconnect your social account if publishing fails.</li>

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
            Browse frequently asked questions to better
            understand MagicReel features, workflows and best
            practices.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/faq"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: Frequently Asked Questions</h3>

            <p>
              Find answers to common questions about AI Hero,
              Lookbooks, AI Reels, publishing, credits and
              account management.
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
            Most MagicReel issues can be resolved by verifying
            your inputs, checking image quality, confirming your
            available credits and ensuring all required accounts
            are properly connected. Following the recommended
            workflow helps you resolve problems quickly and keep
            your AI content creation running smoothly.
          </p>

        </div>

      </section>

    </div>
  );
}