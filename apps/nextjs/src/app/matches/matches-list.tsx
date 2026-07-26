"use client";

import type { RouterOutputs } from "@matchfaca/api";
import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";

import { cn } from "@matchfaca/ui";
import { Button } from "@matchfaca/ui/button";
import { Input } from "@matchfaca/ui/input";
import { toast } from "@matchfaca/ui/toast";

import { useTRPC } from "~/trpc/react";

// ─── Types ─────────────────────────────────────────────────

type Match = RouterOutputs["fightRequest"]["matches"][number];

// ─── Helpers ──────────────────────────────────────────────

const FIGHT_STATUS_LABELS: Record<string, { label: string; color: string }> = {
  scheduled: { label: "Agendada", color: "text-yellow-400" },
  confirmed: { label: "Confirmada", color: "text-green-400" },
  in_progress: { label: "Em andamento", color: "text-red-400" },
  completed: { label: "Finalizada", color: "text-zinc-400" },
  cancelled: { label: "Cancelada", color: "text-zinc-600" },
};

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function Avatar({
  name,
  image,
  className,
}: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className={cn("size-10 rounded-full object-cover", className)}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex size-10 items-center justify-center rounded-full border border-border bg-muted text-xs font-bold text-muted-foreground",
        className,
      )}
    >
      {getInitials(name)}
    </div>
  );
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ─── Schedule Dialog ──────────────────────────────────────

function ScheduleForm({
  matchId,
  onClose,
}: {
  matchId: string;
  onClose: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [scheduledAt, setScheduledAt] = useState("");
  const [locationName, setLocationName] = useState("");

  const schedule = useMutation(
    trpc.fight.schedule.mutationOptions({
      onSuccess: async () => {
        toast.success("Luta agendada com sucesso!");
        await queryClient.invalidateQueries(trpc.fightRequest.pathFilter());
        onClose();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    schedule.mutate({
      fightRequestId: matchId,
      scheduledAt: scheduledAt
        ? new Date(scheduledAt).toISOString()
        : undefined,
      locationName: locationName || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3 border-t border-border pt-3"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Data e horário
        </label>
        <Input
          type="datetime-local"
          value={scheduledAt}
          onChange={(e) => setScheduledAt(e.target.value)}
          className="w-full"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-muted-foreground">
          Local
        </label>
        <Input
          type="text"
          placeholder="Ex: Academia X, Ginásio Y..."
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={schedule.isPending}>
          {schedule.isPending ? "Agendando..." : "Agendar luta"}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          disabled={schedule.isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}

// ─── Match Card ───────────────────────────────────────────

function MatchCard({ match }: { match: Match }) {
  const [showSchedule, setShowSchedule] = useState(false);

  const isChallenger = match.challengerId === match.challenger.id;
  const opponent = isChallenger ? match.challenged : match.challenger;
  const fight = match.fight;

  return (
    <div className="rounded-xl border border-border/60 bg-card p-4 transition-colors hover:border-border">
      {/* Opponent info */}
      <div className="flex items-center gap-3">
        <Avatar
          name={opponent.name ?? "Desconhecido"}
          image={opponent.image}
        />

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">
            {opponent.name ?? "Lutador desconhecido"}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            Você{" "}
            {match.message && (
              <span className="italic">&ldquo;{match.message}&rdquo;</span>
            )}
          </p>
        </div>

        {/* VS badge */}
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/5 text-xs font-bold text-primary">
          VS
        </div>
      </div>

      {/* Fight details */}
      {fight && (
        <div className="mt-3 rounded-lg bg-muted/50 px-3 py-2">
          <div className="flex items-center justify-between">
            <span
              className={cn(
                "text-xs font-semibold",
                FIGHT_STATUS_LABELS[fight.status]?.color ??
                  "text-muted-foreground",
              )}
            >
              {FIGHT_STATUS_LABELS[fight.status]?.label ?? fight.status}
            </span>
            {fight.scheduledAt && (
              <span className="text-xs text-muted-foreground">
                {formatDate(fight.scheduledAt)}
              </span>
            )}
          </div>
          {fight.locationName && (
            <p className="mt-0.5 text-xs text-muted-foreground">
              📍 {fight.locationName}
            </p>
          )}
        </div>
      )}

      {/* No fight yet — schedule button */}
      {!fight && (
        <div className="mt-3">
          {showSchedule ? (
            <ScheduleForm
              matchId={match.id}
              onClose={() => setShowSchedule(false)}
            />
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="w-full border-primary/30 text-primary hover:bg-primary/10"
              onClick={() => setShowSchedule(true)}
            >
              Agendar luta
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// ─── List ──────────────────────────────────────────────────

export function MatchesList() {
  const trpc = useTRPC();
  const { data: matches } = useSuspenseQuery(
    trpc.fightRequest.matches.queryOptions(),
  );

  if (matches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-muted-foreground/30 text-4xl text-muted-foreground/50">
          ⚔️
        </div>
        <h2 className="text-xl font-bold text-foreground">
          Nenhuma luta ainda
        </h2>
        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
          Continue deslizando. Quando alguém aceitar seu desafio, as lutas
          aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-medium text-muted-foreground">
        {matches.length}{" "}
        {matches.length === 1 ? "luta confirmada" : "lutas confirmadas"}
      </p>

      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
