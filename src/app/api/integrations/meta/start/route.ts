import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";
import { createOAuthState } from "@/lib/oauth-state";

export async function GET(req: Request) {
  if (!isClerkMiddlewareEnabled()) {
    return NextResponse.json(
      { error: "Clerk required for Meta connect. Set Clerk keys or paste token in settings." },
      { status: 501 },
    );
  }
  const { userId } = await auth();
  if (!userId) {
    const origin = process.env.NEXT_PUBLIC_APP_URL || new URL(req.url).origin;
    return NextResponse.redirect(new URL("/sign-in?redirect_url=/settings/integrations", origin));
  }

  const appId = process.env.NEXT_PUBLIC_META_APP_ID?.trim();
  if (!appId) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_META_APP_ID not configured" },
      { status: 503 },
    );
  }

  const base = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || new URL(req.url).origin;
  const redirectUri = `${base}/api/integrations/meta/callback`;
  const state = createOAuthState(userId);
  const scope = process.env.META_OAUTH_SCOPES?.trim() || "ads_read,public_profile,email";
  const url = new URL(`https://www.facebook.com/${process.env.META_GRAPH_VERSION || "v21.0"}/dialog/oauth`);
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");

  return NextResponse.redirect(url.toString());
}
