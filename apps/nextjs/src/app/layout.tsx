import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@matchfaca/ui";
import { Toaster } from "@matchfaca/ui/toast";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";

import { env } from "~/env";

export const metadata: Metadata = {
  metadataBase: new URL(
    env.VERCEL_ENV === "production"
      ? "https://matchfaca.app"
      : "http://localhost:3000",
  ),
  title: "matchFaca — Encontros que Escalam",
  description:
    "O Tinder da porrada. Encontre oponentes, marque brigas, resolva no soco.",
  openGraph: {
    title: "matchFaca — Encontros que Escalam",
    description:
      "O Tinder da porrada. Encontre oponentes, marque brigas, resolva no soco.",
    url: "https://matchfaca.app",
    siteName: "matchFaca",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: dark)", color: "black" }],
};

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <TRPCReactProvider>
          {props.children}
        </TRPCReactProvider>
        <Toaster />
      </body>
    </html>
  );
}
