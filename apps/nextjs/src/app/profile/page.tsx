import { Suspense } from "react";

import { HydrateClient, prefetch, trpc } from "~/trpc/server";
import { AuthShowcase } from "../_components/auth-showcase";
import { ProfileView } from "./profile-view";

export default function ProfilePage() {
  prefetch(trpc.profile.mine.queryOptions());

  return (
    <HydrateClient>
      <div className="relative min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            <div>
              <h1 className="text-base font-bold tracking-tight text-foreground">
                <span className="text-primary">Meu</span> Perfil
              </h1>
              <p className="text-xs text-muted-foreground">
                Sua ficha de lutador
              </p>
            </div>
            <AuthShowcase />
          </div>
        </header>

        <main className="px-4 pb-6 pt-4">
          <Suspense
            fallback={
              <div className="space-y-4">
                <div className="mx-auto size-32 animate-pulse rounded-full border border-border/50 bg-muted/30" />
                <div className="h-8 w-3/5 animate-pulse rounded bg-muted/30" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-muted/30" />
              </div>
            }
          >
            <ProfileView />
          </Suspense>
        </main>
      </div>
    </HydrateClient>
  );
}
