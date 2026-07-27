import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";

import { appRouter, createTRPCContext } from "@matchfaca/api";
import { env } from "~/env";

const isDev = env.NODE_ENV === "development";

/**
 * Configure CORS headers restricted to known origins.
 * In development, allow any origin for Expo dev client.
 * In production, restrict to the app's own origin or configured ALLOWED_ORIGINS.
 */
const getAllowedOrigin = (req: Request): string => {
  if (isDev) return "*";

  const origin = req.headers.get("origin");
  if (!origin) return "";

  const allowedOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  // Always allow same-origin (no origin header = same origin)
  if (allowedOrigins.includes(origin)) return origin;

  return "";
};

const setCorsHeaders = (res: Response, req: Request) => {
  const origin = getAllowedOrigin(req);
  if (origin) {
    res.headers.set("Access-Control-Allow-Origin", origin);
  }
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set(
    "Access-Control-Allow-Headers",
    "Authorization, Content-Type, x-trpc-source",
  );
  res.headers.set("Access-Control-Max-Age", "86400");
};

export const OPTIONS = (req: Request) => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response, req);
  return response;
};

/**
 * Create context without the redundant auth() wrapper — createTRPCContext
 * resolves the session internally via isomorphicGetSession, which handles
 * both cookie-based (Next.js) and Bearer-token (Expo) authentication.
 */
const createContext = async (req: NextRequest) => {
  return createTRPCContext({
    headers: req.headers,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () => createContext(req),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

export { handler as GET, handler as POST };
