import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { useClerkProviderBypass } from "@/lib/clerk-config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "dnads — adaptive advertising intelligence",
  description:
    "Simulated evolutionary system for advertising intelligence — selection pressure, mutation, market resolution.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bypassClerk = useClerkProviderBypass();

  return (
    <ClerkProvider __internal_bypassMissingPublishableKey={bypassClerk}>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        >
          <div className="flex min-h-screen flex-col">
            <SiteHeader clerkActive={!bypassClerk} />
            <div className="flex-1">{children}</div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
