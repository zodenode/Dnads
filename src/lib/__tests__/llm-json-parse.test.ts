import { describe, expect, it } from "vitest";
import { parseJsonFromLlmText } from "@/lib/llm-json-parse";

describe("parseJsonFromLlmText", () => {
  it("parses first JSON object from prose wrapper", () => {
    const text = 'Here is the result:\n{"a":1,"b":"x"}\nthanks';
    expect(parseJsonFromLlmText<{ a: number; b: string }>(text)).toEqual({ a: 1, b: "x" });
  });

  it("parses nested braces", () => {
    const text = `prefix {"outer":{"inner":true}}`;
    expect(parseJsonFromLlmText(text)).toEqual({ outer: { inner: true } });
  });

  it("throws when no JSON object present", () => {
    expect(() => parseJsonFromLlmText("no braces here")).toThrow("parseable JSON");
  });
});
