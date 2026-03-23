import "./PlansPage.css";

type Plan = {
  name: string;
  price: string;
  generations: number;
  creditPrice: string;
  packs: string[];
  popular?: boolean;
};

const plans: Plan[] = [
  {
    name: "FREE",
    price: "₹0",
    generations: 3,
    creditPrice: "",
    packs: ["E-Commerce Pack"],
  },
  {
    name: "BASIC",
    price: "₹900",
    generations: 10,
    creditPrice: "₹90 / generation",
    packs: ["E-Commerce Pack"],
  },
  {
    name: "PRO",
    price: "₹3600",
    generations: 48,
    creditPrice: "₹75 / generation",
    packs: ["E-Commerce Pack", "Social Pack", "Cinematic Pack"],
    popular: true,
  },
  {
    name: "ADVANCE",
    price: "₹6300",
    generations: 105,
    creditPrice: "₹60 / generation",
    packs: ["E-Commerce Pack", "Social Pack", "Cinematic Pack"],
  },
];

export default function PlansPage() {

  const handleUpgrade = (planName: string) => {
    alert(`Upgrade to ${planName} coming soon`);
  };

  return (
    <div className="plans-page">

      <div className="plans-header">
        <h1>MagicReel Pricing</h1>
        <p>Generate studio-quality fashion visuals instantly</p>
      </div>

      <div className="plans-grid">

        {plans.map((plan) => (

          <div
            key={plan.name}
            className={`plan-card ${plan.popular ? "popular" : ""}`}
          >

            {plan.popular && (
              <div className="popular-badge">Most Popular</div>
            )}

            <h2 className="plan-name">{plan.name}</h2>

            <div className="plan-price">{plan.price}</div>

            <div className="plan-credits">
              {plan.generations} Hero Generations
            </div>

            <div className="plan-credit-price">
              {plan.creditPrice}
            </div>

            <ul className="plan-packs">
              {plan.packs.map((pack) => (
                <li key={pack}>✓ {pack}</li>
              ))}
            </ul>

            <button
              className="upgrade-btn"
              onClick={() => handleUpgrade(plan.name)}
            >
              {plan.name === "FREE" ? "Get Started" : "Upgrade"}
            </button>

          </div>

        ))}

      </div>

      <div className="enterprise-section">

        <h2>Enterprise</h2>

        <p>
          For large brands and agencies requiring high-volume generation
        </p>

        <button
          className="enterprise-btn"
          onClick={() => (window.location.href = "mailto:sales@magicreel.in")}
        >
          Contact Sales
        </button>

      </div>

    </div>
  );
}