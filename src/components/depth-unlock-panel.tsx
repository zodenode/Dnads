"use client";

import { SignInButton } from "@clerk/nextjs";
import type { AccessTier } from "@/lib/access-tier";

type Props = {
  tier: AccessTier;
  isSignedIn: boolean;
  headline: string;
  subcopy: string;
  bullets: string[];
  /** When signed in on free tier — analyst upgrade (Stripe / Clerk Billing later). */
  upgradeHref?: string;
};

export function DepthUnlockPanel({
  tier,
  isSignedIn,
  headline,
  subcopy,
  bullets,
  upgradeHref = "/settings/access",
}: Props) {
  const showUpgrade = tier === "free" && isSignedIn;

  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-700/80 bg-gradient-to-b from-zinc-900/95 to-zinc-950 p-6 shadow-xl">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, transparent, transparent 6px, rgba(34,211,238,0.35) 6px, rgba(34,211,238,0.35) 7px)",
        }}
      />
      <div className="relative">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-400/90">
          Analysis layer
        </p>
        <h2 className="mt-2 text-lg font-semibold tracking-tight text-zinc-50">{headline}</h2>
        <p className="mt-2 text-sm leading-relaxed text-zinc-400">{subcopy}</p>
        <ul className="mt-4 space-y-2 text-sm text-zinc-300">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="mt-0.5 text-cyan-500/90" aria-hidden>
                ·
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs leading-relaxed text-zinc-500">
          We show how your market is behaving — and what to do next. Deeper analysis is available when you
          activate full intelligence resolution.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          {!isSignedIn ? (
            <SignInButton mode="modal" forceRedirectUrl="/results" signUpForceRedirectUrl="/results">
              <button
                type="button"
                className="rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
              >
                Unlock full report
              </button>
            </SignInButton>
          ) : showUpgrade ? (
            <a
              href={upgradeHref}
              className="inline-flex items-center justify-center rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Activate full market intelligence
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}
