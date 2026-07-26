import React from "react";
import { ActivityIndicator, Button, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { useSession, useSignIn, useSignOut, useUser } from "~/utils/auth";
import { NavBar } from "./_components/nav-bar";
import { SwipeFeed } from "./swipe";

function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#0D0D0D]">
      <ActivityIndicator size="large" color="#DC2626" />
    </SafeAreaView>
  );
}

function AuthScreen() {
  const signIn = useSignIn();

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
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8 items-center">
          <Text className="text-6xl font-black tracking-tight text-white">
            match
            <Text className="text-[#DC2626]">Faca</Text>
          </Text>
          <Text className="mt-2 text-center text-sm text-gray-500">
            Encontre oponentes. Marque lutas. Prove seu valor.
          </Text>
        </View>

        <View className="mb-12 h-32 w-32 items-center justify-center rounded-full border-2 border-[#DC2626]/30 bg-[#DC2626]/5">
          <Text className="text-5xl">🗡️</Text>
        </View>

        <Button
          onPress={() => signIn()}
          title="Entrar com Discord"
          color="#DC2626"
        />

        <Text className="mt-4 text-center text-xs text-gray-600">
          Ao entrar, você concorda com os termos de uso
        </Text>
      </View>
    </SafeAreaView>
  );
}

function AuthenticatedApp() {
  const signOut = useSignOut();

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "matchFaca",
          headerStyle: { backgroundColor: "#0D0D0D" },
          headerTitleStyle: { color: "#DC2626", fontWeight: "bold" },
          headerTintColor: "#DC2626",
          headerRight: () => (
            <Pressable onPress={() => signOut()} className="mr-2">
              <Text className="text-sm text-gray-500">Sair</Text>
            </Pressable>
          ),
        }}
      />
      <SwipeFeed />
      <NavBar />
    </SafeAreaView>
  );
}

export default function Index() {
  const { data: session, isLoading, isFetched } = useSession();
  const user = useUser();

  // Loading state: prevent flash of AuthScreen while session is being checked
  if (isLoading && !isFetched) {
    return <LoadingScreen />;
  }

  if (!session?.user || !user) return <AuthScreen />;

  return <AuthenticatedApp />;
}
