import { Link } from "react-router-dom";
import {
  FileText,
  ArrowRight,
  Lock,
  BadgeCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function TermsPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <FileText size={16} />
            Legal Agreement
          </div>

          <h1>Terms of Service</h1>

          <p>
            These Terms of Service govern your access to and use of the
            MagicReel platform, including AI image generation, lookbooks,
            publishing tools, and related services.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            By creating an account or using MagicReel, you agree to these
            terms. Please read them carefully before using our services.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. Eligibility</h2>

        <div className="welcome-card">
          <p>
            You must be legally permitted to enter into a binding agreement in
            your jurisdiction and comply with all applicable laws while using
            MagicReel.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. Your Account</h2>

        <div className="welcome-card">
          <p>
            You are responsible for maintaining the confidentiality of your
            account credentials and for all activity that occurs under your
            account.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. Acceptable Use</h2>

        <div className="welcome-card">
          <p>
            You agree not to misuse the platform, interfere with our services,
            violate intellectual property rights, or use MagicReel for unlawful,
            harmful, fraudulent, or abusive activities.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. AI Generated Content</h2>

        <div className="welcome-card">
          <p>
            AI-generated images and videos are created automatically and may
            not always produce perfect or expected results. Users are
            responsible for reviewing generated content before publication.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Intellectual Property</h2>

        <div className="welcome-card">
          <p>
            You retain ownership of the content you upload. MagicReel retains
            ownership of the platform, software, branding, and underlying
            technology.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Payments & Credits</h2>

        <div className="welcome-card">
          <p>
            Paid subscriptions and AI credits are governed by the applicable
            pricing plans and our Refund Policy.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>7. Service Availability</h2>

        <div className="welcome-card">
          <p>
            We continually improve MagicReel and may update, modify, suspend,
            or discontinue features when necessary without prior notice.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>8. Limitation of Liability</h2>

        <div className="welcome-card">
          <p>
            To the maximum extent permitted by law, MagicReel shall not be
            liable for indirect, incidental, consequential, or special damages
            arising from the use of the platform.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>9. Updates to These Terms</h2>

        <div className="welcome-card">
          <p>
            We may revise these Terms of Service periodically. Continued use of
            MagicReel after changes become effective constitutes acceptance of
            the updated terms.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Policies</h2>

        <div className="next-guide-grid">
          <Link to="/policies/privacy" className="guide-card">
            <Lock size={20} />
            <div>
              <h3>Privacy Policy</h3>
              <p>How we collect, store, and protect your data.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/acceptable-use" className="guide-card">
            <BadgeCheck size={20} />
            <div>
              <h3>Acceptable Use</h3>
              <p>Responsible and permitted platform usage.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/refund" className="guide-card">
            <RotateCcw size={20} />
            <div>
              <h3>Refund Policy</h3>
              <p>Billing, subscriptions, credits, and refunds.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/ai-content" className="guide-card">
            <Sparkles size={20} />
            <div>
              <h3>AI Content Disclaimer</h3>
              <p>Understanding AI-generated outputs and limitations.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}