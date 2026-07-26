import { authRouter } from "./router/auth";
import { fightRouter } from "./router/fight";
import { fightRequestRouter } from "./router/fight-request";
import { profileRouter } from "./router/profile";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  auth: authRouter,
  profile: profileRouter,
  fightRequest: fightRequestRouter,
  fight: fightRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
