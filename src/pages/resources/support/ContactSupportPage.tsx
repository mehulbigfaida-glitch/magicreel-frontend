import { Link } from "react-router-dom";
import {
  Mail,
  ArrowRight,
  BookOpen,
  ShieldCheck,
  Bug,
  CreditCard,
} from "lucide-react";

import "../Resources.css";

export default function ContactSupportPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Mail size={16} />
            Contact Support
          </div>

          <h1>We're Here to Help</h1>

          <p>
            If you can't find the answer in our documentation, our support team
            is ready to help. Providing complete information with your request
            helps us resolve issues more quickly.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Before Contacting Support</h2>

          <p>
            We recommend checking the Documentation Center and Troubleshooting
            Guide first. Many common questions about AI generation, credits,
            publishing, and workflows can be resolved immediately without
            waiting for support.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>When to Contact Us</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Account Issues</h3>
            <p>
              Login problems, account access, verification, or workspace
              questions.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Billing Questions</h3>
            <p>
              Subscription plans, invoices, payments, credits, or refund
              enquiries.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Technical Problems</h3>
            <p>
              Errors, failed AI generations, upload issues, unexpected
              behaviour, or platform bugs.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Include These Details</h2>

        <div className="welcome-card">
          <p>
            To help us investigate your request efficiently, please include:
          </p>

          <ul>
            <li>Your MagicReel account email.</li>
            <li>A clear description of the issue.</li>
            <li>The steps that led to the problem.</li>
            <li>Screenshots or screen recordings, if available.</li>
            <li>Any error messages displayed.</li>
            <li>The browser and device you were using.</li>
          </ul>
        </div>
      </section>

      <section className="resource-section">
        <h2>Response Expectations</h2>

        <div className="welcome-card">
          <p>
            We aim to respond to all support requests as quickly as possible.
            Response times may vary depending on request complexity, business
            hours, and overall support volume. Urgent service-impacting issues
            are prioritized whenever possible.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Helpful Resources</h2>

        <div className="next-guide-grid">
          <Link to="/docs" className="guide-card">
            <BookOpen size={20} />
            <div>
              <h3>Documentation</h3>
              <p>Guides, tutorials, FAQs, and troubleshooting resources.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies" className="guide-card">
            <ShieldCheck size={20} />
            <div>
              <h3>Policies Center</h3>
              <p>Privacy, terms, refunds, and legal information.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/report-bug" className="guide-card">
            <Bug size={20} />
            <div>
              <h3>Report a Bug</h3>
              <p>Help us investigate technical issues.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/billing" className="guide-card">
            <CreditCard size={20} />
            <div>
              <h3>Billing Help</h3>
              <p>Support for subscriptions, invoices, and credits.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
