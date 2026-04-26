import "./PlansPage.css";


type Plan = {
  name: string;
  price: string;
  generations: number;
  creditPrice: string;
  packs: string[];
  popular?: boolean;
};

type PaidPlan = "BASIC" | "PRO" | "ADVANCE";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans: Plan[] = [
  {
    name: "FREE",
    price: "₹0",
    generations: 1,
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

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    const existing = document.getElementById("razorpay-script");
    if (existing) return resolve(true);

    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export default function PlansPage() {
  
  const BACKEND_URL = import.meta.env.VITE_API_BASE;

  const handleUpgrade = async (planName: string) => {
    try {
      // ✅ FREE FLOW (unchanged)
      if (planName === "FREE") {
        window.location.href = "/create-v2";
        return;
      }

      const plan = planName as PaidPlan;

      // 🔧 Load Razorpay
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment system");
        return;
      }

      // 🔐 STEP 1 — CREATE ORDER
      const orderRes = await fetch(
        `${BACKEND_URL}/api/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ plan }),
        }
      );

      const orderData = await orderRes.json();

      if (!orderData.success) {
        alert(orderData.error || "Failed to create order");
        return;
      }

            // 💳 STEP 2 — OPEN RAZORPAY
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "MagicReel",
        description: `${plan} Plan`,
        order_id: orderData.orderId,

        // ✅ CONTROL PAYMENT METHODS
        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          paylater: false, // ❌ DISABLED
        },

        handler: async function (response: any) {
  const verifyRes = await fetch(
    `${BACKEND_URL}/api/payments/verify-payment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        ...response,
        plan,
      }),
    }
  );

  const verifyData = await verifyRes.json();

  if (!verifyData.success) {
    alert("Payment verification failed");
    return;
  }

  // ✅ CLEAN UX (no alert)
  console.log("✅ Payment successful");

  // OPTIONAL: small toast (temporary fallback)
  const toast = document.createElement("div");
  toast.innerText = "Payment successful! Credits added.";
  toast.style.position = "fixed";
  toast.style.top = "20px";
  toast.style.right = "20px";
  toast.style.background = "#22c55e";
  toast.style.color = "white";
  toast.style.padding = "12px 18px";
  toast.style.borderRadius = "8px";
  toast.style.zIndex = "9999";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);

  // Redirect after short delay
  setTimeout(() => {
    window.location.href = "/create-v2";
  }, 1200);
},

        theme: {
          color: "#6366f1",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
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