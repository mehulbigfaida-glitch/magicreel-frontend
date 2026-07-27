import { Link } from "react-router-dom";
import {
  RotateCcw,
  ArrowRight,
  FileText,
  Lock,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function RefundPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <RotateCcw size={16} />
            Billing & Refunds
          </div>

          <h1>Refund Policy</h1>

          <p>
            This Refund Policy explains how MagicReel handles subscriptions,
            AI credits, billing disputes, cancellations, and refund requests.
            Our goal is to provide transparent and fair billing practices for
            every customer.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            Please review this policy before purchasing a subscription or AI
            credits. By completing a purchase, you acknowledge and accept the
            refund terms described below.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. Subscription Plans</h2>

        <div className="welcome-card">
          <p>
            MagicReel offers subscription plans that provide access to platform
            features and AI credits. Subscription details, pricing, and renewal
            terms are displayed during checkout.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. AI Credits</h2>

        <div className="welcome-card">
          <p>
            AI credits are consumed when eligible AI services are used, such as
            image generation, lookbooks, reels, or other supported features.
            Once credits have been consumed, they cannot be restored or
            refunded.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. Refund Eligibility</h2>

        <div className="welcome-card">
          <p>
            Refund requests may be considered for accidental duplicate charges,
            verified billing errors, or circumstances required by applicable
            law. Refund eligibility is evaluated on a case-by-case basis.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. Non-Refundable Services</h2>

        <div className="welcome-card">
          <p>
            Fees associated with successfully delivered AI services, consumed
            credits, completed content generation, or previously used
            subscription benefits are generally non-refundable unless required
            by applicable law.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Subscription Cancellation</h2>

        <div className="welcome-card">
          <p>
            You may cancel your subscription at any time. Cancellation prevents
            future renewals but does not automatically generate a refund for the
            current billing period unless otherwise required by law.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Billing Issues</h2>

        <div className="welcome-card">
          <p>
            If you believe you have been charged incorrectly, please contact our
            support team as soon as possible with your account details and
            payment information so we can investigate the issue promptly.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>7. Policy Changes</h2>

        <div className="welcome-card">
          <p>
            We may update this Refund Policy periodically to reflect changes in
            our services, payment providers, or legal requirements. The latest
            version will always be available in the Policies Center.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Need Assistance?</h2>

        <div className="welcome-card">
          <p>
            If you have questions regarding billing, subscriptions, or refund
            eligibility, please contact our support team. We'll review your
            request and respond as quickly as possible.
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
              <p>How your information is collected and protected.</p>
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

          <Link to="/policies/ai-content" className="guide-card">
            <Sparkles size={20} />
            <div>
              <h3>AI Content Disclaimer</h3>
              <p>Understand the nature and limitations of AI-generated content.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}