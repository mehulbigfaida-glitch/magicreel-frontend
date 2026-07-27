import { Link } from "react-router-dom";
import {
  BadgeCheck,
  ArrowRight,
  FileText,
  Lock,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function AcceptableUsePage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <BadgeCheck size={16} />
            Responsible Platform Usage
          </div>

          <h1>Acceptable Use Policy</h1>

          <p>
            This policy explains the standards for responsible use of
            MagicReel. It helps protect creators, businesses, intellectual
            property, and the broader community while using AI-powered fashion
            tools.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            By using MagicReel, you agree to use the platform lawfully,
            ethically, and responsibly. Content that violates this policy may be
            removed, and accounts may be restricted or suspended.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. Lawful Use</h2>

        <div className="welcome-card">
          <p>
            MagicReel may only be used for lawful purposes. Users must comply
            with applicable laws, regulations, and intellectual property rights
            in their jurisdiction.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. Respect Intellectual Property</h2>

        <div className="welcome-card">
          <p>
            Upload only content that you own or have permission to use. Do not
            upload copyrighted, trademarked, or proprietary material without
            authorization.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. Prohibited Content</h2>

        <div className="welcome-card">
          <p>
            You must not use MagicReel to create or distribute illegal,
            fraudulent, deceptive, defamatory, hateful, violent, sexually
            explicit, or otherwise harmful content.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. AI-Generated Media</h2>

        <div className="welcome-card">
          <p>
            Users are responsible for reviewing AI-generated images and videos
            before publishing or sharing them. Generated content should not be
            used to mislead, impersonate individuals, or spread misinformation.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Platform Integrity</h2>

        <div className="welcome-card">
          <p>
            Do not attempt to interfere with platform security, reverse engineer
            the service, bypass usage limits, automate abuse, or disrupt normal
            platform operations.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Account Responsibility</h2>

        <div className="welcome-card">
          <p>
            You are responsible for all activity performed using your account.
            Keep your login credentials secure and notify us promptly of any
            unauthorized access.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>7. Enforcement</h2>

        <div className="welcome-card">
          <p>
            MagicReel may investigate violations of this policy and take
            appropriate action, including removing content, limiting features,
            suspending accounts, or terminating access where necessary.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>8. Policy Updates</h2>

        <div className="welcome-card">
          <p>
            This Acceptable Use Policy may be updated from time to time to
            reflect changes in technology, legal requirements, or platform
            capabilities. Continued use of MagicReel constitutes acceptance of
            the latest version.
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

          <Link to="/policies/refund" className="guide-card">
            <RotateCcw size={20} />
            <div>
              <h3>Refund Policy</h3>
              <p>Understand billing, subscriptions, and refund eligibility.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/ai-content" className="guide-card">
            <Sparkles size={20} />
            <div>
              <h3>AI Content Disclaimer</h3>
              <p>Important guidance about AI-generated content.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}