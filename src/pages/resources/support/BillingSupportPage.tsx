import { Link } from "react-router-dom";
import {
  CreditCard,
  ArrowRight,
  RotateCcw,
  ShieldCheck,
  Mail,
  BookOpen,
} from "lucide-react";

import "../Resources.css";

export default function BillingSupportPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <CreditCard size={16} />
            Billing & Account
          </div>

          <h1>Billing & Account Help</h1>

          <p>
            Find answers to common questions about subscriptions, AI credits,
            invoices, account management, and payments. If you need additional
            assistance, our support team is here to help.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Account & Billing Support</h2>

          <p>
            Most billing questions can be resolved quickly by reviewing your
            subscription details, available credits, invoices, or our Refund
            Policy. This page summarizes the most common account-related topics.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Common Billing Topics</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Subscriptions</h3>

            <p>
              Manage your subscription plan, renewals, upgrades, downgrades,
              and cancellations from your MagicReel account.
            </p>
          </div>

          <div className="welcome-card">
            <h3>AI Credits</h3>

            <p>
              AI credits are consumed when eligible generation services are
              used. Your remaining balance is displayed within your workspace.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Invoices</h3>

            <p>
              Download invoices, review payment history, and verify billing
              information associated with your account.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Account Management</h2>

        <div className="welcome-card">
          <p>
            You can update your account information, business profile, password,
            and other account settings from within your MagicReel workspace.
            Keeping your account information up to date helps us provide a
            better support experience.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Payment Issues</h2>

        <div className="welcome-card">
          <p>
            If you believe a payment failed, was duplicated, or appears
            incorrect, please contact support with your account email,
            transaction details, and any relevant screenshots so we can
            investigate promptly.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Refund Requests</h2>

        <div className="welcome-card">
          <p>
            Refund eligibility is governed by our Refund Policy. Requests are
            reviewed individually based on the nature of the transaction,
            applicable laws, and the circumstances surrounding the request.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Resources</h2>

        <div className="next-guide-grid">
          <Link to="/policies/refund" className="guide-card">
            <RotateCcw size={20} />
            <div>
              <h3>Refund Policy</h3>
              <p>Learn about refund eligibility and billing policies.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies" className="guide-card">
            <ShieldCheck size={20} />
            <div>
              <h3>Policies Center</h3>
              <p>Terms, privacy, billing, and legal information.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/contact" className="guide-card">
            <Mail size={20} />
            <div>
              <h3>Contact Support</h3>
              <p>Need help with your account or billing?</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/docs/credits" className="guide-card">
            <BookOpen size={20} />
            <div>
              <h3>Credits Guide</h3>
              <p>Understand how AI credits are used across MagicReel.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}