import { Link } from "react-router-dom";
import {
  Cookie,
  ArrowRight,
  FileText,
  Lock,
  BadgeCheck,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function CookiePolicyPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Cookie size={16} />
            Cookies & Tracking
          </div>

          <h1>Cookie Policy</h1>

          <p>
            This Cookie Policy explains how MagicReel uses cookies and similar
            technologies to improve your browsing experience, keep your account
            secure, and understand how our platform is used.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            Cookies help MagicReel remember your preferences, maintain secure
            sessions, improve performance, and provide a more consistent user
            experience. You can manage cookie preferences through your browser
            settings.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. What Are Cookies?</h2>

        <div className="welcome-card">
          <p>
            Cookies are small text files stored on your device by your web
            browser. They help websites recognize returning visitors, remember
            preferences, and improve overall functionality.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. How We Use Cookies</h2>

        <div className="welcome-card">
          <p>
            MagicReel uses cookies to maintain secure login sessions, remember
            user preferences, improve website performance, analyze platform
            usage, and support essential features of the application.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. Types of Cookies</h2>

        <div className="welcome-card">
          <p>
            We may use essential cookies required for platform operation,
            performance cookies that help us improve reliability, functional
            cookies that remember preferences, and analytics cookies that help
            us understand how users interact with MagicReel.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. Third-Party Services</h2>

        <div className="welcome-card">
          <p>
            Some trusted third-party providers may place cookies or similar
            technologies when delivering services such as authentication,
            payment processing, analytics, cloud hosting, or AI-powered
            features.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Managing Cookies</h2>

        <div className="welcome-card">
          <p>
            Most web browsers allow you to control or delete cookies through
            their settings. Disabling certain cookies may affect the
            functionality or performance of some MagicReel features.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Policy Updates</h2>

        <div className="welcome-card">
          <p>
            We may update this Cookie Policy from time to time to reflect
            changes in technology, legal requirements, or platform services.
            The latest version will always be available in the Policies Center.
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
              <p>Learn how your information is collected and protected.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/terms" className="guide-card">
            <FileText size={20} />
            <div>
              <h3>Terms of Service</h3>
              <p>Your agreement for using MagicReel.</p>
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
              <p>Important guidance about AI-generated content.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}