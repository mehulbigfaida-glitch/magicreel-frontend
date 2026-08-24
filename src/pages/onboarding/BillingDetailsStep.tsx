import React, { useEffect, useState } from "react";

import OnboardingLayout from "./OnboardingLayout";
import TextField from "../../components/onboarding/TextField";

import { API_BASE } from "../../config/api";

export interface BillingDetailsData {
  fullName: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  gstin: string;
  phone: string;
}

interface BillingDetailsStepProps {
  onContinue: (
    data: BillingDetailsData
  ) => Promise<void> | void;

  onBack: () => void;
}

const emptyBilling: BillingDetailsData = {
  fullName: "",
  companyName: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  gstin: "",
  phone: "",
};

const BillingDetailsStep: React.FC<
  BillingDetailsStepProps
> = ({
  onContinue,
  onBack,
}) => {
  const [billing, setBilling] =
    useState<BillingDetailsData>(
      emptyBilling
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  useEffect(() => {
    async function loadBilling() {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          `${API_BASE}/api/billing-profile`,
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
              "Unable to load billing details."
          );
        }

        const profile =
          data?.profile ??
          data;

        setBilling({
          ...emptyBilling,
          ...profile,
          country:
            profile?.country ||
            "India",
        });

      } catch (err: any) {
        console.error(
          "BILLING PROFILE LOAD ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load billing details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBilling();
  }, []);

  const update =
    (field: keyof BillingDetailsData) =>
    (value: string) => {
      setBilling((current) => ({
        ...current,
        [field]: value,
      }));
    };

  const handleContinue = async () => {
    setError("");

    const requiredFields: Array<
      [keyof BillingDetailsData, string]
    > = [
      ["fullName", "Full Name"],
      ["addressLine1", "Address Line 1"],
      ["city", "City"],
      ["state", "State"],
      ["postalCode", "Postal Code"],
      ["country", "Country"],
    ];

    for (const [field, label] of requiredFields) {
      if (!billing[field]?.trim()) {
        setError(
          `${label} is required.`
        );
        return;
      }
    }

    if (
      billing.country.trim() !==
      "India"
    ) {
      setError(
        "This billing flow currently supports India only."
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `${API_BASE}/api/billing-profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            billing
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ||
            "Failed to update billing profile."
        );
      }

      await onContinue(billing);

    } catch (err: any) {
      console.error(
        "BILLING PROFILE SAVE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to update billing profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <OnboardingLayout
      step={4}
      totalSteps={4}
      title="Billing Details"
      subtitle="Complete your billing information before choosing your plan."
      primaryText="Continue to Plans"
      secondaryText="Back"
      onPrimary={handleContinue}
      onSecondary={onBack}
      loading={
        loading ||
        saving
      }
    >
      {loading ? (
        <div
          style={{
            padding: "50px 0",
            textAlign: "center",
            color: "#64748B",
          }}
        >
          Loading your billing details…
        </div>
      ) : (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "1fr 1fr",
              gap: 8,
            }}
          >
            <TextField
              label="Full Name"
              required
              value={billing.fullName}
              onChange={update(
                "fullName"
              )}
              placeholder="Your full name"
            />

            <TextField
              label="Company Name"
              value={
                billing.companyName
              }
              onChange={update(
                "companyName"
              )}
              placeholder="Your company"
            />

            <TextField
              label="Address Line 1"
              required
              value={
                billing.addressLine1
              }
              onChange={update(
                "addressLine1"
              )}
              placeholder="Street address"
            />

            <TextField
              label="Address Line 2"
              value={
                billing.addressLine2
              }
              onChange={update(
                "addressLine2"
              )}
              placeholder="Apartment, suite, etc."
            />

            <TextField
              label="City"
              required
              value={billing.city}
              onChange={update("city")}
              placeholder="Mumbai"
            />

            <TextField
              label="State"
              required
              value={billing.state}
              onChange={update(
                "state"
              )}
              placeholder="Maharashtra"
            />

            <TextField
              label="Postal Code"
              required
              value={
                billing.postalCode
              }
              onChange={update(
                "postalCode"
              )}
              placeholder="400001"
            />

            <TextField
              label="Country"
              required
              value={billing.country}
              onChange={update(
                "country"
              )}
              placeholder="India"
            />

            <TextField
              label="GSTIN"
              value={billing.gstin}
              onChange={update(
                "gstin"
              )}
              placeholder="Optional"
            />

            <TextField
              label="Phone"
              value={billing.phone}
              onChange={update(
                "phone"
              )}
              placeholder="Optional"
            />
          </div>

          {error && (
            <div
              style={{
                marginTop: 16,
                color: "#DC2626",
                fontSize: 14,
              }}
            >
              {error}
            </div>
          )}
        </>
      )}
    </OnboardingLayout>
  );
};

export default BillingDetailsStep;
