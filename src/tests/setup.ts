import { beforeAll, beforeEach } from "vitest";
import { db } from "@/db";
import { notes, workspaces } from "@/db/schema";

beforeAll(async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS workspaces (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );
  `);

  await db.run(`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      id_workspace TEXT NOT NULL,
      created_at TEXT,
      updated_at TEXT
    );
  `);
});

beforeEach(async () => {
  await db.delete(notes);
  await db.delete(workspaces);
});
