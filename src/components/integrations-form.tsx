"use client";

import { useSearchParams } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

export function IntegrationsForm() {
  const sp = useSearchParams();
  const [metaToken, setMetaToken] = useState("");
  const [tikTokAccess, setTikTokAccess] = useState("");
  const [tikTokRefresh, setTikTokRefresh] = useState("");
  const [tikTokKey, setTikTokKey] = useState("");
  const [tikTokSecret, setTikTokSecret] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const m = sp.get("meta");
    const t = sp.get("tiktok");
    const message = sp.get("message");
    startTransition(() => {
      if (m === "ok") setMsg("Meta connected.");
      if (m === "error") setErr(`Meta: ${message || "failed"}`);
      if (t === "ok") setMsg((p) => (p ? `${p} ` : "") + "TikTok connected.");
      if (t === "error") setErr(`TikTok: ${message || "failed"}`);
    });
  }, [sp]);

  async function saveManual(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      const res = await fetch("/api/integrations/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta_access_token: metaToken.trim() || undefined,
          tiktok_access_token: tikTokAccess.trim() || undefined,
          tiktok_refresh_token: tikTokRefresh.trim() || undefined,
          tiktok_client_key: tikTokKey.trim() || undefined,
          tiktok_client_secret: tikTokSecret.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Save failed");
      setMsg("Saved. Tokens are encrypted at rest.");
      setMetaToken("");
      setTikTokAccess("");
      setTikTokRefresh("");
      setTikTokKey("");
      setTikTokSecret("");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      {(msg || err) && (
        <div className="rounded border border-zinc-800 bg-zinc-900/50 p-3 text-sm">
          {msg && <p className="text-emerald-400">{msg}</p>}
          {err && <p className="text-red-400">{err}</p>}
        </div>
      )}

      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Connect with OAuth (recommended)</h2>
        <p className="mt-2 text-xs text-zinc-500">
          Redirects to Meta / TikTok. You must register redirect URIs in each developer console (see docs).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/api/integrations/meta/start"
            className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Connect Meta
          </a>
          <a
            href="/api/integrations/tiktok/start"
            className="rounded border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
          >
            Connect TikTok
          </a>
        </div>
      </section>

      <section className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Or paste tokens manually</h2>
        <p className="mt-2 text-xs text-zinc-500">
          Stored encrypted with <code className="text-zinc-400">INTEGRATIONS_SECRET</code>. Used when you run Generate while signed in.
        </p>
        <form onSubmit={saveManual} className="mt-4 space-y-4">
          <label className="block text-xs text-zinc-400">
            Meta user access token (ads_read)
            <textarea
              value={metaToken}
              onChange={(e) => setMetaToken(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-200"
              placeholder="EAAB..."
            />
          </label>
          <label className="block text-xs text-zinc-400">
            TikTok user access token (research scopes)
            <textarea
              value={tikTokAccess}
              onChange={(e) => setTikTokAccess(e.target.value)}
              rows={2}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-200"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            TikTok refresh token (optional)
            <input
              value={tikTokRefresh}
              onChange={(e) => setTikTokRefresh(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-200"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            TikTok client key (optional — overrides server default for your OAuth app)
            <input
              value={tikTokKey}
              onChange={(e) => setTikTokKey(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-200"
            />
          </label>
          <label className="block text-xs text-zinc-400">
            TikTok client secret (optional)
            <input
              type="password"
              value={tikTokSecret}
              onChange={(e) => setTikTokSecret(e.target.value)}
              className="mt-1 w-full rounded border border-zinc-700 bg-zinc-950 px-2 py-2 font-mono text-xs text-zinc-200"
            />
          </label>
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-cyan-600 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-cyan-500 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save tokens"}
          </button>
        </form>
      </section>

      <section className="rounded-lg border border-amber-900/40 bg-amber-950/20 p-4 text-xs text-amber-200/90">
        <strong className="text-amber-100">Backup HTML fetch:</strong> set{" "}
        <code className="rounded bg-black/30 px-1">BACKUP_HTML_FETCH=1</code> on the server. If APIs return
        very few rows, the pipeline fetches public library HTML and extracts text snippets (fragile, ToS-sensitive).
      </section>
    </div>
  );
}
