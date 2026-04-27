import { describe, expect, it } from "vitest";
import { analyzePatterns } from "@/lib/pattern-analysis";
import type { Ad } from "@/lib/types";

function ad(partial: Partial<Ad>): Ad {
  return {
    competitor: "C",
    hook_type: partial.hook_type ?? "curiosity",
    angle: partial.angle ?? "value",
    emotional_trigger: partial.emotional_trigger ?? "trust",
    format: partial.format ?? "static",
    cta: partial.cta ?? "Go",
    text: partial.text ?? "body",
    ...partial,
  };
}

describe("analyzePatterns", () => {
  it("computes hook distribution", () => {
    const ads: Ad[] = [
      ad({ hook_type: "pain" }),
      ad({ hook_type: "pain" }),
      ad({ hook_type: "curiosity" }),
    ];
    const m = analyzePatterns(ads);
    expect(m.top_hooks.find((h) => h.label === "pain")?.percent).toBeCloseTo(66.7, 0);
    expect(m.top_hooks.find((h) => h.label === "curiosity")?.percent).toBeCloseTo(33.3, 0);
  });

  it("includes winning_patterns when data exists", () => {
    const ads: Ad[] = [ad({ hook_type: "urgency", angle: "speed", format: "video" })];
    const m = analyzePatterns(ads);
    expect(m.winning_patterns.length).toBeGreaterThan(0);
    expect(m.top_angles[0]?.label).toBe("speed");
  });
});
