import React, { useState } from "react";
import "../Resources.css";

type QuickStep = {
  step: string;
  title: string;
  description: string;
};

const quickSteps: QuickStep[] = [
  {
    step: "1",
    title: "Create Your Workspace",
    description:
      "Sign up and complete your MagicReel business workspace in just a few minutes."
  },
  {
    step: "2",
    title: "Upload Your Garment",
    description:
      "Upload a high-quality front image of your garment. Add a back image if available."
  },
  {
    step: "3",
    title: "Generate AI Hero",
    description:
      "Create realistic AI fashion model images that showcase your garment professionally."
  },
  {
    step: "4",
    title: "Create Content",
    description:
      "Generate lookbooks, eCommerce packs and AI reels ready for publishing."
  }
];

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "What is MagicReel?",
    answer:
      "MagicReel is an AI Fashion Intelligence Engine that transforms garment images into premium AI fashion models, editorial lookbooks, eCommerce visuals and promotional AI reels."
  },
  {
    question: "Who is MagicReel designed for?",
    answer:
      "MagicReel is built for fashion brands, garment manufacturers, wholesalers, retailers, marketplaces, designers and creative agencies."
  },
  {
    question: "Do I need professional photography experience?",
    answer:
      "No. Simply upload clear garment images and MagicReel guides you through the complete AI creation workflow."
  },
  {
    question: "What can I create with MagicReel?",
    answer:
      "You can create AI Heroes, editorial lookbooks, eCommerce product images, marketing creatives and AI-powered fashion reels."
  },
  {
    question: "How long does AI generation take?",
    answer:
      "Generation time depends on the selected feature. Hero generation usually completes in under a minute while Lookbooks and AI Reels may require additional processing time."
  },
  {
    question: "Can I use generated content commercially?",
    answer:
      "Yes. Content generated from your own products can generally be used for catalogues, websites, social media, advertising and marketing, subject to the MagicReel Terms of Use."
  },
  {
    question: "Which image formats are supported?",
    answer:
      "MagicReel supports standard image formats including JPG, JPEG and PNG. High-resolution images provide the best AI generation quality."
  },
  {
    question: "Do I need front and back garment images?",
    answer:
      "Front images are required for AI Hero generation. Uploading both front and back images enables additional experiences such as 360° fashion reels."
  },
  {
    question: "Will my original garment images be modified?",
    answer:
      "No. Your uploaded images remain unchanged. MagicReel creates new AI-generated assets while preserving your original uploads."
  },
  {
    question: "How do credits work?",
    answer:
      "Each AI generation consumes credits depending on the selected feature. Your remaining balance is displayed in your workspace."
  },
  {
    question: "Can I regenerate results?",
    answer:
      "Yes. You may regenerate outputs whenever you want, although each new generation consumes the applicable credits."
  },
  {
    question: "Where should I go after this guide?",
    answer:
      "Continue with the AI Hero Guide to learn best practices for creating high-quality fashion models before exploring Lookbooks and AI Reels."
  }
];


const GettingStartedPage: React.FC = () => {

const [openIndex, setOpenIndex] = useState<number | null>(0);

const toggleFAQ = (index: number) => {
  setOpenIndex((current) => (current === index ? null : index));
};

    return (
    <div className="resources-page">

      {/* ------------------------------------------------ */}
      {/* HERO */}
      {/* ------------------------------------------------ */}

      <section className="resource-hero">

        <span className="resource-category">
          Help Center
        </span>

        <h1>
          Getting Started
        </h1>

        <p className="resource-intro">
          Welcome to MagicReel — your AI Fashion Intelligence Engine.
          Whether you're a fashion brand, apparel manufacturer,
          retailer, designer or marketing agency, MagicReel helps you
          transform garment images into premium AI fashion content in
          just a few clicks.
        </p>

        <p className="resource-intro">
          This guide walks you through the complete workflow—from
          uploading your first garment to creating AI Heroes,
          Lookbooks and Reels.
        </p>

      </section>

<section className="resource-section">

    <div className="welcome-card">

        <h2>
            Welcome to MagicReel
        </h2>

        <p>
            MagicReel is designed to remove the complexity of traditional fashion photography.
            Upload your garment once and let AI create premium marketing assets within minutes.
        </p>

        <ul className="welcome-list">

            <li>Create AI fashion models</li>

            <li>Generate editorial lookbooks</li>

            <li>Produce AI marketing reels</li>

            <li>Download campaign-ready assets</li>

        </ul>

    </div>

</section>

      {/* ------------------------------------------------ */}
      {/* QUICK START */}
      {/* ------------------------------------------------ */}

      <section className="resource-section">

        <div className="section-header">

          <h2>Quick Start</h2>

          <p>
            New to MagicReel? Follow these four simple steps to create
            your first AI fashion campaign.
          </p>

        </div>

        <div className="quick-start-grid">

          {quickSteps.map((item) => (

            <div
              key={item.step}
              className="quick-card"
            >

              <div className="quick-step">

                {item.step}

              </div>

              <h3>

                {item.title}

              </h3>

              <p>

                {item.description}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/* WHAT YOU'LL LEARN */}
      {/* ------------------------------------------------ */}

      <section className="resource-section">

        <div className="section-header">

          <h2>
            What You'll Learn
          </h2>

          <p>
            This guide introduces the core concepts you'll need before
            exploring the rest of the Help Center.
          </p>

        </div>

        <div className="learning-grid">

          <div className="learn-card">
            <h4>✓ AI Hero Generation</h4>
            <p>
              Learn how to create premium fashion models from your
              garment images.
            </p>
          </div>

          <div className="learn-card">
            <h4>✓ AI Lookbooks</h4>
            <p>
              Generate editorial-quality product showcases with
              multiple poses.
            </p>
          </div>

          <div className="learn-card">
            <h4>✓ AI Reels</h4>
            <p>
              Produce engaging promotional videos suitable for social
              media campaigns.
            </p>
          </div>

          <div className="learn-card">
            <h4>✓ Credits & Workflow</h4>
            <p>
              Understand how credits are used and how to maximize every
              generation.
            </p>
          </div>

        </div>

      </section>

      {/* ------------------------------------------------ */}
      {/* FAQ PLACEHOLDER */}
      {/* ------------------------------------------------ */}

      <section className="resource-section">

        <div className="section-header">

          <h2>
            Frequently Asked Questions
          </h2>

          <p>
            Everything new users should know before creating their
            first AI campaign.
          </p>

        </div>

        <div className="faq-list">

  {faqs.map((faq, index) => {

    const open = openIndex === index;

    return (

      <div
        key={faq.question}
        className={`faq-card ${open ? "open" : ""}`}
      >

        <button
          className="faq-question"
          onClick={() => toggleFAQ(index)}
        >

          <span>

            {faq.question}

          </span>

          <span className="faq-icon">

            {open ? "−" : "+"}

          </span>

        </button>

        {open && (

          <div className="faq-answer">

            <p>

              {faq.answer}

            </p>

          </div>

        )}

      </div>

    );

  })}

</div>

      </section>

      {/* ------------------------------------------------ */}
      {/* NEXT STEPS */}
      {/* ------------------------------------------------ */}

      <section className="resource-section">

    <div className="section-header">

        <h2>
            Need More Help?
        </h2>

        <p>
            Continue learning with our detailed step-by-step guides.
        </p>

    </div>

    <div className="next-guide-grid">

        <div className="guide-card">

            <span className="guide-icon">
                👤
            </span>

            <h3>
                AI Hero Guide
            </h3>

            <p>
                Learn how to generate realistic AI fashion models from your garment images.
            </p>

        </div>

        <div className="guide-card">

            <span className="guide-icon">
                📖
            </span>

            <h3>
                AI Lookbook Guide
            </h3>

            <p>
                Create editorial-quality fashion catalogues using multiple AI poses.
            </p>

        </div>

        <div className="guide-card">

            <span className="guide-icon">
                🎬
            </span>

            <h3>
                AI Reel Guide
            </h3>

            <p>
                Turn your AI fashion images into engaging promotional videos.
            </p>

        </div>

        <div className="guide-card">

            <span className="guide-icon">
                💳
            </span>

            <h3>
                Credits & Billing
            </h3>

            <p>
                Understand plans, credit consumption and billing before large projects.
            </p>

        </div>

    </div>

</section>

<section className="resource-section">

    <div className="resource-cta">

        <h2>
            Ready to Create Your First AI Fashion Campaign?
        </h2>

        <p>
            You're only a few clicks away from transforming your garment images into premium AI content.
        </p>

        <button className="primary-resource-button">

            Start Creating

        </button>

    </div>

</section>
    </div>
  );
};

export default GettingStartedPage;