import type { Metadata } from "next";
import { Inter, Orbitron, Oxanium } from "next/font/google";
import { headers } from "next/headers";
import { Suspense } from "react";
import { preconnect } from "react-dom";
import Providers from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { env } from "@/lib/env";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const orbitron = Orbitron({ subsets: ["latin"], variable: "--font-orbitron" });
const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-oxanium" });

const appUrl = env.NEXT_PUBLIC_URL;
const appName = env.NEXT_PUBLIC_APPLICATION_NAME;
const appDescription = env.NEXT_PUBLIC_APPLICATION_DESCRIPTION;

export function generateMetadata(): Metadata {
  return {
    title: `${appName} by Builders Garden`,
    description: appDescription,
    metadataBase: new URL(appUrl),
    openGraph: {
      title: `${appName} by Builders Garden`,
      description: appDescription,
      type: "website",
      images: [
        {
          url: `${appUrl}/images/feed.png`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${appName} by Builders Garden`,
      description: appDescription,
      siteId: "1727435024931094528",
      creator: "@builders_garden",
      creatorId: "1727435024931094528",
      images: [`${appUrl}/images/feed.png`],
    },
    other: {
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: `${appUrl}/images/feed-3x2.png`,
        button: {
          title: "Launch App",
          action: {
            type: "launch_miniapp",
            name: appName,
            url: appUrl,
            splashImageUrl: `${appUrl}/images/splash.png`,
            splashBackgroundColor: "#ffffff",
          },
        },
      }),
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  preconnect("https://auth.farcaster.xyz");
  const cookie = (await headers()).get("cookie");

  return (
    <html className="dark no-scrollbar" lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} ${orbitron.variable} ${oxanium.variable} size-full antialiased`}
      >
        <Providers cookie={cookie}>
          <main className="no-scrollbar flex w-full flex-col gap-0">
            {children}
          </main>
          <Suspense>
            <Toaster />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
