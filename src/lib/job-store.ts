/**
 * JSON file-backed monitor jobs (no native SQLite in default Node sandbox).
 * Path: DATA_DIR/monitor-jobs.json or ./data/monitor-jobs.json
 */

import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type MonitorJob = {
  id: string;
  url: string;
  /** ISO country codes for Meta */
  meta_countries: string[];
  /** Max competitors to poll per run */
  max_competitors: number;
  /** Minutes between runs */
  interval_minutes: number;
  created_at: string;
  updated_at: string;
  last_run_at: string | null;
  next_run_at: string | null;
  last_status: "idle" | "running" | "error" | "ok";
  last_error: string | null;
  last_snapshot?: unknown;
};

function dataPath(): string {
  const base = process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
  return path.join(base, "monitor-jobs.json");
}

async function readAll(): Promise<MonitorJob[]> {
  const p = dataPath();
  try {
    const raw = await readFile(p, "utf-8");
    const j = JSON.parse(raw) as { jobs?: MonitorJob[] };
    return Array.isArray(j.jobs) ? j.jobs : [];
  } catch {
    return [];
  }
}

async function writeAll(jobs: MonitorJob[]): Promise<void> {
  const p = dataPath();
  await mkdir(path.dirname(p), { recursive: true });
  await writeFile(p, JSON.stringify({ jobs }, null, 2), "utf-8");
}

export async function listJobs(): Promise<MonitorJob[]> {
  const jobs = await readAll();
  return jobs.sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export async function getJob(id: string): Promise<MonitorJob | null> {
  const jobs = await readAll();
  return jobs.find((j) => j.id === id) ?? null;
}

export async function upsertJob(
  partial: Omit<MonitorJob, "id" | "created_at" | "updated_at"> & {
    id?: string;
  },
): Promise<MonitorJob> {
  const jobs = await readAll();
  const now = new Date().toISOString();
  const id = partial.id || crypto.randomUUID();
  const idx = jobs.findIndex((j) => j.id === id);
  const next: MonitorJob = {
    id,
    url: partial.url,
    meta_countries: partial.meta_countries ?? ["US"],
    max_competitors: partial.max_competitors ?? 8,
    interval_minutes: Math.max(5, partial.interval_minutes ?? 60),
    created_at: idx >= 0 ? jobs[idx].created_at : now,
    updated_at: now,
    last_run_at: partial.last_run_at ?? (idx >= 0 ? jobs[idx].last_run_at : null),
    next_run_at: partial.next_run_at ?? (idx >= 0 ? jobs[idx].next_run_at : null),
    last_status: partial.last_status ?? (idx >= 0 ? jobs[idx].last_status : "idle"),
    last_error: partial.last_error ?? (idx >= 0 ? jobs[idx].last_error : null),
    last_snapshot: partial.last_snapshot ?? (idx >= 0 ? jobs[idx].last_snapshot : undefined),
  };
  if (idx >= 0) jobs[idx] = next;
  else jobs.push(next);
  await writeAll(jobs);
  return next;
}

export async function deleteJob(id: string): Promise<boolean> {
  const jobs = await readAll();
  const next = jobs.filter((j) => j.id !== id);
  if (next.length === jobs.length) return false;
  await writeAll(next);
  return true;
}

export function computeNextRun(intervalMinutes: number): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() + intervalMinutes);
  return d.toISOString();
}
