import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AccessSettingsPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in?redirect_url=/settings/access");

  const user = await currentUser();
  const meta = (user?.publicMetadata ?? {}) as Record<string, unknown>;
  const plan =
    typeof meta.plan === "string"
      ? meta.plan
      : typeof meta.tier === "string"
        ? meta.tier
        : "not set";

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <p className="text-xs font-medium uppercase tracking-wider text-cyan-400/90">
        Analyst access
      </p>
      <h1 className="mt-2 text-2xl font-semibold text-zinc-50">Intelligence resolution</h1>
      <p className="mt-4 text-sm leading-relaxed text-zinc-400">
        Pricing maps to <strong className="text-zinc-200">depth of market intelligence</strong>, not to
        unlocking generic AI output. Your current Clerk{" "}
        <code className="rounded bg-zinc-800 px-1 text-xs text-cyan-300">publicMetadata.plan</code> is:
      </p>
      <p className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 font-mono text-sm text-zinc-200">
        {plan}
      </p>
      <p className="mt-6 text-sm text-zinc-400">
        For development, set <code className="text-cyan-300">plan</code> to{" "}
        <code className="text-cyan-300">pro</code> or <code className="text-cyan-300">studio</code> in the
        Clerk Dashboard (Users → Public metadata). In production, assign this from Stripe webhooks or
        Clerk Billing after purchase.
      </p>
      <Link href="/results" className="mt-8 inline-block text-sm text-cyan-400 hover:text-cyan-300">
        ← Back to report
      </Link>
    </main>
  );
}
