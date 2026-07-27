import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { handlers, isSecureContext } from "@matchfaca/auth";

const EXPO_COOKIE_NAME = "__acme-expo-redirect-state";
const AUTH_COOKIE_PATTERN = /authjs\.session-token=([^;]+)/;

/**
 * In-memory store for Expo redirect URLs keyed by random state.
 * Used as fallback when the cookie doesn't survive the OAuth redirect chain
 * in system browsers (SFSafariViewController / Chrome Custom Tabs).
 *
 * Entries expire after 10 minutes.
 */
const expoRedirectStore = new Map<
  string,
  { redirectTo: string; expiresAt: number }
>();

if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, val] of expoRedirectStore) {
        if (val.expiresAt < now) expoRedirectStore.delete(key);
      }
    },
    5 * 60 * 1000,
  );
}

/**
 * Noop in production.
 *
 * In development, rewrite the request URL to use localhost instead of host IP address
 * so that Expo Auth works without getting trapped by Next.js CSRF protection.
 * @param req The request to modify
 * @returns The modified request.
 */
function rewriteRequestUrlInDevelopment(req: NextRequest) {
  if (isSecureContext) return req;

  const host = req.headers.get("host");
  const newURL = new URL(req.url);
  newURL.host = host ?? req.nextUrl.host;
  return new NextRequest(newURL, req);
}

async function handleExpoSigninCallback(req: NextRequest, redirectURL: string) {
  (await cookies()).delete(EXPO_COOKIE_NAME);

  // Run original handler, then extract the session token from the response
  // Send it back via a query param in the Expo deep link. The Expo app
  // will then get that and set it in the session storage.
  const authResponse = await handlers.POST(req);
  const setCookie = authResponse.headers
    .getSetCookie()
    .find((cookie) => AUTH_COOKIE_PATTERN.test(cookie));
  const match = setCookie?.match(AUTH_COOKIE_PATTERN)?.[1];

  if (!match)
    throw new Error(
      "Unable to find session cookie: " +
        JSON.stringify(authResponse.headers.getSetCookie()),
    );

  const url = new URL(redirectURL);
  url.searchParams.set("session_token", match);

  return NextResponse.redirect(url);
}

export const POST = async (
  _req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> },
) => {
  // First step must be to correct the request URL.
  const req = rewriteRequestUrlInDevelopment(_req);

  const nextauthAction = (await props.params).nextauth[0];

  // 1. Try cookie first (primary path when cookie survives)
  const isExpoCallback = (await cookies()).get(EXPO_COOKIE_NAME);
  if (nextauthAction === "callback" && !!isExpoCallback) {
    return handleExpoSigninCallback(req, isExpoCallback.value);
  }

  return handlers.POST(req);
};

export const GET = async (
  _req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> },
) => {
  // First step must be to correct the request URL.
  const req = rewriteRequestUrlInDevelopment(_req);

  const nextauthAction = (await props.params).nextauth[0];
  const isExpoSignIn = req.nextUrl.searchParams.get("expo-redirect");
  let isExpoCallback = (await cookies()).get(EXPO_COOKIE_NAME);

  if (nextauthAction === "signin" && !!isExpoSignIn) {
    // Primary: set cookie for the callback to read
    (await cookies()).set({
      name: EXPO_COOKIE_NAME,
      value: isExpoSignIn,
      maxAge: 60 * 10, // 10 min
      path: "/",
    });

    // Fallback: store redirect URL in memory keyed by random state,
    // pass it through the OAuth redirect chain via callbackUrl.
    // This survives even if the system browser loses the cookie.
    const state = crypto.randomUUID();
    expoRedirectStore.set(state, {
      redirectTo: isExpoSignIn,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Embed expo_state in the callback URL so Discord returns it
    const url = new URL(req.url);
    url.searchParams.set(
      "callbackUrl",
      `/api/auth/callback/discord?expo_state=${state}`,
    );

    return handlers.GET(new NextRequest(url, req));
  }

  // Callback GET handler — Discord redirects here after OAuth
  // This runs BEFORE the POST; we use it to re-set the cookie if needed
  if (nextauthAction === "callback") {
    // Primary path: cookie survived (set in signin step)
    if (isExpoCallback) {
      return handleExpoSigninCallback(req, isExpoCallback.value);
    }

    // Fallback: cookie was lost, try to recover from in-memory store
    const expoState = req.nextUrl.searchParams.get("expo_state");
    if (expoState) {
      const entry = expoRedirectStore.get(expoState);
      if (entry && entry.expiresAt > Date.now()) {
        // Re-set the cookie so the POST handler can find it
        (await cookies()).set({
          name: EXPO_COOKIE_NAME,
          value: entry.redirectTo,
          maxAge: 60 * 10,
          path: "/",
        });
        isExpoCallback = { value: entry.redirectTo, name: EXPO_COOKIE_NAME };
      }
      expoRedirectStore.delete(expoState);
    }

    if (isExpoCallback) {
      return handleExpoSigninCallback(req, isExpoCallback.value);
    }
  }

  // Every other request just calls the default handler
  return handlers.GET(req);
};
