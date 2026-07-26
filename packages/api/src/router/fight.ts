import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, or } from "@matchfaca/db";
import { Fight, FightRequest } from "@matchfaca/db/schema";

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
      const request = await ctx.db.query.FightRequest.findFirst({
        where: and(
          eq(FightRequest.id, input.fightRequestId),
          eq(FightRequest.status, "accepted"),
        ),
      });

      if (!request) throw new Error("Pedido não encontrado ou não aceito");

      const isParticipant =
        request.challengerId === ctx.session.user.id ||
        request.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte desse pedido");

      const existingFight = await ctx.db.query.Fight.findFirst({
        where: eq(Fight.fightRequestId, input.fightRequestId),
      });

      if (existingFight) throw new Error("Já existe uma luta agendada para esse pedido");

      return ctx.db
        .insert(Fight)
        .values({
          fightRequestId: input.fightRequestId,
          scheduledAt: input.scheduledAt
            ? new Date(input.scheduledAt)
            : null,
          locationName: input.locationName ?? null,
          latitude: input.latitude ?? null,
          longitude: input.longitude ?? null,
        })
        .returning();
    }),

  /** Get my fights */
  mine: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.FightRequest.findMany({
      where: and(
        or(
          eq(FightRequest.challengerId, ctx.session.user.id),
          eq(FightRequest.challengedId, ctx.session.user.id),
        ),
        eq(FightRequest.status, "accepted"),
      ),
      with: {
        fight: true,
        challenger: true,
        challenged: true,
      },
      limit: 50,
    });
  }),

  /** Confirm a fight (both sides need to confirm) */
  confirm: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const fight = await ctx.db.query.Fight.findFirst({
        where: eq(Fight.id, input.id),
        with: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");
      if (fight.status !== "scheduled") throw new Error("Luta não está agendada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db
        .update(Fight)
        .set({ status: "confirmed" })
        .where(eq(Fight.id, input.id))
        .returning();
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
      const fight = await ctx.db.query.Fight.findFirst({
        where: eq(Fight.id, input.id),
        with: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db
        .update(Fight)
        .set({
          status: "completed",
          winnerId: input.winnerId,
          result: input.result,
          endedAt: new Date(),
        })
        .where(eq(Fight.id, input.id))
        .returning();
    }),

  /** Cancel a fight */
  cancel: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const fight = await ctx.db.query.Fight.findFirst({
        where: eq(Fight.id, input.id),
        with: { fightRequest: true },
      });

      if (!fight) throw new Error("Luta não encontrada");

      const isParticipant =
        fight.fightRequest.challengerId === ctx.session.user.id ||
        fight.fightRequest.challengedId === ctx.session.user.id;

      if (!isParticipant) throw new Error("Você não faz parte dessa luta");

      return ctx.db
        .update(Fight)
        .set({ status: "cancelled" })
        .where(eq(Fight.id, input.id))
        .returning();
    }),
} satisfies TRPCRouterRecord;
