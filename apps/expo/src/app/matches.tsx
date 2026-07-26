import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";
import { Stack } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import type { RouterOutputs } from "~/utils/api";
import { trpc } from "~/utils/api";

import { NavBar } from "./_components/nav-bar";

type Match = RouterOutputs["fightRequest"]["matches"][number];

const fightStatusLabels: Record<string, string> = {
  scheduled: "Agendada",
  confirmed: "Confirmada",
  in_progress: "Em andamento",
  completed: "Finalizada",
  cancelled: "Cancelada",
};

function formatDate(date: Date | string | null): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function MatchCard({ match }: { match: Match }) {
  const challengerName = match.challenger.name ?? "Desconhecido";
  const challengedName = match.challenged.name ?? "Desconhecido";
  const fight = match.fight;
  const statusLabel = fight
    ? fightStatusLabels[fight.status] ?? fight.status
    : "Aguardando agendamento";

  return (
    <View className="mx-4 mb-3 overflow-hidden rounded-xl border border-[#DC2626]/20 bg-[#1A1A1A]">
      <View className="p-4">
        {/* Fighters */}
        <View className="flex-row items-center justify-between">
          <View className="flex-1 items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#DC2626]/20">
              <Text className="text-lg font-bold text-[#DC2626]">
                {challengerName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="mt-1 text-sm font-semibold text-white text-center" numberOfLines={1}>
              {challengerName}
            </Text>
          </View>

          <View className="mx-3 items-center">
            <Text className="text-2xl font-bold text-[#DC2626]">VS</Text>
            <Text className="text-xs text-gray-500">Luta</Text>
          </View>

          <View className="flex-1 items-center">
            <View className="h-12 w-12 items-center justify-center rounded-full bg-[#DC2626]/20">
              <Text className="text-lg font-bold text-[#DC2626]">
                {challengedName.charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text className="mt-1 text-sm font-semibold text-white text-center" numberOfLines={1}>
              {challengedName}
            </Text>
          </View>
        </View>

        {/* Status */}
        <View className="mt-3 flex-row items-center justify-between rounded-lg bg-[#111111] px-3 py-2">
          <View className="flex-row items-center gap-2">
            <View
              className={`h-2 w-2 rounded-full ${
                fight?.status === "completed"
                  ? "bg-green-500"
                  : fight?.status === "cancelled"
                    ? "bg-red-500"
                    : "bg-yellow-500"
              }`}
            />
            <Text className="text-sm text-gray-300">{statusLabel}</Text>
          </View>
          {fight?.scheduledAt && (
            <Text className="text-xs text-gray-500">
              {formatDate(fight.scheduledAt)}
            </Text>
          )}
        </View>

        {/* Action hint */}
        {!fight && (
          <Pressable className="mt-3 items-center rounded-lg border border-[#DC2626]/30 bg-[#DC2626]/10 py-2 active:opacity-70">
            <Text className="text-sm font-semibold text-[#DC2626]">
              Agendar Luta
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

export default function MatchesScreen() {
  const { data: matches, isLoading } = useQuery(
    trpc.fightRequest.matches.queryOptions(),
  );

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "Lutas",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
        }}
      />

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-gray-500">Carregando...</Text>
        </View>
      ) : !matches || matches.length === 0 ? (
        <View className="flex-1 items-center justify-center px-8">
          <Text className="mb-4 text-6xl">🤜</Text>
          <Text className="text-center text-xl font-bold text-white">
            Nenhuma luta ainda
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Deslize para encontrar oponentes e comece a lutar
          </Text>
        </View>
      ) : (
        <FlashList
          data={matches}
          estimatedItemSize={180}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingTop: 12, paddingBottom: 12 }}
          renderItem={({ item }) => <MatchCard match={item} />}
        />
      )}

      <NavBar />
    </SafeAreaView>
  );
}
