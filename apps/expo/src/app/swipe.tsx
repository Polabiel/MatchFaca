import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { trpc } from "~/utils/api";

import { NavBar } from "./_components/nav-bar";
import { SwipeCard } from "./_components/swipe-card";

export function SwipeFeed() {
  const queryClient = useQueryClient();
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);

  const { data: nearbyProfiles, isLoading } = useQuery(
    trpc.profile.nearby.queryOptions({
      latitude: -23.5505,
      longitude: -46.6333,
      radiusKm: 100,
    }),
  );

  const profiles = nearbyProfiles ?? [];
  const visibleProfiles = profiles.filter(
    (p) => !dismissedIds.includes(p.id),
  );

  const challengeMutation = useMutation(
    trpc.fightRequest.send.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.profile.pathFilter());
        await queryClient.invalidateQueries(
          trpc.fightRequest.matches.queryFilter(),
        );
      },
    }),
  );

  const handleSkip = useCallback(() => {
    const firstProfile = visibleProfiles[0];
    if (!firstProfile) return;
    setDismissedIds((prev) => [...prev, firstProfile.id]);
  }, [visibleProfiles]);

  const handleChallenge = useCallback(() => {
    const firstProfile = visibleProfiles[0];
    if (!firstProfile) return;
    challengeMutation.mutate({ challengedId: firstProfile.userId });
    setDismissedIds((prev) => [...prev, firstProfile.id]);
  }, [visibleProfiles, challengeMutation]);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0D0D0D]">
        <Text className="text-lg text-gray-500">Carregando...</Text>
      </View>
    );
  }

  const currentProfile = visibleProfiles[0];

  if (!currentProfile) {
    return (
      <View className="flex-1 items-center justify-center bg-[#0D0D0D] px-8">
        <Text className="text-6xl mb-4">🗡️</Text>
        <Text className="text-center text-xl font-bold text-white">
          Ninguém por perto
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          Volte mais tarde para encontrar novos oponentes
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#0D0D0D] p-4">
      <SwipeCard
        profile={currentProfile}
        onSkip={handleSkip}
        onChallenge={handleChallenge}
        disabled={challengeMutation.isPending}
      />
    </View>
  );
}

export default function SwipeScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "matchFaca",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
        }}
      />
      <SwipeFeed />
      <NavBar />
    </SafeAreaView>
  );
}
