import { useEffect, useRef, useState } from "react";
import "./QuickStartGuidePage.css";

const SLIDES = Array.from({ length: 7 }, (_, index) => ({
  number: index + 1,
  src: `/qsg/QSG${index + 1}.png`,
}));

export default function QuickStartGuidePage() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const next = () => setCurrent((value) => (value + 1) % SLIDES.length);
  const previous = () => setCurrent((value) => (value - 1 + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = endX - touchStartX.current;
    touchStartX.current = null;
    if (Math.abs(distance) < 50) return;
    if (distance < 0) next();
    else previous();
  };

  const slide = SLIDES[current];

  return (
    <main className="qsg-page">
      <section className="qsg-shell" aria-label="MagicReel Quick Start Guide">
        <header className="qsg-heading">
          <div>
            <p className="qsg-eyebrow">MAGICREEL</p>
            <h1>QUICK START GUIDE</h1>
            <p className="qsg-subtitle">Your visual guide to creating, publishing and growing with MagicReel.</p>
          </div>
          <div className="qsg-progress-label" aria-live="polite">
            <span>{String(slide.number).padStart(2, "0")}</span><small>/ 07</small>
          </div>
        </header>

        <div className="qsg-stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
          <button type="button" className="qsg-arrow qsg-arrow-left" onClick={previous} aria-label="Previous">‹</button>
          <div className="qsg-card-frame">
            <img key={slide.src} src={slide.src} alt={`MagicReel Quick Start Guide card ${slide.number}`} className="qsg-card-image" draggable={false} />
          </div>
          <button type="button" className="qsg-arrow qsg-arrow-right" onClick={next} aria-label="Next">›</button>
        </div>

        <nav className="qsg-navigation" aria-label="Quick Start Guide navigation">
          <button type="button" className="qsg-text-nav" onClick={previous}>← <span>Previous</span></button>
          <div className="qsg-number-nav">
            {SLIDES.map((item, index) => (
              <button key={item.number} type="button" className={`qsg-number ${index === current ? "active" : ""}`} onClick={() => setCurrent(index)} aria-label={`Go to card ${item.number}`} aria-current={index === current ? "step" : undefined}>
                {String(item.number).padStart(2, "0")}
              </button>
            ))}
          </div>
          <button type="button" className="qsg-text-nav qsg-next-nav" onClick={next}><span>{current === 6 ? "Start Again" : "Next"}</span> →</button>
        </nav>

        <div className="qsg-dots" aria-hidden="true">
          {SLIDES.map((item, index) => <span key={item.number} className={index === current ? "active" : ""} />)}
        </div>
      </section>
    </main>
  );
}
