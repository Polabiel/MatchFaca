import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

// Middleware only checks JWT — no Prisma adapter needed (edge-compatible)
export const { auth: middleware } = NextAuth({ providers: [Discord] });

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
