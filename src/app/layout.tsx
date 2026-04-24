import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "URL → Growth Intelligence & Ad Generator",
  description:
    "Competitor-driven marketing intelligence: patterns, simulated ad libraries, and campaign packs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
