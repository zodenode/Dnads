import { callClaudeJson } from "./claude";
import type { Ad, Business } from "./types";

const SYSTEM = `You simulate realistic competitor ad LIBRARY SAMPLES for pattern analysis (Meta, TikTok, Google Ads styles). These are NOT copies of real ads — invent plausible creatives that match how brands in this category typically advertise.

For EACH competitor in the input list, produce 2-3 distinct simulated ad samples across platforms (mix meta, tiktok, google).

Each ad must use this exact Ad shape:
{
  "competitor": string (must match one from input),
  "hook_type": one of "pain"|"curiosity"|"urgency"|"status"|"comparison"|"other",
  "angle": string,
  "audience_target": string,
  "offer_type": string,
  "emotional_trigger": string,
  "format": string (e.g. UGC, testimonial, static, video, carousel, search RSA),
  "cta": string,
  "text": string (primary ad body / headline+body for search),
  "platform": "meta"|"tiktok"|"google"
}

Output ONLY valid JSON: { "ads": Ad[] }`;

export async function generateSimulatedCompetitorAds(
  business: Business
): Promise<Ad[]> {
  const user = JSON.stringify({
    url: business.url,
    category: business.category,
    value_proposition: business.value_proposition,
    target_audience: business.target_audience,
    competitors: business.competitors,
  });

  const result = await callClaudeJson<{ ads: Ad[] }>(SYSTEM, user);
  return result.ads || [];
}
