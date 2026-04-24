const MAX_CHARS = 55_000;
const FETCH_TIMEOUT_MS = 12_000;

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("URL is required");
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  return new URL(withScheme).toString();
}

export async function fetchUrlText(rawUrl: string): Promise<{ url: string; text: string }> {
  const url = normalizeUrl(rawUrl);
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "GrowthIntelligenceBot/0.1 (+https://example.com; research; contact ops@example.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch URL (${res.status})`);
    }
    const html = await res.text();
    const text = stripHtml(html).slice(0, MAX_CHARS);
    return { url, text: text || "(No readable text extracted from page.)" };
  } finally {
    clearTimeout(id);
  }
}

function stripHtml(html: string): string {
  const noScripts = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ");
  const noTags = noScripts.replace(/<[^>]+>/g, " ");
  return noTags.replace(/\s+/g, " ").trim();
}
