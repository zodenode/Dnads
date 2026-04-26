import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";
import {
  encryptMetaToken,
  encryptTikTokPatch,
  saveUserIntegrations,
} from "@/lib/integrations/store";

export async function POST(req: Request) {
  if (!isClerkMiddlewareEnabled()) {
    return NextResponse.json({ error: "Clerk required to save integrations." }, { status: 501 });
  }
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as {
    meta_access_token?: string;
    tiktok_access_token?: string;
    tiktok_refresh_token?: string;
    tiktok_client_key?: string;
    tiktok_client_secret?: string;
  };

  const patch: Parameters<typeof saveUserIntegrations>[1] = {};

  if (typeof body.meta_access_token === "string" && body.meta_access_token.trim()) {
    patch.meta_access_token_enc = encryptMetaToken(body.meta_access_token.trim());
  }

  const tt = encryptTikTokPatch({
    access: body.tiktok_access_token?.trim(),
    refresh: body.tiktok_refresh_token?.trim(),
    clientKey: body.tiktok_client_key?.trim(),
    clientSecret: body.tiktok_client_secret?.trim(),
  });
  Object.assign(patch, tt);

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Provide at least one token field" }, { status: 400 });
  }

  await saveUserIntegrations(userId, patch);
  return NextResponse.json({ ok: true });
}
