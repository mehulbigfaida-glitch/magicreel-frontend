import { Link } from "react-router-dom";
import {
  Bug,
  ArrowRight,
  Mail,
  BookOpen,
 Lightbulb,
  Wand2,
} from "lucide-react";

import "../Resources.css";

export default function ReportBugPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Bug size={16} />
            Report a Bug
          </div>

          <h1>Help Us Improve MagicReel</h1>

          <p>
            If you've discovered a bug or unexpected behavior, we'd love to hear
            about it. Detailed bug reports help our engineering team reproduce,
            investigate, and resolve issues much faster.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Before Reporting</h2>

          <p>
            Please confirm that the issue still occurs after refreshing the page
            and checking the relevant Documentation or Troubleshooting Guide.
            Some issues may be caused by temporary network conditions or browser
            extensions.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Information to Include</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Describe the Issue</h3>

            <p>
              Explain what happened, what you expected to happen, and whether
              the issue occurs every time or only occasionally.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Reproduction Steps</h3>

            <p>
              List the exact steps needed to reproduce the problem so our team
              can investigate under the same conditions.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Screenshots</h3>

            <p>
              Include screenshots or screen recordings whenever possible,
              especially if error messages or visual issues are involved.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Helpful Technical Details</h2>

        <div className="welcome-card">
          <p>
            Including technical information helps us resolve issues more
            efficiently. Consider providing:
          </p>

          <ul>
            <li>Your MagicReel account email.</li>
            <li>Browser name and version.</li>
            <li>Operating system.</li>
            <li>Device type (desktop, tablet, or mobile).</li>
            <li>Any error messages shown.</li>
            <li>The approximate time the issue occurred.</li>
          </ul>
        </div>
      </section>

      <section className="resource-section">
        <h2>After You Submit</h2>

        <div className="welcome-card">
          <p>
            Once your report is received, our team may request additional
            information if needed. Confirmed issues are prioritized based on
            severity, impact, and reproducibility.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Related Resources</h2>

        <div className="next-guide-grid">
          <Link to="/support/contact" className="guide-card">
            <Mail size={20} />
            <div>
              <h3>Contact Support</h3>
              <p>Need direct assistance from our support team?</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/docs/troubleshooting" className="guide-card">
            <BookOpen size={20} />
            <div>
              <h3>Troubleshooting Guide</h3>
              <p>Resolve common platform issues before reporting.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/feature-request" className="guide-card">
            <Lightbulb size={20} />
            <div>
              <h3>Feature Requests</h3>
              <p>Suggest improvements and new capabilities.</p>
            </div>
            <ArrowRight size={18} />
          </Link>

          <Link to="/support/ai-help" className="guide-card">
            <Wand2 size={20} />
            <div>
              <h3>AI Generation Help</h3>
              <p>Guidance for Hero, Lookbook, and AI Reel generation.</p>
            </div>
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}