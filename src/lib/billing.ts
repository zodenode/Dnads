/**
 * Payment placeholder for campaign pack downloads.
 * Replace `unlockPackForSession` with a Stripe Checkout success handler
 * (e.g. session_id verification + signed cookie).
 */

const STORAGE_KEY = "growth_pack_download_unlocked";

export function isPackDownloadUnlocked(): boolean {
  if (typeof window === "undefined") return false;
  return window.sessionStorage.getItem(STORAGE_KEY) === "1";
}

/** Demo-only: call after successful Stripe checkout in production. */
export function unlockPackForSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(STORAGE_KEY, "1");
}

export function lockPackForSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
