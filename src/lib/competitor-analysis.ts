/**
 * URL context + competitor discovery inputs for the intelligence pipeline.
 * Real scraping of ad libraries is out of scope for MVP; downstream stages
 * simulate realistic competitor ads from category + positioning signals.
 */

const MAX_HTML_BYTES = 120_000;

export type UrlSignals = {
  url: string;
  title?: string;
  description?: string;
  textSnippet?: string;
};

function stripTags(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function fetchUrlSignals(url: string): Promise<UrlSignals> {
  const normalized = url.startsWith("http") ? url : `https://${url}`;
  let title: string | undefined;
  let description: string | undefined;
  let textSnippet: string | undefined;

  try {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), 12_000);
    const res = await fetch(normalized, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GrowthIntelBot/0.1; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(t);
    if (!res.ok) {
      return { url: normalized };
    }
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > MAX_HTML_BYTES ? buf.slice(0, MAX_HTML_BYTES) : buf;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);

    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    title = titleMatch?.[1] ? stripTags(titleMatch[1]).slice(0, 200) : undefined;

    const ogDesc =
      html.match(/property=["']og:description["'][^>]*content=["']([^"']+)["']/i) ??
      html.match(/name=["']description["'][^>]*content=["']([^"']+)["']/i);
    description = ogDesc?.[1]
      ? stripTags(ogDesc[1]).slice(0, 320)
      : undefined;

    const body = html.match(/<body[^>]*>([\s\S]*)/i)?.[1] ?? html;
    textSnippet = stripTags(body).slice(0, 2500);
  } catch {
    /* offline or blocked — LLM still runs on URL alone */
  }

  return { url: normalized, title, description, textSnippet };
}
