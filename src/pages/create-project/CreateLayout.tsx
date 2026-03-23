// Pose always has at least ["front"]
// No gating required for demo

import { Outlet, useNavigate } from "react-router-dom";
import { useAvatarStore } from "../../store/avatarStore";
import { useGarmentStore } from "../../store/garmentStore";
import "./CreateLayout.css";

type Step =
  | "hero"
  | "avatar"
  | "garment"
  | "pose"
  | "view"
  | "review"
  | "export";

const STEP_ORDER: Step[] = [
  "hero",
  "avatar",
  "garment",
  "pose",
  "view",
  "review",
  "export",
];

const STEP_META: Record<
  Step,
  { title: string; subtitle: string }
> = {
  hero: {
    title: "Create try-on",
    subtitle: "Start your AI try-on flow.",
  },
  avatar: {
    title: "Select fitting model",
    subtitle: "Choose the model that best represents your customer fit.",
  },
  garment: {
    title: "Upload garment images",
    subtitle: "Upload clear images of the garment.",
  },
  pose: {
    title: "Select poses",
    subtitle: "Choose poses for the try-on output.",
  },
  view: {
    title: "Preview results",
    subtitle: "Review generated visuals.",
  },
  review: {
    title: "Review",
    subtitle: "Final review before export.",
  },
  export: {
    title: "Export",
    subtitle: "Download your visuals.",
  },
};

export default function CreateLayout() {
  const navigate = useNavigate();

  const selectedAvatar = useAvatarStore((s) => s.selectedAvatar);
  const garmentReady = useGarmentStore((s) => s.frontImageUrl);


  const currentPath = window.location.pathname.split("/").pop() as Step;
  const currentStep: Step = STEP_ORDER.includes(currentPath)
    ? currentPath
    : "hero";

  const stepIndex = STEP_ORDER.indexOf(currentStep);
  const nextStep = STEP_ORDER[stepIndex + 1];

  let canContinue = false;

  switch (currentStep) {
    case "hero":
      canContinue = true;
      break;
    case "avatar":
      canContinue = !!selectedAvatar;
      break;
    case "garment":
      canContinue = !!garmentReady;
      break;
    case "pose":
  canContinue = true; // demo-safe, pose validation later
  break;
    case "view":
    case "review":
      canContinue = true;
      break;
    default:
      canContinue = false;
  }

  const handleContinue = () => {
    if (!nextStep) return;
    navigate(`/create/${nextStep}`);
  };

  return (
    <div className="mr-create-layout">
      <div className="mr-create-header">
        <div>
          <h1>{STEP_META[currentStep].title}</h1>
          <p>{STEP_META[currentStep].subtitle}</p>
        </div>

        {nextStep && (
          <button
            className="mr-continue-btn"
            disabled={!canContinue}
            onClick={handleContinue}
          >
            Continue
          </button>
        )}
      </div>

      <div className="mr-create-main">
        <Outlet />
      </div>
    </div>
  );
}
