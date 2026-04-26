"use client";

import Link from "next/link";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";

function SiteHeaderClerk() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="border-b border-[#1e1f24] bg-[#0b0c0f]/90 font-mono backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-xs font-normal uppercase tracking-[0.14em] text-[#9a9a9a] transition-colors hover:text-[#c4c4c4]"
          >
            dnads
          </Link>
          <nav className="flex items-center gap-3 text-[10px] font-normal uppercase tracking-[0.12em] text-[#5c5c5c]">
            <Link href="/guide" className="transition-colors hover:text-[#9a9a9a]">
              guide
            </Link>
            <Link href="/monitor" className="transition-colors hover:text-[#9a9a9a]">
              monitor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <span className="h-7 w-7 rounded-full bg-[#1a1b22]" aria-hidden />
          ) : isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                href="/settings/integrations"
                className="text-[10px] font-normal uppercase tracking-[0.12em] text-[#6a6a6a] hover:text-[#9a9a9a]"
              >
                integrations
              </Link>
              <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
            </div>
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
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <Link
            href="/"
            className="text-xs font-normal uppercase tracking-[0.14em] text-[#9a9a9a] transition-colors hover:text-[#c4c4c4]"
          >
            dnads
          </Link>
          <nav className="flex items-center gap-3 text-[10px] font-normal uppercase tracking-[0.12em] text-[#5c5c5c]">
            <Link href="/guide" className="transition-colors hover:text-[#9a9a9a]">
              guide
            </Link>
            <Link href="/monitor" className="transition-colors hover:text-[#9a9a9a]">
              monitor
            </Link>
          </nav>
        </div>
        <span className="text-[10px] uppercase tracking-[0.12em] text-[#5c5c5c]">local · no clerk keys</span>
      </div>
    </header>
  );
}

export function SiteHeader({ clerkActive = true }: { clerkActive?: boolean }) {
  if (!clerkActive) return <SiteHeaderLocal />;
  return <SiteHeaderClerk />;
}
