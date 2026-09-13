import React from "react";
import { Metadata } from "next";
import { Inter as FontSans, Lato, Nunito } from "next/font/google";
import { cn } from "@/lib/utils";
import { VideoDialogProvider } from "@/components/ui/VideoDialogContext";
import VideoDialog from "@/components/ui/VideoDialog";
import { Analytics } from "@vercel/analytics/next";

import "@/styles.css";
import { TailwindIndicator } from "@/components/ui/breakpoint-indicator";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

const lato = Lato({
  subsets: ["latin"],
  variable: "--font-lato",
  weight: "400",
});

const SITE_NAME = "Tatjanizza";
const SITE_DESCRIPTION =
  "Music in ancient and modern tongues — Akkadian, Phoenician, Old Norse, Sanskrit, Old Greek, Hebrew, Welsh and Serbian.";

export const metadata: Metadata = {
  // Required so relative OG/Twitter image paths resolve to absolute URLs.
  metadataBase: new URL("https://www.tatjanizza.com"),
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
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: ["/og.jpg"],
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
    <html lang="en" className={cn(fontSans.variable, nunito.variable, lato.variable)}>
      <body className="min-h-screen bg-background font-sans antialiased">
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
