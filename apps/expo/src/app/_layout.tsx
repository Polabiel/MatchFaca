import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { queryClient } from "~/utils/api";

import "../styles.css";

import { QueryClientProvider } from "@tanstack/react-query";

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
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
