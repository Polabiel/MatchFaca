import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { useSession, useSignIn, useSignOut, useUser } from "~/utils/auth";
import { trpc } from "~/utils/api";
import { NavBar } from "./_components/nav-bar";
import { SwipeFeed } from "./swipe";

// ─── Loading ───────────────────────────────────────────────

function LoadingScreen() {
  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-[#0D0D0D]">
      <View className="items-center gap-4">
        <ActivityIndicator size="large" color="#DC2626" />
        <Text className="text-sm text-gray-500">Carregando...</Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Auth Screen ───────────────────────────────────────────

function AuthScreen() {
  const signIn = useSignIn();

  return (
    <SafeAreaView className="flex-1 bg-[#0D0D0D]">
      <Stack.Screen
        options={{
          title: "matchFaca",
          headerShown: false,
        }}
      />
      <View className="flex-1 items-center justify-center px-8">
        {/* Background effects */}
        <View className="absolute -right-40 -top-40 size-80 rounded-full bg-[#DC2626]/5 blur-3xl" />
        <View className="absolute -bottom-40 -left-40 size-72 rounded-full bg-[#DC2626]/8 blur-3xl" />

        {/* Logo */}
        <View className="mb-6 items-center">
          <View className="mb-6 size-24 items-center justify-center rounded-full border-2 border-[#DC2626]/20 bg-[#DC2626]/5">
            <Text className="text-5xl">🗡️</Text>
          </View>
          <Text className="text-5xl font-black tracking-tight text-white">
            match
            <Text className="text-[#DC2626]">Faca</Text>
          </Text>
          <View className="mt-2 h-px w-16 bg-[#DC2626]/30" />
          <Text className="mt-4 text-center text-base leading-relaxed text-gray-500">
            Encontre oponentes.{"\n"}Marque lutas. Prove seu valor.
          </Text>
        </View>

        {/* Divider */}
        <View className="mb-10 w-full max-w-[200px] flex-row items-center gap-3">
          <View className="h-px flex-1 bg-gray-800" />
          <Text className="text-xs text-gray-600">Fight Club</Text>
          <View className="h-px flex-1 bg-gray-800" />
        </View>

        {/* CTA */}
        <Pressable
          onPress={() => signIn()}
          className="w-full max-w-xs flex-row items-center justify-center gap-3 rounded-xl bg-[#DC2626] px-6 py-4 active:opacity-80"
          style={{
            shadowColor: "#DC2626",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <Text className="text-lg">🔗</Text>
          <Text className="text-base font-bold text-white">
            Entrar com Discord
          </Text>
        </Pressable>

        <Text className="mt-6 text-center text-xs leading-relaxed text-gray-700">
          Ao entrar, você concorda com nossos{"\n"}
          Termos de Uso e Política de Privacidade
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ─── Authenticated Gate ────────────────────────────────────

function AuthenticatedGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: profile, isLoading } = useQuery(
    trpc.profile.mine.queryOptions(),
  );

  useEffect(() => {
    if (!isLoading && !profile) {
      router.replace("/onboarding");
    }
  }, [profile, isLoading, router]);

  if (isLoading) return <LoadingScreen />;
  if (!profile) return null;

  return <>{children}</>;
}

// ─── Authenticated App ─────────────────────────────────────

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
      <AuthenticatedGate>
        <SwipeFeed />
        <NavBar />
      </AuthenticatedGate>
    </SafeAreaView>
  );
}

// ─── Root Index ────────────────────────────────────────────

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


