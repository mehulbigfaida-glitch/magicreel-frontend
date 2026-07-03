import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "./CampaignOutputPage.css";

type Campaign = {
  id: string;

  heroImageUrl: string;

  outputImageUrl: string;

  headline: string;

  subheadline?: string;

  cta?: string;

  status: string;

  createdAt: string;
};

export default function CampaignOutputPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [loading, setLoading] =
    useState(true);

  const [campaign, setCampaign] =
    useState<Campaign | null>(null);

  useEffect(() => {
    async function loadCampaign() {
      try {
        const API_BASE =
          import.meta.env.VITE_API_BASE ||
          import.meta.env.VITE_API_BASE_URL ||
          "http://localhost:5003";

        const token = localStorage.getItem("token");

const response = await fetch(
  `${API_BASE}/api/campaign-v2/${id}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);

        const json =
          await response.json();

        console.log(
          "[CAMPAIGN OUTPUT]",
          json
        );

        if (json.success) {
          setCampaign(json.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadCampaign();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="campaign-output-page">
        <div className="campaign-output-loading">
          Loading Campaign...
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="campaign-output-page">
        <div className="campaign-output-error">

          <h2>
            Campaign not found
          </h2>

          <p>
            The requested campaign
            could not be loaded.
          </p>

          <button
            onClick={() =>
              navigate("/campaign-engine")
            }
          >
            Back to Campaign Studio
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="campaign-output-page">

      <div className="campaign-output-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="campaign-output-header">

          <div>

            <div className="campaign-ready-badge">
              ✓ Campaign Ready
            </div>

            <h1>
              Campaign Studio
            </h1>

            <p>
              Your premium marketing campaign
              has been generated successfully.
            </p>

          </div>

        </div>

        {/* ==========================================
            CONTENT
        ========================================== */}

        <div className="campaign-output-content">

          {/* ======================================
              LEFT PANEL
          ====================================== */}

          <div className="campaign-preview-card">

            <div className="campaign-preview-wrapper">

              <img
                src={
                  campaign.outputImageUrl ||
                  campaign.heroImageUrl
                }
                alt="Campaign Preview"
                className="campaign-preview-image"
                onError={(e) => {
                  (
                    e.currentTarget as HTMLImageElement
                  ).src =
                    campaign.heroImageUrl;
                }}
              />

            </div>

          </div>

          {/* ======================================
              RIGHT PANEL
          ====================================== */}

          <div className="campaign-info-card">

            <h2>
              Campaign Details
            </h2>

            <div className="campaign-detail-row">

              <span>Status</span>

              <strong>
                {campaign.status}
              </strong>

            </div>

            <div className="campaign-detail-row">

              <span>Created</span>

              <strong>
                {new Date(
                  campaign.createdAt
                ).toLocaleString()}
              </strong>

            </div>

            <div className="campaign-detail-row">

              <span>Campaign ID</span>

              <strong className="campaign-id">

                {campaign.id}

              </strong>

            </div>

            <div className="campaign-divider" />

            <div className="campaign-copy">

              <h3>
                Campaign Copy
              </h3>

              <h4>
                {campaign.headline}
              </h4>

              {campaign.subheadline && (
                <p>
                  {campaign.subheadline}
                </p>
              )}

              {campaign.cta && (
                <div className="campaign-cta">
                  {campaign.cta}
                </div>
              )}

            </div>

            <div className="campaign-divider" />

            {/* PART 2 STARTS HERE */}
                        <div className="campaign-actions">

              <button
  className="primary-btn"
  onClick={async () => {
    try {
      const imageUrl =
        campaign.outputImageUrl ||
        campaign.heroImageUrl;

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error("Unable to download image.");
      }

      const blob = await response.blob();

      const objectUrl =
        window.URL.createObjectURL(blob);

      const a =
        document.createElement("a");

      a.href = objectUrl;

      a.download = `campaign-${campaign.id}.png`;

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(objectUrl);

    } catch (err) {
      console.error(
        "Campaign download failed:",
        err
      );
    }
  }}
>
  Download Campaign
</button>

<button
  className="secondary-btn"
  onClick={() => {

    window.open(
      `/publish?assetUrl=${encodeURIComponent(
        campaign.outputImageUrl ||
        campaign.heroImageUrl
      )}&assetType=image`,
      "_blank"
    );

  }}
>
  Publish Campaign
</button>

              <button
                className="ghost-btn"
                onClick={() =>
                  navigate("/campaign-engine")
                }
              >
                Back to Campaign Studio
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}