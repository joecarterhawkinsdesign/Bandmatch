import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BandMatch",
  description: "Swipe to find musicians to start your next band."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
