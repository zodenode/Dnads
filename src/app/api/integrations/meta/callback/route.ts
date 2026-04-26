import { NextResponse } from "next/server";
import { parseOAuthState } from "@/lib/oauth-state";
import { encryptMetaToken, saveUserIntegrations } from "@/lib/integrations/store";

const GRAPH = process.env.META_GRAPH_VERSION || "v21.0";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error_description") || url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const back = `${base}/settings/integrations`;

  if (err || !code || !state) {
    return NextResponse.redirect(`${back}?meta=error&message=${encodeURIComponent(err || "missing code")}`);
  }

  const userId = parseOAuthState(state);
  if (!userId) {
    return NextResponse.redirect(`${back}?meta=error&message=invalid_state`);
  }

  const appId = process.env.NEXT_PUBLIC_META_APP_ID?.trim();
  const secret = process.env.META_APP_SECRET?.trim();
  if (!appId || !secret) {
    return NextResponse.redirect(`${back}?meta=error&message=missing_app_secret`);
  }

  const redirectUri = `${base}/api/integrations/meta/callback`;

  const tokenUrl = new URL(`https://graph.facebook.com/${GRAPH}/oauth/access_token`);
  tokenUrl.searchParams.set("client_id", appId);
  tokenUrl.searchParams.set("redirect_uri", redirectUri);
  tokenUrl.searchParams.set("client_secret", secret);
  tokenUrl.searchParams.set("code", code);

  const tr = await fetch(tokenUrl.toString());
  const tj = (await tr.json()) as { access_token?: string; error?: { message?: string } };
  if (!tr.ok || !tj.access_token) {
    return NextResponse.redirect(
      `${back}?meta=error&message=${encodeURIComponent(tj.error?.message || "token_exchange_failed")}`,
    );
  }

  let longLived = tj.access_token;
  const ex = new URL(`https://graph.facebook.com/${GRAPH}/oauth/access_token`);
  ex.searchParams.set("grant_type", "fb_exchange_token");
  ex.searchParams.set("client_id", appId);
  ex.searchParams.set("client_secret", secret);
  ex.searchParams.set("fb_exchange_token", tj.access_token);
  const er = await fetch(ex.toString());
  const ej = (await er.json()) as { access_token?: string };
  if (er.ok && ej.access_token) longLived = ej.access_token;

  await saveUserIntegrations(userId, { meta_access_token_enc: encryptMetaToken(longLived) });

  return NextResponse.redirect(`${back}?meta=ok`);
}
