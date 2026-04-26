import { createHmac, timingSafeEqual } from "crypto";

const TTL_MS = 15 * 60 * 1000;

function sign(payload: string): string {
  const secret = process.env.INTEGRATIONS_SECRET?.trim() || "dev-only-integrations-secret-change-me";
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

/** state = base64url(userId|exp)|sig */
export function createOAuthState(userId: string): string {
  const exp = Date.now() + TTL_MS;
  const core = `${encodeURIComponent(userId)}|${exp}`;
  const sig = sign(core);
  return Buffer.from(`${core}|${sig}`, "utf8").toString("base64url");
}

export function parseOAuthState(state: string): string | null {
  try {
    const raw = Buffer.from(state, "base64url").toString("utf8");
    const last = raw.lastIndexOf("|");
    if (last <= 0) return null;
    const core = raw.slice(0, last);
    const sig = raw.slice(last + 1);
    if (sign(core) !== sig) return null;
    const pipe = core.indexOf("|");
    if (pipe < 0) return null;
    const userId = decodeURIComponent(core.slice(0, pipe));
    const exp = Number(core.slice(pipe + 1));
    if (!Number.isFinite(exp) || Date.now() > exp) return null;
    return userId;
  } catch {
    return null;
  }
}

export function safeEqual(a: string, b: string): boolean {
  try {
    const ba = Buffer.from(a);
    const bb = Buffer.from(b);
    if (ba.length !== bb.length) return false;
    return timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
}
