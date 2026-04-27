import type { GrowthPack } from "@/lib/types";

/** Product access plane — maps to Clerk `publicMetadata.plan`. */
export type AccessTier = "free" | "pro" | "studio";

const PLAN_KEYS = ["plan", "tier", "subscription"] as const;

export function accessTierFromPublicMetadata(
  metadata: Record<string, unknown> | null | undefined,
): AccessTier {
  if (!metadata) return "free";
  for (const key of PLAN_KEYS) {
    const raw = metadata[key];
    if (typeof raw !== "string") continue;
    const v = raw.toLowerCase();
    if (v === "studio" || v === "agency") return "studio";
    if (v === "pro" || v === "professional") return "pro";
  }
  return "free";
}

export function accessTierForViewer(options: {
  isSignedIn: boolean;
  metadata: Record<string, unknown> | null | undefined;
}): AccessTier {
  if (!options.isSignedIn) return "free";
  return accessTierFromPublicMetadata(options.metadata);
}

/** Signed-out and free: taste path — depth gated elsewhere, not blocked at generation. */
export function canViewCompetitorIntelligence(tier: AccessTier): boolean {
  return tier === "pro" || tier === "studio";
}

export function canViewFullMarketResolution(tier: AccessTier): boolean {
  return tier === "pro" || tier === "studio";
}

export function canViewHighResolutionAds(tier: AccessTier): boolean {
  return tier === "pro" || tier === "studio";
}

export function canUseCampaignExport(tier: AccessTier): boolean {
  return tier === "pro" || tier === "studio";
}

export function canViewStudioIntelligence(tier: AccessTier): boolean {
  return tier === "studio";
}

const FREE_AD_PREVIEW = 3;
const FREE_HOOK_ANGLE_ROWS = 2;

export function slicePackForFreePreview(pack: GrowthPack): GrowthPack {
  return {
    ...pack,
    ad_provenance: pack.ad_provenance,
    generated_ads: pack.generated_ads.slice(0, FREE_AD_PREVIEW),
    competitor_ads: [],
    market: {
      ...pack.market,
      top_hooks: pack.market.top_hooks.slice(0, FREE_HOOK_ANGLE_ROWS),
      top_angles: pack.market.top_angles.slice(0, FREE_HOOK_ANGLE_ROWS),
    },
    ugc_script_ideas: [],
    landing_headlines: pack.landing_headlines.slice(0, 2),
    landing_subcopy: [],
    campaign_structure: pack.campaign_structure.slice(0, 1),
  };
}

export function adPrimaryTextLowRes(text: string): string {
  const max = 120;
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}…`;
}

export { FREE_AD_PREVIEW, FREE_HOOK_ANGLE_ROWS };
