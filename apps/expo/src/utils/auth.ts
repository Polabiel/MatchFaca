import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import * as Browser from "expo-web-browser";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { trpc } from "./api";
import { getBaseUrl } from "./base-url";
import { deleteToken, setToken } from "./session-store";

export const signIn = async () => {
  try {
    const signInUrl = `${getBaseUrl()}/api/auth/signin`;
    const redirectTo = Linking.createURL("/login");
    const result = await Browser.openAuthSessionAsync(
      `${signInUrl}?expo-redirect=${encodeURIComponent(redirectTo)}`,
      redirectTo,
    );

    if (result.type !== "success") {
      console.warn("[AUTH] Sign-in cancelled or failed:", result.type);
      return false;
    }

    const url = Linking.parse(result.url);
    const sessionToken = url.queryParams?.session_token;
    if (typeof sessionToken !== "string" || !sessionToken) {
      console.error("[AUTH] No session token in OAuth redirect:", url);
      return false;
    }

    await setToken(sessionToken);
    return true;
  } catch (e) {
    console.error("[AUTH] Sign-in failed:", e);
    return false;
  }
};

export const useSession = () => {
  return useQuery(trpc.auth.getSession.queryOptions());
};

export const useUser = () => {
  const { data: session } = useSession();
  return session?.user ?? null;
};

export const useSignIn = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return async () => {
    const success = await signIn();
    if (!success) return;

    await queryClient.invalidateQueries(trpc.pathFilter());
    router.replace("/");
  };
};

export const useSignOut = () => {
  const queryClient = useQueryClient();
  const signOut = useMutation(trpc.auth.signOut.mutationOptions());
  const router = useRouter();

  return async () => {
    try {
      const res = await signOut.mutateAsync();
      if (!res.success) return;
    } catch (e) {
      console.error("[AUTH] Sign-out API call failed:", e);
    }
    await deleteToken();
    await queryClient.invalidateQueries(trpc.pathFilter());
    router.replace("/");
  };
};
