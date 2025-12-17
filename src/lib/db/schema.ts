import { pgTable, text, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";

export const roundStatusEnum = pgEnum("round_status", ["active", "completed"]);

export const groups = pgTable("groups", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const members = pgTable("members", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const coffeeRounds = pgTable("coffee_rounds", {
  id: text("id").primaryKey(),
  groupId: text("group_id")
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  assignedTo: text("assigned_to").references(() => members.id),
  status: roundStatusEnum("status").notNull().default("active"),
  isVolunteer: boolean("is_volunteer").notNull().default(false),
});

export const coffeeRegistrations = pgTable("coffee_registrations", {
  id: text("id").primaryKey(),
  roundId: text("round_id")
    .notNull()
    .references(() => coffeeRounds.id, { onDelete: "cascade" }),
  memberId: text("member_id")
    .notNull()
    .references(() => members.id, { onDelete: "cascade" }),
  registeredAt: timestamp("registered_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

