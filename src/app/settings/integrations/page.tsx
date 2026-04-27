import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { IntegrationsForm } from "@/components/integrations-form";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";

export default async function IntegrationsPage() {
  if (!isClerkMiddlewareEnabled()) {
    return (
      <main className="mx-auto max-w-lg px-6 py-16">
        <h1 className="text-xl font-semibold text-zinc-100">Integrations</h1>
        <p className="mt-4 text-sm text-zinc-400">
          Clerk is not configured. Enable Clerk and set{" "}
          <code className="text-cyan-400">NEXT_PUBLIC_APP_URL</code>, Meta app id, and TikTok keys for OAuth.
          You can still use server <code className="text-cyan-400">META_ACCESS_TOKEN</code> / TikTok client credentials in{" "}
          <code className="text-cyan-400">.env</code>.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-cyan-400">
          ← Home
        </Link>
      </main>
    );
  }

  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/settings/integrations");

  return (
    <main className="mx-auto max-w-xl px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">Settings</p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Meta &amp; TikTok</h1>
      <p className="mt-3 text-sm text-zinc-400">
        Connect your accounts so <strong className="text-zinc-200">Generate</strong> uses your tokens instead of
        hunting server env keys. Cron jobs created while signed in inherit your integrations.
      </p>
      <Suspense fallback={<p className="mt-8 text-sm text-zinc-500">Loading…</p>}>
        <div className="mt-8">
          <IntegrationsForm />
        </div>
      </Suspense>
      <p className="mt-10 text-xs text-zinc-600">
        Docs: <code className="text-zinc-500">docs/INTEGRATIONS.md</code>
      </p>
      <Link href="/settings/access" className="mt-4 inline-block text-sm text-cyan-400 hover:text-cyan-300">
        Analyst access →
      </Link>
    </main>
  );
}
