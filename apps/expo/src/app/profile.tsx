import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";
import { useSignOut, useUser } from "~/utils/auth";
import { NavBar } from "./_components/nav-bar";

const fightingStyles = [
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
  { value: "vale_tudo", label: "Vale Tudo" },
  { value: "porrada_limpa", label: "Porrada Limpa" },
  { value: "outro", label: "Outro" },
] as const;

const weightClasses = [
  { value: "até_66kg", label: "Até 66kg" },
  { value: "até_77kg", label: "Até 77kg" },
  { value: "até_93kg", label: "Até 93kg" },
  { value: "acima_93kg", label: "Acima de 93kg" },
] as const;

type FightingStyle = (typeof fightingStyles)[number]["value"];

function ProfileForm({
  initial,
  onSuccess,
}: {
  initial?: {
    nickname: string;
    bio?: string | null;
    fightingStyle: string;
    weightClass?: string | null;
  };
  onSuccess: () => void;
}) {
  const queryClient = useQueryClient();
  const [nickname, setNickname] = useState(initial?.nickname ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [fightingStyle, setFightingStyle] = useState<FightingStyle>(
    (initial?.fightingStyle ?? "outro") as FightingStyle,
  );
  const [weightClass, setWeightClass] = useState(initial?.weightClass ?? "");

  const upsertMutation = useMutation(
    trpc.profile.upsert.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.pathFilter());
        onSuccess();
      },
    }),
  );

  type WeightValue = (typeof weightClasses)[number]["value"];

  const handleSave = () => {
    if (!nickname.trim()) return;
    upsertMutation.mutate({
      nickname: nickname.trim(),
      bio: bio.trim() || undefined,
      fightingStyle,
      weightClass: (weightClass || undefined) as WeightValue | undefined,
    });
  };

  const isEditing = !!initial;

  return (
    <ScrollView className="flex-1 px-4" keyboardShouldPersistTaps="handled">
      {/* Nickname */}
      <View className="mb-4">
        <Text className="mb-1 text-sm font-semibold text-gray-400">
          Apelido
        </Text>
        <TextInput
          className="rounded-xl border border-[#DC2626]/30 bg-[#1A1A1A] px-4 py-3 text-base text-white"
          value={nickname}
          onChangeText={setNickname}
          placeholder="Seu apelido de luta"
          placeholderTextColor="#666666"
          maxLength={60}
        />
      </View>

      {/* Fighting Style */}
      <View className="mb-4">
        <Text className="mb-1 text-sm font-semibold text-gray-400">
          Estilo de Luta
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {fightingStyles.map((style) => (
            <Pressable
              key={style.value}
              onPress={() => setFightingStyle(style.value)}
              className={`rounded-full border px-3 py-1.5 ${
                fightingStyle === style.value
                  ? "border-[#DC2626] bg-[#DC2626]/20"
                  : "border-gray-700 bg-[#1A1A1A]"
              }`}
            >
              <Text
                className={`text-sm ${
                  fightingStyle === style.value
                    ? "font-semibold text-[#DC2626]"
                    : "text-gray-400"
                }`}
              >
                {style.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Bio */}
      <View className="mb-4">
        <Text className="mb-1 text-sm font-semibold text-gray-400">Bio</Text>
        <TextInput
          className="rounded-xl border border-[#DC2626]/30 bg-[#1A1A1A] px-4 py-3 text-base text-white"
          value={bio}
          onChangeText={setBio}
          placeholder="Fale sobre você..."
          placeholderTextColor="#666666"
          multiline
          numberOfLines={3}
          maxLength={500}
          textAlignVertical="top"
        />
      </View>

      {/* Weight Class */}
      <View className="mb-6">
        <Text className="mb-1 text-sm font-semibold text-gray-400">
          Categoria de Peso
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {weightClasses.map((wc) => (
            <Pressable
              key={wc.value}
              onPress={() =>
                setWeightClass(weightClass === wc.value ? "" : wc.value)
              }
              className={`rounded-full border px-3 py-1.5 ${
                weightClass === wc.value
                  ? "border-[#DC2626] bg-[#DC2626]/20"
                  : "border-gray-700 bg-[#1A1A1A]"
              }`}
            >
              <Text
                className={`text-sm ${
                  weightClass === wc.value
                    ? "font-semibold text-[#DC2626]"
                    : "text-gray-400"
                }`}
              >
                {wc.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        disabled={upsertMutation.isPending || !nickname.trim()}
        className="mb-6 items-center rounded-xl bg-[#DC2626] py-3.5 active:opacity-70 disabled:opacity-50"
      >
        <Text className="text-base font-bold text-white">
          {upsertMutation.isPending
            ? "Salvando..."
            : isEditing
              ? "Salvar Alterações"
              : "Criar Perfil"}
        </Text>
      </Pressable>

      {upsertMutation.error && (
        <Text className="mb-4 text-center text-sm text-red-500">
          {upsertMutation.error.message}
        </Text>
      )}
    </ScrollView>
  );
}

function ProfileCard({
  profile,
  onEdit,
  onSignOut,
}: {
  profile: NonNullable<ReturnType<typeof useProfileData>["profile"]>;
  onEdit: () => void;
  onSignOut: () => void;
}) {
  const user = useUser();

  const fightingStyleLabels: Record<string, string> = {
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
    vale_tudo: "Vale Tudo",
    porrada_limpa: "Porrada Limpa",
    outro: "Outro",
  };

  const styleLabel =
    fightingStyleLabels[profile.fightingStyle] ?? profile.fightingStyle;
  const weightLabel = profile.weightClass
    ? profile.weightClass.replace(/_/g, " ")
    : null;

  return (
    <ScrollView className="flex-1 px-4">
      {/* Avatar */}
      <View className="items-center py-6">
        <View className="mb-3 h-24 w-24 items-center justify-center rounded-full border-2 border-[#DC2626] bg-[#DC2626]/10">
          <Text className="text-4xl font-bold text-[#DC2626]">
            {profile.nickname.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text className="text-2xl font-bold text-white">
          {profile.nickname}
        </Text>
        {user?.name && (
          <Text className="mt-1 text-sm text-gray-500">{user.name}</Text>
        )}
      </View>

      {/* Stats */}
      <View className="mb-4 flex-row gap-3">
        <View className="flex-1 items-center rounded-xl bg-[#1A1A1A] py-3">
          <Text className="text-2xl font-bold text-green-500">
            {profile.wins}
          </Text>
          <Text className="text-xs text-gray-500">Vitórias</Text>
        </View>
        <View className="flex-1 items-center rounded-xl bg-[#1A1A1A] py-3">
          <Text className="text-2xl font-bold text-red-500">
            {profile.losses}
          </Text>
          <Text className="text-xs text-gray-500">Derrotas</Text>
        </View>
      </View>

      {/* Details */}
      <View className="mb-4 rounded-xl bg-[#1A1A1A] p-4">
        <View className="mb-3 flex-row justify-between">
          <Text className="text-sm text-gray-500">Estilo</Text>
          <Text className="text-sm font-semibold text-white">{styleLabel}</Text>
        </View>
        {weightLabel && (
          <View className="mb-3 flex-row justify-between">
            <Text className="text-sm text-gray-500">Peso</Text>
            <Text className="text-sm font-semibold text-white">
              {weightLabel}
            </Text>
          </View>
        )}
        {profile.bio && (
          <View className="mb-3">
            <Text className="mb-1 text-sm text-gray-500">Bio</Text>
            <Text className="text-sm text-white">{profile.bio}</Text>
          </View>
        )}
        {profile.locationName && (
          <View className="flex-row justify-between">
            <Text className="text-sm text-gray-500">Localização</Text>
            <Text className="text-sm font-semibold text-white">
              {profile.locationName}
            </Text>
          </View>
        )}
      </View>

      {/* Edit Button */}
      <Pressable
        onPress={onEdit}
        className="mb-3 items-center rounded-xl border border-[#DC2626]/30 bg-[#DC2626]/10 py-3.5 active:opacity-70"
      >
        <Text className="text-base font-bold text-[#DC2626]">
          Editar Perfil
        </Text>
      </Pressable>

      {/* Sign Out */}
      <Pressable
        onPress={onSignOut}
        className="mb-8 items-center rounded-xl border border-gray-700 py-3.5 active:opacity-70"
      >
        <Text className="text-base font-semibold text-gray-400">Sair</Text>
      </Pressable>
    </ScrollView>
  );
}

function useProfileData() {
  const { data: profile, isLoading } = useQuery(
    trpc.profile.mine.queryOptions(),
  );
  return { profile: profile ?? null, isLoading };
}

export default function ProfileScreen() {
  const signOut = useSignOut();
  const [isEditing, setIsEditing] = useState(false);
  const { profile, isLoading } = useProfileData();

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-[#0D0D0D]">
        <Stack.Screen
          options={{
            title: "Perfil",
            headerStyle: { backgroundColor: "#0D0D0D" },
            headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
            headerTintColor: "#DC2626",
          }}
        />
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Carregando...</Text>
        </View>
        <NavBar />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "Perfil",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
        }}
      />

      {!profile || isEditing ? (
        <ProfileForm
          key={profile?.id ?? "new"}
          initial={
            profile
              ? {
                  nickname: profile.nickname,
                  bio: profile.bio,
                  fightingStyle: profile.fightingStyle,
                  weightClass: profile.weightClass,
                }
              : undefined
          }
          onSuccess={() => setIsEditing(false)}
        />
      ) : (
        <ProfileCard
          profile={profile}
          onEdit={() => setIsEditing(true)}
          onSignOut={() => signOut()}
        />
      )}

      <NavBar />
    </SafeAreaView>
  );
}
