"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { RouterInputs } from "@matchfaca/api";
import { Button } from "@matchfaca/ui/button";
import { useTRPC } from "~/trpc/react";

import { PenLine, Swords, Scale, Zap, Flame, Shield, Eye, Skull, Hand, HelpCircle } from "lucide-react";

// ─── Options ────────────────────────────────────────────────

const STYLE_OPTIONS = [
  {
    value: "boxe",
    label: "Boxe",
    Icon: Hand,
  },
  {
    value: "muay_thai",
    label: "Muay Thai",
    Icon: Zap,
  },
  {
    value: "jiu_jitsu",
    label: "Jiu-Jitsu",
    Icon: Shield,
  },
  {
    value: "mma",
    label: "MMA",
    Icon: Flame,
  },
  {
    value: "kickboxing",
    label: "Kickboxing",
    Icon: Zap,
  },
  {
    value: "capoeira",
    label: "Capoeira",
    Icon: Eye,
  },
  {
    value: "karate",
    label: "Caratê",
    Icon: Swords,
  },
  {
    value: "judô",
    label: "Judô",
    Icon: Shield,
  },
  {
    value: "taekwondo",
    label: "Taekwondo",
    Icon: Zap,
  },
  {
    value: "luta_livre",
    label: "Luta Livre",
    Icon: Swords,
  },
  {
    value: "vale_tudo",
    label: "Vale-Tudo",
    Icon: Skull,
  },
  {
    value: "porrada_limpa",
    label: "Porrada Limpa",
    Icon: Hand,
  },
  {
    value: "outro",
    label: "Outro",
    Icon: HelpCircle,
  },
] as const;

const WEIGHT_OPTIONS = [
  { value: "até_66kg", label: "Até 66kg" },
  { value: "até_77kg", label: "Até 77kg" },
  { value: "até_93kg", label: "Até 93kg" },
  { value: "acima_93kg", label: "+93kg" },
] as const;

// ─── Component ──────────────────────────────────────────────

type UpsertInput = RouterInputs["profile"]["upsert"];

interface OnboardingData {
  nickname: string;
  fightingStyle: string;
  weightClass: string;
}

export function OnboardingForm({ userId: _userId }: { userId: string }) {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    nickname: "",
    fightingStyle: "",
    weightClass: "",
  });
  const [error, setError] = useState<string | null>(null);

  const saveProfile = useMutation(
    trpc.profile.upsert.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.pathFilter());
        router.replace("/swipe");
      },
      onError: (err) => {
        setError(err.message);
      },
    }),
  );

  const handleSkip = useCallback(() => {
    router.replace("/swipe");
  }, [router]);

  const handleSubmit = useCallback(() => {
    if (!data.nickname.trim() || data.nickname.trim().length < 2) {
      setError("O apelido precisa ter pelo menos 2 caracteres");
      return;
    }
    if (!data.fightingStyle) {
      setError("Selecione um estilo de luta");
      return;
    }
    setError(null);

    const payload: UpsertInput = {
      nickname: data.nickname.trim(),
      fightingStyle: data.fightingStyle as UpsertInput["fightingStyle"],
      weightClass: data.weightClass
        ? (data.weightClass as UpsertInput["weightClass"])
        : undefined,
    };
    saveProfile.mutate(payload);
  }, [data, saveProfile]);

  const canContinue =
    step === 0
      ? data.nickname.trim().length >= 2
      : step === 1
        ? data.fightingStyle !== ""
        : true;

  // ─── Step 0: Nickname ──────────────────────────────────

  if (step === 0) {
    return (
      <div className="flex flex-col gap-8 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <PenLine className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Qual seu apelido de luta?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            É assim que os outros lutadores vão te chamar
          </p>
        </div>

        <div className="space-y-2">
          <input
            autoFocus
            value={data.nickname}
            onChange={(e) => {
              setData((d) => ({ ...d, nickname: e.target.value }));
              setError(null);
            }}
            placeholder="Ex: Faca, Brutamontes, Predador..."
            maxLength={60}
            className="h-12 w-full rounded-xl border border-border bg-muted/30 px-4 text-center text-lg font-bold text-foreground placeholder:text-muted-foreground/40 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30"
            onKeyDown={(e) => {
              if (e.key === "Enter" && canContinue) setStep(1);
            }}
          />
          <p className="text-center text-xs text-muted-foreground/60">
            {data.nickname.length}/60 caracteres
          </p>
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={handleSkip}
          >
            Pular
          </Button>
          <Button
            className="flex-1"
            disabled={!canContinue}
            onClick={() => setStep(1)}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step 1: Fighting Style ────────────────────────────

  if (step === 1) {
    return (
      <div className="flex flex-col gap-8 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <Swords className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Qual sua arte marcial?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Selecione seu estilo principal de luta
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {STYLE_OPTIONS.map((style) => {
            const isSelected = data.fightingStyle === style.value;
            const IconComponent = style.Icon;
            return (
              <button
                key={style.value}
                type="button"
                onClick={() => {
                  setData((d) => ({ ...d, fightingStyle: style.value }));
                  setError(null);
                }}
                className={`flex flex-col items-center gap-1.5 rounded-xl border p-4 text-center transition-all duration-200 ${
                  isSelected
                    ? "border-primary/50 bg-primary/10 text-primary shadow-blood"
                    : "border-border bg-muted/20 text-muted-foreground hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <IconComponent
                  className={`size-6 ${
                    isSelected ? "text-primary" : "text-muted-foreground/60"
                  }`}
                />
                <span className="text-sm font-medium">{style.label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={handleSkip}
          >
            Pular
          </Button>
          <Button
            className="flex-1"
            disabled={!canContinue}
            onClick={() => setStep(2)}
          >
            Continuar
          </Button>
        </div>
      </div>
    );
  }

  // ─── Step 2: Weight Class (optional) + Confirm ────────

  if (step === 2) {
    const selectedStyle = STYLE_OPTIONS.find(
      (s) => s.value === data.fightingStyle,
    );
    const SelectedIcon = selectedStyle?.Icon ?? Swords;

    return (
      <div className="flex flex-col gap-8 py-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex size-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5">
            <Scale className="size-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Quase lá!
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Sua categoria de peso (opcional)
          </p>
        </div>

        {/* Preview */}
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-lg font-bold text-primary">
              {data.nickname.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-foreground">{data.nickname}</p>
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <SelectedIcon className="size-3.5" />
                {selectedStyle?.label}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setData((d) => ({ ...d, weightClass: "" }))}
            className={`rounded-xl border p-3 text-center text-sm transition-all ${
              !data.weightClass
                ? "border-primary/40 bg-primary/10 text-primary"
                : "border-border bg-muted/20 text-muted-foreground"
            }`}
          >
            Não informar
          </button>
          {WEIGHT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() =>
                setData((d) => ({ ...d, weightClass: opt.value }))
              }
              className={`rounded-xl border p-3 text-center text-sm transition-all ${
                data.weightClass === opt.value
                  ? "border-primary/40 bg-primary/10 text-primary"
                  : "border-border bg-muted/20 text-muted-foreground"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {error && (
          <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1 text-muted-foreground"
            onClick={handleSkip}
          >
            Pular
          </Button>
          <Button
            className="flex-1"
            disabled={saveProfile.isPending}
            onClick={handleSubmit}
          >
            {saveProfile.isPending ? "Salvando..." : "Finalizar"}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
