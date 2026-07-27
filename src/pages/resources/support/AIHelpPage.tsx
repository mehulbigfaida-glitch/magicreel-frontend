import { Link } from "react-router-dom";
import {
  Wand2,
  ArrowRight,
  Sparkles,
  Image,
  Film,
  BookOpen,
  Mail,
} from "lucide-react";

import "../Resources.css";

export default function AIHelpPage() {
  return (
    <div className="resources-page">
      <section className="resource-hero">
        <div className="resource-hero-content">
          <div className="resource-badge">
            <Wand2 size={16} />
            AI Generation Help
          </div>

          <h1>AI Generation Help</h1>

          <p>
            Get the best results from MagicReel's AI-powered fashion creation
            tools. This guide provides practical recommendations for Hero
            generation, Lookbooks, AI Reels, and image quality to help you
            create professional content consistently.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <div className="welcome-card">
          <h2>Getting the Best Results</h2>

          <p>
            AI-generated content is influenced by the quality of the images you
            provide. Using clear, well-lit source images with properly visible
            garments will generally produce the most accurate and realistic
            outputs.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>AI Creation Tips</h2>

        <div className="quick-start-grid">
          <div className="welcome-card">
            <h3>Hero Generation</h3>

            <p>
              Upload clean front and back garment images whenever possible.
              Ensure the garment is fully visible and free from heavy wrinkles,
              shadows, or obstructions.
            </p>
          </div>

          <div className="welcome-card">
            <h3>Lookbook Generation</h3>

            <p>
              Begin with a high-quality Hero image. Better Hero images generally
              produce stronger editorial poses and more consistent fashion
              campaigns.
            </p>
          </div>

          <div className="welcome-card">
            <h3>AI Reels</h3>

            <p>
              Use high-resolution generated assets for smoother animations and
              more visually consistent video results.
            </p>
          </div>
        </div>
      </section>

      <section className="resource-section">
        <h2>Image Quality Recommendations</h2>

        <div className="welcome-card">
          <ul>
            <li>Use sharp, high-resolution images.</li>
            <li>Avoid blurry or heavily compressed uploads.</li>
            <li>Ensure garments are completely visible.</li>
            <li>Use even lighting with minimal shadows.</li>
            <li>Avoid cluttered or distracting backgrounds.</li>
            <li>Replace low-quality source images whenever possible.</li>
          </ul>
        </div>
      </section>

      <section className="resource-section">
        <h2>If Something Doesn't Look Right</h2>

        <div className="welcome-card">
          <p>
            If an AI result is different from what you expected, review your
            source images first. Many quality issues can be improved by using
            cleaner garment photos or higher-resolution inputs. If problems
            continue after multiple attempts, please contact our support team
            with screenshots and details of the generation.
          </p>
        </div>
      </section>

      <section className="resource-section">
        <h2>Helpful Resources</h2>

        <div className="learning-grid">
          <Link to="/docs/ai-hero" className="guide-card">
            <div className="guide-icon">
              <Sparkles size={22} />
            </div>

            <div className="guide-content">
              <h3>AI Hero Guide</h3>
              <p>Learn how to generate high-quality AI fashion models.</p>
            </div>

            <ArrowRight size={18} />
          </Link>

          <Link to="/docs/lookbook" className="guide-card">
            <div className="guide-icon">
              <Image size={22} />
            </div>

            <div className="guide-content">
              <h3>Lookbook Guide</h3>
              <p>Create editorial-quality fashion campaigns.</p>
            </div>

            <ArrowRight size={18} />
          </Link>

          <Link to="/docs/reels" className="guide-card">
            <div className="guide-icon">
              <Film size={22} />
            </div>

            <div className="guide-content">
              <h3>AI Reels Guide</h3>
              <p>Create engaging AI-powered fashion videos.</p>
            </div>

            <ArrowRight size={18} />
          </Link>

          <Link to="/docs/image-quality" className="guide-card">
            <div className="guide-icon">
              <BookOpen size={22} />
            </div>

            <div className="guide-content">
              <h3>Image Quality Guide</h3>
              <p>Improve AI results with better source images.</p>
            </div>

            <ArrowRight size={18} />
          </Link>

          <Link to="/support/contact" className="guide-card">
            <div className="guide-icon">
              <Mail size={22} />
            </div>

            <div className="guide-content">
              <h3>Contact Support</h3>
              <p>Need additional help? Our support team is ready to assist.</p>
            </div>

            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}