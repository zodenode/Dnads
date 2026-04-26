import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";
import { listJobs, upsertJob } from "@/lib/job-store";

export const dynamic = "force-dynamic";

export async function GET() {
  const jobs = await listJobs();
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      url?: string;
      interval_minutes?: number;
      max_competitors?: number;
      meta_countries?: string[];
    };
    const url = typeof body.url === "string" ? body.url.trim() : "";
    if (!url) {
      return NextResponse.json({ error: "url is required" }, { status: 400 });
    }
    const interval = Math.max(5, Number(body.interval_minutes) || 60);
    const maxCompetitors = Math.min(20, Math.max(1, Number(body.max_competitors) || 8));
    const meta_countries =
      Array.isArray(body.meta_countries) && body.meta_countries.length
        ? body.meta_countries.map((c) => String(c).toUpperCase())
        : ["US"];

    const now = new Date().toISOString();
    let clerk_user_id: string | null = null;
    if (isClerkMiddlewareEnabled()) {
      const { userId } = await auth();
      clerk_user_id = userId;
    }

    const job = await upsertJob({
      clerk_user_id,
      url,
      meta_countries,
      max_competitors: maxCompetitors,
      interval_minutes: interval,
      last_run_at: null,
      next_run_at: now,
      last_status: "idle",
      last_error: null,
    });

    return NextResponse.json({ job });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to create job";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
