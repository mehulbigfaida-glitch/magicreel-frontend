import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

type Theme = {
  id: string;
  title: string;
  description: string;
  credits: number;
  color: string;
};

const THEMES: Theme[] = [
  {
    id: "dark-runway",
    title: "Dark Fashion Week",
    description: "Luxury spotlight runway with dramatic depth",
    credits: 3,
    color: "linear-gradient(135deg,#111,#2a2a2a)",
  },
  {
    id: "golden-hour",
    title: "Golden Hour Editorial",
    description: "Warm cinematic sunset fashion frames",
    credits: 3,
    color: "linear-gradient(135deg,#d6a73d,#ffcc70)",
  },
  {
    id: "urban-night",
    title: "Urban Night Vogue",
    description: "City lights, neon reflections, bold attitude",
    credits: 3,
    color: "linear-gradient(135deg,#1a1a3a,#3a3aff)",
  },
];

function CinematicPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const heroImageUrl = location.state?.heroImageUrl;

  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!selectedTheme || !heroImageUrl) return;

    setLoading(true);

    const res = await fetch("/api/p2m/cinematic/generate-lookbook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        heroImageUrl,
        theme: selectedTheme.id,
      }),
    });

    const data = await res.json();

    navigate("/lookbook", {
      state: {
        cinematicRunId: data.runId,
        cinematic: true,
      },
    });
  };

  return (
    <div className="cinematic-container">
      <div className="cinematic-header">
        <h1>Select Cinematic Theme</h1>
        <p>Cinematic Lookbook – 3 Credits</p>
      </div>

      <div className="cinematic-grid">
        {THEMES.map((theme) => (
          <div
            key={theme.id}
            className={`cinematic-card ${
              selectedTheme?.id === theme.id ? "active" : ""
            }`}
            onClick={() => setSelectedTheme(theme)}
          >
            <div
              className="cinematic-preview"
              style={{ background: theme.color }}
            />

            <div className="cinematic-content">
              <h3>{theme.title}</h3>
              <p>{theme.description}</p>
            </div>
          </div>
        ))}
      </div>

      {selectedTheme && (
        <div className="cinematic-footer">
          <button onClick={handleGenerate} disabled={loading}>
            {loading
              ? "Generating Cinematic Lookbook..."
              : "Generate Cinematic Lookbook (3 Credits)"}
          </button>
        </div>
      )}
    </div>
  );
}

export default CinematicPage;