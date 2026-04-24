import { clerkMiddleware } from "@clerk/nextjs/server";

/**
 * Clerk session refresh for all matched routes.
 * Routes stay reachable without login so users complete the taste experience;
 * depth is gated in UI (see results page), not at generation.
 */
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
