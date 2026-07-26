import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { CreateProfileSchema } from "@matchfaca/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = {
  /** Get the current user's profile */
  mine: protectedProcedure.query(({ ctx }) => {
    return ctx.db.profile.findFirst({
      where: { userId: ctx.session.user.id },
    });
  }),

  /** Get a profile by user ID */
  byUserId: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.profile.findFirst({
        where: { userId: input.userId },
      });
    }),

  /** Create or update profile */
  upsert: protectedProcedure
    .input(CreateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.profile.findFirst({
        where: { userId: ctx.session.user.id },
      });

      if (existing) {
        return ctx.db.profile.update({
          where: { userId: ctx.session.user.id },
          data: { ...input },
        });
      }

      return ctx.db.profile.create({
        data: { ...input, userId: ctx.session.user.id },
      });
    }),

  /** Get nearby profiles for the swipe feed */
  nearby: protectedProcedure
    .input(
      z.object({
        latitude: z.number().min(-90).max(90),
        longitude: z.number().min(-180).max(180),
        radiusKm: z.number().min(1).max(200).default(50),
        limit: z.number().min(1).max(50).default(20),
        excludeIds: z.array(z.string().uuid()).optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Haversine-based proximity filter
      // Approx: 1° lat = 111km, 1° lng = 111*cos(lat) km
      const latDelta = input.radiusKm / 111;
      const lngDelta =
        input.radiusKm / (111 * Math.cos((input.latitude * Math.PI) / 180));

      return ctx.db.profile.findMany({
        where: {
          AND: [
            { latitude: { not: null } },
            { longitude: { not: null } },
            { userId: { not: ctx.session.user.id } },
            {
              latitude: {
                gte: input.latitude - latDelta,
                lte: input.latitude + latDelta,
              },
            },
            {
              longitude: {
                gte: input.longitude - lngDelta,
                lte: input.longitude + lngDelta,
              },
            },
            ...(input.excludeIds?.length
              ? [{ userId: { notIn: input.excludeIds } }]
              : []),
          ],
        },
        take: input.limit,
        include: {
          user: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
