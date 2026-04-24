import { NextResponse } from "next/server";
import { buildGrowthPack } from "@/lib/orchestrator";
import type { GenerateResponse } from "@/lib/types";

export const maxDuration = 300;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = typeof body.url === "string" ? body.url.trim() : "";

    if (!url) {
      return NextResponse.json<GenerateResponse>(
        { success: false, error: "Missing url" },
        { status: 400 }
      );
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json<GenerateResponse>(
        {
          success: false,
          error:
            "Server misconfiguration: ANTHROPIC_API_KEY is not set. Add it to .env.local.",
        },
        { status: 503 }
      );
    }

    const notes = typeof body.notes === "string" ? body.notes : undefined;
    const pack = await buildGrowthPack(url, notes);

    return NextResponse.json<GenerateResponse>({ success: true, pack });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json<GenerateResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
