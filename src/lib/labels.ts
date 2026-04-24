const PROMPT_FIELD_LABELS: Record<string, string> = {
  subject: "Subject",
  environment: "Environment",
  lighting: "Lighting",
  emotion: "Emotion",
  composition: "Composition",
  negativeSpace: "Negative space instruction",
  styleReference: "Style reference",
};

export function promptFieldLabel(key: string): string {
  return PROMPT_FIELD_LABELS[key] ?? key;
}
