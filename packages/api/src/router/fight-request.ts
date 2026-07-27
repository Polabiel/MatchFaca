import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

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
      const existing = await ctx.db.fightRequest.findFirst({
        where: {
          challengerId: ctx.session.user.id,
          challengedId: input.challengedId,
          OR: [{ status: "pending" }, { status: "accepted" }],
        },
      });

      if (existing) {
        throw new Error("Já existe um pedido pendente para essa pessoa");
      }

      return ctx.db.fightRequest.create({
        data: {
          challengerId: ctx.session.user.id,
          challengedId: input.challengedId,
          message: input.message ?? null,
        },
      });
    }),

  /** Get all pending requests for the current user */
  incoming: protectedProcedure.query(({ ctx }) => {
    return ctx.db.fightRequest.findMany({
      where: {
        challengedId: ctx.session.user.id,
        status: "pending",
      },
      include: {
        challenger: true,
      },
      take: 50,
    });
  }),

  /** Get all sent requests by the current user */
  outgoing: protectedProcedure.query(({ ctx }) => {
    return ctx.db.fightRequest.findMany({
      where: {
        challengerId: ctx.session.user.id,
        status: "pending",
      },
      include: {
        challenged: true,
      },
      take: 50,
    });
  }),

  /** Accept a fight request */
  accept: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.fightRequest.findFirst({
        where: { id: input.id },
      });

      if (!request || request.challengedId !== ctx.session.user.id) {
        throw new Error("Pedido não encontrado");
      }

      return ctx.db.fightRequest.update({
        where: { id: input.id },
        data: { status: "accepted" },
      });
    }),

  /** Decline a fight request */
  decline: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.fightRequest.findFirst({
        where: { id: input.id },
      });

      if (!request || request.challengedId !== ctx.session.user.id) {
        throw new Error("Pedido não encontrado");
      }

      return ctx.db.fightRequest.update({
        where: { id: input.id },
        data: { status: "declined" },
      });
    }),

  /** Get accepted matches */
  matches: protectedProcedure.query(({ ctx }) => {
    return ctx.db.fightRequest.findMany({
      where: {
        OR: [
          { challengerId: ctx.session.user.id },
          { challengedId: ctx.session.user.id },
        ],
        status: "accepted",
      },
      include: {
        challenger: true,
        challenged: true,
        fight: true,
      },
      take: 50,
    });
  }),
} satisfies TRPCRouterRecord;
