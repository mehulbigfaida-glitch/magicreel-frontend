import { Link } from "react-router-dom";
import {
  LifeBuoy,
  Mail,
  Bug,
  Lightbulb,
  CreditCard,
  Wand2,
  ArrowRight,
} from "lucide-react";

import "../Resources.css";

const supportTopics = [
  {
    title: "Contact Support",
    description: "Get help from the MagicReel support team.",
    icon: Mail,
    to: "/support/contact",
  },
  {
    title: "Report a Bug",
    description: "Found an issue? Help us improve MagicReel.",
    icon: Bug,
    to: "/support/report-bug",
  },
  {
    title: "Feature Requests",
    description: "Share ideas and suggest new capabilities.",
    icon: Lightbulb,
    to: "/support/feature-request",
  },
  {
    title: "Billing & Account Help",
    description: "Questions about subscriptions, credits, or invoices.",
    icon: CreditCard,
    to: "/support/billing",
  },
  {
    title: "AI Generation Help",
    description: "Troubleshoot Hero, Lookbook and AI Reel generation.",
    icon: Wand2,
    to: "/support/ai-help",
  },
];

export default function SupportPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <LifeBuoy size={16} />
            Help & Support
          </div>

          <h1>Support Center</h1>

          <p>
            Need assistance? Whether you have questions about AI generation,
            billing, your account, or you'd like to report a bug, we're here to
            help you get the most out of MagicReel.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>How Can We Help?</h2>

          <p>
            Before contacting support, we recommend exploring our Documentation
            and Policies Centers, where you'll find guides, FAQs,
            troubleshooting steps, and platform policies that answer the most
            common questions.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Support Topics</h2>

        <div className="learning-grid">
          {supportTopics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.title}
                to={topic.to}
                className="guide-card"
              >
                <div className="guide-icon">
                  <Icon size={22} />
                </div>

                <div className="guide-content">
                  <h3>{topic.title}</h3>
                  <p>{topic.description}</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="resource-section">
        <h2>Support Expectations</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Documentation First</h3>

            <p>
              Most questions about AI generation, publishing, credits, and
              workflows are answered in our Documentation Center.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Fast Response</h3>

            <p>
              Our goal is to respond to support requests as quickly as possible.
              Response times may vary depending on request complexity and
              support volume.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Continuous Improvement</h3>

            <p>
              Every bug report and feature request helps us improve MagicReel
              for creators, fashion brands, and businesses.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Quick Links</h2>

        <div className="next-guide-grid">
          <Link to="/docs" className="guide-card">
            <h3>Documentation Center</h3>
            <p>Guides, tutorials, FAQs, and troubleshooting resources.</p>
          </Link>

          <Link to="/policies" className="guide-card">
            <h3>Policies Center</h3>
            <p>Privacy, terms, acceptable use, refunds, and legal information.</p>
          </Link>

          <Link to="/support/contact" className="guide-card">
            <h3>Contact Support</h3>
            <p>Reach the MagicReel support team for additional assistance.</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
