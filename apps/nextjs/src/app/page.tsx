import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth, signIn } from "@matchfaca/auth";
import { Button } from "@matchfaca/ui/button";

export const metadata: Metadata = {
  title: "matchFaca — Encontre Oponentes, Marque a Luta",
  description:
    "O Tinder da porrada. Encontre oponentes reais na sua área, marque lutas, prove seu valor.",
  openGraph: {
    title: "matchFaca — Encontre Oponentes, Marque a Luta",
    description:
      "O Tinder da porrada. Encontre oponentes reais na sua área, marque lutas, prove seu valor.",
    url: "https://matchfaca.app",
    siteName: "matchFaca",
  },
  twitter: {
    card: "summary_large_image",
  },
};

function SignInButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord", { redirectTo: "/swipe" });
      }}
    >
      <Button
        type="submit"
        size="lg"
        className="glow-fire h-14 w-full rounded-xl border-0 bg-primary text-base font-bold tracking-wide text-white shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 active:scale-[0.97]"
      >
        <span className="flex items-center gap-3">
          <DiscordIcon />
          Entrar com Discord
        </span>
      </Button>
    </form>
  );
}

export default async function LandingPage() {
  const session = await auth();

  // Usuário já logado — pula direto pro app
  if (session?.user) {
    redirect("/swipe");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0A0A0A]">
      {/* ─── Background Effects ─── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Blood gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,hsl(0_72%_48%/0.15),transparent)]" />

        {/* Side blood splatter */}
        <div className="absolute -left-32 top-1/4 h-[500px] w-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -right-32 top-1/3 h-[400px] w-[400px] rounded-full bg-primary/8 blur-[100px]" />

        {/* Noise texture */}
        <div className="absolute inset-0 bg-noise opacity-40" />

        {/* Ring lights */}
        <div className="absolute bottom-1/3 left-1/2 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      {/* ─── Content ─── */}
      <div className="relative z-10">
        {/* ─── Hero ─── */}
        <section className="flex min-h-dvh flex-col items-center justify-center px-6 text-center">
          {/* Logo / Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/80">
            <span className="size-1.5 animate-pulse rounded-full bg-primary" />
            Beta Fechado
          </div>

          {/* Headline */}
          <h1 className="max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
            match
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              Faca
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/50 sm:text-xl">
            O primeiro aplicativo feito para lutadores reais se encontrarem.
            Crie seu perfil, encontre oponentes próximos e marque seu próximo
            combate.
          </p>

          {/* CTA */}
          <div className="mt-10 w-full max-w-xs">
            <SignInButton />
          </div>

          {/* Social proof */}
          <p className="mt-4 text-xs text-white/25">
            Junte-se a centenas de lutadores ativos
          </p>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/20"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
            </svg>
          </div>
        </section>

        {/* ─── Como Funciona ─── */}
        <section className="relative border-t border-white/5 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Como{" "}
                <span className="text-primary">funciona</span>
              </h2>
              <p className="mt-3 text-white/40">
                Três passos para entrar no ringue
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {steps.map((step, i) => (
                <div
                  key={step.title}
                  className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all duration-500 hover:border-primary/20 hover:bg-primary/[0.03]"
                >
                  {/* Step number */}
                  <div className="mb-6 flex size-12 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-lg font-bold text-primary">
                    {i + 1}
                  </div>

                  {/* Connector line (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="absolute -right-4 top-12 hidden h-px w-8 bg-gradient-to-r from-primary/30 to-transparent md:block" />
                  )}

                  <h3 className="mb-3 text-lg font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="leading-relaxed text-white/40">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Features ─── */}
        <section className="relative border-t border-white/5 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <div className="mb-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Por que{" "}
                <span className="text-primary">matchFaca</span>?
              </h2>
              <p className="mt-3 text-white/40">
                Feito por lutadores, para lutadores
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all duration-300 hover:border-primary/20 hover:bg-primary/[0.04]"
                >
                  <div className="mb-4 flex size-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-lg">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-white/40">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA Final ─── */}
        <section className="relative border-t border-white/5 px-6 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex size-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/10 text-4xl">
              🥊
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto pra{" "}
              <span className="text-primary">porrada</span>?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-white/40">
              Crie seu perfil em menos de 2 minutos e comece a desafiar
              oponentes na sua região.
            </p>
            <div className="mt-10">
              <SignInButton />
            </div>
          </div>
        </section>

        {/* ─── Footer ─── */}
        <footer className="border-t border-white/5 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                match
                <span className="text-primary">Faca</span>
              </span>
              <span className="text-xs text-white/20">•</span>
              <span className="text-xs text-white/20">
                Encontros que escalam
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/30">
              <span>© 2026 matchFaca</span>
              <span>Termos de uso</span>
              <span>Privacidade</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── Data ───────────────────────────────────────────────────

const steps = [
  {
    title: "Crie seu perfil",
    description:
      "Monte sua ficha de lutador: apelido, estilo de luta, categoria de peso e localização. Mostre do que você é feito.",
  },
  {
    title: "Encontre oponentes",
    description:
      "Deslize por lutadores próximos. Veja o estilo, cartel e nível de cada um. Desafie quem te interessar.",
  },
  {
    title: "Marque a luta",
    description:
      "Se o desafio for aceito, combinem local, data e regras. Resolvam no ringue como verdadeiros guerreiros.",
  },
];

const features = [
  {
    icon: "📍",
    title: "Oponentes próximos",
    description:
      "Encontre lutadores perto de você usando geolocalização. Nada de viajar horas pra trocar uma porrada.",
  },
  {
    icon: "⚔️",
    title: "Match por estilo",
    description:
      "Filtre por modalidade: Boxe, Jiu-Jitsu, Muay Thai, MMA e mais. Enfrente alguém da sua área ou explore novos estilos.",
  },
  {
    icon: "📊",
    title: "Cartel ao vivo",
    description:
      "Cada luta registrada entra no seu histórico. Vitórias, derrotas — seu cartel fala por você.",
  },
  {
    icon: "💬",
    title: "Chat integrado",
    description:
      "Combine regras, local e data diretamente no chat. Sem precisar trocar WhatsApp com estranho.",
  },
  {
    icon: "🛡️",
    title: "Segurança primeiro",
    description:
      "Perfis verificados, denúncia de abuso e moderação ativa. Respeito dentro e fora do ringue.",
  },
  {
    icon: "🏆",
    title: "Ranking de lutadores",
    description:
      "Suba no ranking conforme vence. Quanto mais luta, mais alto você sobe. O topo espera por você.",
  },
];

// ─── Discord Icon SVG ──────────────────────────────────────

function DiscordIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09-.01-.02-.04-.03-.07-.03-1.5.26-2.93.71-4.27 1.33-.01 0-.02.01-.03.02-2.72 4.07-3.47 8.03-3.1 11.95 0 .02.01.04.03.05 1.8 1.32 3.53 2.12 5.24 2.65.03.01.06 0 .07-.02.4-.55.76-1.13 1.07-1.74.02-.04 0-.08-.04-.09-.57-.22-1.11-.48-1.64-.78-.04-.02-.04-.08-.01-.11.11-.08.22-.17.33-.25.02-.02.05-.02.07-.01 3.44 1.57 7.15 1.57 10.55 0 .02-.01.05-.01.07.01.11.08.22.17.33.25.04.03.04.09-.01.11-.52.31-1.07.56-1.64.78-.04.01-.05.06-.04.09.32.61.68 1.19 1.07 1.74.03.01.06.02.09.01 1.72-.53 3.45-1.33 5.25-2.65.02-.01.03-.03.03-.05.44-4.53-.73-8.46-3.1-11.95-.01-.01-.02-.02-.04-.02M8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.83-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.84 2.12-1.89 2.12m6.97 0c-1.03 0-1.89-.95-1.89-2.12s.83-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12 0 1.17-.83 2.12-1.89 2.12"
        fill="currentColor"
      />
    </svg>
  );
}
