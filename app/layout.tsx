import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Variable-font form (no `weight: [...]`) — Geist + Geist Mono are variable
// fonts. Loading the variable form matches the design mockup's @import URL
// (Geist:wght@300;400;500;600;700) and gets accurate hinting at every weight.
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "akro-app — Safety MTO Platform",
  description:
    "Multi-tenant Safety MTO platform for fall protection and height-safety contractors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
