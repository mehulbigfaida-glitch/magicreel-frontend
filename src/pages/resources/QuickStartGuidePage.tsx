import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import "./QuickStartGuidePage.css";

const SLIDES = Array.from({ length: 7 }, (_, index) => ({
  number: index + 1,
  src: `/qsg/QSG${index + 1}.png`,
}));

export default function QuickStartGuidePage() {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const goTo = (index: number) => {
    setCurrent(Math.min(Math.max(index, 0), SLIDES.length - 1));
  };

  const next = () => {
    if (current === SLIDES.length - 1) {
      setCurrent(0);
      return;
    }
    setCurrent((value) => value + 1);
  };

  const previous = () => {
    if (current === 0) return;
    setCurrent((value) => value - 1);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [current]);

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

  return (
    <main className="qsg-page">
      <section className="qsg-shell" aria-label="MagicReel Quick Start Guide">
        <div className="qsg-heading">
          <div>
            <p className="qsg-eyebrow">MAGICREEL</p>
            <h1>QUICK START GUIDE</h1>
            <p className="qsg-subtitle">
              Your visual guide to creating, publishing and growing with MagicReel.
            </p>
          </div>
          <div className="qsg-progress-label" aria-live="polite">
            <span>{String(current + 1).padStart(2, "0")}</span>
            <small>/ 07</small>
          </div>
        </div>

        <div
          className="qsg-stage"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <button
            type="button"
            className="qsg-arrow qsg-arrow-left"
            onClick={previous}
            disabled={current === 0}
            aria-label="Previous Quick Start Guide card"
          >
            <ArrowLeft size={22} strokeWidth={1.8} />
          </button>

          <div className="qsg-card-frame">
            <img
              key={SLIDES[current].src}
              src={SLIDES[current].src}
              alt={`MagicReel Quick Start Guide card ${SLIDES[current].number}`}
              className="qsg-card-image"
              draggable={false}
            />
          </div>

          <button
            type="button"
            className="qsg-arrow qsg-arrow-right"
            onClick={next}
            aria-label={
              current === SLIDES.length - 1
                ? "Start the Quick Start Guide again"
                : "Next Quick Start Guide card"
            }
          >
            {current === SLIDES.length - 1 ? (
              <RotateCcw size={21} strokeWidth={1.8} />
            ) : (
              <ArrowRight size={22} strokeWidth={1.8} />
            )}
          </button>
        </div>

        <div className="qsg-navigation" aria-label="Quick Start Guide navigation">
          <button
            type="button"
            className="qsg-text-nav"
            onClick={previous}
            disabled={current === 0}
          >
            <ArrowLeft size={16} />
            <span>Previous</span>
          </button>

          <div className="qsg-number-nav">
            {SLIDES.map((slide, index) => (
              <button
                key={slide.number}
                type="button"
                className={`qsg-number ${index === current ? "active" : ""}`}
                onClick={() => goTo(index)}
                aria-label={`Go to Quick Start Guide card ${slide.number}`}
                aria-current={index === current ? "step" : undefined}
              >
                {String(slide.number).padStart(2, "0")}
              </button>
            ))}
          </div>

          <button type="button" className="qsg-text-nav qsg-next-nav" onClick={next}>
            <span>{current === SLIDES.length - 1 ? "Start Again" : "Next"}</span>
            {current === SLIDES.length - 1 ? (
              <RotateCcw size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
          </button>
        </div>

        <div className="qsg-dots" aria-hidden="true">
          {SLIDES.map((slide, index) => (
            <span key={slide.number} className={index === current ? "active" : ""} />
          ))}
        </div>
      </section>
    </main>
  );
}
