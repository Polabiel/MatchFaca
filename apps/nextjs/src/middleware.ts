import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// Middleware only checks JWT — no Prisma adapter needed (edge-compatible)
const { auth: nextAuthMiddleware } = NextAuth({ providers: [Discord] });

export default nextAuthMiddleware(function middleware(_req: NextRequest) {
  const res = NextResponse.next();

  // Security headers
  const headers = res.headers;
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

  return res;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
