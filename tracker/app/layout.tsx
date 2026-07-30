import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Bet — Progress Tracker",
  description: "Live NeetCode accountability tracker, pulled straight from GitHub.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
