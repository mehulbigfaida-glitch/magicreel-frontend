import { useNavigate } from "react-router-dom";
import { usePlanStore } from "../../store/planStore";
import type { PlanType } from "../../store/planStore";
import "./PlanStep.css";

export default function PlanStep() {
  const navigate = useNavigate();
  const setPlan = usePlanStore((s) => s.setPlan);

  function selectPlan(plan: PlanType) {
    setPlan(plan);
    navigate("/create/view");
  }

  return (
    <div className="mr-plan">
      <h1>Select a plan</h1>
      <p className="mr-plan-sub">
        Choose what you want to generate for this garment.
      </p>

      <div className="mr-plan-grid">
        {/* BASIC */}
        <div className="mr-plan-card">
          <h3>Basic</h3>
          <p className="mr-plan-price">$9</p>

          <ul>
            <li>1 Lookbook (4K)</li>
            <li>Auto-generated angles</li>
            <li>1 Reel (5 seconds)</li>
            <li>System avatars</li>
            <li>No watermark</li>
          </ul>

          <button onClick={() => selectPlan("basic")}>
            Choose Basic
          </button>
        </div>

        {/* PRO */}
        <div className="mr-plan-card highlight">
          <span className="mr-plan-badge">Most Popular</span>
          <h3>Pro</h3>
          <p className="mr-plan-price">$29</p>

          <ul>
            <li>3 Lookbooks (4K)</li>
            <li>3 Reels (10 seconds each)</li>
            <li>1 user-uploaded model</li>
            <li>Category-aware poses</li>
            <li>No watermark</li>
          </ul>

          <button onClick={() => selectPlan("pro")}>
            Choose Pro
          </button>
        </div>

        {/* ADVANCED */}
        <div className="mr-plan-card">
          <h3>Advanced</h3>
          <p className="mr-plan-price">$59</p>

          <ul>
            <li>6 Lookbooks (4K)</li>
            <li>6 Reels (15 seconds each)</li>
            <li>2 user-uploaded models</li>
            <li>Hero & motion poses</li>
            <li>Priority processing</li>
          </ul>

          <button onClick={() => selectPlan("advanced")}>
            Choose Advanced
          </button>
        </div>
      </div>

      {/* ENTERPRISE */}
      <div className="mr-plan-enterprise">
        <h4>Need something custom?</h4>
        <p>
          For image-only workflows, bulk SKUs, or fixed pose templates,
          talk to us about Enterprise plans.
        </p>
        <a href="/contact">Contact Sales →</a>
      </div>
    </div>
  );
}
