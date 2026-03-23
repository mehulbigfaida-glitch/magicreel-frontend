import { useNavigate } from "react-router-dom";
import "./HomePage.css";

export default function HomePage() {
  const navigate = useNavigate();

  /* AUTH GATE */

  const handleStartCreating = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/create-v2");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="mr-home">

      {/* HERO SECTION */}

      <section className="mr-home-hero">

        <div className="mr-home-hero-left">

          <h1 className="mr-home-title">
            Your AI fashion studio
          </h1>

          <p className="mr-home-subtitle">
            Generate lookbooks, reels, and campaign visuals
            from a single garment image.
          </p>

          <button
            className="mr-home-cta"
            onClick={handleStartCreating}
          >
            Start Creating
          </button>

          <div className="mr-home-free-credits">
            🎁 Start with 3 free generations
          </div>

          <div className="mr-home-beta">
            Private beta • Access via invite-only login
          </div>

        </div>

        {/* HERO DEMO PREVIEW */}

        <div className="mr-home-hero-right">

          <div className="mr-home-preview-box">

            <img
              src="/magicreel-demo.png"
              alt="MagicReel AI fashion generation pipeline"
              className="mr-home-demo-image"
            />

            <div className="mr-home-demo-overlay">

              <div className="mr-demo-spinner"></div>

              <div className="mr-demo-text">
                Generating AI fashion visuals...
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* TRUST STRIP */}

      <section className="mr-home-trust">

        <div className="mr-home-trust-title">
          Built for modern fashion brands
        </div>

        <div className="mr-home-trust-grid">

          <div className="mr-trust-item">
            E-commerce Brands
          </div>

          <div className="mr-trust-item">
            Fashion Designers
          </div>

          <div className="mr-trust-item">
            Clothing Manufacturers
          </div>

          <div className="mr-trust-item">
            Social Media Sellers
          </div>

          <div className="mr-trust-item">
            Shopify Stores
          </div>

        </div>

      </section>

      {/* CONTENT PACKS */}

      <section className="mr-home-packs">

        <h2 className="mr-home-section-title">
          Content Packs
        </h2>

        <div className="mr-home-pack-grid">

          <div className="mr-home-pack-card">

            <h3>E-Commerce Pack</h3>

            <p>
              Hero images <br />
              6-pose lookbooks <br />
              10-second product reels
            </p>

            <button onClick={handleStartCreating}>
              Create
            </button>

          </div>

          <div className="mr-home-pack-card disabled">

            <h3>Cinematic Pack</h3>

            <p>
              Stylized hero shots <br />
              Fashion-film lookbooks <br />
              Cinematic reels
            </p>

            <button disabled>
              Coming Soon
            </button>

          </div>

          <div className="mr-home-pack-card disabled">

            <h3>Campaign Pack</h3>

            <p>
              Marketing visuals <br />
              Social media campaigns <br />
              Seasonal fashion shoots
            </p>

            <button disabled>
              Coming Soon
            </button>

          </div>

        </div>

      </section>

      {/* HOW IT WORKS */}

      <section className="mr-home-how">

        <h2 className="mr-home-section-title">
          How It Works
        </h2>

        <div className="mr-home-how-grid">

          <div className="mr-home-how-step">
            <h3>1. Upload Garment</h3>
            <p>Upload a garment and select Avatar.</p>
          </div>

          <div className="mr-home-how-step">
            <h3>2. Generate Content</h3>
            <p>Create hero images, lookbooks, and reels.</p>
          </div>

          <div className="mr-home-how-step">
            <h3>3. Download & Publish</h3>
            <p>Use assets for ecommerce and marketing.</p>
          </div>

        </div>

      </section>

      {/* EXAMPLE OUTPUTS */}

      <section className="mr-home-examples">

        <h2 className="mr-home-section-title">
          Example Outputs
        </h2>

        <div className="mr-home-example-grid">

          <img src="/example1.png" alt="MagicReel output" />
          <img src="/example2.png" alt="MagicReel output" />
          <img src="/example3.png" alt="MagicReel output" />
          <img src="/example4.png" alt="MagicReel output" />

        </div>

        {/* FINAL CTA */}

        <section className="mr-home-final-cta">

          <h2>
            Ready to create AI fashion content?
          </h2>

          <p>
            Generate lookbooks, reels, and campaign visuals in minutes.
          </p>

          <button
            className="mr-home-cta"
            onClick={handleStartCreating}
          >
            Start Creating
          </button>

        </section>

      </section>

      {/* FOOTER */}

      <footer className="mr-home-footer">

        <div>© 2026 MagicReel</div>

        <div className="mr-footer-links">
          <a href="#">About</a>
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>

      </footer>

    </div>
  );
}