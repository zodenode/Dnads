"use client";

import Link from "next/link";
import { SignInButton, useAuth, UserButton } from "@clerk/nextjs";

export function SiteHeader() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="text-sm font-semibold tracking-tight text-zinc-100 hover:text-cyan-300">
            Growth Intelligence
          </Link>
          <nav className="flex items-center gap-3 text-xs font-medium text-zinc-500">
            <Link href="/" className="hover:text-cyan-400">
              Home
            </Link>
            <Link href="/guide" className="hover:text-cyan-400">
              Guide
            </Link>
            <Link href="/monitor" className="hover:text-cyan-400">
              Monitor
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {!isLoaded ? (
            <span className="h-8 w-8 rounded-full bg-zinc-800" aria-hidden />
          ) : isSignedIn ? (
            <UserButton appearance={{ elements: { userButtonAvatarBox: "h-8 w-8" } }} />
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/results" signUpForceRedirectUrl="/results">
              <button
                type="button"
                className="rounded-md border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:border-zinc-500 hover:bg-zinc-900"
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
