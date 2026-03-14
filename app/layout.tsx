import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Vaiket Studio",
  description: "Vaiket Studio Website Builder"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}

