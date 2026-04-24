"use client";

import Link from "next/link";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";

function SiteHeaderClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="border-b border-[#1e1f24] bg-[#0b0c0f]/90 font-mono backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-xs font-normal uppercase tracking-[0.14em] text-[#9a9a9a] transition-colors hover:text-[#c4c4c4]"
        >
          dnads
        </Link>
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <span className="h-7 w-7 rounded-full bg-[#1a1b22]" aria-hidden />
          ) : isSignedIn ? (
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/results" signUpForceRedirectUrl="/results">
              <button
                type="button"
                className="border border-[#3d3d44] px-3 py-1.5 text-[10px] font-normal uppercase tracking-[0.12em] text-[#9a9a9a] transition-colors hover:border-[#52525a] hover:text-[#c4c4c4]"
              >
                Sign in
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </header>
  );
}

function SiteHeaderLocal() {
  return (
    <header className="border-b border-[#1e1f24] bg-[#0b0c0f]/90 font-mono backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-xs font-normal uppercase tracking-[0.14em] text-[#9a9a9a] transition-colors hover:text-[#c4c4c4]"
        >
          dnads
        </Link>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c5c5c]">local · no clerk keys</span>
      </div>
    </header>
  );
}

export function SiteHeader({ clerkActive = true }: { clerkActive?: boolean }) {
  if (!clerkActive) return <SiteHeaderLocal />;
  return <SiteHeaderClerk />;
}
