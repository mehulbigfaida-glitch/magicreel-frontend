import "./ImageQualityPage.css";

export default function ImageQualityPage() {
  return (
    <div className="doc-page">

      <div className="doc-container">

        <h1 className="doc-title">
          📘 Image Quality Guidelines
        </h1>

        <p className="doc-subtitle">
          Better images → Better AI results
        </p>

        {/* SECTION 0 — INPUT TYPE */}
<div className="doc-section">

  <h2>Allowed Input Types</h2>

  <div className="doc-compare">

    {/* GOOD TYPES */}
    <div className="doc-card good">
      <img src="/docs/flat-lay.jpg" />
      <div>✅ Flat-lay garment</div>
    </div>

    <div className="doc-card good">
      <img src="/docs/hanger.jpg" />
      <div>✅ Hanger photo</div>
    </div>

    <div className="doc-card good">
      <img src="/docs/ghost-mannequin.jpg" />
      <div>✅ Ghost mannequin</div>
    </div>

    {/* BAD TYPE */}
    <div className="doc-card bad">
      <img src="/docs/on-model.jpg" />
      <div>❌ Garment worn by a person (Not supported)</div>
    </div>

  </div>

</div>
        
        {/* SECTION 1 */}
        <div className="doc-section">

          <h2>Background</h2>

          <div className="doc-compare">

            <div className="doc-card good">
              <img src="/docs/good-bg.jpg" />
              <div>✅ Clean background</div>
            </div>

            <div className="doc-card bad">
              <img src="/docs/bad-bg.jpg" />
              <div>❌ Cluttered background</div>
            </div>

          </div>

        </div>

        {/* SECTION 2 */}
        <div className="doc-section">

          <h2>Garment Visibility</h2>

          <div className="doc-compare">

            <div className="doc-card good">
              <img src="/docs/good-full.jpg" />
              <div>✅ Full garment visible</div>
            </div>

            <div className="doc-card bad">
              <img src="/docs/bad-crop.jpg" />
              <div>❌ Cropped / incomplete</div>
            </div>

          </div>

        </div>

        {/* SECTION 3 */}
        <div className="doc-section">

          <h2>Image Quality</h2>

          <div className="doc-compare">

            <div className="doc-card good">
              <img src="/docs/good-hd.jpg" />
              <div>✅ High resolution</div>
            </div>

            <div className="doc-card bad">
              <img src="/docs/bad-blur.jpg" />
              <div>❌ Blurry / low quality</div>
            </div>

          </div>

        </div>

        {/* FINAL NOTE */}
        <div className="doc-highlight">
          💡 High-quality input images directly improve AI output quality.
        </div>

      </div>

    </div>
  );
}