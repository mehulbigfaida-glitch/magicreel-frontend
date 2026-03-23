import { useNavigate } from "react-router-dom";
import { useGenerationStore } from "../../store/generationStore";
import { useStyleStore } from "../../store/styleStore";
import type { LogoPosition, LogoSize } from "../../store/styleStore";
import "./BrandStylingStep.css";

export default function BrandStylingStep() {
  const navigate = useNavigate();
  const setStatus = useGenerationStore((s) => s.setStatus);

  const {
    logo,
    setPresetBackground,
    setAiBackground,
    setUploadedBackground,
    setLogoImage,
    setLogoPosition,
    setLogoSize,
    setLogoOpacity,
    removeLogo,
  } = useStyleStore();

  function handleGenerateFinal() {
    setStatus("generating");
    navigate("/create/export");
  }

  return (
    <div className="mr-style">
      <h1>Brand Styling</h1>
      <p className="mr-style-sub">
        Customize branding for your final lookbook.
      </p>

      {/* Background */}
      <section>
        <h3>Background</h3>
        <div className="mr-style-grid">
          <button onClick={() => setPresetBackground("studio-white")}>
            Studio White
          </button>
          <button onClick={() => setPresetBackground("beige")}>
            Soft Beige
          </button>
          <button onClick={() => setPresetBackground("editorial-grey")}>
            Editorial Grey
          </button>
        </div>

        <div className="mr-style-grid">
          <button onClick={() => setAiBackground("clean")}>
            Clean Studio (AI)
          </button>
          <button onClick={() => setAiBackground("luxury")}>
            Luxury Editorial (AI)
          </button>
        </div>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            setUploadedBackground(
              URL.createObjectURL(e.target.files[0])
            )
          }
        />
      </section>

      {/* Logo */}
      <section>
        <h3>Brand Logo</h3>

        {!logo ? (
          <input
            type="file"
            accept="image/png,image/svg+xml"
            onChange={(e) =>
              e.target.files &&
              setLogoImage(
                URL.createObjectURL(e.target.files[0])
              )
            }
          />
        ) : (
          <div className="mr-style-row">
            <select
              value={logo.position}
              onChange={(e) =>
                setLogoPosition(
                  e.target.value as LogoPosition
                )
              }
            >
              <option value="top-left">Top Left</option>
              <option value="top-right">Top Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="bottom-right">Bottom Right</option>
            </select>

            <select
              value={logo.size}
              onChange={(e) =>
                setLogoSize(e.target.value as LogoSize)
              }
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>

            <input
              type="range"
              min="0.3"
              max="1"
              step="0.1"
              value={logo.opacity}
              onChange={(e) =>
                setLogoOpacity(Number(e.target.value))
              }
            />

            <button onClick={removeLogo}>Remove</button>
          </div>
        )}
      </section>

      <button className="primary" onClick={handleGenerateFinal}>
        Generate Final Lookbook
      </button>
    </div>
  );
}
