import { useEffect, useState } from "react";
import { AppState, AppStateStatus } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useQueryClient } from "@tanstack/react-query";
import { SplashScreen } from "expo-router";

import { queryClient } from "~/utils/api";
import { trpc } from "~/utils/api";
import { initializeToken } from "~/utils/session-store";

import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";

// Prevent splash screen from auto-hiding until we're ready
SplashScreen.preventAutoHideAsync();

function AppStateHandler() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (state: AppStateStatus) => {
        if (state === "active") {
          // Revalidate session when app returns from background
          queryClient.invalidateQueries({
            queryKey: trpc.auth.getSession.queryKey(),
          });
        }
      },
    );

    return () => subscription.remove();
  }, [queryClient]);

  return null;
}

export default function RootLayout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initializeToken()
      .catch((e) =>
        console.error("[ROOT] Token initialization failed:", e),
      )
      .finally(() => {
        setReady(true);
        SplashScreen.hideAsync();
      });
  }, []);

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <AppStateHandler />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#0D0D0D",
          },
          headerTintColor: "#DC2626",
          headerTitleStyle: {
            color: "#DC2626",
            fontWeight: "bold",
          },
          contentStyle: {
            backgroundColor: "#0D0D0D",
          },
        }}
      />
      <StatusBar style="light" />
    </QueryClientProvider>
  );
}
