import { describe, expect, it } from "vitest";
import { normalizeAd, parseAdsFromJson } from "@/lib/ad-decomposition";

describe("parseAdsFromJson", () => {
  it("normalizes source and external_id", () => {
    const rows = [
      {
        competitor: "Acme",
        hook_type: "pain",
        angle: "a",
        emotional_trigger: "e",
        format: "video",
        cta: "Buy",
        text: "hello",
        source: "meta",
        external_id: "123",
      },
    ];
    const ads = parseAdsFromJson(rows, "Fallback");
    expect(ads[0]?.source).toBe("meta");
    expect(ads[0]?.external_id).toBe("123");
  });

  it("defaults invalid hook_type to curiosity", () => {
    const a = normalizeAd({ hook_type: "invalid", text: "t" } as Record<string, unknown>, "X");
    expect(a.hook_type).toBe("curiosity");
  });
});
