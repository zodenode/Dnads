import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      url?: string;
      meta_countries?: string[];
      max_competitors?: number;
    };
    const url = typeof body.url === "string" ? body.url.trim() : "";
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const meta_countries =
      Array.isArray(body.meta_countries) && body.meta_countries.length
        ? body.meta_countries.map((c) => String(c).toUpperCase())
        : undefined;
    const max_competitors =
      typeof body.max_competitors === "number" && body.max_competitors > 0
        ? Math.min(20, body.max_competitors)
        : undefined;

    const pack = await runPipeline(url, {
      metaCountries: meta_countries,
      maxCompetitors: max_competitors,
    });
    return NextResponse.json(pack);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
