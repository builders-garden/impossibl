import { relations, sql } from "drizzle-orm";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";
import { ulid } from "ulid";
import type { FarcasterNotificationDetails } from "@/types/farcaster.type";

/**
 * Better Auth Tables
 */
export const user = sqliteTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" })
    .default(false)
    .notNull(),
  image: text("image"),
  minikitAddress: text("minikit_address").unique(),
  farcasterFid: integer("farcaster_fid").unique(),
  farcasterUsername: text("farcaster_username"),
  farcasterDisplayName: text("farcaster_display_name"),
  role: text("role"),
  banned: integer("banned", { mode: "boolean" }).default(false),
  banReason: text("ban_reason"),
  banExpires: integer("ban_expires", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = sqliteTable("session", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const account = sqliteTable("account", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", {
    mode: "timestamp_ms",
  }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", {
    mode: "timestamp_ms",
  }),
  scope: text("scope"),
  password: text("password"),
  minikitAddress: text("minikit_address").unique(),
  farcasterFid: integer("farcaster_fid").unique(),
  farcasterUsername: text("farcaster_username"),
  farcasterDisplayName: text("farcaster_display_name"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/**
 * Better Auth Farcaster Plugin Tables
 */
export const farcaster = sqliteTable("farcaster", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => ulid()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  fid: integer("fid").notNull().unique(),
  username: text("username").notNull(),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  notificationDetails: text("notification_details", {
    mode: "json",
  })
    .$type<FarcasterNotificationDetails[]>()
    .default([]),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const walletAddress = sqliteTable("wallet_address", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  address: text("address").notNull(),
  chainId: integer("chain_id").notNull(),
  isPrimary: integer("is_primary", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

/**
 * Impossibl Tables
 */
export const tournament = sqliteTable("tournament", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: integer("type").notNull().default(0), // 0 daily, 1 group
  winner: text("winner").references(() => user.id, { onDelete: "cascade" }), // only for group tournaments
  startDate: integer("start_date", { mode: "timestamp_ms" }).notNull(),
  endDate: integer("end_date", { mode: "timestamp_ms" }).notNull(),
  merkleRoot: text("merkle_root", { mode: "json" }),
  merkleValues: text("merkle_values", { mode: "json" }),
  prizePool: integer("prize_pool").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});

export const userPrize = sqliteTable(
  "user_prize",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tournamentId: text("tournament_id")
      .notNull()
      .references(() => tournament.id, { onDelete: "cascade" }),
    prize: text("prize").notNull(),
    attempts: integer("attempts").notNull().default(0).notNull(),
    wonAtAttempt: integer("won_at_attempt").default(0).notNull(),
    depositTxHash: text("deposit_tx_hash"),
    depositAmount: text("deposit_amount").default("0"),
    claimedTxHash: text("claimed_tx_hash"),
    claimedAmount: text("claimed_amount").default("0"),
    createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.tournamentId] })]
);

/**
 * Drizzle Types
 */
export type Account = typeof account.$inferSelect;
export type CreateAccount = typeof account.$inferInsert;
export type UpdateAccount = Partial<CreateAccount>;

export type User = typeof user.$inferSelect;
export type CreateUser = typeof user.$inferInsert;
export type UpdateUser = Partial<CreateUser>;

export type Farcaster = typeof farcaster.$inferSelect;
export type CreateFarcaster = typeof farcaster.$inferInsert;
export type UpdateFarcaster = Partial<CreateFarcaster>;

export type WalletAddress = typeof walletAddress.$inferSelect;
export type CreateWalletAddress = typeof walletAddress.$inferInsert;
export type UpdateWalletAddress = Partial<CreateWalletAddress>;

export type Tournament = typeof tournament.$inferSelect;
export type CreateTournament = typeof tournament.$inferInsert;
export type UpdateTournament = Partial<CreateTournament>;

export type UserPrize = typeof userPrize.$inferSelect;
export type CreateUserPrize = typeof userPrize.$inferInsert;
export type UpdateUserPrize = Partial<CreateUserPrize>;

/**
 * Drizzle Relations
 */
export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  farcaster: one(farcaster, {
    fields: [user.farcasterFid],
    references: [farcaster.fid],
  }),
  minikit: one(walletAddress, {
    fields: [user.minikitAddress],
    references: [walletAddress.userId],
  }),
  tournaments: many(tournament),
  prizes: many(userPrize),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));

export const farcasterRelations = relations(farcaster, ({ one }) => ({
  user: one(user, {
    fields: [farcaster.userId],
    references: [user.id],
  }),
}));

export const walletAddressRelations = relations(walletAddress, ({ one }) => ({
  user: one(user, {
    fields: [walletAddress.userId],
    references: [user.id],
  }),
}));

export const tournamentRelations = relations(tournament, ({ many }) => ({
  userPrizes: many(userPrize),
}));

export const userPrizeRelations = relations(userPrize, ({ one }) => ({
  user: one(user, {
    fields: [userPrize.userId],
    references: [user.id],
  }),
  tournament: one(tournament, {
    fields: [userPrize.tournamentId],
    references: [tournament.id],
  }),
}));
