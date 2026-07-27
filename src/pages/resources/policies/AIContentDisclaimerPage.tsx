import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Lock,
  BadgeCheck,
  RotateCcw,
} from "lucide-react";

import "../Resources.css";

export default function AIContentDisclaimerPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Sparkles size={16} />
            AI Transparency
          </div>

          <h1>AI Content Disclaimer</h1>

          <p>
            MagicReel uses artificial intelligence to generate images, videos,
            lookbooks, and other creative assets. AI-generated content is
            intended to assist creators and businesses, but results may vary and
            should always be reviewed before use.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            AI generation is an evolving technology. While MagicReel strives to
            produce high-quality results, outputs may occasionally contain
            inaccuracies, inconsistencies, or unexpected elements. Users remain
            responsible for reviewing generated content before publishing or
            commercial use.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. AI-Generated Outputs</h2>

        <div className="welcome-card">
          <p>
            Images, videos, captions, and other creative assets produced by
            MagicReel are generated using artificial intelligence. Results are
            created algorithmically and may differ between generations, even
            when using similar inputs.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. No Guaranteed Results</h2>

        <div className="welcome-card">
          <p>
            Although we continuously improve our AI models, we cannot guarantee
            that every generated result will perfectly match user expectations,
            accurately represent uploaded content, or be free from visual or
            factual imperfections.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. User Responsibility</h2>

        <div className="welcome-card">
          <p>
            You are responsible for reviewing all AI-generated content before
            publishing, distributing, or using it for commercial purposes.
            Verify accuracy, branding, product representation, and compliance
            with applicable laws and platform policies.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. Intellectual Property</h2>

        <div className="welcome-card">
          <p>
            Users should only upload content that they own or are authorized to
            use. MagicReel does not verify ownership of uploaded materials and
            cannot determine whether generated outputs may resemble existing
            works.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Responsible AI Usage</h2>

        <div className="welcome-card">
          <p>
            MagicReel must not be used to generate deceptive, fraudulent,
            defamatory, harmful, or unlawful content. AI-generated media should
            never be used to impersonate individuals or intentionally mislead
            others.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Continuous Improvement</h2>

        <div className="welcome-card">
          <p>
            Our AI capabilities continue to evolve. Features, generation
            quality, supported models, and creative capabilities may improve or
            change over time as new technologies become available.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>7. Third-Party AI Services</h2>

        <div className="welcome-card">
          <p>
            Certain MagicReel features may utilize trusted third-party AI
            providers to process generation requests. These providers are
            selected to help deliver reliable and high-quality AI experiences.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>8. Disclaimer Updates</h2>

        <div className="welcome-card">
          <p>
            This AI Content Disclaimer may be updated periodically to reflect
            advances in AI technology, regulatory requirements, and changes to
            the MagicReel platform.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Policies</h2>

        <div className="next-guide-grid">
          <Link to="/policies/terms" className="guide-card">
            <FileText size={20} />
            <div>
              <h3>Terms of Service</h3>
              <p>Your agreement for using MagicReel.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/privacy" className="guide-card">
            <Lock size={20} />
            <div>
              <h3>Privacy Policy</h3>
              <p>Learn how your information is collected and protected.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/acceptable-use" className="guide-card">
            <BadgeCheck size={20} />
            <div>
              <h3>Acceptable Use</h3>
              <p>Guidelines for responsible use of the platform.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/refund" className="guide-card">
            <RotateCcw size={20} />
            <div>
              <h3>Refund Policy</h3>
              <p>Understand billing, subscriptions, credits, and refunds.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}