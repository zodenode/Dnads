import { describe, expect, it, vi } from "vitest";
import { POST } from "../route";

vi.mock("@/lib/pipeline", () => ({
  runPipeline: vi.fn().mockResolvedValue({
    business: {
      url: "https://example.com",
      category: "Test",
      value_proposition: ["v"],
      target_audience: ["a"],
      competitors: ["C1"],
    },
    competitor_ads: [
      {
        competitor: "C1",
        hook_type: "curiosity",
        angle: "x",
        emotional_trigger: "t",
        format: "static",
        cta: "Go",
        text: "ad text here for length",
        source: "synthetic",
      },
    ],
    market: {
      top_hooks: [{ label: "curiosity", percent: 100 }],
      top_angles: [{ label: "x", percent: 100 }],
      saturation_gaps: [],
      winning_patterns: ["one"],
    },
    generated_ads: Array.from({ length: 10 }, (_, i) => ({
      hook: `h${i}`,
      primary_text: `text ${i} `.repeat(15),
      cta: "c",
      angle_label: "a",
      emotional_trigger_label: "e",
      cluster: "G",
    })),
    landing_headlines: ["h1", "h2", "h3"],
    landing_subcopy: ["s1", "s2", "s3"],
    ugc_script_ideas: ["u1", "u2", "u3", "u4", "u5"],
    campaign_structure: [{ name: "n", objective: "o" }],
  }),
}));

describe("POST /api/generate", () => {
  it("returns 400 when url missing", async () => {
    const res = await POST(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(res.status).toBe(400);
    const j = await res.json();
    expect(j.error).toMatch(/url is required/i);
  });

  it("returns 200 and pack when pipeline succeeds", async () => {
    const res = await POST(
      new Request("http://localhost/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://example.com", max_competitors: 5 }),
      }),
    );
    expect(res.status).toBe(200);
    const pack = await res.json();
    expect(pack.business.url).toBe("https://example.com");
    expect(pack.generated_ads.length).toBe(10);
  });
});
