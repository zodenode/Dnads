import { NextResponse } from "next/server";
import { runPipeline } from "@/lib/pipeline";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const url = typeof body.url === "string" ? body.url.trim() : "";
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const pack = await runPipeline(url);
    return NextResponse.json(pack);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Generation failed";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
