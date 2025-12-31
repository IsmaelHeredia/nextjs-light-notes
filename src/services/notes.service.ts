import { db } from "@/db";
import { notes } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export const notesService = {
  async getByWorkspace(workspaceId: string) {
    return db
      .select()
      .from(notes)
      .where(eq(notes.idWorkspace, workspaceId));
  },

  async create(text: string, idWorkspace: string) {
    const note = {
      id: crypto.randomUUID(),
      text,
      idWorkspace,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(notes).values(note);
    return note;
  },

  async update(id: string, text: string) {
    await db
      .update(notes)
      .set({ text, updatedAt: new Date() })
      .where(eq(notes.id, id));
  },

  async remove(id: string) {
    await db.delete(notes).where(eq(notes.id, id));
  },
};
