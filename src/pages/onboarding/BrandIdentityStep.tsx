import React, { useState } from "react";

import OnboardingLayout from "./OnboardingLayout";

import TextField from "../../components/onboarding/TextField";
import LogoUploader from "../../components/onboarding/LogoUploader";

export interface BrandIdentityData {
  brandName: string;
  companyName: string;
  website: string;
  tagline: string;
  logoFile: File | null;
}

interface BrandIdentityStepProps {
  initialData?: BrandIdentityData;

  onContinue: (
    data: BrandIdentityData
  ) => void;

  onSkip: () => void;
}

const BrandIdentityStep: React.FC<
  BrandIdentityStepProps
> = ({
  initialData,
  onContinue,
  onSkip,
}) => {
  const [brandName, setBrandName] =
    useState(
      initialData?.brandName || ""
    );

  const [companyName, setCompanyName] =
    useState(
      initialData?.companyName || ""
    );

  const [website, setWebsite] =
    useState(
      initialData?.website || ""
    );

  const [tagline, setTagline] =
    useState(
      initialData?.tagline || ""
    );

  const [logoFile, setLogoFile] =
    useState<File | null>(
      initialData?.logoFile || null
    );

  const [logoPreview, setLogoPreview] =
    useState("");

  const [error, setError] =
    useState("");

  const handleContinue = () => {
    if (!brandName.trim()) {
      setError(
        "Brand Name is required."
      );
      return;
    }

    onContinue({
      brandName,
      companyName,
      website,
      tagline,
      logoFile,
    });
  };

  return (
    <OnboardingLayout
      step={2}
      totalSteps={4}
      title="Brand Identity"
      subtitle="Tell MagicReel about your brand."
      primaryText="Continue"
      secondaryText="Skip"
      onPrimary={handleContinue}
      onSecondary={onSkip}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "220px 1fr",
          gap: 40,
          alignItems: "start",
        }}
      >
        <LogoUploader
          logo={logoPreview}
          onChange={(file) => {
            setLogoFile(file);

            if (file) {
              setLogoPreview(
                URL.createObjectURL(file)
              );
            }
          }}
        />

        <div>
          <TextField
            label="Brand Name"
            required
            value={brandName}
            onChange={setBrandName}
            placeholder="Magic Fashion"
          />

          <TextField
            label="Company Name"
            value={companyName}
            onChange={setCompanyName}
            placeholder="ABC Fashion Pvt Ltd"
          />

          <TextField
            label="Website"
            value={website}
            onChange={setWebsite}
            placeholder="https://"
          />

          <TextField
            label="Brand Tagline"
            value={tagline}
            onChange={setTagline}
            placeholder="Timeless Fashion"
          />

          {error && (
            <div
              style={{
                color: "#DC2626",
                marginTop: 12,
              }}
            >
              {error}
            </div>
          )}
        </div>
      </div>
    </OnboardingLayout>
  );
};

export default BrandIdentityStep;