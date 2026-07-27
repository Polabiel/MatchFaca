import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Pure edge middleware — no NextAuth wrapper needed.
// Auth is handled by createTRPCContext (serverless) which uses PrismaAdapter
// for database sessions. Using a separate JWT-only NextAuth instance here
// would fail to decode the database-session cookie, producing false-positive
// JWTSessionError logs.
export default function middleware(_req: NextRequest) {
  const res = NextResponse.next();

  // Security headers
  const headers = res.headers;
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
