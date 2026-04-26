import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";
import { createOAuthState } from "@/lib/oauth-state";

export async function GET(req: Request) {
  if (!isClerkMiddlewareEnabled()) {
    return NextResponse.json(
      { error: "Clerk required for TikTok connect." },
      { status: 501 },
    );
  }
  const { userId } = await auth();
  if (!userId) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    return NextResponse.redirect(new URL("/sign-in?redirect_url=/settings/integrations", origin));
  }

  const clientKey = process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY?.trim() || process.env.TIKTOK_CLIENT_KEY?.trim();
  if (!clientKey) {
    return NextResponse.json({ error: "TIKTOK_CLIENT_KEY / NEXT_PUBLIC_TIKTOK_CLIENT_KEY not set" }, { status: 503 });
  }

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const redirectUri = `${base}/api/integrations/tiktok/callback`;
  const state = createOAuthState(userId);
  const scope =
    process.env.TIKTOK_OAUTH_SCOPES?.trim() ||
    "research.adlib.basic,user.info.basic";

  const u = new URL("https://www.tiktok.com/v2/auth/authorize/");
  u.searchParams.set("client_key", clientKey);
  u.searchParams.set("scope", scope);
  u.searchParams.set("response_type", "code");
  u.searchParams.set("redirect_uri", redirectUri);
  u.searchParams.set("state", state);

  return NextResponse.redirect(u.toString());
}
