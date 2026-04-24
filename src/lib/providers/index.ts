/**
 * Multimodal provider layer — swap vendors per modality without tangling the growth pipeline.
 */

export type {
  AsrProvider,
  ChatMessage,
  ImageGenResult,
  ImageProvider,
  LlmTextProvider,
  Modality,
  TtsProvider,
  VideoProvider,
} from "./types";
export { ProviderNotConfiguredError } from "./types";

export {
  createNvidiaNimImageProvider,
  createNvidiaNimTextProvider,
  isNvidiaNimConfigured,
} from "./nvidia-nim";
export { createAsrFromEnv, createOpenAiCompatibleAsrProvider } from "./openai-compatible-asr";
export { createTtsStub, createVideoStub } from "./stubs";
