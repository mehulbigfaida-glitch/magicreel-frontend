import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export interface HeroWorkflowStep {
  number: number;
  title: string;
  narration: string;
  image: string;
  alt: string;
}

interface HeroWorkflowSlideshowProps {
  steps: HeroWorkflowStep[];
}

export default function HeroWorkflowSlideshow({
  steps,
}: HeroWorkflowSlideshowProps) {

  const [currentStep, setCurrentStep] = useState(0);

  if (!steps.length) {
    return null;
  }

  const step = steps[currentStep];

  const isFirst = currentStep === 0;
  const isLast = currentStep === steps.length - 1;

  const goPrevious = () => {
    if (!isFirst) {
      setCurrentStep((previous) => previous - 1);
    }
  };

  const goNext = () => {
    if (!isLast) {
      setCurrentStep((previous) => previous + 1);
    }
  };

  const goToStep = (index: number) => {
    setCurrentStep(index);
  };

  return (
    <div className="hero-slideshow">

      <div className="hero-slideshow-header">

        <div className="hero-slideshow-progress">
          Step {step.number} of {steps.length}
        </div>

        <div
          className="hero-slideshow-dots"
          role="tablist"
          aria-label="AI Hero workflow steps"
        >

          {steps.map((item, index) => (
            <button
              key={item.number}
              type="button"
              className={
                index === currentStep
                  ? "hero-slideshow-dot active"
                  : "hero-slideshow-dot"
              }
              onClick={() => goToStep(index)}
              role="tab"
              aria-selected={index === currentStep}
              aria-label={`Go to Step ${item.number}: ${item.title}`}
            >
              {item.number}
            </button>
          ))}

        </div>

      </div>

      <div className="hero-slideshow-card">

        <div className="hero-slideshow-content">

          <div className="step-number">
            {step.number}
          </div>

          <h3>{step.title}</h3>

          <p>{step.narration}</p>

        </div>

        <div className="hero-slideshow-image">

          <img
            src={step.image}
            alt={step.alt}
            draggable={false}
          />

        </div>

      </div>

      <div className="hero-slideshow-controls">

        <button
          type="button"
          className="hero-slideshow-button"
          onClick={goPrevious}
          disabled={isFirst}
          aria-label="Previous AI Hero workflow step"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        <div className="hero-slideshow-position">
          {step.number} / {steps.length}
        </div>

        <button
          type="button"
          className="hero-slideshow-button"
          onClick={goNext}
          disabled={isLast}
          aria-label="Next AI Hero workflow step"
        >
          Next
          <ChevronRight size={20} />
        </button>

      </div>

    </div>
  );
}
