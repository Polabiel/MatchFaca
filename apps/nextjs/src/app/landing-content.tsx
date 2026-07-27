"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@matchfaca/ui/button";
import { signInWithDiscord } from "./landing-actions";

import {
  Swords,
  MapPin,
  BarChart3,
  MessageSquare,
  Shield,
  Trophy,
  ChevronDown,
  Crosshair,
  Users,
  Target,
  Fingerprint,
} from "lucide-react";

// ─── Server Action Wrapper ────────────────────────────────

function SignInButton() {
  return (
    <form action={signInWithDiscord}>
      <Button
        type="submit"
        className="glow-fire group relative h-14 w-full overflow-hidden rounded-xl border-0 bg-primary text-base font-bold tracking-wide text-white shadow-2xl transition-all duration-300 hover:scale-[1.03] hover:bg-primary/90 active:scale-[0.97]"
      >
        <span className="relative z-10 flex items-center justify-center gap-3">
          <DiscordIcon />
          Entrar com Discord
        </span>
        <span className="absolute inset-0 translate-y-full bg-gradient-to-t from-white/10 to-transparent transition-transform duration-300 group-hover:translate-y-0" />
      </Button>
    </form>
  );
}

// ─── Header ───────────────────────────────────────────────

function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Como Funciona", href: "#como-funciona" },
    { label: "Recursos", href: "#recursos" },
  ];

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-white/[0.04] bg-[#0A0A0A]/80 backdrop-blur-xl"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10">
            <Crosshair className="size-4 text-primary" />
          </div>
          <span className="text-sm font-bold tracking-tight text-white">
            match
            <span className="text-primary">Faca</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm tracking-wide text-white/50 transition-colors duration-200 hover:text-white/80"
            >
              {item.label}
            </a>
          ))}
          <form action={signInWithDiscord}>
            <Button
              type="submit"
              size="sm"
              className="rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20"
            >
              <span className="flex items-center gap-2">
                <DiscordIconSmall />
                Entrar
              </span>
            </Button>
          </form>
        </nav>

        {/* Mobile Hamburger */}
        <button
          type="button"
          className="relative z-50 flex size-10 items-center justify-center md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`block h-px w-full bg-white/60 transition-all duration-300 ${
                mobileOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-white/60 transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-px w-full bg-white/60 transition-all duration-300 ${
                mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </div>
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-[#0A0A0A]/98 backdrop-blur-2xl transition-all duration-500 md:hidden ${
            mobileOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="text-2xl font-bold tracking-tight text-white/80 transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
          <form action={signInWithDiscord} className="mt-4">
            <Button
              type="submit"
              size="lg"
              className="glow-fire rounded-xl border-0 bg-primary px-10 font-bold text-white shadow-2xl"
            >
              <span className="flex items-center gap-3">
                <DiscordIcon />
                Entrar com Discord
              </span>
            </Button>
          </form>
        </div>
      </div>
    </header>
  );
}

// ─── Hero Section ─────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative flex min-h-dvh flex-col items-center justify-center px-6 pt-20 text-center">
      {/* Badge */}
      <div className="animate-fade-in-blur animation-delay-100 mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] text-primary/80">
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary/75 opacity-75" />
          <span className="relative inline-flex size-1.5 rounded-full bg-primary" />
        </span>
        Beta Fechado
      </div>

      {/* Headline */}
      <h1 className="animate-fade-in-blur animation-delay-200 max-w-4xl text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl">
        <span className="text-white">match</span>
        <span className="bg-gradient-to-r from-primary via-primary to-orange-500 bg-clip-text text-transparent">
          Faca
        </span>
      </h1>

      {/* Decrypted Subtitle */}
      <div className="animate-fade-in-blur animation-delay-300 mt-6 max-w-xl">
        <DecryptedText
          text="Lutadores reais. Porrada de verdade."
          className="text-lg leading-relaxed text-white/50 sm:text-xl"
        />
      </div>

      {/* Description */}
      <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-lg text-sm leading-relaxed text-white/30 sm:text-base">
        Crie seu perfil de lutador, encontre oponentes próximos e marque seu
        próximo combate. O ringue espera por você.
      </p>

      {/* CTA */}
      <div className="animate-scale-in animation-delay-500 mt-10 w-full max-w-xs">
        <SignInButton />
      </div>

      {/* Social proof */}
      <p className="animate-fade-in-up animation-delay-600 mt-4 flex items-center gap-2 text-xs text-white/25">
        <Users className="size-3" />
        Junte-se a centenas de lutadores ativos
      </p>

      {/* Scroll indicator */}
      <div className="animate-chevron absolute bottom-8 left-1/2 -translate-x-1/2">
        <ChevronDown className="size-5 text-white/20" />
      </div>
    </section>
  );
}

// ─── Decrypted Text Effect ────────────────────────────────

function DecryptedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const chars =
    "!<>-_\\/[]{}—=+*^?#0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let iteration = 0;
    const maxIterations = text.length + 5;

    intervalRef.current = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < Math.floor(iteration)) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join(""),
      );

      if (iteration >= maxIterations) {
        clearInterval(intervalRef.current!);
        setDisplayText(text);
      }

      iteration += 0.5;
    }, 35);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text]);

  return <p className={className}>{displayText}</p>;
}

// ─── Features Section ─────────────────────────────────────

const features = [
  {
    icon: MapPin,
    title: "Oponentes Próximos",
    description:
      "Encontre lutadores perto de você usando geolocalização. Nada de viajar horas pra trocar uma porrada.",
  },
  {
    icon: Swords,
    title: "Match por Estilo",
    description:
      "Filtre por modalidade: Boxe, Jiu-Jitsu, Muay Thai, MMA e mais. Enfrente alguém da sua área ou explore novos estilos.",
  },
  {
    icon: BarChart3,
    title: "Cartel ao Vivo",
    description:
      "Cada luta registrada entra no seu histórico. Vitórias, derrotas — seu cartel fala por você.",
  },
  {
    icon: MessageSquare,
    title: "Chat Integrado",
    description:
      "Combine regras, local e data diretamente no chat. Sem precisar trocar WhatsApp com estranho.",
  },
  {
    icon: Shield,
    title: "Segurança Primeiro",
    description:
      "Perfis verificados, denúncia de abuso e moderação ativa. Respeito dentro e fora do ringue.",
  },
  {
    icon: Trophy,
    title: "Ranking de Lutadores",
    description:
      "Suba no ranking conforme vence. Quanto mais luta, mais alto você sobe. O topo espera por você.",
  },
];

function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="recursos"
      ref={sectionRef}
      className="relative border-t border-white/[0.04] px-6 py-24 sm:py-32"
    >
      {/* Section glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2
            className={`text-3xl font-bold tracking-tight text-white transition-all duration-700 sm:text-4xl ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Por que{" "}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              matchFaca
            </span>
            ?
          </h2>
          <p
            className={`mt-3 text-white/40 transition-all delay-100 duration-700 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
          >
            Feito por lutadores, para lutadores
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`card-grid-mask group rounded-2xl border border-white/[0.06] bg-white/[0.015] p-7 transition-all duration-500 hover:border-primary/20 hover:bg-primary/[0.03] ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{
                  transitionDelay: `${150 + index * 80}ms`,
                }}
              >
                {/* Icon */}
                <div className="mb-5 flex size-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/[0.08] text-primary transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/[0.12]">
                  <Icon className="size-5" />
                </div>

                <h3 className="mb-2.5 text-base font-bold text-white">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-white/40">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Stats Section ────────────────────────────────────────

const stats = [
  {
    value: "500+",
    label: "Lutadores Cadastrados",
    icon: Users,
  },
  {
    value: "1.2K",
    label: "Lutas Marcadas",
    icon: Swords,
  },
  {
    value: "95%",
    label: "Taxa de Match",
    icon: Target,
  },
  {
    value: "12",
    label: "Modalidades",
    icon: Fingerprint,
  },
];

function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/[0.04] px-6 py-20 sm:py-28"
    >
      {/* Section glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/10 to-transparent" />

      <div className="mx-auto max-w-5xl">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.04] lg:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`relative flex flex-col items-center gap-3 bg-[#0A0A0A] p-8 text-center transition-all duration-700 sm:p-10 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${index * 120}ms` }}
              >
                {/* Divisor lines (desktop) */}
                {index < stats.length - 1 && (
                  <div className="absolute right-0 top-1/4 hidden h-1/2 w-px bg-gradient-to-b from-transparent via-white/[0.06] to-transparent lg:block" />
                )}

                <Icon className="size-6 text-primary/60" />

                <div>
                  <p className="font-mono text-3xl font-black tracking-tight text-white sm:text-4xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-white/30">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Section ──────────────────────────────────────────

function CTASection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-white/[0.04] px-6 py-24 sm:py-32"
    >
      <div className="mx-auto max-w-3xl">
        <div
          className={`relative overflow-hidden rounded-3xl border border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-transparent p-10 text-center transition-all duration-1000 sm:p-16 ${
            visible
              ? "translate-y-0 opacity-100"
              : "translate-y-12 opacity-0"
          }`}
        >
          {/* Inner glow */}
          <div className="pointer-events-none absolute -inset-20 bg-[radial-gradient(ellipse_50%_40%_at_50%_50%,hsl(0_72%_48%/0.08),transparent)]" />

          {/* Icon */}
          <div className="relative mx-auto mb-8 flex size-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/[0.08]">
            <Crosshair className="size-8 text-primary" />
          </div>

          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Pronto pra{" "}
            <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              porrada
            </span>
            ?
          </h2>

          <p className="relative mx-auto mt-4 max-w-md text-white/40">
            Crie seu perfil em menos de 2 minutos e comece a desafiar oponentes
            na sua região.
          </p>

          <div className="relative mx-auto mt-10 w-full max-w-xs">
            <SignInButton />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────

function FooterSection() {
  return (
    <footer className="border-t border-white/[0.04] px-6 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 sm:flex-row sm:justify-between">
        {/* Logo + tagline */}
        <div className="flex flex-col items-center gap-2 sm:items-start">
          <a href="/" className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-md border border-primary/20 bg-primary/8">
              <Crosshair className="size-3.5 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight text-white">
              match
              <span className="text-primary">Faca</span>
            </span>
          </a>
          <span className="text-xs text-white/20">
            Encontros que escalam
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-xs text-white/30">
          <a href="#" className="transition-colors hover:text-white/50">
            Termos de uso
          </a>
          <a href="#" className="transition-colors hover:text-white/50">
            Privacidade
          </a>
          <span className="text-white/15">&copy; 2026 matchFaca</span>
        </div>
      </div>
    </footer>
  );
}

// ─── Main Content ─────────────────────────────────────────

export function LandingContent() {
  return (
    <div className="relative z-10">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
      <FooterSection />
    </div>
  );
}

// ─── Discord Icon SVGs ────────────────────────────────────

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

function DiscordIconSmall() {
  return (
    <svg
      width="16"
      height="16"
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
