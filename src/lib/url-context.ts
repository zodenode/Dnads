/**
 * Lightweight HTML fetch for MVP context (title + meta description).
 */
export async function fetchUrlContext(url: string): Promise<string> {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }

  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(normalized, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; GrowthPackBot/0.1; +https://example.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    if (!res.ok) {
      return `Fetch returned ${res.status}. URL: ${normalized}`;
    }
    const html = await res.text();
    const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim() ?? "";
    const desc =
      html
        .match(
          /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i
        )?.[1]
        ?.trim() ??
      html
        .match(
          /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["']/i
        )?.[1]
        ?.trim() ??
      "";
    const parts = [`URL resolved: ${normalized}`];
    if (title) parts.push(`Title: ${title}`);
    if (desc) parts.push(`Meta description: ${desc}`);
    return parts.join("\n");
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return `Could not fetch page (${msg}). Proceed with URL string only: ${normalized}`;
  } finally {
    clearTimeout(t);
  }
}
