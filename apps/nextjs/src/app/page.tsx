import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@matchfaca/auth";

import { LandingContent } from "./landing-content";

export const metadata: Metadata = {
  title: "matchFaca — Encontre Oponentes, Marque a Luta",
  description:
    "O primeiro aplicativo feito para lutadores reais se encontrarem. Crie seu perfil, encontre oponentes próximos e marque seu próximo combate.",
  openGraph: {
    title: "matchFaca — Encontre Oponentes, Marque a Luta",
    description:
      "O primeiro aplicativo feito para lutadores reais se encontrarem. Crie seu perfil, encontre oponentes próximos e marque seu próximo combate.",
    url: "https://matchfaca.app",
    siteName: "matchFaca",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// ─── Server Component (auth gate) ─────────────────────────

export default async function LandingPage() {
  const session = await auth();

  if (session?.user) {
    redirect("/swipe");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* ─── Background Layer ─── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Main blood glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-15%,hsl(0_72%_48%/0.18),transparent)]" />

        {/* Secondary glows */}
        <div className="absolute -left-48 top-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[150px]" />
        <div className="absolute -right-48 top-1/3 h-[500px] w-[500px] rounded-full bg-primary/6 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[400px] w-[400px] rounded-full bg-orange-500/3 blur-[100px]" />

        {/* Ring light */}
        <div className="absolute bottom-1/3 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/15 to-transparent" />

        {/* Animated noise texture */}
        <div className="absolute inset-0 animate-noise-drift bg-noise opacity-30" />
      </div>

      {/* ─── Content ─── */}
      <LandingContent />
    </div>
  );
}
