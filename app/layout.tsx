import React from "react";
import { Analytics } from "@vercel/analytics/next";
import { Metadata } from "next";
import localFont from "next/font/local";
import { cn } from "@/lib/utils";
import { DEFAULT_OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

// Fonts are self-hosted from app/fonts/ (latin subset, from Fontsource, OFL-1.1).
// next/font/google downloads them from fonts.googleapis.com during every build,
// and a single failed download there fails the whole Vercel deploy.

const fontSans = localFont({
  src: "./fonts/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
});

const nunito = localFont({
  src: "./fonts/nunito-latin-wght-normal.woff2",
  variable: "--font-nunito",
  weight: "200 1000",
});

const lato = localFont({
  src: "./fonts/lato-latin-400-normal.woff2",
  variable: "--font-lato",
  weight: "400",
});

// Display serif for the poetry and the statement — the human layer.
const fontSerif = localFont({
  src: [
    { path: "./fonts/cormorant-garamond-latin-wght-normal.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/cormorant-garamond-latin-wght-italic.woff2", weight: "300 700", style: "italic" },
  ],
  variable: "--font-serif",
});

// Monospace for dates, languages and credits — the machine layer.
const fontMono = localFont({
  src: "./fonts/jetbrains-mono-latin-wght-normal.woff2",
  variable: "--font-mono",
  weight: "100 800",
});

export const metadata: Metadata = {
  // Required so relative OG/Twitter image paths resolve to absolute URLs.
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "en_US",
    images: [{ ...DEFAULT_OG_IMAGE, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE.url],
  },
  // Icons are picked up by convention from app/favicon.ico, app/icon.png
  // and app/apple-icon.png — no need to declare them here.
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        fontSans.variable,
        nunito.variable,
        lato.variable,
        fontSerif.variable,
        fontMono.variable,
      )}
    >
      <body className="tz min-h-screen antialiased">
        <VideoDialogProvider>
          {children}
          <VideoDialog />
        </VideoDialogProvider>
        <TailwindIndicator />
        <Analytics />
      </body>
    </html>
  );
}
