import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { UserIntegrations } from "./types";
import { decryptSecret, encryptSecret } from "./crypto";

function dir(): string {
  const base = process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
  return path.join(base, "integrations");
}

function filePath(userId: string): string {
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(dir(), `${safe}.json`);
}

export async function loadUserIntegrations(userId: string): Promise<UserIntegrations | null> {
  try {
    const raw = await readFile(filePath(userId), "utf-8");
    const j = JSON.parse(raw) as UserIntegrations;
    return j ?? null;
  } catch {
    return null;
  }
}

export async function saveUserIntegrations(
  userId: string,
  patch: Partial<Omit<UserIntegrations, "updated_at">>,
): Promise<void> {
  const prev = (await loadUserIntegrations(userId)) ?? { updated_at: new Date().toISOString() };
  const next: UserIntegrations = {
    ...prev,
    ...patch,
    updated_at: new Date().toISOString(),
  };
  await mkdir(dir(), { recursive: true });
  await writeFile(filePath(userId), JSON.stringify(next, null, 2), "utf-8");
}

export function decryptMetaToken(record: UserIntegrations | null): string | null {
  if (!record?.meta_access_token_enc) return null;
  try {
    return decryptSecret(record.meta_access_token_enc);
  } catch {
    return null;
  }
}

export function decryptTikTokTokens(record: UserIntegrations | null): {
  access: string | null;
  refresh: string | null;
  clientKey: string | null;
  clientSecret: string | null;
} {
  const out = { access: null as string | null, refresh: null as string | null, clientKey: null as string | null, clientSecret: null as string | null };
  if (!record) return out;
  try {
    if (record.tiktok_access_token_enc) out.access = decryptSecret(record.tiktok_access_token_enc);
    if (record.tiktok_refresh_token_enc) out.refresh = decryptSecret(record.tiktok_refresh_token_enc);
    if (record.tiktok_client_key_enc) out.clientKey = decryptSecret(record.tiktok_client_key_enc);
    if (record.tiktok_client_secret_enc) out.clientSecret = decryptSecret(record.tiktok_client_secret_enc);
  } catch {
    /* ignore */
  }
  return out;
}

export function encryptMetaToken(token: string): string {
  return encryptSecret(token);
}

export function encryptTikTokPatch(tokens: {
  access?: string;
  refresh?: string;
  clientKey?: string;
  clientSecret?: string;
}): Partial<UserIntegrations> {
  const p: Partial<UserIntegrations> = {};
  if (tokens.access) p.tiktok_access_token_enc = encryptSecret(tokens.access);
  if (tokens.refresh) p.tiktok_refresh_token_enc = encryptSecret(tokens.refresh);
  if (tokens.clientKey) p.tiktok_client_key_enc = encryptSecret(tokens.clientKey);
  if (tokens.clientSecret) p.tiktok_client_secret_enc = encryptSecret(tokens.clientSecret);
  return p;
}
