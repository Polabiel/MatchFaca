"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RouterOutputs } from "@matchfaca/api";
import { cn } from "@matchfaca/ui";
import { toast } from "@matchfaca/ui/toast";

import { useTRPC } from "~/trpc/react";

// ─── Helpers ──────────────────────────────────────────────

const STYLE_LABELS: Record<string, string> = {
  boxe: "Boxe",
  muay_thai: "Muay Thai",
  jiu_jitsu: "Jiu-Jitsu",
  mma: "MMA",
  kickboxing: "Kickboxing",
  capoeira: "Capoeira",
  karate: "Caratê",
  judô: "Judô",
  taekwondo: "Taekwondo",
  luta_livre: "Luta Livre",
  vale_tudo: "Vale-Tudo",
  porrada_limpa: "Porrada Limpa",
  outro: "Outro",
};

const WEIGHT_LABELS: Record<string, string> = {
  até_66kg: "Até 66kg",
  até_77kg: "Até 77kg",
  até_93kg: "Até 93kg",
  acima_93kg: "Acima de 93kg",
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

// ─── Types ─────────────────────────────────────────────────

type NearbyProfile = RouterOutputs["profile"]["nearby"][number];

interface SwipeCardProps {
  profile: NearbyProfile;
  onSkip: () => void;
  onChallenge: () => void;
  style?: React.CSSProperties;
  className?: string;
  index?: number;
}

// ─── Component ─────────────────────────────────────────────

export function SwipeCard({
  profile,
  onSkip,
  onChallenge,
  style,
  className,
  index = 0,
}: SwipeCardProps) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [dismissing, setDismissing] = useState<"left" | "right" | null>(null);
  const [imageError, setImageError] = useState(false);

  const sendChallenge = useMutation(
    trpc.fightRequest.send.mutationOptions({
      onSuccess: async () => {
        toast.success("🔥 Desafio enviado!");
        await queryClient.invalidateQueries(trpc.profile.pathFilter());
        onChallenge();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const handleSkip = () => {
    setDismissing("left");
    setTimeout(onSkip, 300);
  };

  const handleChallenge = () => {
    sendChallenge.mutate({
      challengedId: profile.userId,
    });
    setDismissing("right");
    setTimeout(onChallenge, 300);
  };

  const nickname = profile.nickname;
  const userName = profile.user?.name ?? nickname;
  const wins = profile.wins ?? 0;
  const losses = profile.losses ?? 0;
  const totalFights = wins + losses;
  const winRate = totalFights > 0 ? Math.round((wins / totalFights) * 100) : null;

  const hasPhoto = !!profile.photo && !imageError;

  return (
    <div
      className={cn(
        "swipe-card-enter relative w-full max-w-sm overflow-hidden rounded-2xl border border-border/50",
        dismissing === "left" && "swipe-card-exit-left pointer-events-none",
        dismissing === "right" && "swipe-card-exit-right pointer-events-none",
        className,
      )}
      style={{
        aspectRatio: "3 / 4",
        animationDelay: `${index * 80}ms`,
        ...style,
      }}
    >
      {/* Background */}
      {hasPhoto ? (
        <img
          src={profile.photo!}
          alt={nickname}
          className="absolute inset-0 size-full object-cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black" />
      )}

      {/* Noise overlay */}
      <div className="absolute inset-0 bg-noise" />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-card-overlay" />

      {/* Content */}
      <div className="relative flex h-full flex-col justify-end p-5">
        {/* Fighting style badge */}
        <div className="absolute right-4 top-4">
          <span className="inline-block rounded-full border border-primary/30 bg-black/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary backdrop-blur-sm">
            {STYLE_LABELS[profile.fightingStyle] ?? profile.fightingStyle}
          </span>
        </div>

        {/* Weight class if present */}
        {profile.weightClass && (
          <div className="absolute left-4 top-4">
            <span className="inline-block rounded-full border border-zinc-600/50 bg-black/60 px-3 py-1 text-xs text-zinc-300 backdrop-blur-sm">
              {WEIGHT_LABELS[profile.weightClass] ?? profile.weightClass}
            </span>
          </div>
        )}

        {/* Avatar initials */}
        {!hasPhoto && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex size-24 items-center justify-center rounded-full border-2 border-primary/30 bg-black/50 text-3xl font-bold tracking-wide text-primary/70 backdrop-blur-sm">
              {getInitials(nickname)}
            </div>
          </div>
        )}

        {/* Info section */}
        <div className="space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-white drop-shadow-lg">
            {nickname}
          </h2>

          {profile.bio && (
            <p className="line-clamp-2 text-sm leading-snug text-zinc-300 drop-shadow-md">
              {profile.bio}
            </p>
          )}

          {/* Record */}
          <div className="flex items-center gap-3 pt-1">
            <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <span className="size-1.5 rounded-full bg-green-400" />
              {wins}V
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-red-400">
              <span className="size-1.5 rounded-full bg-red-400" />
              {losses}D
            </span>
            {winRate !== null && (
              <span className="text-xs text-zinc-400">
                {winRate}% aproveitamento
              </span>
            )}
            {totalFights === 0 && (
              <span className="text-xs text-zinc-500">Estreante</span>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={handleSkip}
            disabled={dismissing !== null}
            className="flex size-14 items-center justify-center rounded-full border-2 border-zinc-600 bg-black/50 text-2xl text-zinc-400 backdrop-blur-sm transition-all duration-200 hover:border-red-500 hover:bg-red-500/10 hover:text-red-500 active:scale-90 disabled:opacity-30"
            aria-label="Skip"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={handleChallenge}
            disabled={dismissing !== null || sendChallenge.isPending}
            className="glow-fire flex size-14 items-center justify-center rounded-full border-2 border-orange-500/50 bg-gradient-to-br from-red-600/60 to-orange-600/60 text-2xl text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
            aria-label="Challenge"
          >
            🔥
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────

export function SwipeCardSkeleton() {
  return (
    <div
      className="relative w-full max-w-sm animate-pulse overflow-hidden rounded-2xl border border-border/50"
      style={{ aspectRatio: "3 / 4" }}
    >
      <div className="absolute inset-0 bg-zinc-800/50" />
      <div className="absolute inset-0 bg-card-overlay" />
      <div className="relative flex h-full flex-col justify-end p-5">
        <div className="absolute right-4 top-4 h-6 w-24 rounded-full bg-zinc-700/50" />
        <div className="mb-2 h-8 w-3/5 rounded bg-zinc-700/50" />
        <div className="h-4 w-full rounded bg-zinc-700/30" />
        <div className="mt-1 h-4 w-4/5 rounded bg-zinc-700/30" />
        <div className="mt-2 flex gap-3">
          <div className="h-4 w-12 rounded bg-zinc-700/40" />
          <div className="h-4 w-12 rounded bg-zinc-700/40" />
        </div>
        <div className="mt-4 flex justify-center gap-6">
          <div className="size-14 rounded-full bg-zinc-700/40" />
          <div className="size-14 rounded-full bg-zinc-700/40" />
        </div>
      </div>
    </div>
  );
}
