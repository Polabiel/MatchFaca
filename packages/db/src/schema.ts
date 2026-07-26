import { relations, sql } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTable,
  primaryKey,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// ─── Enums ──────────────────────────────────────────────

export const fightingStyleEnum = pgEnum("fighting_style", [
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
  "porrada_limpa", // sem regra, só briga
  "outro",
]);

export const weightClassEnum = pgEnum("weight_class", [
  "até_66kg",
  "até_77kg",
  "até_93kg",
  "acima_93kg",
]);

export const fightRequestStatusEnum = pgEnum("fight_request_status", [
  "pending",
  "accepted",
  "declined",
]);

export const fightStatusEnum = pgEnum("fight_status", [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
]);

export const fightResultEnum = pgEnum("fight_result", [
  "knockout",
  "submission",
  "desistência",
  "empate",
  "nocaute_técnico",
  "finalizado",
]);

// ─── Auth tables (NextAuth / Auth.js) ──────────────────

export const User = pgTable("user", (t) => ({
  id: t.uuid().notNull().primaryKey().defaultRandom(),
  name: t.varchar({ length: 255 }),
  email: t.varchar({ length: 255 }).notNull(),
  emailVerified: t.timestamp({ mode: "date", withTimezone: true }),
  image: t.varchar({ length: 255 }),
}));

export const UserRelations = relations(User, ({ many }) => ({
  accounts: many(Account),
  profile: many(Profile),
  sentRequests: many(FightRequest, { relationName: "challenger" }),
  receivedRequests: many(FightRequest, { relationName: "challenged" }),
  fights: many(Fight),
  messages: many(Message),
}));

export const Account = pgTable(
  "account",
  (t) => ({
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    type: t
      .varchar({ length: 255 })
      .$type<"email" | "oauth" | "oidc" | "webauthn">()
      .notNull(),
    provider: t.varchar({ length: 255 }).notNull(),
    providerAccountId: t.varchar({ length: 255 }).notNull(),
    refresh_token: t.varchar({ length: 255 }),
    access_token: t.text(),
    expires_at: t.integer(),
    token_type: t.varchar({ length: 255 }),
    scope: t.varchar({ length: 255 }),
    id_token: t.text(),
    session_state: t.varchar({ length: 255 }),
  }),
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  }),
);

export const AccountRelations = relations(Account, ({ one }) => ({
  user: one(User, { fields: [Account.userId], references: [User.id] }),
}));

export const Session = pgTable("session", (t) => ({
  sessionToken: t.varchar({ length: 255 }).notNull().primaryKey(),
  userId: t
    .uuid()
    .notNull()
    .references(() => User.id, { onDelete: "cascade" }),
  expires: t.timestamp({ mode: "date", withTimezone: true }).notNull(),
}));

export const SessionRelations = relations(Session, ({ one }) => ({
  user: one(User, { fields: [Session.userId], references: [User.id] }),
}));

// ─── matchFaca tables ──────────────────────────────────

export const Profile = pgTable(
  "profile",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    userId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    nickname: t.varchar({ length: 60 }).notNull(),
    photo: t.varchar({ length: 512 }),
    bio: t.text(),
    fightingStyle: fightingStyleEnum("fighting_style")
      .notNull()
      .default("outro"),
    weightClass: weightClassEnum("weight_class"),
    wins: t.integer().notNull().default(0),
    losses: t.integer().notNull().default(0),
    latitude: t.doublePrecision(),
    longitude: t.doublePrecision(),
    locationName: t.varchar({ length: 255 }),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (table) => ({
    userIdIdx: uniqueIndex("profile_user_id_idx").on(table.userId),
    locationIdx: index("profile_location_idx").on(
      table.latitude,
      table.longitude,
    ),
  }),
);

export const ProfileRelations = relations(Profile, ({ one }) => ({
  user: one(User, { fields: [Profile.userId], references: [User.id] }),
}));

export const CreateProfileSchema = createInsertSchema(Profile, {
  nickname: z.string().min(2).max(60),
  bio: z.string().max(500).optional(),
  fightingStyle: z.enum(fightingStyleEnum.enumValues),
  weightClass: z.enum(weightClassEnum.enumValues).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  locationName: z.string().max(255).optional(),
}).omit({
  id: true,
  userId: true,
  wins: true,
  losses: true,
  createdAt: true,
  updatedAt: true,
});

export const FightRequest = pgTable(
  "fight_request",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    challengerId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    challengedId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    message: t.varchar({ length: 280 }),
    status: fightRequestStatusEnum("status").notNull().default("pending"),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .$onUpdateFn(() => sql`now()`),
  }),
  (table) => ({
    challengerIdx: index("fr_challenger_idx").on(table.challengerId),
    challengedIdx: index("fr_challenged_idx").on(table.challengedId),
    statusIdx: index("fr_status_idx").on(table.status),
  }),
);

export const FightRequestRelations = relations(
  FightRequest,
  ({ one, many }) => ({
    challenger: one(User, {
      fields: [FightRequest.challengerId],
      references: [User.id],
      relationName: "challenger",
    }),
    challenged: one(User, {
      fields: [FightRequest.challengedId],
      references: [User.id],
      relationName: "challenged",
    }),
    messages: many(Message),
    fight: one(Fight),
  }),
);

export const Fight = pgTable(
  "fight",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    fightRequestId: t
      .uuid()
      .notNull()
      .references(() => FightRequest.id, { onDelete: "cascade" }),
    scheduledAt: t.timestamp({ mode: "date", withTimezone: true }),
    locationName: t.varchar({ length: 255 }),
    latitude: t.doublePrecision(),
    longitude: t.doublePrecision(),
    winnerId: t.uuid().references(() => User.id),
    status: fightStatusEnum("status").notNull().default("scheduled"),
    result: fightResultEnum("result"),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
    endedAt: t.timestamp({ mode: "date", withTimezone: true }),
  }),
  (table) => ({
    fightRequestIdx: uniqueIndex("fight_fight_request_idx").on(
      table.fightRequestId,
    ),
    statusIdx: index("fight_status_idx").on(table.status),
  }),
);

export const FightRelations = relations(Fight, ({ one }) => ({
  fightRequest: one(FightRequest, {
    fields: [Fight.fightRequestId],
    references: [FightRequest.id],
  }),
  winner: one(User, {
    fields: [Fight.winnerId],
    references: [User.id],
  }),
}));

export const Message = pgTable(
  "message",
  (t) => ({
    id: t.uuid().notNull().primaryKey().defaultRandom(),
    fightRequestId: t
      .uuid()
      .notNull()
      .references(() => FightRequest.id, { onDelete: "cascade" }),
    senderId: t
      .uuid()
      .notNull()
      .references(() => User.id, { onDelete: "cascade" }),
    content: t.text().notNull(),
    createdAt: t
      .timestamp({ mode: "date", withTimezone: true })
      .defaultNow()
      .notNull(),
  }),
  (table) => ({
    fightRequestIdx: index("msg_fight_request_idx").on(table.fightRequestId),
  }),
);

export const MessageRelations = relations(Message, ({ one }) => ({
  fightRequest: one(FightRequest, {
    fields: [Message.fightRequestId],
    references: [FightRequest.id],
  }),
  sender: one(User, {
    fields: [Message.senderId],
    references: [User.id],
  }),
}));

// ─── Old Post table removed ────────────────────────────
// Replaced by matchFaca entities: Profile, FightRequest, Fight, Message
