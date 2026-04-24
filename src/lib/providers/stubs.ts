import { ProviderNotConfiguredError, type Modality, type TtsProvider, type VideoProvider } from "./types";

/** Placeholder until a hosted video API (e.g. NVIDIA catalog entry, Runway, etc.) is wired with keys. */
export function createVideoStub(): VideoProvider {
  return {
    id: "stub-video",
    async generate() {
      throw new ProviderNotConfiguredError(
        "video",
        "Video generation is not wired yet. Add a VideoProvider implementation (e.g. NVIDIA NIM video model from build.nvidia.com when available to your account). See docs/MULTIMODAL_PROVIDERS.md.",
      );
    },
  };
}

/** Placeholder until TTS (NVIDIA Speech NIM, OpenAI TTS, etc.) is wired. */
export function createTtsStub(): TtsProvider {
  return {
    id: "stub-tts",
    async synthesize() {
      throw new ProviderNotConfiguredError(
        "tts",
        "Text-to-speech is not wired yet. NVIDIA Speech NIM exposes gRPC/WebSocket TTS — see docs/MULTIMODAL_PROVIDERS.md.",
      );
    },
  };
}
