import { NextResponse } from "next/server";
import { buildGrowthPack } from "@/lib/growthPack";

export const maxDuration = 120;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { url?: string };
    const url = body?.url;
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing or invalid `url`" }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: "Server misconfiguration: ANTHROPIC_API_KEY is not set" },
        { status: 503 }
      );
    }

    const pack = await buildGrowthPack(url);
    return NextResponse.json(pack);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
