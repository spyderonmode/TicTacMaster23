import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table - mandatory for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table - mandatory for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  displayName: varchar("display_name"),
  username: varchar("username").unique(),
  profileImageUrl: varchar("profile_image_url"),
  isEmailVerified: boolean("is_email_verified").default(false),
  wins: integer("wins").default(0),
  losses: integer("losses").default(0),
  draws: integer("draws").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 8 }).notNull().unique(),
  name: varchar("name").notNull(),
  maxPlayers: integer("max_players").default(2),
  isPrivate: boolean("is_private").default(false),
  ownerId: varchar("owner_id").references(() => users.id),
  status: varchar("status").default("waiting"), // waiting, playing, finished
  createdAt: timestamp("created_at").defaultNow(),
});

export const games = pgTable("games", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id),
  playerXId: varchar("player_x_id").references(() => users.id),
  playerOId: varchar("player_o_id").references(() => users.id),
  currentPlayer: varchar("current_player").default("X"), // X or O
  gameMode: varchar("game_mode").notNull(), // ai, pass-play, online
  status: varchar("status").default("active"), // active, finished, abandoned
  winnerId: varchar("winner_id").references(() => users.id),
  winCondition: varchar("win_condition"), // horizontal, diagonal, draw
  board: jsonb("board").default('{}'), // position -> player mapping
  createdAt: timestamp("created_at").defaultNow(),
  finishedAt: timestamp("finished_at"),
});

export const roomParticipants = pgTable("room_participants", {
  id: uuid("id").primaryKey().defaultRandom(),
  roomId: uuid("room_id").references(() => rooms.id),
  userId: varchar("user_id").references(() => users.id),
  role: varchar("role").notNull(), // player, spectator
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const moves = pgTable("moves", {
  id: uuid("id").primaryKey().defaultRandom(),
  gameId: uuid("game_id").references(() => games.id),
  playerId: varchar("player_id").references(() => users.id),
  position: integer("position").notNull(),
  symbol: varchar("symbol").notNull(), // X or O
  moveNumber: integer("move_number").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const blockedUsers = pgTable("blocked_users", {
  id: uuid("id").primaryKey().defaultRandom(),
  blockerId: varchar("blocker_id").references(() => users.id).notNull(),
  blockedId: varchar("blocked_id").references(() => users.id).notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
}, (table) => [
  // Prevent duplicate blocks
  index("unique_block").on(table.blockerId, table.blockedId),
]);

export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  achievementType: varchar("achievement_type").notNull(), // first_win, win_streak_5, win_streak_10, master_of_diagonals, speed_demon, etc.
  achievementName: varchar("achievement_name").notNull(),
  description: varchar("description").notNull(),
  icon: varchar("icon").notNull(), // emoji or icon name
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  metadata: jsonb("metadata").default('{}'), // additional data like streak count, game time, etc.
}, (table) => [
  // Prevent duplicate achievements
  index("unique_achievement").on(table.userId, table.achievementType),
]);

export const userThemes = pgTable("user_themes", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id).notNull(),
  themeName: varchar("theme_name").notNull(), // halloween, christmas, summer, etc.
  unlockedAt: timestamp("unlocked_at").defaultNow(),
  isUnlocked: boolean("is_unlocked").default(true),
}, (table) => [
  // Prevent duplicate theme unlocks
  index("unique_user_theme").on(table.userId, table.themeName),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedRooms: many(rooms),
  gameParticipations: many(roomParticipants),
  gamesAsX: many(games, { relationName: "playerX" }),
  gamesAsO: many(games, { relationName: "playerO" }),
  wonGames: many(games, { relationName: "winner" }),
  moves: many(moves),
  blockedUsers: many(blockedUsers, { relationName: "blocker" }),
  blockedByUsers: many(blockedUsers, { relationName: "blocked" }),
  achievements: many(achievements),
  unlockedThemes: many(userThemes),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  owner: one(users, { fields: [rooms.ownerId], references: [users.id] }),
  participants: many(roomParticipants),
  games: many(games),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  room: one(rooms, { fields: [games.roomId], references: [rooms.id] }),
  playerX: one(users, { fields: [games.playerXId], references: [users.id], relationName: "playerX" }),
  playerO: one(users, { fields: [games.playerOId], references: [users.id], relationName: "playerO" }),
  winner: one(users, { fields: [games.winnerId], references: [users.id], relationName: "winner" }),
  moves: many(moves),
}));

export const roomParticipantsRelations = relations(roomParticipants, ({ one }) => ({
  room: one(rooms, { fields: [roomParticipants.roomId], references: [rooms.id] }),
  user: one(users, { fields: [roomParticipants.userId], references: [users.id] }),
}));

export const movesRelations = relations(moves, ({ one }) => ({
  game: one(games, { fields: [moves.gameId], references: [games.id] }),
  player: one(users, { fields: [moves.playerId], references: [users.id] }),
}));

export const blockedUsersRelations = relations(blockedUsers, ({ one }) => ({
  blocker: one(users, { fields: [blockedUsers.blockerId], references: [users.id], relationName: "blocker" }),
  blocked: one(users, { fields: [blockedUsers.blockedId], references: [users.id], relationName: "blocked" }),
}));

export const achievementsRelations = relations(achievements, ({ one }) => ({
  user: one(users, { fields: [achievements.userId], references: [users.id] }),
}));

export const userThemesRelations = relations(userThemes, ({ one }) => ({
  user: one(users, { fields: [userThemes.userId], references: [users.id] }),
}));

// Schemas
export const insertRoomSchema = createInsertSchema(rooms).pick({
  name: true,
  maxPlayers: true,
  isPrivate: true,
});

export const insertGameSchema = createInsertSchema(games).pick({
  roomId: true,
  gameMode: true,
  currentPlayer: true,
  status: true,
  board: true,
}).extend({
  playerXId: z.string().nullable().optional(),
  playerOId: z.string().nullable().optional(),
});

export const insertMoveSchema = createInsertSchema(moves).pick({
  gameId: true,
  playerId: true,
  position: true,
  symbol: true,
  moveNumber: true,
});

export const insertRoomParticipantSchema = createInsertSchema(roomParticipants).pick({
  roomId: true,
  userId: true,
  role: true,
});

export const insertBlockedUserSchema = createInsertSchema(blockedUsers).pick({
  blockerId: true,
  blockedId: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).pick({
  userId: true,
  achievementType: true,
  achievementName: true,
  description: true,
  icon: true,
  metadata: true,
});

export const insertUserThemeSchema = createInsertSchema(userThemes).pick({
  userId: true,
  themeName: true,
  isUnlocked: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Room = typeof rooms.$inferSelect;
export type Game = typeof games.$inferSelect;
export type Move = typeof moves.$inferSelect;
export type RoomParticipant = typeof roomParticipants.$inferSelect;
export type BlockedUser = typeof blockedUsers.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserTheme = typeof userThemes.$inferSelect;
export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type InsertGame = z.infer<typeof insertGameSchema>;
export type InsertMove = z.infer<typeof insertMoveSchema>;
export type InsertRoomParticipant = z.infer<typeof insertRoomParticipantSchema>;
export type InsertBlockedUser = z.infer<typeof insertBlockedUserSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type InsertUserTheme = z.infer<typeof insertUserThemeSchema>;
