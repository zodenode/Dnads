/**
 * Executes one monitor cycle: full pipeline + stores snapshot on the job.
 */

import { computeNextRun, getJob, listJobs, upsertJob } from "./job-store";
import { runPipeline } from "./pipeline";

export async function runMonitorJobOnce(jobId: string): Promise<void> {
  const job = await getJob(jobId);
  if (!job) throw new Error("job not found");

  await upsertJob({
    ...job,
    last_status: "running",
    last_error: null,
  });

  try {
    const pack = await runPipeline(job.url, {
      metaCountries: job.meta_countries,
      maxCompetitors: job.max_competitors,
      clerkUserId: job.clerk_user_id ?? null,
    });

    await upsertJob({
      ...job,
      last_run_at: new Date().toISOString(),
      next_run_at: computeNextRun(job.interval_minutes),
      last_status: "ok",
      last_error: null,
      last_snapshot: {
        generated_at: new Date().toISOString(),
        business: pack.business,
        market: pack.market,
        ad_provenance: pack.ad_provenance,
        ads_sample: pack.competitor_ads.slice(0, 30),
      },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    await upsertJob({
      ...job,
      last_run_at: new Date().toISOString(),
      next_run_at: computeNextRun(job.interval_minutes),
      last_status: "error",
      last_error: msg,
    });
    throw e;
  }
}

export async function runDueJobs(): Promise<{ ran: string[]; errors: string[] }> {
  const jobs = await listJobs();
  const now = Date.now();
  const ran: string[] = [];
  const errors: string[] = [];

  for (const j of jobs) {
    if (!j.next_run_at) continue;
    if (new Date(j.next_run_at).getTime() > now) continue;
    try {
      await runMonitorJobOnce(j.id);
      ran.push(j.id);
    } catch {
      errors.push(j.id);
    }
  }

  return { ran, errors };
}
