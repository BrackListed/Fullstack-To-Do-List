import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, boolean, jsonb, serial } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").default("").unique(),
    username: text("username").notNull(),
    createdAt: timestamp("created_at",{withTimezone:true}).defaultNow().notNull()
})

export const tasks = pgTable("tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    content: text("content").notNull(),
    completed: boolean("completed").notNull().default(false)
})

export const journal = pgTable("journal", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    content: text("content").notNull(),
    date_created: timestamp("date_created", {withTimezone: true}).defaultNow().notNull()
})

export const completedTasks = pgTable("completed_tasks", {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    content: text("content").notNull(),
    dateCompleted: timestamp("date_completed", {withTimezone: true}).defaultNow().notNull()
})

export const watch_list = pgTable("watch_list", {
    id: serial("id").primaryKey(),
    user_id: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    movie: jsonb("movie")
})

export const userJournalRelations = relations(users, ({many}) => ({
    journal: many(journal)
}))

export const journalUserRelations = relations(journal, ({one}) => ({
    user: one(users, {fields: [journal.userId], references: [users.id]})
}))

export const userTaskRelations = relations(users, ({many}) => ({
    tasks: many(tasks)
}))

export const taskUserRelations = relations(tasks, ({one}) => ({
    users: one(users, {fields: [tasks.userId], references: [users.id]})
}))

export const usersWatchlistRelations = relations(users, ({ many }) => ({
    watch_list: many(watch_list),
}))

export const watchListUserRelations = relations(watch_list, ({ one }) => ({
    user: one(users, {
        fields: [watch_list.user_id],
        references: [users.id],
    }),
}))
