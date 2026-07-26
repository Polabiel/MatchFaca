import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthShowcase } from "../_components/auth-showcase";
import { MatchesList } from "./matches-list";

export default function MatchesPage() {
  prefetch(trpc.fightRequest.matches.queryOptions());

  return (
    <HydrateClient>
      <div className="relative min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                <span className="text-primary">Lutas</span> Marcadas
              </h1>
              <p className="text-xs text-muted-foreground">
                Seus confrontos confirmados
              </p>
            </div>
            <AuthShowcase />
          </div>
        </header>

        <main className="px-4 pb-6 pt-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-32 animate-pulse rounded-xl border border-border/50 bg-muted/30"
                  />
                ))}
              </div>
            }
          >
            <MatchesList />
          </Suspense>
        </main>
      </div>
    </HydrateClient>
  );
}
