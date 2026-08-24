import React, {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import { API_BASE } from "../../config/api";

import WelcomeStep from "./WelcomeStep";

import BrandIdentityStep from "./BrandIdentityStep";
import type {
  BrandIdentityData,
} from "./BrandIdentityStep";

import SocialPresenceStep from "./SocialPresenceStep";
import type {
  SocialPresenceData,
} from "./SocialPresenceStep";

import BillingDetailsStep from "./BillingDetailsStep";
import type {
  BillingDetailsData,
} from "./BillingDetailsStep";

const TOTAL_STEPS = 4;

interface BusinessProfileState
  extends BrandIdentityData,
    SocialPresenceData {}

const OnboardingWizard: React.FC =
  () => {
    const navigate =
      useNavigate();

    const [searchParams] =
      useSearchParams();

    const requiredMode =
      searchParams.get(
        "required"
      ) === "1";

    const returnTo =
      searchParams.get(
        "returnTo"
      ) || "/plans";

    const [step, setStep] =
      useState(1);

    const [
      businessProfile,
      setBusinessProfile,
    ] =
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

    useEffect(() => {
      async function loadBusinessProfile() {
        try {
          const token =
            localStorage.getItem(
              "token"
            );

          if (!token) {
            return;
          }

          const res =
            await fetch(
              `${API_BASE}/api/business-profile`,
              {
                headers: {
                  Authorization:
                    `Bearer ${token}`,
                },
              }
            );

          if (!res.ok) {
            return;
          }

          const data =
            await res.json();

          const profile =
            data?.profile ??
            data;

          setBusinessProfile(
            (current) => ({
              ...current,
              ...profile,
              logoFile: null,
            })
          );

          /*
           * Required conversion mode:
           *
           * - Business incomplete:
           *   resume at next business step.
           *
           * - Business already complete:
           *   go directly to Billing.
           */
          if (
            requiredMode
          ) {
            if (
              profile?.completed ===
              true
            ) {
              setStep(4);
            } else if (
              typeof profile?.onboardingStep ===
                "number" &&
              profile.onboardingStep >=
                2 &&
              profile.onboardingStep < 4
            ) {
              setStep(
                Math.min(
                  profile.onboardingStep +
                    1,
                  4
                )
              );
            }
          }

        } catch (error) {
          console.error(
            "BUSINESS PROFILE LOAD ERROR:",
            error
          );
        }
      }

      loadBusinessProfile();
    }, [requiredMode]);

    const nextStep =
      () => {
        setStep(
          (current) =>
            Math.min(
              current + 1,
              TOTAL_STEPS
            )
        );
      };

    const saveBusinessProfile =
      async (
        payload: any
      ) => {
        const token =
          localStorage.getItem(
            "token"
          );

        const res =
          await fetch(
            `${API_BASE}/api/business-profile`,
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
                Authorization:
                  `Bearer ${token}`,
              },
              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        if (!res.ok) {
          throw new Error(
            "Failed to save business profile."
          );
        }
      };

    const completeOnboarding =
      async () => {
        await saveBusinessProfile({
          completed: true,
          onboardingStep: 4,
        });

        window.dispatchEvent(
          new Event(
            "businessProfileUpdated"
          )
        );

        /*
         * Both new users and testing users
         * arrive at Plans after onboarding.
         */
        navigate(
          requiredMode
            ? returnTo || "/plans"
            : "/plans"
        );
      };

    const handleBrandContinue =
      async (
        data: BrandIdentityData
      ) => {
        const updated = {
          ...businessProfile,
          ...data,
        };

        setBusinessProfile(
          updated
        );

        await saveBusinessProfile({
          brandName:
            data.brandName,
          companyName:
            data.companyName,
          website:
            data.website,
          tagline:
            data.tagline,
          onboardingStep: 2,
        });

        nextStep();
      };

    const handleSocialContinue =
      async (
        data: SocialPresenceData
      ) => {
        const updated = {
          ...businessProfile,
          ...data,
        };

        setBusinessProfile(
          updated
        );

        await saveBusinessProfile({
          instagram:
            data.instagram,
          facebook:
            data.facebook,
          youtube:
            data.youtube,
          linkedin:
            data.linkedin,
          pinterest:
            data.pinterest,
          twitter:
            data.twitter,
          onboardingStep: 3,
        });

        nextStep();
      };

    const handleBillingContinue =
      async (
        _data: BillingDetailsData
      ) => {
        await completeOnboarding();
      };

    switch (step) {
      case 1:
        return (
          <WelcomeStep
            onContinue={nextStep}
          />
        );

      case 2:
        return (
          <BrandIdentityStep
            initialData={
              businessProfile
            }
            onContinue={
              handleBrandContinue
            }
            onSkip={() =>
              setStep(1)
            }
          />
        );

      case 3:
        return (
          <SocialPresenceStep
            initialData={
              businessProfile
            }
            onContinue={
              handleSocialContinue
            }
            onSkip={() =>
              setStep(2)
            }
          />
        );

      case 4:
        return (
          <BillingDetailsStep
            onContinue={
              handleBillingContinue
            }
            onBack={() =>
              setStep(3)
            }
          />
        );

      default:
        navigate("/plans");
        return null;
    }
  };

export default OnboardingWizard;
