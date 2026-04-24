import type { Ad, Business } from "./types";
import { completeJson } from "./anthropic";

const SYSTEM = `You simulate a performance marketing intelligence feed: for each named competitor, produce 2-3 REALISTIC BUT FICTIONAL ad-style snippets inspired by typical patterns in their category (Meta feed, TikTok spark, Google RSA style). These are synthetic samples for R&D pattern extraction — NOT copies of real ads, NOT trademarked taglines from real campaigns.
For each ad include: hook_type (one of: pain, curiosity, urgency, status, comparison), angle, audience_target, offer_type, emotional_trigger, format (UGC, testimonial, static, video, carousel, etc.), cta, text (short primary text body).
Also assign channel per ad: meta | tiktok | google (vary across competitors).
Output ONLY valid JSON: { "ads": [ ... ] } with objects matching keys: competitor, hook_type, angle, audience_target, offer_type, emotional_trigger, format, cta, text, channel.`;

type AdsEnvelope = { ads: Ad[] };

export async function synthesizeCompetitorAds(business: Business): Promise<Ad[]> {
  const user = JSON.stringify({
    url: business.url,
    category: business.category,
    value_proposition: business.value_proposition,
    target_audience: business.target_audience,
    competitors: business.competitors,
  });

  const out = await completeJson<AdsEnvelope>(SYSTEM, user);
  const ads = Array.isArray(out.ads) ? out.ads : [];
  return ads.map((a) => ({
    competitor: String(a.competitor || "Unknown"),
    hook_type: String(a.hook_type || "curiosity"),
    angle: String(a.angle || ""),
    audience_target: String(a.audience_target || ""),
    offer_type: String(a.offer_type || ""),
    emotional_trigger: String(a.emotional_trigger || ""),
    format: String(a.format || "static"),
    cta: String(a.cta || "Learn more"),
    text: String(a.text || ""),
    channel:
      a.channel === "meta" || a.channel === "tiktok" || a.channel === "google"
        ? a.channel
        : "meta",
  }));
}
