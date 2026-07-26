import { Image, Pressable, Text, View } from "react-native";

import type { RouterOutputs } from "~/utils/api";

type NearbyProfile = RouterOutputs["profile"]["nearby"][number];

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

interface SwipeCardProps {
  profile: NearbyProfile;
  onSkip: () => void;
  onChallenge: () => void;
  disabled?: boolean;
}

export function SwipeCard({
  profile,
  onSkip,
  onChallenge,
  disabled = false,
}: SwipeCardProps) {
  const styleLabel =
    fightingStyleLabels[profile.fightingStyle] ?? profile.fightingStyle;

  return (
    <View className="w-full flex-1 overflow-hidden rounded-2xl border border-[#DC2626]/30 bg-[#1A1A1A]">
      {/* Photo area */}
      <View className="flex-1 items-center justify-center bg-[#111111]">
        {profile.photo ? (
          <Image
            source={{ uri: profile.photo }}
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="items-center justify-center">
            <View className="mb-2 h-20 w-20 items-center justify-center rounded-full border-2 border-[#DC2626] bg-[#DC2626]/20">
              <Text className="text-4xl text-[#DC2626]">
                {profile.nickname.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="text-sm text-[#DC2626]/60">Sem foto</Text>
          </View>
        )}
      </View>

      {/* Profile info overlay at bottom of card */}
      <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
        <View className="flex-row items-center gap-2">
          <Text className="text-2xl font-bold text-white">
            {profile.nickname}
          </Text>
          <View className="rounded-full border border-[#DC2626]/40 bg-[#DC2626]/10 px-2.5 py-0.5">
            <Text className="text-xs font-semibold text-[#DC2626]">
              {styleLabel}
            </Text>
          </View>
        </View>

        {profile.bio && (
          <Text className="mt-1 text-sm text-gray-400" numberOfLines={2}>
            {profile.bio}
          </Text>
        )}

        <View className="mt-2 flex-row items-center gap-3">
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-bold text-green-500">
              {profile.wins}
            </Text>
            <Text className="text-xs text-gray-500">V</Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="text-sm font-bold text-red-500">
              {profile.losses}
            </Text>
            <Text className="text-xs text-gray-500">D</Text>
          </View>
          {profile.weightClass && (
            <View className="ml-auto rounded bg-[#333333] px-2 py-0.5">
              <Text className="text-xs text-gray-400">
                {profile.weightClass.replace(/_/g, " ")}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action buttons */}
      <View className="flex-row items-center justify-center gap-6 border-t border-[#DC2626]/20 bg-[#1A1A1A] px-6 py-4">
        <Pressable
          onPress={onSkip}
          disabled={disabled}
          className="h-14 w-14 items-center justify-center rounded-full border-2 border-gray-600 bg-[#222222] active:opacity-70"
        >
          <Text className="text-2xl text-gray-400">✕</Text>
        </Pressable>

        <Pressable
          onPress={onChallenge}
          disabled={disabled}
          className="h-14 w-14 items-center justify-center rounded-full bg-[#DC2626] active:opacity-70"
        >
          <Text className="text-2xl">🔥</Text>
        </Pressable>
      </View>
    </View>
  );
}
