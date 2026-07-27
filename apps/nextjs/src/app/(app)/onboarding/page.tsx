import { redirect } from "next/navigation";

import { auth } from "@matchfaca/auth";
import { db } from "@matchfaca/db/client";

import { OnboardingForm } from "./onboarding-form";

export default async function OnboardingPage() {
  const session = await auth();

  // Se não está logado, redireciona pro login
  if (!session?.user) {
    redirect("/swipe");
  }

  // Se já tem perfil, pula onboarding
  const existingProfile = await db.profile.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (existingProfile) {
    redirect("/swipe");
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-base font-bold tracking-tight text-foreground">
            Crie sua{" "}
            <span className="text-primary">ficha</span>
          </h1>
        </div>
      </header>

      <main className="px-4 pb-6 pt-6">
        <OnboardingForm userId={session.user.id} />
      </main>
    </div>
  );
}
