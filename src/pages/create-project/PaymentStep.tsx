import { useNavigate } from "react-router-dom";
import { usePaymentStore } from "../../store/paymentStore";
import { usePlanStore } from "../../store/planStore";

export default function PaymentStep() {
  const navigate = useNavigate();
  const plan = usePlanStore((s) => s.plan);
  const completePayment = usePaymentStore(
    (s) => s.completePayment
  );

  function handlePay() {
    if (!plan) return;
    completePayment(plan);
    navigate("/create/view");
  }

  return (
    <div style={{ padding: 80 }}>
      <h1>Payment</h1>
      <p>Complete payment to continue.</p>

      <button onClick={handlePay}>
        Simulate Payment Success
      </button>
    </div>
  );
}
