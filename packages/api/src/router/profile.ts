import type { TRPCRouterRecord } from "@trpc/server";
import { z } from "zod";

import { and, eq, isNotNull, ne, sql } from "@matchfaca/db";
import { CreateProfileSchema, Profile } from "@matchfaca/db/schema";

import { protectedProcedure, publicProcedure } from "../trpc";

export const profileRouter = {
  /** Get the current user's profile */
  mine: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.Profile.findFirst({
      where: eq(Profile.userId, ctx.session.user.id),
    });
  }),

  /** Get a profile by user ID */
  byUserId: publicProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .query(({ ctx, input }) => {
      return ctx.db.query.Profile.findFirst({
        where: eq(Profile.userId, input.userId),
      });
    }),

  /** Create or update profile */
  upsert: protectedProcedure
    .input(CreateProfileSchema)
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.query.Profile.findFirst({
        where: eq(Profile.userId, ctx.session.user.id),
      });

      if (existing) {
        return ctx.db
          .update(Profile)
          .set({ ...input, updatedAt: sql`now()` })
          .where(eq(Profile.userId, ctx.session.user.id))
          .returning();
      }

      return ctx.db
        .insert(Profile)
        .values({ ...input, userId: ctx.session.user.id })
        .returning();
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

      const conditions = [
        isNotNull(Profile.latitude),
        isNotNull(Profile.longitude),
        ne(Profile.userId, ctx.session.user.id),
        sql`${Profile.latitude} BETWEEN ${input.latitude - latDelta} AND ${input.latitude + latDelta}`,
        sql`${Profile.longitude} BETWEEN ${input.longitude - lngDelta} AND ${input.longitude + lngDelta}`,
      ];

      if (input.excludeIds?.length) {
        conditions.push(
          sql`${Profile.userId} NOT IN (${sql.join(
            input.excludeIds.map((id) => sql`${id}::uuid`),
            sql`, `,
          )})`,
        );
      }

      return ctx.db.query.Profile.findMany({
        where: and(...conditions),
        limit: input.limit,
        with: {
          user: true,
        },
      });
    }),
} satisfies TRPCRouterRecord;
