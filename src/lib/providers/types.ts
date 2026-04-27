/**
 * Modality-level provider contracts.
 * Wire implementations via env (see docs/MULTIMODAL_PROVIDERS.md).
 */

export type Modality =
  | "llm_structured"
  | "llm_marketing"
  | "image"
  | "video"
  | "tts"
  | "asr";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

/** OpenAI-style chat completion → plain assistant text (JSON prompting is caller’s responsibility). */
export type LlmTextProvider = {
  id: string;
  completeChat(params: {
    messages: ChatMessage[];
    temperature?: number;
    max_tokens?: number;
  }): Promise<string>;
};

export type ImageGenResult = {
  /** Remote URL when the API returns one */
  url?: string;
  /** base64 PNG/JPEG when the API returns b64_json */
  b64_json?: string;
};

export type ImageProvider = {
  id: string;
  generate(params: { prompt: string; n?: number; size?: `${number}x${number}` | string }): Promise<ImageGenResult[]>;
};

/** Short-form video; many vendors use async job + poll — keep interface minimal for now. */
export type VideoProvider = {
  id: string;
  generate(params: { prompt: string; durationSec?: number }): Promise<{ jobId: string; statusUrl?: string }>;
};

export type TtsProvider = {
  id: string;
  synthesize(params: { text: string; voice?: string; format?: "mp3" | "wav" }): Promise<ArrayBuffer>;
};

export type AsrProvider = {
  id: string;
  transcribe(params: { audio: Blob | ArrayBuffer; filename?: string; language?: string }): Promise<string>;
};

export class ProviderNotConfiguredError extends Error {
  constructor(
    public modality: Modality,
    message: string,
  ) {
    super(message);
    this.name = "ProviderNotConfiguredError";
  }
}
