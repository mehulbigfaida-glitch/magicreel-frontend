import { Link } from "react-router-dom";
import {
  ShieldCheck,
  FileText,
  Lock,
  BadgeCheck,
  RotateCcw,
  Sparkles,
  Cookie,
  ArrowRight,
} from "lucide-react";

import "../Resources.css";

const policies = [
  {
    title: "Terms of Service",
    description: "Rules, responsibilities, and platform usage terms.",
    icon: FileText,
    to: "/policies/terms",
  },
  {
    title: "Privacy Policy",
    description: "Learn how MagicReel collects and protects your data.",
    icon: Lock,
    to: "/policies/privacy",
  },
  {
    title: "Acceptable Use Policy",
    description: "Guidelines for responsible use of AI-generated content.",
    icon: BadgeCheck,
    to: "/policies/acceptable-use",
  },
  {
    title: "Refund Policy",
    description: "Understand subscription, billing, and refund eligibility.",
    icon: RotateCcw,
    to: "/policies/refund",
  },
  {
    title: "AI Content Disclaimer",
    description: "Important information about AI-generated images and videos.",
    icon: Sparkles,
    to: "/policies/ai-content",
  },
  {
    title: "Cookie Policy",
    description: "How cookies improve your experience on MagicReel.",
    icon: Cookie,
    to: "/policies/cookies",
  },
];

export default function PoliciesPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <ShieldCheck size={16} />
            Legal & Compliance
          </div>

          <h1>Policies Center</h1>

          <p>
            Review the legal policies, privacy commitments, responsible AI
            practices, and platform guidelines that govern the use of
            MagicReel.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Everything You Need in One Place</h2>

          <p>
            Transparency is important to us. These policies explain how
            MagicReel protects your information, manages subscriptions,
            governs AI-generated content, and ensures a safe experience for
            every creator.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Browse Policies</h2>

        <div className="learning-grid">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <Link
                key={policy.title}
                to={policy.to}
                className="guide-card"
              >
                <div className="guide-icon">
                  <Icon size={22} />
                </div>

                <div className="guide-content">
                  <h3>{policy.title}</h3>
                  <p>{policy.description}</p>
                </div>

                <ArrowRight size={18} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="resource-section">
        <h2>Policy Highlights</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Privacy First</h3>
            <p>
              We collect only the information necessary to operate the
              platform, secure your account, and improve your experience.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Responsible AI</h3>
            <p>
              AI-generated content should always be used responsibly and in
              compliance with applicable laws and intellectual property rights.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Transparent Billing</h3>
            <p>
              Subscription plans, credits, renewals, and refund eligibility
              are clearly explained in our Refund Policy.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Policies</h2>

        <div className="next-guide-grid">
          {policies.map((policy) => (
            <Link
              key={policy.title}
              to={policy.to}
              className="guide-card"
            >
              <h3>{policy.title}</h3>
              <p>{policy.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}