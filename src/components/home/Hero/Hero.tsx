import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import "./Hero.css";
import { useNavigate } from "react-router-dom";

import heroImage from "../../../assets/home/hero.png";
import editorialImage from "../../../assets/home/editorial.png";
import campaignImage from "../../../assets/home/campaign.png";
import lookbookImage from "../../../assets/home/lookbook.png";
import reel360Image from "../../../assets/home/360-reel.png";
import cinematicReelImage from "../../../assets/home/cinematic-reel.png";
import garmentImage from "../../../assets/home/garment.png";

import instagramLogo from "../../../assets/platforms/instagram.svg";
import facebookLogo from "../../../assets/platforms/facebook.svg";
import whatsappLogo from "../../../assets/platforms/whatsapp.svg";
import tiktokLogo from "../../../assets/platforms/tiktok.svg";
import xLogo from "../../../assets/platforms/x.svg";
import linkedinLogo from "../../../assets/platforms/linkedin.svg";
import pinterestLogo from "../../../assets/platforms/pinterest.svg";
import shopifyLogo from "../../../assets/platforms/shopify.svg";
import youtubeLogo from "../../../assets/platforms/youtube.svg";

export default function Hero() {

  const navigate = useNavigate();

  return (
    <section className="hero">

      <div className="hero-container">

        {/* Header */}

        <div className="hero-header">

          <div className="hero-badge">
            ✨ MAGICREEL FASHION INTELLIGENCE ENGINE
          </div>

          <h1 className="hero-title">
            Turn One Garment Into
            <br />
            an Entire Fashion Campaign.
          </h1>

          <p className="hero-description">
            Create AI Heroes, Editorials, Lookbooks, Campaigns,
            Social Packs and 360° Reels from a single garment—
            ready to publish in minutes.
          </p>

          <div className="hero-actions">

            <button
              className="primary-btn"
              onClick={() => navigate("/create-ai-hero")}
            >
              Start Creating
              <ArrowRight size={18} />
            </button>

          </div>

<p className="hero-trust">
    ✨ First creation is free. No credit card required.
</p>

                </div>

        {/* Fashion Intelligence Pipeline */}

        <h2 className="pipeline-title">
  <span>MagicReel</span> in Action

  <div className="pipeline-title-arrow">
    ↓
  </div>
</h2>
        
        <div className="pipeline">

          <div className="pipeline-node garment-node">

  <div className="garment-preview">

    <img
      src={garmentImage}
      alt="Your Garment"
    />

  </div>

  <span>Your Garment</span>

</div>

          <div className="pipeline-arrow">
            ↓
          </div>

          <div className="pipeline-engine">

  <div className="engine-status">
    ● AI Processing
  </div>

  <div className="engine-icon">
    ✨
  </div>

  <h3>
    Fashion Intelligence Engine
  </h3>

  <p>
    Creating Hero, Editorial, Campaign,
    Lookbook, Social Pack and 360° Reel
    simultaneously.
  </p>

</div>

          <div className="pipeline-arrow">
  ↓
</div>

<div className="pipeline-grid">

  {[
  {
    title: "AI Hero",
    image: heroImage,
    badge: "LIVE",
  },
  {
    title: "Editorial",
    image: editorialImage,
    badge: "LIVE",
  },
  {
    title: "Campaign Pack",
    image: campaignImage,
    badge: "LIVE",
  },
  {
    title: "Lookbook",
    image: lookbookImage,
    badge: "LIVE",
  },
  {
    title: "360° Reel",
    image: reel360Image,
    badge: "LIVE",
  },
  {
    title: "Cinematic Reel",
    image: cinematicReelImage,
    badge: "COMING SOON",
  },
].map((item) => (

    <div
      key={item.title}
      className="pipeline-card"
    >

      <div className="card-preview">

  <img
    src={item.image}
    alt={item.title}
  />

  <div className="preview-overlay">

    <div
      className={`preview-badge ${
        item.badge === "COMING SOON"
          ? "coming-soon"
          : ""
      }`}
    >
      {item.badge}
    </div>

  </div>

</div>

      <span>{item.title}</span>

    </div>

  ))}

</div>

<div className="pipeline-arrow">
  ↓
</div>

<div className="publish-node">

  <div className="publish-heading">
    🚀 Auto-Publish Everywhere
  </div>

  <div className="publish-platforms">

    <div className="platform-chip live">
      <img src={instagramLogo} alt="Instagram" />
      <span className="live-badge">LIVE</span>
    </div>

    <div className="platform-chip">
      <img src={facebookLogo} alt="Facebook" />
    </div>

    <div className="platform-chip">
      <img src={whatsappLogo} alt="WhatsApp" />
    </div>

    <div className="platform-chip">
      <img src={tiktokLogo} alt="TikTok" />
    </div>

    <div className="platform-chip">
      <img src={linkedinLogo} alt="LinkedIn" />
    </div>

    <div className="platform-chip">
      <img src={pinterestLogo} alt="Pinterest" />
    </div>

    <div className="platform-chip">
      <img src={xLogo} alt="X" />
    </div>

    <div className="platform-chip">
      <img src={shopifyLogo} alt="Shopify" />
    </div>

    <div className="platform-chip">
      <img src={youtubeLogo} alt="YouTube" />
    </div>

  </div>

</div>

</div>

{/* =====================================
    Closing CTA
===================================== */}

<div className="closing-cta">

  <div className="closing-badge">
  <Sparkles size={16} />
  AI Fashion Intelligence Engine
</div>

<h2>
  Turn One Garment Into
  <br />
  <span>an Entire Fashion Campaign.</span>
</h2>

<p>
  Create AI Heroes, Editorials, Lookbooks, Campaigns,
  Social Packs and 360° Reels from a single garment—
  ready to publish in minutes.
</p>

  <a
    href="/create-ai-hero"
    className="closing-button"
  >
    Start Creating Free
    <ArrowRight size={18} />
  </a>

  <div className="closing-features">

    <div>
      <CheckCircle2 size={18} />
      1 Welcome Credit
    </div>

    <div>
      <CheckCircle2 size={18} />
      No Credit Card Required
    </div>

    <div>
      <CheckCircle2 size={18} />
      Commercial Use
    </div>

  </div>

</div>

      </div>

    </section>
  );
}