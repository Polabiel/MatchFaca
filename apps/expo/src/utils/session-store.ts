import * as SecureStore from "expo-secure-store";

const key = "session_token";

/**
 * In-memory cache for the session token.
 * - getToken() reads from here synchronously (no async issues with tRPC headers)
 * - setToken() writes here AND persists to SecureStore
 * - deleteToken() clears both
 * - initializeToken() loads from SecureStore into cache at app startup
 */
let tokenCache: string | null = null;

export const getToken = (): string | null => {
  return tokenCache;
};

export const setToken = async (v: string): Promise<void> => {
  tokenCache = v;
  try {
    await SecureStore.setItemAsync(key, v);
  } catch (e) {
    console.error("[SESSION-STORE] Failed to set token:", e);
    throw e;
  }
};

export const deleteToken = async (): Promise<void> => {
  tokenCache = null;
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (e) {
    console.error("[SESSION-STORE] Failed to delete token:", e);
  }
};

export const initializeToken = async (): Promise<void> => {
  try {
    tokenCache = await SecureStore.getItemAsync(key);
  } catch (e) {
    console.error("[SESSION-STORE] Failed to initialize token:", e);
    tokenCache = null;
  }
};
