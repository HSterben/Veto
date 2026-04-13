import {
  pgTable,
  uuid,
  text,
  timestamp,
  jsonb,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ideaSessions = pgTable("idea_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  answersJson: jsonb("answers_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const projectIdeas = pgTable("project_ideas", {
  id: uuid("id").primaryKey(),
  sessionId: uuid("session_id")
    .references(() => ideaSessions.id)
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  pitch: text("pitch").notNull(),
  rationale: text("rationale").notNull(),
  difficulty: varchar("difficulty", { length: 50 }).notNull(),
  timeEstimate: varchar("time_estimate", { length: 100 }).notNull(),
  stackJson: jsonb("stack_json").notNull(),
  tagsJson: jsonb("tags_json").notNull(),
  standoutFeature: text("standout_feature").notNull(),
  portfolioValue: varchar("portfolio_value", { length: 50 }).notNull(),
  score: integer("score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const ideaBlueprints = pgTable("idea_blueprints", {
  id: uuid("id").primaryKey().defaultRandom(),
  ideaId: uuid("idea_id")
    .references(() => projectIdeas.id)
    .notNull(),
  overview: text("overview").notNull(),
  audience: text("audience").notNull(),
  featuresJson: jsonb("features_json").notNull(),
  architectureJson: jsonb("architecture_json").notNull(),
  schemaJson: jsonb("schema_json").notNull(),
  pagesJson: jsonb("pages_json").notNull(),
  apiRoutesJson: jsonb("api_routes_json").notNull(),
  roadmapJson: jsonb("roadmap_json").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedIdeas = pgTable("saved_ideas", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id)
    .notNull(),
  ideaId: uuid("idea_id")
    .references(() => projectIdeas.id)
    .notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});
