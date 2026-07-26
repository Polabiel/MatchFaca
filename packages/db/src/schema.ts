import { z } from "zod";

// ─── Zod validation schemas ─────────────────────────────

export const CreateProfileSchema = z.object({
  nickname: z.string().min(2).max(60),
  bio: z.string().max(500).optional(),
  fightingStyle: z.enum([
    "boxe",
    "muay_thai",
    "jiu_jitsu",
    "mma",
    "kickboxing",
    "capoeira",
    "karate",
    "judô",
    "taekwondo",
    "luta_livre",
    "vale_tudo",
    "porrada_limpa",
    "outro",
  ]),
  weightClass: z
    .enum(["até_66kg", "até_77kg", "até_93kg", "acima_93kg"])
    .optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationName: z.string().max(255).optional(),
});
