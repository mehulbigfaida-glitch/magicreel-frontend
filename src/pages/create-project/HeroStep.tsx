import { useNavigate } from "react-router-dom";
import { useGenerationStore } from "../../store/generationStore";
import "./HeroStep.css";

export default function HeroStep() {
  const navigate = useNavigate();
  const setStatus = useGenerationStore((s) => s.setStatus);

  function handleAccept() {
    setStatus("accepted");
    navigate("/create/style");
  }

  function handleReject() {
    setStatus("idle");
    navigate("/create/avatar");
  }

  return (
    <div className="mr-hero">
      <h1>Preview Try-On</h1>
      <p>
        Review the generated try-on. You will only be charged
        after accepting.
      </p>

      <div className="mr-hero-actions">
        <button onClick={handleReject}>
          Reject
        </button>
        <button className="primary" onClick={handleAccept}>
          Accept & Continue
        </button>
      </div>
    </div>
  );
}
