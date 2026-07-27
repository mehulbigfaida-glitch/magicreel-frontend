import { Link } from "react-router-dom";
import {
  Lock,
  ArrowRight,
  FileText,
  BadgeCheck,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import "../Resources.css";

export default function PrivacyPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Lock size={16} />
            Privacy & Security
          </div>

          <h1>Privacy Policy</h1>

          <p>
            Your privacy matters to us. This Privacy Policy explains what
            information MagicReel collects, how it is used, how it is protected,
            and the choices you have regarding your personal data.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Summary</h2>

          <p>
            MagicReel is committed to protecting your personal information and
            maintaining transparency about how your data is handled while using
            our AI-powered fashion platform.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>1. Information We Collect</h2>

        <div className="welcome-card">
          <p>
            We may collect information you provide directly, including your
            name, email address, account details, uploaded images, generated
            content, billing information, and communications with our support
            team.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>2. How We Use Your Information</h2>

        <div className="welcome-card">
          <p>
            Your information is used to provide MagicReel services, generate AI
            content, process payments, improve platform performance, enhance
            security, communicate service updates, and deliver customer support.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>3. AI Processing</h2>

        <div className="welcome-card">
          <p>
            Images uploaded to MagicReel may be securely processed by trusted AI
            service providers solely for generating requested outputs. We work
            with providers that maintain appropriate security standards.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>4. Data Security</h2>

        <div className="welcome-card">
          <p>
            We implement technical and organizational safeguards designed to
            protect your information against unauthorized access, disclosure,
            alteration, and loss.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>5. Data Sharing</h2>

        <div className="welcome-card">
          <p>
            We do not sell your personal information. Data may be shared only
            with trusted service providers who assist in operating MagicReel,
            processing payments, delivering AI services, or complying with legal
            obligations.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>6. Data Retention</h2>

        <div className="welcome-card">
          <p>
            We retain information only for as long as necessary to provide our
            services, comply with legal obligations, resolve disputes, and
            maintain platform security.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>7. Your Rights</h2>

        <div className="welcome-card">
          <p>
            Depending on your jurisdiction, you may have rights to access,
            update, download, or request deletion of your personal information,
            subject to applicable legal requirements.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>8. Policy Updates</h2>

        <div className="welcome-card">
          <p>
            We may revise this Privacy Policy periodically to reflect changes in
            technology, legal requirements, or our services. Updated versions
            will be published within the Policies Center.
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

          <Link to="/policies/acceptable-use" className="guide-card">
            <BadgeCheck size={20} />
            <div>
              <h3>Acceptable Use</h3>
              <p>Responsible and appropriate platform usage.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/refund" className="guide-card">
            <RotateCcw size={20} />
            <div>
              <h3>Refund Policy</h3>
              <p>Credits, billing, and subscription information.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/policies/ai-content" className="guide-card">
            <Sparkles size={20} />
            <div>
              <h3>AI Content Disclaimer</h3>
              <p>Understand AI-generated outputs and limitations.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}