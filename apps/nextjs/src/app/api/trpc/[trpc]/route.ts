import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

import { appRouter, createTRPCContext } from "@matchfaca/api";
import { auth } from "@matchfaca/auth";
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

const handler = auth(async (req) => {
  const response = await fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () =>
      createTRPCContext({
        session: req.auth,
        headers: req.headers,
      }),
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
  });

  setCorsHeaders(response, req);
  return response;
});

export { handler as GET, handler as POST };
