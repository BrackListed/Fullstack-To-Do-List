import { relations } from "drizzle-orm";
import { pgTable, uuid, text, timestamp, boolean } from "drizzle-orm/pg-core";

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

export const userTaskRelations = relations(users, ({many}) => ({
    tasks: many(tasks)
}))

export const taskUserRelations = relations(tasks, ({one}) => ({
    users: one(users, {fields: [tasks.userId], references: [users.id]})
}))