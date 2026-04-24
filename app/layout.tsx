import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL → Growth Intelligence & Ad Generator",
  description: "Competitor-driven marketing intelligence from a single URL.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
