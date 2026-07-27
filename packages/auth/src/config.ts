import { readFileSync, writeFileSync } from "node:fs";
import type {
  DefaultSession,
  NextAuthConfig,
  Session as NextAuthSession,
} from "next-auth";
import { skipCSRFCheck } from "@auth/core";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";

import { db } from "@matchfaca/db/client";

import { env } from "../env";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

// ─── Auth error debug infrastructure ────────────────────
// Ported from Yield: writes auth errors to /tmp for debugging via API

const AUTH_ERROR_PATH = "/tmp/matchfaca-auth-error.json";

function writeAuthError(error: unknown) {
  const entry = JSON.stringify({
    t: Date.now(),
    m: error instanceof Error ? error.message : String(error),
    n: error instanceof Error ? error.name : typeof error,
    s:
      error instanceof Error
        ? error.stack?.split("\n").slice(0, 6).join("\n")
        : undefined,
    c:
      error instanceof Error && error.cause
        ? error.cause instanceof Error
          ? {
              m: error.cause.message,
              s: error.cause.stack?.split("\n").slice(0, 4).join("\n"),
            }
          : JSON.stringify(error.cause)
        : undefined,
  });
  try {
    writeFileSync(AUTH_ERROR_PATH, entry, "utf-8");
  } catch {
    // Best-effort: auth error debug file is non-critical
  }
}

export function readLastAuthError(): Record<string, unknown> | null {
  try {
    const content = readFileSync(AUTH_ERROR_PATH, "utf-8");
    return JSON.parse(content) as Record<string, unknown>;
  } catch {
    return null;
  }
}

const adapter = PrismaAdapter(db);

export const isSecureContext = env.NODE_ENV !== "development";

export const authConfig = {
  adapter,
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  // In development, we need to skip checks to allow Expo to work
  ...(!isSecureContext
    ? {
        skipCSRFCheck: skipCSRFCheck,
        trustHost: true,
      }
    : {}),
  secret: env.AUTH_SECRET,
  providers: [Discord],
  logger: {
    error(error) {
      writeAuthError(error);
      console.error(
        "[auth error]",
        error instanceof Error ? error.message : error,
      );
    },
  },
  callbacks: {
    session: (opts) => {
      if (!("user" in opts))
        throw new Error("unreachable with session strategy");

      return {
        ...opts.session,
        user: {
          ...opts.session.user,
          id: opts.user.id,
        },
      };
    },
  },
} satisfies NextAuthConfig;

export const validateToken = async (
  token: string,
): Promise<NextAuthSession | null> => {
  const sessionToken = token.slice("Bearer ".length);
  const session = await adapter.getSessionAndUser?.(sessionToken);
  return session
    ? {
        user: {
          ...session.user,
        },
        expires: session.session.expires.toISOString(),
      }
    : null;
};

export const invalidateSessionToken = async (token: string) => {
  const sessionToken = token.slice("Bearer ".length);
  await adapter.deleteSession?.(sessionToken);
};
