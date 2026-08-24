import React, { useState } from "react";

import OnboardingLayout from "./OnboardingLayout";
import TextField from "../../components/onboarding/TextField";

export interface SocialPresenceData {
  instagram: string;
  facebook: string;
  youtube: string;
  linkedin: string;
  pinterest: string;
  twitter: string;
}

interface SocialPresenceStepProps {
  initialData?: SocialPresenceData;

  onContinue: (
    data: SocialPresenceData
  ) => void;

  onSkip: () => void;
}

const SocialPresenceStep: React.FC<
  SocialPresenceStepProps
> = ({
  initialData,
  onContinue,
  onSkip,
}) => {
  const [instagram, setInstagram] =
    useState(initialData?.instagram || "");

  const [facebook, setFacebook] =
    useState(initialData?.facebook || "");

  const [youtube, setYoutube] =
    useState(initialData?.youtube || "");

  const [linkedin, setLinkedin] =
    useState(initialData?.linkedin || "");

  const [pinterest, setPinterest] =
    useState(initialData?.pinterest || "");

  const [twitter, setTwitter] =
    useState(initialData?.twitter || "");

  const handleContinue = () => {
    onContinue({
      instagram,
      facebook,
      youtube,
      linkedin,
      pinterest,
      twitter,
    });
  };

  return (
    <OnboardingLayout
      step={3}
      totalSteps={4}
      title="Social Presence"
      subtitle="Connect your social identities. You can always update these later."
      primaryText="Continue"
      secondaryText="Back"
      onPrimary={handleContinue}
      onSecondary={onSkip}
    >
      <TextField
        label="Instagram"
        value={instagram}
        onChange={setInstagram}
        placeholder="@yourbrand"
      />

      <TextField
        label="Facebook"
        value={facebook}
        onChange={setFacebook}
        placeholder="Facebook Page"
      />

      <TextField
        label="YouTube"
        value={youtube}
        onChange={setYoutube}
        placeholder="YouTube Channel"
      />

      <TextField
        label="LinkedIn"
        value={linkedin}
        onChange={setLinkedin}
        placeholder="LinkedIn Company"
      />

      <TextField
        label="Pinterest"
        value={pinterest}
        onChange={setPinterest}
        placeholder="Pinterest"
      />

      <TextField
        label="X (Twitter)"
        value={twitter}
        onChange={setTwitter}
        placeholder="@yourbrand"
      />
    </OnboardingLayout>
  );
};

export default SocialPresenceStep;