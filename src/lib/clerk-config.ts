/**
 * Clerk is optional for local smoke tests (no dashboard keys).
 * Set NEXT_PUBLIC_CLERK_DISABLED=1 or omit NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY to bypass middleware auth.
 */
export function isClerkMiddlewareEnabled(): boolean {
  if (process.env.NEXT_PUBLIC_CLERK_DISABLED === "1") return false;
  const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim();
  if (!pk) return false;
  return pk.startsWith("pk_test_") || pk.startsWith("pk_live_");
}

export function useClerkProviderBypass(): boolean {
  return !isClerkMiddlewareEnabled();
}
