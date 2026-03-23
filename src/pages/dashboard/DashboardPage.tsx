import { useNavigate } from "react-router-dom";
import "./dashboard.css";

export default function DashboardPage() {

  const navigate = useNavigate();

  // MOCK DATA (V1)
  const plan = "BASIC";
  const heroLimit = 10;
  const heroUsed = 3;

  const remaining = heroLimit - heroUsed;

  const recent = [
    "/sample/hero1.jpg",
    "/sample/hero2.jpg",
    "/sample/hero3.jpg"
  ];

  return (
    <div className="mr-dashboard">

      <h1 className="mr-dashboard-title">
        Dashboard
      </h1>

      {/* PLAN CARD */}

      <div className="mr-dashboard-card">

        <h2>Current Plan</h2>

        <p>
          Plan: <strong>{plan}</strong>
        </p>

        <p>
          Hero Generations Remaining:
          <strong> {remaining} / {heroLimit}</strong>
        </p>

        <button
          className="mr-upgrade-btn"
          onClick={() => navigate("/plans")}
        >
          Upgrade to PRO
        </button>

      </div>


      {/* USAGE CARD */}

      <div className="mr-dashboard-card">

        <h2>Usage</h2>

        <p>
          Hero Generations Used:
          <strong> {heroUsed}</strong>
        </p>

      </div>


      {/* RECENT GENERATIONS */}

      <div className="mr-dashboard-card">

        <h2>Recent Generations</h2>

        {recent.length === 0 ? (

  <p>No generations yet</p>

) : (

  <div className="mr-recent-grid">
    {recent.map((img, i) => (
      <img
        key={i}
        src={img}
        className="mr-recent-thumb"
        alt="hero"
      />
    ))}
  </div>

)}

        <button
          className="mr-view-all"
          onClick={() => navigate("/predictions")}
        >
          View All
        </button>

      </div>

    </div>
  );
}