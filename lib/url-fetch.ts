/**
 * Fetches public URL HTML and extracts readable text for LLM context.
 * MVP: no browser rendering; best-effort text extraction.
 */

const MAX_CHARS = 12000;

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchUrlText(url: string): Promise<{ text: string; ok: boolean; status?: number }> {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  try {
    const res = await fetch(normalized, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GrowthIntelBot/0.1; +https://example.com/bot) AppleWebKit/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
    });
    const html = await res.text();
    const text = stripTags(html).slice(0, MAX_CHARS);
    return { text, ok: res.ok, status: res.status };
  } catch {
    return { text: "", ok: false };
  }
}
