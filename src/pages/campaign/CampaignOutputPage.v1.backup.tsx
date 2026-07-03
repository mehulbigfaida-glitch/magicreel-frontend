import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

type Campaign = {
  id: string;
  outputImageUrl: string;
  status: string;
};

export default function CampaignOutputPage() {
  const { id } = useParams();

  const [campaign, setCampaign] =
    useState<Campaign | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const BACKEND_URL =
          import.meta.env
            .VITE_API_BASE_URL ||
          import.meta.env
            .VITE_API_URL;

        const token =
          localStorage.getItem(
            "token"
          );

        const response =
          await fetch(
            `${BACKEND_URL}/api/campaigns/${id}`,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        const data =
          await response.json();

        console.log(
          "CAMPAIGN DATA",
          data
        );

        setCampaign(data);

      } catch (err) {

        console.error(err);

      } finally {

        setLoading(false);

      }
    }

    loadCampaign();

  }, [id]);

  if (loading) {
    return (
      <div
        style={{
          padding: 40,
          color: "white",
        }}
      >
        Loading campaign...
      </div>
    );
  }

  if (!campaign) {
    return (
      <div
        style={{
          padding: 40,
          color: "white",
        }}
      >
        Campaign not found.
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "white",
        padding: 40,
      }}
    >
      <h1>
        Campaign Output
      </h1>

      <div
        style={{
          marginTop: 30,
        }}
      >
        <img
          src={
            campaign.outputImageUrl
          }
          alt="Campaign"
          style={{
            width: 450,
            maxWidth: "100%",
            borderRadius: 24,
          }}
        />
      </div>

      <div
        style={{
          marginTop: 30,
          display: "flex",
          gap: 12,
        }}
      >
        <button
  onClick={() => {

    const a =
      document.createElement(
        "a"
      );

    a.href =
      campaign.outputImageUrl;

    a.download =
      "campaign.jpg";

    document.body.appendChild(
      a
    );

    a.click();

    a.remove();
  }}
>
  Download
</button>

        <button
  onClick={() => {

    const publishUrl =
      `/publish?assetUrl=${encodeURIComponent(
        campaign.outputImageUrl
      )}&heroImageUrl=${encodeURIComponent(
        campaign.outputImageUrl
      )}&assetType=image`;

    window.open(
      publishUrl,
      "_blank"
    );
  }}
>
  Publish
</button>


      </div>
    </div>
  );
}