import { Link } from "react-router-dom";
import {
  Coins,
  BookOpen,
  Wallet,
  Zap,
} from "lucide-react";

import "../Resources.css";

export default function CreditsGuidePage() {
  return (
    <div className="resources-page">

      {/* ======================================================
          HERO
      ======================================================= */}

      <section className="resource-hero">

        <div className="resource-badge">
          <Coins size={16} />
          GUIDE
        </div>

        <h1>Credits Guide</h1>

        <p>
          Learn how MagicReel credits work, when they are
          consumed and how to make the most of your available
          balance while creating AI fashion content.
        </p>

      </section>

      {/* ======================================================
          INTRODUCTION
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Understanding Credits</h2>

          <p>
            Credits are used whenever MagicReel performs AI
            generation. Different features consume different
            numbers of credits depending on the type of content
            being created.
          </p>

          <ul className="welcome-list">

            <li>Credits are deducted only when generation begins.</li>

            <li>Each AI feature has its own credit cost.</li>

            <li>Available credits are shown in your workspace.</li>

            <li>Upgrade your subscription for additional credits.</li>

          </ul>

        </div>

      </section>

      {/* ======================================================
          CREDIT WORKFLOW
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>How Credits Are Used</h2>

          <p>
            Every AI generation follows the same basic credit
            workflow.
          </p>

        </div>

        <div className="quick-start-grid">

          <div className="guide-card">

            <div className="step-number">1</div>

            <h3>Select a Feature</h3>

            <p>
              Choose the MagicReel feature you want to use,
              such as AI Hero, Lookbook or AI Reels.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">2</div>

            <h3>Credits Are Checked</h3>

            <p>
              MagicReel verifies that your account has enough
              credits before starting AI generation.
            </p>

          </div>

          <div className="guide-card">

            <div className="step-number">3</div>

            <h3>Generation Starts</h3>

            <p>
              Once generation begins, the required credits are
              deducted and processing starts automatically.
            </p>

          </div>

        </div>

      </section>

            {/* ======================================================
          CREDIT MANAGEMENT
      ======================================================= */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Managing Your Credits</h2>

          <p>
            Planning your AI generations helps you use your
            available credits efficiently while producing
            high-quality fashion content.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">

            <Wallet size={26} />

            <h3>Monitor Your Balance</h3>

            <p>
              Keep an eye on your available credits before
              starting large batches of AI generation to avoid
              interruptions.
            </p>

          </div>

          <div className="learn-card">

            <Zap size={26} />

            <h3>Generate Only Final Assets</h3>

            <p>
              Review garment images and settings before starting
              generation so credits are used on assets you intend
              to keep.
            </p>

          </div>

          <div className="learn-card">

            <Coins size={26} />

            <h3>Choose the Right Feature</h3>

            <p>
              Different MagicReel features consume different
              numbers of credits. Select the workflow that best
              fits your content requirements.
            </p>

          </div>

        </div>

      </section>

      {/* ======================================================
          COMMON QUESTIONS
      ======================================================= */}

      <section className="resource-section">

        <div className="welcome-card">

          <h2>Common Credit Questions</h2>

          <ul className="welcome-list">

            <li>Check your available balance before starting AI generation.</li>

            <li>Review your inputs carefully to minimise unnecessary regenerations.</li>

            <li>Understand the credit requirements of each feature before use.</li>

            <li>Upgrade your subscription if your workflow requires additional credits.</li>

            <li>Track your usage regularly when generating content in bulk.</li>

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
            If you experience problems during generation or
            publishing, the Troubleshooting Guide can help you
            resolve common issues quickly.
          </p>

        </div>

        <div className="next-guide-grid">

          <Link
            to="/docs/troubleshooting"
            className="guide-card"
          >

            <BookOpen size={24} />

            <h3>Next: Troubleshooting Guide</h3>

            <p>
              Learn how to diagnose and resolve common upload,
              generation and publishing issues in MagicReel.
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
            Credits power every AI generation in MagicReel. By
            understanding how credits are consumed, reviewing
            your inputs before generating and choosing the right
            feature for each task, you can maximise the value of
            your subscription while creating professional AI
            fashion content efficiently.
          </p>

        </div>

      </section>

    </div>
  );
}