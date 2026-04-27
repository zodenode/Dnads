import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockAnthropicCreate } = vi.hoisted(() => ({
  mockAnthropicCreate: vi.fn(),
}));

vi.mock("@anthropic-ai/sdk", () => ({
  default: class MockAnthropic {
    messages = { create: mockAnthropicCreate };
    constructor(_opts: { apiKey: string }) {}
  },
}));

describe("callClaudeJson dual backend", () => {
  const origEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    process.env = { ...origEnv };
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.NVIDIA_API_KEY;
    delete process.env.NVIDIA_CHAT_MODEL;
    mockAnthropicCreate.mockReset();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    process.env = origEnv;
    vi.unstubAllGlobals();
  });

  it("throws when no LLM keys", async () => {
    const { callClaudeJson } = await import("@/lib/claude");
    await expect(callClaudeJson("sys", "user")).rejects.toThrow(/No LLM configured/);
  });

  it("uses Anthropic when ANTHROPIC_API_KEY is set", async () => {
    process.env.ANTHROPIC_API_KEY = "sk-ant-test";
    mockAnthropicCreate.mockResolvedValue({
      content: [{ type: "text", text: '{"from":"claude"}' }],
    });

    const { callClaudeJson } = await import("@/lib/claude");
    const out = await callClaudeJson<{ from: string }>("system prompt", "user prompt");
    expect(out).toEqual({ from: "claude" });
    expect(mockAnthropicCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        system: "system prompt",
        messages: [{ role: "user", content: "user prompt" }],
      }),
    );
  });

  it("uses NVIDIA NIM when only NVIDIA_API_KEY is set", async () => {
    process.env.NVIDIA_API_KEY = "nvapi-test";
    process.env.NVIDIA_CHAT_MODEL = "test/model";

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: '{"from":"nvidia"}' } }],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { callClaudeJson } = await import("@/lib/claude");
    const out = await callClaudeJson<{ from: string }>("sys", "usr");
    expect(out).toEqual({ from: "nvidia" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer nvapi-test",
        }),
      }),
    );
    const body = JSON.parse((fetchMock.mock.calls[0][1] as { body: string }).body);
    expect(body.model).toBe("test/model");
    expect(body.messages).toEqual([
      { role: "system", content: "sys" },
      { role: "user", content: "usr" },
    ]);
  });
});
