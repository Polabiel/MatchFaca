"use client";

import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "~/trpc/react";
import { SwipeCard, SwipeCardSkeleton } from "../_components/swipe-card";

export function SwipeFeed() {
  const trpc = useTRPC();

  const { data: profiles } = useSuspenseQuery(
    trpc.profile.nearby.queryOptions({
      latitude: -23.5505,
      longitude: -46.6333,
      radiusKm: 100,
    }),
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  const isExhausted = profiles.length === 0 || currentIndex >= profiles.length;

  // Empty state — no profiles at all OR all swiped
  if (isExhausted) {
    const hasProfiles = profiles.length === 0;
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-4xl text-muted-foreground/50">
          {hasProfiles ? "👊" : "🔥"}
        </div>
        <h2 className="text-xl font-bold text-foreground">
          {hasProfiles ? "Ninguém por perto" : "Por hoje é isso"}
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          {hasProfiles
            ? "Não encontramos lutadores na sua região. Volte mais tarde ou ajuste sua localização."
            : "Você já viu todos os lutadores disponíveis. Volte mais tarde para novos desafios."}
        </p>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const currentProfile = profiles[currentIndex]!;

  const handleSkip = () => {
    setCurrentIndex((i) => i + 1);
  };

  const handleChallenge = () => {
    setCurrentIndex((i) => i + 1);
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Card stack */}
      <div className="relative flex w-full items-center justify-center">
        {/* Peek of next card */}
        {currentIndex + 1 < profiles.length && (
          <div className="absolute inset-0 flex items-center justify-center opacity-30">
            <div
              className="w-full max-w-sm rounded-2xl border border-border/20 bg-muted/20"
              style={{ aspectRatio: "3 / 4" }}
            />
          </div>
        )}

        <SwipeCard
          key={currentProfile.userId}
          profile={currentProfile}
          onSkip={handleSkip}
          onChallenge={handleChallenge}
        />
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {profiles.slice(0, Math.min(profiles.length, 10)).map((p, i) => (
          <span
            key={p.userId}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex
                ? "w-6 bg-primary"
                : i < currentIndex
                  ? "w-1.5 bg-muted-foreground/30"
                  : "w-1.5 bg-muted-foreground/15"
            }`}
          />
        ))}
        {profiles.length > 10 && (
          <span className="text-xs text-muted-foreground/50">
            +{profiles.length - 10}
          </span>
        )}
      </div>
    </div>
  );
}

export function SwipeFeedSkeleton() {
  return (
    <div className="flex flex-col items-center gap-6">
      <SwipeCardSkeleton />
    </div>
  );
}
