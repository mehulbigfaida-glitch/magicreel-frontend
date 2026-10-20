import "./PlansPage.css";
import { useEffect, useMemo, useState } from "react";

type PaidPlan = "PRO";

type Plan = {
  name: PaidPlan;
  credits: number;
  priceINR: number;
  priceUSD: number;
  museCount: number;
  popular?: boolean;
  description: string;
};

const plans: Plan[] = [
  {
    name: "PRO",
    credits: 27,
    priceINR: 900,
    priceUSD: 9,
    museCount: 0,
    popular: true,
    description:
      "Create 9 fashion lookbooks, each with 8 images, plus 9 included 15-second Carousel Reels.",
  },
];

const topupRateINR: Record<PaidPlan, number> = {
  PRO: 35,
};

declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript =
  (): Promise<boolean> =>
    new Promise((resolve) => {
      const existing =
        document.getElementById(
          "razorpay-script"
        );

      if (existing) {
        resolve(true);
        return;
      }

      const script =
        document.createElement(
          "script"
        );

      script.id =
        "razorpay-script";

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () =>
        resolve(true);

      script.onerror = () =>
        resolve(false);

      document.body.appendChild(
        script
      );
    });

export default function PlansPage() {

  const BACKEND_URL =
    import.meta.env.VITE_API_BASE_URL;

  const [userInfo, setUserInfo] =
    useState<any>(null);

  const [payments, setPayments] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [busyPlan, setBusyPlan] =
    useState<PaidPlan | null>(null);

  const [topupCredits, setTopupCredits] =
    useState(10);

  const [topupBusy, setTopupBusy] =
    useState(false);

  const [publishingBusy, setPublishingBusy] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const token =
    localStorage.getItem("token");

  async function fetchUser() {

    try {

      const res =
        await fetch(
          `${BACKEND_URL}/api/auth/me`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Failed to fetch account"
        );
      }

      /*
       * Current backend returns the user
       * directly. Keeping data.user fallback
       * makes this tolerant of older response
       * shapes during deployment.
       */
      setUserInfo(
        data?.user ??
          data
      );

    } catch (error) {

      console.error(
        "Failed to fetch user:",
        error
      );

    }

  }

  async function fetchPayments() {

    try {

      const res =
        await fetch(
          `${BACKEND_URL}/api/payments/history`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        await res.json();

      if (
        res.ok &&
        data?.success
      ) {
        setPayments(
          data.data || []
        );
      }

    } catch (error) {

      console.error(
        "Failed to fetch payments:",
        error
      );

    }

  }

  async function refreshAccount() {
    await Promise.all([
      fetchUser(),
      fetchPayments(),
    ]);
  }

  useEffect(() => {

    async function load() {

      setLoading(true);

      await refreshAccount();

      setLoading(false);

    }

    load();

  }, []);

  function showMessage(
    text: string
  ) {
    setMessage(text);

    window.setTimeout(
      () => setMessage(""),
      4500
    );
  }

  async function ensureBusinessProfileComplete(): Promise<boolean> {
    try {
      const businessRes =
        await fetch(
          `${BACKEND_URL}/api/business-profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (
        businessRes.status === 404 ||
        !businessRes.ok
      ) {
        window.location.href =
          "/onboarding?required=1&returnTo=/plans";

        return false;
      }

      const businessData =
        await businessRes.json();

      const businessProfile =
        businessData?.profile ??
        businessData;

      if (
        businessProfile?.completed !== true
      ) {
        window.location.href =
          "/onboarding?required=1&returnTo=/plans";

        return false;
      }

      const billingRes =
        await fetch(
          `${BACKEND_URL}/api/billing-profile`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      if (
        billingRes.status === 404 ||
        !billingRes.ok
      ) {
        window.location.href =
          "/onboarding?required=1&returnTo=/plans";

        return false;
      }

      const billingData =
        await billingRes.json();

      const billing =
        billingData?.profile ??
        billingData;

      const billingComplete =
        Boolean(
          billing?.fullName?.trim() &&
          billing?.addressLine1?.trim() &&
          billing?.city?.trim() &&
          billing?.state?.trim() &&
          billing?.postalCode?.trim() &&
          billing?.country?.trim()
        );

      if (!billingComplete) {
        window.location.href =
          "/onboarding?required=1&returnTo=/plans";

        return false;
      }

      return true;

    } catch (error) {

      console.error(
        "BUSINESS/BILLING PROFILE CHECK ERROR:",
        error
      );

      showMessage(
        "Unable to verify your account details."
      );

      return false;
    }
  }

  async function openPlanCheckout(
    plan: PaidPlan
  ) {

    try {

      const profileComplete =
        await ensureBusinessProfileComplete();

      if (!profileComplete) {
        setBusyPlan(null);
        return;
      }

      setBusyPlan(plan);

      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Failed to load payment system."
        );
      }

      const orderRes =
        await fetch(
          `${BACKEND_URL}/api/payments/create-order`,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                plan,
              }),
          }
        );

      const orderData =
        await orderRes.json();

      if (
        !orderRes.ok ||
        !orderData?.success
      ) {
        throw new Error(
          orderData?.error ||
            "Failed to create payment order."
        );
      }

      const options = {
        key:
          orderData.key,

        amount:
          orderData.amount,

        currency:
          orderData.currency,

        name:
          "MagicReel",

        description:
          `${plan} Plan`,

        order_id:
          orderData.orderId,

        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          paylater: false,
        },

        handler:
          async (
            response: any
          ) => {

            try {

              const verifyRes =
                await fetch(
                  `${BACKEND_URL}/api/payments/verify-payment`,
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body:
                      JSON.stringify({
                        ...response,
                        plan,
                      }),
                  }
                );

              const verifyData =
                await verifyRes.json();

              if (
                !verifyRes.ok ||
                !verifyData?.success
              ) {
                throw new Error(
                  verifyData?.error ||
                    "Payment verification failed."
                );
              }

              showMessage(
                `${plan} activated. Credits added successfully.`
              );

              await refreshAccount();

              window.dispatchEvent(
                new Event(
                  "creditsUpdated"
                )
              );

            } catch (error: any) {

              console.error(
                "PLAN PAYMENT VERIFY ERROR:",
                error
              );

              showMessage(
                error?.message ||
                  "Payment verification failed."
              );

            } finally {

              setBusyPlan(null);

            }

          },

        theme: {
          color:
            "#7c3aed",
        },

      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (error: any) {

      console.error(
        "PLAN CHECKOUT ERROR:",
        error
      );

      showMessage(
        error?.message ||
          "Unable to start payment."
      );

      setBusyPlan(null);

    }

  }

  async function openTopupCheckout() {

    try {

      const profileComplete =
        await ensureBusinessProfileComplete();

      if (!profileComplete) {
        setTopupBusy(false);
        return;
      }

      setTopupBusy(true);

      const loaded =
        await loadRazorpayScript();

      if (!loaded) {
        throw new Error(
          "Failed to load payment system."
        );
      }

      const orderRes =
        await fetch(
          `${BACKEND_URL}/api/payments/create-credit-topup`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body:
              JSON.stringify({
                credits:
                  topupCredits,
              }),
          }
        );

      const orderData =
        await orderRes.json();

      if (
        !orderRes.ok ||
        !orderData?.success
      ) {
        throw new Error(
          orderData?.error ||
            "Failed to create top-up order."
        );
      }

      const options = {

        key:
          orderData.key,

        amount:
          orderData.amount,

        currency:
          orderData.currency,

        name:
          "MagicReel",

        description:
          `${topupCredits} Credit Top-Up`,

        order_id:
          orderData.orderId,

        method: {
          netbanking: true,
          card: true,
          upi: true,
          wallet: true,
          paylater: false,
        },

        handler:
          async (
            response: any
          ) => {

            try {

              const verifyRes =
                await fetch(
                  `${BACKEND_URL}/api/payments/verify-credit-topup`,
                  {
                    method:
                      "POST",

                    headers: {
                      "Content-Type":
                        "application/json",

                      Authorization:
                        `Bearer ${token}`,
                    },

                    body:
                      JSON.stringify({
                        ...response,

                        credits:
                          topupCredits,
                      }),
                  }
                );

              const verifyData =
                await verifyRes.json();

              if (
                !verifyRes.ok ||
                !verifyData?.success
              ) {
                throw new Error(
                  verifyData?.error ||
                    "Top-up verification failed."
                );
              }

              showMessage(
                `${topupCredits} credits added successfully.`
              );

              await refreshAccount();

              window.dispatchEvent(
                new Event(
                  "creditsUpdated"
                )
              );

            } catch (error: any) {

              console.error(
                "TOP-UP VERIFY ERROR:",
                error
              );

              showMessage(
                error?.message ||
                  "Credit top-up failed."
              );

            } finally {

              setTopupBusy(false);

            }

          },

        theme: {
          color:
            "#ec4899",
        },

      };

      const razorpay =
        new window.Razorpay(
          options
        );

      razorpay.open();

    } catch (error: any) {

      console.error(
        "TOP-UP CHECKOUT ERROR:",
        error
      );

      showMessage(
        error?.message ||
          "Unable to start credit top-up."
      );

      setTopupBusy(false);

    }

  }

  const currentPlan =
    userInfo?.plan;

  const availableCredits =
    Number(
      userInfo?.creditsAvailable ??
        0
    );

  const creditExpiry =
    userInfo?.creditsValidUntil
      ? new Date(
          userInfo.creditsValidUntil
        )
      : null;

  const currentTopupRate =
    currentPlan &&
    topupRateINR[
      currentPlan as PaidPlan
    ];

  const topupPriceINR =
    currentTopupRate
      ? currentTopupRate *
        topupCredits
      : null;

  const currentPlanLabel =
    currentPlan || "—";

  const formattedCreditExpiry =
    creditExpiry
      ? creditExpiry.toLocaleDateString(
          "en-IN",
          {
            day:
              "2-digit",
            month:
              "short",
            year:
              "numeric",
          }
        )
      : "—";

  const paymentRows =
    useMemo(
      () => payments,
      [payments]
    );

  return (
    <div className="plans-page">

      <div className="plans-header">

        <div className="plans-eyebrow">
          MAGICREEL
        </div>

        <h1>
          Plans & Pricing
        </h1>

        <p>
          Create premium fashion
          content with credits that
          work across your MagicReel
          creative studio.
        </p>

      </div>

      {message && (
        <div className="plans-toast">
          {message}
        </div>
      )}

      {loading ? (

        <div className="plans-loading">
          Loading your billing details…
        </div>

      ) : (

        <>

          <section className="account-summary">

            <div>
              <span className="summary-label">
                CURRENT PLAN
              </span>

              <strong>
                {currentPlanLabel}
              </strong>
            </div>

            <div>
              <span className="summary-label">
                AVAILABLE CREDITS
              </span>

              <strong>
                {availableCredits}
              </strong>
            </div>

            <div>
              <span className="summary-label">
                CREDIT VALID UNTIL
              </span>

              <strong>
                {formattedCreditExpiry}
              </strong>
            </div>

          </section>

          <section className="pricing-section">

            <div className="section-heading">
              <span>
                AI CREATION
              </span>

              <h2>
                PRO — your complete fashion content workflow
              </h2>

              <p>
                ₹900 + GST for 27 credits: 9 lookbooks with 72 images and 9 included 15-second Carousel Reels. Lookbooks are designed with major fashion marketplace image guidelines in mind; marketplace acceptance requirements can change.
              </p>
            </div>

            <div className="plans-grid">

              {plans.map(
                (plan) => {

                  const isCurrent =
                    currentPlan ===
                    plan.name;

                  return (
                    <article
                      key={
                        plan.name
                      }
                      className={
                        `plan-card ${
                          plan.popular
                            ? "popular"
                            : ""
                        } ${
                          isCurrent
                            ? "current-plan"
                            : ""
                        }`
                      }
                    >

                      {plan.popular && (
                        <div className="popular-badge">
                          MOST POPULAR
                        </div>
                      )}

                      <div className="plan-name">
                        {plan.name}
                      </div>

                      <div className="plan-price-row">
                        <span className="plan-price">
                          ₹
                          {plan.priceINR.toLocaleString(
                            "en-IN"
                          )}
                        </span>

                        <span className="plan-tax">
                          + GST
                        </span>
                      </div>

                      <div className="plan-credit-count">
                        {plan.credits}
                        {" "}
                        Credits
                      </div>

                      <p className="plan-description">
                        {plan.description}
                      </p>

                      <div className="plan-feature">
                        ✓ 9 lookbooks × 8 images (Hero Front, Hero Back + 6 poses)
                      </div>
                      <div className="plan-feature">
                        ✓ 9 included 15-second Carousel Reels
                      </div>
                      <div className="plan-feature">
                        ✓ Direct Instagram publishing included — no publishing fee or credit deduction
                      </div>
                      <div className="plan-feature">
                        ✓ 360° Reel generation: 4 credits each
                      </div>

                      <div className="plan-feature">
                        ✓ Credits valid for
                        90 days
                      </div>

                      <button
                        className="upgrade-btn"
                        disabled={
                          busyPlan ===
                          plan.name
                        }
                        onClick={() =>
                          openPlanCheckout(
                            plan.name
                          )
                        }
                      >
                        {busyPlan ===
                        plan.name
                          ? "Opening checkout…"
                          : isCurrent
                            ? "Buy PRO Credits"
                            : "Choose PRO"}
                      </button>

                    </article>
                  );

                }
              )}

              <article className="plan-card enterprise-card">

                <div className="plan-name">
                  ENTERPRISE
                </div>

                <div className="enterprise-price">
                  Custom
                </div>

                <p className="plan-description">
                  High-volume generation,
                  custom commercial
                  requirements and support.
                </p>

                <div className="plan-feature">
                  ✓ Custom credit allocation
                </div>

                <div className="plan-feature">
                  ✓ Custom Muse requirements
                </div>

                <div className="plan-feature">
                  ✓ Dedicated support
                </div>

                <button
                  className="enterprise-btn"
                  onClick={() =>
                    (window.location.href =
                      "mailto:sales@magicreel.in")
                  }
                >
                  Contact Sales
                </button>

              </article>

            </div>

          </section>

          <section className="billing-rule">
            <div className="billing-rule-icon">
              ⏳
            </div>

            <div>
              <strong>
                Credit validity
              </strong>

              <p>
                Credits are valid for 90 days from your latest credit purchase. Buying additional credits refreshes the validity period for your available balance.
              </p>
            </div>
          </section>

          <section className="commercial-grid">
            <article className="commercial-card topup-card">
              <div className="commercial-eyebrow">BUY MORE CREDITS</div>
              <h2>Top up your PRO plan</h2>
              <p>Buy additional credits in multiples of 10 at ₹35 per credit, plus GST. Top-ups refresh the 90-day validity period.</p>
              <div className="topup-controls">
                <label>
                  Credits
                  <select value={topupCredits} disabled={topupBusy} onChange={(e) => setTopupCredits(Number(e.target.value))}>
                    {[10,20,30,40,50,60,70,80,90,100].map((value) => <option key={value} value={value}>{value} Credits</option>)}
                  </select>
                </label>
                <div className="topup-price">
                  <strong>₹{topupPriceINR?.toLocaleString("en-IN") ?? "—"}</strong>
                  <span>+ GST</span>
                </div>
              </div>
              <div className="topup-rate">PRO rate: ₹35 / credit</div>
              <button className="topup-btn" disabled={topupBusy} onClick={openTopupCheckout}>
                {topupBusy ? "Opening checkout…" : `Buy ${topupCredits} Credits`}
              </button>
            </article>
          </section>

          <section className="payment-history-section">

            <div className="section-heading">
              <span>
                BILLING
              </span>

              <h2>
                Payment History
              </h2>

              <p>
                Your recent plan,
                top-up and publishing
                payments.
              </p>
            </div>

            {paymentRows.length === 0 ? (

              <div className="empty-payments">
                No payments yet.
              </div>

            ) : (

              <div className="payment-table-wrap">

                <div className="payment-table">

                  <div className="payment-row payment-head">
                    <span>
                      Type
                    </span>

                    <span>
                      Amount
                    </span>

                    <span>
                      Status
                    </span>

                    <span>
                      Date
                    </span>

                    <span>
                      Invoice
                    </span>
                  </div>

                  {paymentRows.map(
                    (payment) => (

                      <div
                        className="payment-row"
                        key={
                          payment.id
                        }
                      >

                        <span>
                          {payment.plan}
                        </span>

                        <span>
                          ₹
                          {Number(
                            payment.amount
                          ) /
                            100}
                        </span>

                        <span className="payment-success">
                          {payment.status}
                        </span>

                        <span className="payment-date">
                          {payment.createdAt
                            ? new Date(
                                payment.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </span>

                        <span>
                          {payment.invoiceUrl ? (
                            <button
                              className="invoice-btn"
                              onClick={() =>
                                window.open(
                                  payment.invoiceUrl,
                                  "_blank",
                                  "noopener,noreferrer"
                                )
                              }
                            >
                              View
                            </button>
                          ) : (
                            "—"
                          )}
                        </span>

                      </div>

                    )
                  )}

                </div>

              </div>

            )}

          </section>

        </>

      )}

    </div>
  );
}
