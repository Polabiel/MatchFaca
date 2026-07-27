import { Suspense } from "react";

import { auth } from "@matchfaca/auth";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthRequired } from "../_components/auth-required";
import { AuthShowcase } from "../_components/auth-showcase";
import { SwipeFeed } from "./swipe-feed";

export default async function SwipePage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="relative min-h-screen bg-background">
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                match<span className="text-primary">Faca</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Encontros que escalam
              </p>
            </div>
            <AuthShowcase />
          </div>
        </header>
        <main className="px-4 pb-6 pt-4">
          <AuthRequired
            icon="👊"
            title="Faça login para começar"
            description='Use o botão "Entrar" no topo da página para se autenticar e encontrar lutadores na sua região.'
          />
        </main>
      </div>
    );
  }

  prefetch(
    trpc.profile.nearby.queryOptions({
      latitude: -23.5505,
      longitude: -46.6333,
      radiusKm: 100,
    }),
  );

  return (
    <HydrateClient>
      <div className="relative min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                match<span className="text-primary">Faca</span>
              </h1>
              <p className="text-xs text-muted-foreground">
                Encontros que escalam
              </p>
            </div>
            <AuthShowcase />
          </div>
        </header>

        {/* Swipe content */}
        <main className="px-4 pb-6 pt-4">
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-4">
                <div className="skeleton-card w-full max-w-sm animate-pulse rounded-2xl border border-border/50 bg-muted/30" />
                <p className="text-sm text-muted-foreground">
                  Carregando lutadores...
                </p>
              </div>
            }
          >
            <SwipeFeed />
          </Suspense>
        </main>
      </div>
    </HydrateClient>
  );
}
