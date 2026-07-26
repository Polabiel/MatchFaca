import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, or } from "@matchfaca/db";
import { FightRequest } from "@matchfaca/db/schema";

import { protectedProcedure } from "../trpc";

export const fightRequestRouter = {
  /** Send a fight request (swipe right → challenge) */
  send: protectedProcedure
    .input(
      z.object({
        challengedId: z.string().uuid(),
        message: z.string().max(280).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.FightRequest.findFirst({
        where: and(
          eq(FightRequest.challengerId, ctx.session.user.id),
          eq(FightRequest.challengedId, input.challengedId),
          or(
            eq(FightRequest.status, "pending"),
            eq(FightRequest.status, "accepted"),
          ),
        ),
      });

      if (existing) {
        throw new Error("Já existe um pedido pendente para essa pessoa");
      }

      return ctx.db
        .insert(FightRequest)
        .values({
          challengerId: ctx.session.user.id,
          challengedId: input.challengedId,
          message: input.message ?? null,
        })
        .returning();
    }),

  /** Get all pending requests for the current user */
  incoming: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.FightRequest.findMany({
      where: and(
        eq(FightRequest.challengedId, ctx.session.user.id),
        eq(FightRequest.status, "pending"),
      ),
      with: {
        challenger: true,
      },
      limit: 50,
    });
  }),

  /** Get all sent requests by the current user */
  outgoing: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.FightRequest.findMany({
      where: and(
        eq(FightRequest.challengerId, ctx.session.user.id),
        eq(FightRequest.status, "pending"),
      ),
      with: {
        challenged: true,
      },
      limit: 50,
    });
  }),

  /** Accept a fight request */
  accept: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.FightRequest.findFirst({
        where: eq(FightRequest.id, input.id),
      });

      if (!request || request.challengedId !== ctx.session.user.id) {
        throw new Error("Pedido não encontrado");
      }

      return ctx.db
        .update(FightRequest)
        .set({ status: "accepted" })
        .where(eq(FightRequest.id, input.id))
        .returning();
    }),

  /** Decline a fight request */
  decline: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.query.FightRequest.findFirst({
        where: eq(FightRequest.id, input.id),
      });

      if (!request || request.challengedId !== ctx.session.user.id) {
        throw new Error("Pedido não encontrado");
      }

      return ctx.db
        .update(FightRequest)
        .set({ status: "declined" })
        .where(eq(FightRequest.id, input.id))
        .returning();
    }),

  /** Get accepted matches */
  matches: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.FightRequest.findMany({
      where: and(
        or(
          eq(FightRequest.challengerId, ctx.session.user.id),
          eq(FightRequest.challengedId, ctx.session.user.id),
        ),
        eq(FightRequest.status, "accepted"),
      ),
      with: {
        challenger: true,
        challenged: true,
        fight: true,
      },
      limit: 50,
    });
  }),
} satisfies TRPCRouterRecord;
