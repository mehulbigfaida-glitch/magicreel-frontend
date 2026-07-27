import { Link } from "react-router-dom";
import {
  Lightbulb,
  ArrowRight,
  Wand2,
  Bug,
  Mail,
  BookOpen,
} from "lucide-react";

import "../Resources.css";

export default function FeatureRequestPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Lightbulb size={16} />
            Feature Requests
          </div>

          <h1>Help Shape MagicReel</h1>

          <p>
            Your ideas help us build a better platform. We welcome suggestions
            that improve workflows, simplify content creation, and make
            MagicReel more valuable for creators, brands, and businesses.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>We Value Your Feedback</h2>

          <p>
            Many improvements begin as customer suggestions. While we cannot
            implement every request, every idea is reviewed and considered as
            part of our product planning process.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>What Makes a Great Feature Request?</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Describe the Problem</h3>

            <p>
              Tell us what challenge you're trying to solve rather than only the
              feature you would like to see.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Explain the Benefit</h3>

            <p>
              Help us understand how the feature would improve your workflow,
              save time, or create additional value.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Provide Examples</h3>

            <p>
              Examples, mockups, or references help our product team understand
              your vision more clearly.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>How We Evaluate Requests</h2>

        <div className="welcome-card">
          <p>
            Feature requests are evaluated based on customer value, platform
            strategy, technical feasibility, security, performance, and overall
            impact. Popular requests that benefit a broad range of users are
            generally prioritized.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Roadmap Expectations</h2>

        <div className="welcome-card">
          <p>
            Submitting a feature request does not guarantee implementation or a
            specific delivery timeline. Some ideas may be scheduled for future
            releases, while others may influence improvements to existing
            features.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Resources</h2>

        <div className="next-guide-grid">
          <Link to="/support/contact" className="guide-card">
            <Mail size={20} />
            <div>
              <h3>Contact Support</h3>
              <p>Share your ideas or discuss your workflow with our team.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/report-bug" className="guide-card">
            <Bug size={20} />
            <div>
              <h3>Report a Bug</h3>
              <p>Found an issue? Help us improve platform stability.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/ai-help" className="guide-card">
            <Wand2 size={20} />
            <div>
              <h3>AI Generation Help</h3>
              <p>Learn how to achieve better AI generation results.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/docs" className="guide-card">
            <BookOpen size={20} />
            <div>
              <h3>Documentation</h3>
              <p>Explore guides, tutorials, FAQs, and best practices.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}