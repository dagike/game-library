import {
  pgTable,
  serial,
  text,
  integer,
  numeric,
  jsonb,
  date,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("users_email_idx").on(table.email),
]);

export const games = pgTable("games", {
  id: serial("id").primaryKey(),
  rawgId: integer("rawg_id").notNull(),
  slug: text("slug").notNull(),
  title: text("title").notNull(),
  coverImageUrl: text("cover_image_url"),
  description: text("description"),
  genres: jsonb("genres").$type<string[]>().notNull().default([]),
  platforms: jsonb("platforms").$type<string[]>().notNull().default([]),
  releaseDate: date("release_date"),
  rawgRating: numeric("rawg_rating", { precision: 3, scale: 2 }),
  rawgMetadata: jsonb("rawg_metadata"),
  starRating: integer("star_rating"),
  manualRank: integer("manual_rank"),
  ownerReview: text("owner_review"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("games_slug_idx").on(table.slug),
  uniqueIndex("games_rawg_id_idx").on(table.rawgId),
  index("games_manual_rank_idx").on(table.manualRank),
  index("games_star_rating_idx").on(table.starRating),
]);

export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  gameId: integer("game_id")
    .notNull()
    .references(() => games.id, { onDelete: "cascade" }),
  authorName: text("author_name").notNull(),
  body: text("body").notNull(),
  commentIpHash: text("comment_ip_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("comments_game_id_idx").on(table.gameId),
]);
