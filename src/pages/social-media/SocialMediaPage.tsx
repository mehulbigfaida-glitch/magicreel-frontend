import { useEffect, useState } from "react";
import "./SocialMediaPage.css";

type Platform = {
  name: string;
  description: string;
};

const platforms: Platform[] = [
  {
    name: "Facebook",
    description: "Publish directly to your Facebook Page.",
  },
  {
    name: "WhatsApp Business",
    description: "Share your creations instantly with customers.",
  },
  {
    name: "LinkedIn",
    description: "Publish professional brand campaigns.",
  },
  {
    name: "TikTok",
    description: "Vertical short-form video publishing.",
  },
  {
    name: "Pinterest",
    description: "Inspire shoppers with visual collections.",
  },
  {
    name: "Threads",
    description: "Engage your audience with real-time conversations.",
  },
];

export default function SocialMediaPage() {

  const API_BASE =
    import.meta.env.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_URL ||
    "http://localhost:5003";

  const [instagram, setInstagram] = useState<{
  username: string;
  connected: boolean;
} | null>(null);

useEffect(() => {

  const token = localStorage.getItem("token");

  fetch(`${API_BASE}/api/social/accounts`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },

  })
    .then((r) => r.json())
    .then((data) => {

      const ig = data.accounts?.find(
        (x: any) => x.platform === "instagram"
      );

      if (ig) {
        setInstagram(ig);
      }

    })
    .catch(console.error);

}, []);
  
    const handleConnectInstagram = () => {

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    window.location.href =
      `${API_BASE}/api/social/connect/instagram?token=${encodeURIComponent(token)}`;

  };

  return (
    <div className="social-page">

      {/* HERO */}

      <section className="social-hero">

        <div className="social-badge">
          ✨ AI Powered Publishing
        </div>

        <h1>Social Media</h1>

        <p>
          Connect your social media accounts once.
          <br />
          Publish your MagicReel creations instantly to all connected platforms.
        </p>

      </section>

      {/* INSTAGRAM */}

      <section className="instagram-section">

        <div className="instagram-card">

          <div className="instagram-left">

            <div className="platform-logo instagram-gradient">
              IG
            </div>

            <div>

              <h2>Instagram</h2>

              <p>
                Connect your Instagram account once and publish directly to
                Feed, Stories and Reels from MagicReel.
              </p>

            </div>

          </div>

          <div className="instagram-right">

            <div className="status-title">
              Status
            </div>

            <div
  className={
    instagram?.connected
      ? "status connected"
      : "status disconnected"
  }
>

  {
    instagram?.connected
      ? "Connected"
      : "Not Connected"
  }

</div>

<div className="status-description">

  {
    instagram?.connected
      ? `@${instagram.username}`
      : "Your account isn't connected yet."
  }

</div>

<button
  className="connect-btn"
  onClick={handleConnectInstagram}
>

  {
    instagram?.connected
      ? "Reconnect Instagram"
      : "Connect Instagram Account"
  }

</button>

          </div>

        </div>

      </section>

      {/* OTHER PLATFORMS */}

      <section className="platform-grid">

        {platforms.map((platform) => (

          <div
            key={platform.name}
            className="platform-card"
          >

            <div className="platform-logo placeholder">

              {platform.name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .substring(0, 2)}

            </div>

            <h3>{platform.name}</h3>

            <p>{platform.description}</p>

            <div className="coming-soon">
              Available after Beta
            </div>

          </div>

        ))}

      </section>

      <footer className="social-footer">

        More publishing platforms are coming soon.

      </footer>

    </div>
  );
}