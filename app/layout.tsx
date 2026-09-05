import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScroll from "./components/smooth-scroll";
import FloatingShootToggleHost from "./components/floating-shoot-toggle-host";
import {buildIdentityMetadata} from "@/lib/identity/build-metadata";
import {getIdentityViewModel} from "@/lib/identity/get-identity";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const identity = await getIdentityViewModel();
  return buildIdentityMetadata(identity.metadata);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <FloatingShootToggleHost />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
