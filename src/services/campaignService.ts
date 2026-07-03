// src/services/campaignService.ts
// 🔒 Transport-only Campaign Service

import { API_BASE } from "../config/api";

/* ============================================================================
 * Request
 * ========================================================================== */

export interface CampaignGenerateRequest {
  heroImageUrl: string;

  supportingHeroUrls: string[];

  logoUrl: string;

  headline: string;

  subheadline?: string;

  cta?: string;
}

/* ============================================================================
 * Response
 * ========================================================================== */

export interface CreativeVision {
  creativeDirection: string;

  composition: string;

  visualMood: string;

  hierarchy: string;

  typographyStyle: string;

  logoPlacement: string;
}

export interface ImageGenerationRequest {
  systemPrompt: string;

  userPrompt: string;
}

export interface CampaignGenerationResult {
  campaignId: string;

  imageUrl: string;

  imageRequest: ImageGenerationRequest;

  vision: CreativeVision;
}

export interface CampaignGenerateResponse {
  success: boolean;

  data: CampaignGenerationResult;
}

/* ============================================================================
 * Generate Campaign
 * ========================================================================== */

export async function generateCampaign(
  payload: CampaignGenerateRequest
): Promise<CampaignGenerateResponse> {
  console.log("===== CAMPAIGN SERVICE =====");
  console.log("API_BASE =", API_BASE);
      console.log("[CAMPAIGN START PAYLOAD]", payload);

  const response = await fetch(`${API_BASE}/api/campaign-v2/generate`, {
    method: "POST",
    headers: {
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("token")}`,
},
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      json?.error || `Backend error: ${response.status}`
    );
  }

  return json as CampaignGenerateResponse;
}