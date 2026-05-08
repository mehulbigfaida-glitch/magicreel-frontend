import { useState } from "react";

const editorialWorlds = [
  {
    id: "dark-aristocracy",

    title: "Dark Aristocracy",

    subtitle:
      "Sculptural luxury portraiture with cinematic darkness and emotional restraint.",

    accent:
      "linear-gradient(135deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
  },

  {
    id: "poetic-nature",

    title: "Poetic Nature",

    subtitle:
      "Romantic environmental storytelling with cinematic stillness and emotional softness.",

    accent:
      "linear-gradient(135deg, rgba(120,119,198,0.20), rgba(255,255,255,0.02))",
  },

  {
    id: "museum-couture",

    title: "Museum Couture",

    subtitle:
      "Architectural couture presentation with gallery-inspired luxury framing.",

    accent:
      "linear-gradient(135deg, rgba(255,220,180,0.14), rgba(255,255,255,0.02))",
  },

  {
    id: "urban-luxury-cinema",

    title: "Urban Luxury Cinema",

    subtitle:
      "Modern nightlife fashion energy with cinematic city atmosphere.",

    accent:
      "linear-gradient(135deg, rgba(180,180,255,0.14), rgba(255,255,255,0.02))",
  },
];

export default function SocialCampaignPage() {
  const [selectedWorld, setSelectedWorld] = useState(
    editorialWorlds[0]
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050505",
        color: "white",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: 1400,
          margin: "0 auto",
        }}
      >
        <div style={{ marginBottom: 40 }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: 4,
              textTransform: "uppercase",
              opacity: 0.5,
              marginBottom: 12,
            }}
          >
            MagicReel V3
          </div>

          <h1
            style={{
              fontSize: 54,
              fontWeight: 300,
              margin: 0,
            }}
          >
            Social Campaign
          </h1>

          <p
            style={{
              marginTop: 20,
              fontSize: 18,
              lineHeight: 1.7,
              opacity: 0.7,
              maxWidth: 900,
            }}
          >
            AI-powered luxury fashion campaign direction
            with editorial intelligence, cinematic
            coherence, and campaign DNA orchestration.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginBottom: 40,
          }}
        >
          {editorialWorlds.map((world) => {
            const active =
              selectedWorld.id === world.id;

            return (
              <button
                key={world.id}
                onClick={() => setSelectedWorld(world)}
                style={{
                  padding: 24,
                  borderRadius: 24,
                  border: active
                    ? "1px solid white"
                    : "1px solid rgba(255,255,255,0.08)",

                  background: world.accent,

                  textAlign: "left",

                  color: "white",

                  cursor: "pointer",

                  transition: "all 0.2s ease",
                }}
              >
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 300,
                    marginBottom: 14,
                  }}
                >
                  {world.title}
                </div>

                <div
                  style={{
                    fontSize: 14,
                    lineHeight: 1.7,
                    opacity: 0.7,
                  }}
                >
                  {world.subtitle}
                </div>
              </button>
            );
          })}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 20,
          }}
        >
          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 14,
              }}
            >
              Selected Editorial World
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 300,
                marginBottom: 20,
              }}
            >
              {selectedWorld.title}
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                opacity: 0.7,
              }}
            >
              {selectedWorld.subtitle}
            </div>
          </div>

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 20,
              }}
            >
              Campaign Outputs
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              <label>
                <input type="checkbox" defaultChecked />{" "}
                Hero Campaign
              </label>

              <label>
                <input type="checkbox" defaultChecked />{" "}
                Instagram Post
              </label>

              <label>
                <input type="checkbox" /> Story Asset
              </label>

              <label>
                <input type="checkbox" /> Reel
              </label>
            </div>
          </div>

          <div
            style={{
              padding: 28,
              borderRadius: 28,
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 20,
              }}
            >
              Campaign DNA
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                opacity: 0.7,
              }}
            >
              <div>• Cinematic coherence</div>

              <div>• Editorial restraint</div>

              <div>• Luxury atmosphere</div>

              <div>• Campaign consistency</div>

              <div>• Fashion-house direction</div>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: 40,
            padding: 32,
            borderRadius: 30,
            background:
              "rgba(255,255,255,0.03)",

            border:
              "1px solid rgba(255,255,255,0.08)",

            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                opacity: 0.5,
                marginBottom: 10,
              }}
            >
              Generation
            </div>

            <div
              style={{
                fontSize: 36,
                fontWeight: 300,
              }}
            >
              Build Luxury Campaign
            </div>
          </div>

          <button
            style={{
              padding: "16px 34px",
              borderRadius: 999,
              border: "1px solid white",
              background: "white",
              color: "black",
              fontSize: 13,
              letterSpacing: 2,
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
}