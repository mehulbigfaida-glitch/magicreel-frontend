import { useEffect, useState } from "react";
import "./CampaignOutputPage.css";

const messages = [
  "Preparing your campaign...",
  "Exploring creative possibilities...",
  "Designing a premium visual composition...",
  "Refining every visual detail...",
  "Applying the finishing touches...",
  "Your campaign is almost ready..."
];

export default function CampaignGeneratingPage() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMessageIndex((current) =>
        current < messages.length - 1 ? current + 1 : current
      );
    }, 8000);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="campaign-generating-page">
      <div className="campaign-generating-card">

        <div className="campaign-generating-logo">
          ✨
        </div>

        <div className="campaign-generating-title">
          MagicReel Creative Studio
        </div>

        <div className="campaign-generating-message">
          {messages[messageIndex]}
        </div>

        <div className="campaign-loader" />

        <div className="campaign-generating-note">
          Please keep this tab open while your campaign is being created.
        </div>

      </div>
    </div>
  );
}