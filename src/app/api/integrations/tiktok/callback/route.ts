import { NextResponse } from "next/server";
import { parseOAuthState } from "@/lib/oauth-state";
import { encryptTikTokPatch, saveUserIntegrations } from "@/lib/integrations/store";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const err = url.searchParams.get("error_description") || url.searchParams.get("error");

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const back = `${base}/settings/integrations`;

  if (err || !code || !state) {
    return NextResponse.redirect(`${back}?tiktok=error&message=${encodeURIComponent(err || "missing code")}`);
  }

  const userId = parseOAuthState(state);
  if (!userId) {
    return NextResponse.redirect(`${back}?tiktok=error&message=invalid_state`);
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY?.trim() || process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY?.trim();
  const secret = process.env.TIKTOK_CLIENT_SECRET?.trim();
  if (!clientKey || !secret) {
    return NextResponse.redirect(`${back}?tiktok=error&message=missing_client_secret`);
  }

  const redirectUri = `${base}/api/integrations/tiktok/callback`;

  const body = new URLSearchParams({
    client_key: clientKey,
    client_secret: secret,
    code,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });

  const tr = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });
  const tj = (await tr.json()) as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
    error_description?: string;
  };

  if (!tr.ok || !tj.access_token) {
    return NextResponse.redirect(
      `${back}?tiktok=error&message=${encodeURIComponent(tj.error_description || tj.error || "token_failed")}`,
    );
  }

  await saveUserIntegrations(
    userId,
    encryptTikTokPatch({
      access: tj.access_token,
      refresh: tj.refresh_token,
    }),
  );

  return NextResponse.redirect(`${back}?tiktok=ok`);
}
