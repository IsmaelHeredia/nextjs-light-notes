import { db } from "@/db";
import { workspaces } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const workspacesService = {
  async getAll() {
    return db.select().from(workspaces);
  },

  async create(name: string) {
    const ws = {
      id: crypto.randomUUID(),
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(workspaces).values(ws);
    return ws;
  },

  async update(id: string, name: string) {
    await db
      .update(workspaces)
      .set({ name, updatedAt: new Date() })
      .where(eq(workspaces.id, id));
  },

  async remove(id: string) {
    await db.delete(workspaces).where(eq(workspaces.id, id));
  },
};
