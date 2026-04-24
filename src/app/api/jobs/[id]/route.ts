import { NextResponse } from "next/server";
import { deleteJob, getJob } from "@/lib/job-store";
import { runMonitorJobOnce } from "@/lib/monitor-runner";

export const maxDuration = 300;

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const ok = await deleteJob(id);
  if (!ok) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

export async function POST(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const job = await getJob(id);
  if (!job) return NextResponse.json({ error: "not found" }, { status: 404 });
  try {
    await runMonitorJobOnce(id);
    const updated = await getJob(id);
    return NextResponse.json({ job: updated });
  } catch (e) {
    const message = e instanceof Error ? e.message : "run failed";
    const updated = await getJob(id);
    return NextResponse.json({ error: message, job: updated }, { status: 500 });
  }
}
