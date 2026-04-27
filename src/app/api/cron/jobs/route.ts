import { NextResponse } from "next/server";
import { runDueJobs } from "@/lib/monitor-runner";

export const maxDuration = 300;

/**
 * Call on a schedule (e.g. Vercel cron every 5–15 min).
 * Protect with CRON_SECRET query or Authorization header in production.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    const auth = req.headers.get("authorization");
    const url = new URL(req.url);
    const q = url.searchParams.get("secret");
    const ok = auth === `Bearer ${secret}` || q === secret;
    if (!ok) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }
  }

  const result = await runDueJobs();
  return NextResponse.json(result);
}
