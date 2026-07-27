import { Suspense } from "react";

import { auth } from "@matchfaca/auth";
import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthShowcase } from "../_components/auth-showcase";
import { MatchesList } from "./matches-list";

function AuthRequired() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-4xl text-muted-foreground/50">
        ⚔️
      </div>
      <h2 className="text-xl font-bold text-foreground">
        Faça login para ver suas lutas
      </h2>
      <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
        Use o botão "Entrar" no topo da página para se autenticar e acompanhar
        seus confrontos.
      </p>
    </div>
  );
}

export default async function MatchesPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="relative min-h-screen bg-background">
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
          <AuthRequired />
        </main>
      </div>
    );
  }

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
