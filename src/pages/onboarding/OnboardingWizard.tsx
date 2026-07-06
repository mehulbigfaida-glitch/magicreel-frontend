import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_BASE } from "../../config/api";

import WelcomeStep from "./WelcomeStep";

import BrandIdentityStep from "./BrandIdentityStep";
import type { BrandIdentityData } from "./BrandIdentityStep";

import SocialPresenceStep from "./SocialPresenceStep";
import type { SocialPresenceData } from "./SocialPresenceStep";

import WorkspaceReadyStep from "./WorkspaceReadyStep";

const TOTAL_STEPS = 4;

interface BusinessProfileState
  extends BrandIdentityData,
    SocialPresenceData {}

const OnboardingWizard: React.FC = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [businessProfile, setBusinessProfile] =
    useState<BusinessProfileState>({
      brandName: "",
      companyName: "",
      website: "",
      tagline: "",
      logoFile: null,

      instagram: "",
      facebook: "",
      youtube: "",
      linkedin: "",
      pinterest: "",
      twitter: "",
    });

  const nextStep = () => {
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  };

  const skipOnboarding = () => {
    navigate("/create-ai-hero");
  };

  const saveBusinessProfile = async (payload: any) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE}/api/business-profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
  };

  const finishOnboarding = async () => {
    await saveBusinessProfile({
      completed: true,
      onboardingStep: 4,
    });

    navigate("/create-ai-hero");
  };

  const handleBrandContinue = async (
    data: BrandIdentityData
  ) => {
    const updated = {
      ...businessProfile,
      ...data,
    };

    setBusinessProfile(updated);

    await saveBusinessProfile({
      brandName: data.brandName,
      companyName: data.companyName,
      website: data.website,
      tagline: data.tagline,
      onboardingStep: 2,
    });

    nextStep();
  };

  const handleSocialContinue = async (
    data: SocialPresenceData
  ) => {
    const updated = {
      ...businessProfile,
      ...data,
    };

    setBusinessProfile(updated);

    await saveBusinessProfile({
      instagram: data.instagram,
      facebook: data.facebook,
      youtube: data.youtube,
      linkedin: data.linkedin,
      pinterest: data.pinterest,
      twitter: data.twitter,
      onboardingStep: 3,
    });

    nextStep();
  };

  switch (step) {
    case 1:
      return (
        <WelcomeStep
          onContinue={nextStep}
          onSkip={skipOnboarding}
        />
      );

    case 2:
      return (
        <BrandIdentityStep
          initialData={businessProfile}
          onContinue={handleBrandContinue}
          onSkip={nextStep}
        />
      );

    case 3:
      return (
        <SocialPresenceStep
          initialData={businessProfile}
          onContinue={handleSocialContinue}
          onSkip={nextStep}
        />
      );

    case 4:
      return (
        <WorkspaceReadyStep
          onFinish={finishOnboarding}
        />
      );

    default:
      navigate("/create-ai-hero");
      return null;
  }
};

export default OnboardingWizard;