import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure } from "../trpc";

export const fightRouter = {
  /** Schedule a fight after a request is accepted */
  schedule: protectedProcedure
    .input(
      z.object({
        fightRequestId: z.string().uuid(),
        scheduledAt: z.string().datetime().optional(),
        locationName: z.string().max(255).optional(),
        latitude: z.number().min(-90).max(90).optional(),
        longitude: z.number().min(-180).max(180).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const request = await ctx.db.fightRequest.findFirst({
        where: {
          id: input.fightRequestId,
          status: "accepted",
        },
      });

      if (!request) throw new Error("Pedido não encontrado ou não aceito");

      const isParticipant =
        request.challengerId === ctx.session.user.id ||
        request.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte desse pedido");

      const existingFight = await ctx.db.fight.findFirst({
        where: { fightRequestId: input.fightRequestId },
      });

      if (existingFight)
        throw new Error("Já existe uma luta agendada para esse pedido");

      return ctx.db.fight.create({
        data: {
          fightRequestId: input.fightRequestId,
          scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : null,
          locationName: input.locationName ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
        },
      });
    }),

  /** Get my fights */
  mine: protectedProcedure.query(({ ctx }) => {
    return ctx.db.fightRequest.findMany({
      where: {
        OR: [
          { challengerId: ctx.session.user.id },
          { challengedId: ctx.session.user.id },
        ],
        status: "accepted",
      },
      include: {
        fight: true,
        challenger: true,
        challenged: true,
      },
      take: 50,
    });
  }),

  /** Confirm a fight (both sides need to confirm) */
  confirm: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const fight = await ctx.db.fight.findFirst({
        where: { id: input.id },
        include: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");
      if (fight.status !== "scheduled")
        throw new Error("Luta não está agendada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db.fight.update({
        where: { id: input.id },
        data: { status: "confirmed" },
      });
    }),

  /** Report result */
  reportResult: protectedProcedure
    .input(
      z.object({
        id: z.string().uuid(),
        winnerId: z.string().uuid(),
        result: z.enum([
          "knockout",
          "submission",
          "desistência",
          "empate",
          "nocaute_técnico",
          "finalizado",
        ]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fight = await ctx.db.fight.findFirst({
        where: { id: input.id },
        include: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db.fight.update({
        where: { id: input.id },
        data: {
          status: "completed",
          winnerId: input.winnerId,
          result: input.result,
          endedAt: new Date(),
        },
      });
    }),

  /** Cancel a fight */
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const fight = await ctx.db.fight.findFirst({
        where: { id: input.id },
        include: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db.fight.update({
        where: { id: input.id },
        data: { status: "cancelled" },
      });
    }),
} satisfies TRPCRouterRecord;
