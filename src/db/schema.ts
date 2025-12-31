import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const workspaces = sqliteTable("workspaces", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    new Date()
  ),
});

export const notes = sqliteTable("notes", {
  id: text("id").primaryKey(),
  text: text("text").notNull(),
  idWorkspace: text("id_workspace")
    .notNull()
    .references(() => workspaces.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    new Date()
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    new Date()
  ),
});
