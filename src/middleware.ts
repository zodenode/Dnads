import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isClerkMiddlewareEnabled } from "@/lib/clerk-config";

/**
 * When Clerk keys are not configured, skip auth middleware so the app runs locally.
 * With real pk_test_/pk_live_ keys, sessions refresh on matched routes.
 */
export default isClerkMiddlewareEnabled()
  ? clerkMiddleware()
  : function passthrough() {
      return NextResponse.next();
    };

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
