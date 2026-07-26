"use client";

import { useState } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { z } from "zod";

import type { RouterOutputs } from "@matchfaca/api";
import { cn } from "@matchfaca/ui";
import { Button } from "@matchfaca/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@matchfaca/ui/form";
import { Input } from "@matchfaca/ui/input";
import { toast } from "@matchfaca/ui/toast";

import { useTRPC } from "~/trpc/react";

// ─── Helpers ──────────────────────────────────────────────

const STYLE_OPTIONS = [
  { value: "boxe", label: "Boxe" },
  { value: "muay_thai", label: "Muay Thai" },
  { value: "jiu_jitsu", label: "Jiu-Jitsu" },
  { value: "mma", label: "MMA" },
  { value: "kickboxing", label: "Kickboxing" },
  { value: "capoeira", label: "Capoeira" },
  { value: "karate", label: "Caratê" },
  { value: "judô", label: "Judô" },
  { value: "taekwondo", label: "Taekwondo" },
  { value: "luta_livre", label: "Luta Livre" },
  { value: "vale_tudo", label: "Vale-Tudo" },
  { value: "porrada_limpa", label: "Porrada Limpa" },
  { value: "outro", label: "Outro" },
] as const;

const WEIGHT_OPTIONS = [
  { value: "até_66kg", label: "Até 66kg" },
  { value: "até_77kg", label: "Até 77kg" },
  { value: "até_93kg", label: "Até 93kg" },
  { value: "acima_93kg", label: "Acima de 93kg" },
] as const;

const fightingStyleValues = STYLE_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];
const weightClassValues = WEIGHT_OPTIONS.map((o) => o.value) as [
  string,
  ...string[],
];

const ProfileFormSchema = z.object({
  nickname: z.string().min(2, "Mínimo de 2 caracteres").max(60),
  bio: z.string().max(500).optional().or(z.literal("")),
  fightingStyle: z.enum(fightingStyleValues as [string, ...string[]]),
  weightClass: z
    .enum(weightClassValues as [string, ...string[]])
    .optional()
    .or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationName: z.string().max(255).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

function getInitials(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

type MyProfile = RouterOutputs["profile"]["mine"];

// ─── Profile Form ─────────────────────────────────────────

function ProfileForm({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: Partial<ProfileFormValues>;
  onSuccess?: () => void;
}) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm({
    schema: ProfileFormSchema,
    defaultValues: {
      nickname: defaultValues?.nickname ?? "",
      bio: defaultValues?.bio ?? "",
      fightingStyle: (defaultValues?.fightingStyle as ProfileFormValues["fightingStyle"]) ?? "outro",
      weightClass: (defaultValues?.weightClass as ProfileFormValues["weightClass"]) ?? "",
      latitude: undefined,
      longitude: undefined,
      locationName: defaultValues?.locationName ?? "",
    },
  });

  const saveProfile = useMutation(
    trpc.profile.upsert.mutationOptions({
      onSuccess: async () => {
        toast.success("Perfil salvo!");
        await queryClient.invalidateQueries(trpc.profile.pathFilter());
        onSuccess?.();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => {
          // Clean up empty strings to undefined for optional fields
          const payload = {
            ...data,
            bio: data.bio || undefined,
            weightClass: data.weightClass || undefined,
            locationName: data.locationName || undefined,
            latitude: data.latitude ?? undefined,
            longitude: data.longitude ?? undefined,
          };
          saveProfile.mutate(payload as never);
        })}
        className="space-y-5"
      >
        {/* Nickname */}
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Apelido de luta *</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Ex: Faca, Brutamontes, Predador..."
                  className="border-border/60 bg-muted/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Fighting Style */}
        <FormField
          control={form.control}
          name="fightingStyle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estilo de luta *</FormLabel>
              <FormControl>
                <select
                  value={field.value}
                  onChange={field.onChange}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {STYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Weight Class */}
        <FormField
          control={form.control}
          name="weightClass"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Classe de peso</FormLabel>
              <FormControl>
                <select
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value || "")
                  }
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Selecionar...</option>
                  {WEIGHT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Bio */}
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  rows={3}
                  placeholder="Conte um pouco sobre você... ou apenas ameace"
                  className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Location */}
        <FormField
          control={form.control}
          name="locationName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Localização</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  value={field.value ?? ""}
                  placeholder="Ex: São Paulo, SP"
                  className="border-border/60 bg-muted/30"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={saveProfile.isPending}
        >
          {saveProfile.isPending ? "Salvando..." : "Salvar perfil"}
        </Button>
      </form>
    </Form>
  );
}

// ─── Profile Card ─────────────────────────────────────────

function ProfileCard({
  profile,
  onEdit,
}: {
  profile: NonNullable<MyProfile>;
  onEdit: () => void;
}) {
  const wins = profile.wins ?? 0;
  const losses = profile.losses ?? 0;
  const total = wins + losses;

  const styleLabel =
    STYLE_OPTIONS.find((s) => s.value === profile.fightingStyle)?.label ??
    profile.fightingStyle;

  const weightLabel = profile.weightClass
    ? WEIGHT_OPTIONS.find((w) => w.value === profile.weightClass)?.label ??
      profile.weightClass
    : null;

  return (
    <div className="space-y-6">
      {/* Avatar */}
      <div className="flex flex-col items-center gap-3">
        {profile.photo ? (
          <img
            src={profile.photo}
            alt={profile.nickname}
            className="size-28 rounded-full border-2 border-primary/30 object-cover"
          />
        ) : (
          <div className="flex size-28 items-center justify-center rounded-full border-2 border-primary/30 bg-gradient-to-br from-zinc-800 to-black text-4xl font-bold tracking-wide text-primary/70">
            {getInitials(profile.nickname)}
          </div>
        )}

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            {profile.nickname}
          </h2>
          {profile.locationName && (
            <p className="text-sm text-muted-foreground">
              📍 {profile.locationName}
            </p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center">
          <p className="text-2xl font-bold text-green-400">{wins}</p>
          <p className="text-xs text-muted-foreground">Vitórias</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center">
          <p className="text-2xl font-bold text-red-400">{losses}</p>
          <p className="text-xs text-muted-foreground">Derrotas</p>
        </div>
        <div className="rounded-xl border border-border/50 bg-muted/30 p-3 text-center">
          <p className="text-2xl font-bold text-primary">{total}</p>
          <p className="text-xs text-muted-foreground">Total</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 rounded-xl border border-border/50 bg-muted/30 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Estilo</span>
          <span className="text-sm font-semibold text-foreground">
            {styleLabel}
          </span>
        </div>
        {weightLabel && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Peso</span>
            <span className="text-sm font-semibold text-foreground">
              {weightLabel}
            </span>
          </div>
        )}
        {profile.bio && (
          <div>
            <span className="text-sm text-muted-foreground">Bio</span>
            <p className="mt-1 text-sm leading-relaxed text-foreground/80">
              {profile.bio}
            </p>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full border-primary/30 text-primary hover:bg-primary/10"
        onClick={onEdit}
      >
        Editar perfil
      </Button>
    </div>
  );
}

// ─── Profile View ─────────────────────────────────────────

export function ProfileView() {
  const trpc = useTRPC();
  const { data: profile } = useSuspenseQuery(
    trpc.profile.mine.queryOptions(),
  );

  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {profile ? "Editar perfil" : "Criar perfil"}
          </h2>
        </div>
        <ProfileForm
          defaultValues={
            profile
              ? {
                  nickname: profile.nickname,
                  bio: profile.bio ?? undefined,
                  fightingStyle: profile.fightingStyle,
                  weightClass: profile.weightClass ?? undefined,
                  locationName: profile.locationName ?? undefined,
                }
              : undefined
          }
          onSuccess={() => setEditing(false)}
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex size-20 items-center justify-center rounded-full border-2 border-dashed border-primary/30 text-4xl text-primary/50">
            👊
          </div>
          <h2 className="text-xl font-bold text-foreground">
            Crie seu perfil de lutador
          </h2>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Para começar a desafiar oponentes, você precisa criar sua ficha de
            lutador. Escolha seu apelido, estilo de luta e mostre pra galera do
            que você é feito.
          </p>
        </div>
        <ProfileForm onSuccess={() => setEditing(false)} />
      </div>
    );
  }

  return <ProfileCard profile={profile} onEdit={() => setEditing(true)} />;
}
