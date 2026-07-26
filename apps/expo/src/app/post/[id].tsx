import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, Stack } from "expo-router";

export default function Post() {
  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "Posts",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
        }}
      />
      <View className="flex-1 items-center justify-center px-8">
        <Text className="mb-4 text-6xl">🗡️</Text>
        <Text className="text-center text-lg font-semibold text-white">
          Funcionalidade removida
        </Text>
        <Text className="mt-2 text-center text-sm text-gray-500">
          O sistema de posts foi substituído pelo matchFaca
        </Text>
        <Link href="/swipe" asChild>
          <View className="mt-6 rounded-xl bg-[#DC2626] px-6 py-3">
            <Text className="font-bold text-white">Ir para o Swipe</Text>
          </View>
        </Link>
      </View>
    </SafeAreaView>
  );
}
