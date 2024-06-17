import type { Metadata } from "next";
import Script from 'next/script'
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Trendy GitHub",
  description: "Trending GitHub repositories based on stars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Script defer src="https://umami.coolify.glup3.dev/script.js" data-website-id="1a75fdb3-b8fb-4f16-a9e1-602f65918b2f" />
    </html>
  );
}
