import { NextResponse } from "next/server";
import { notesService } from "@/services/notes.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const workspaceId = searchParams.get("workspaceId");

  if (!workspaceId) return NextResponse.json([]);

  const data = await notesService.getByWorkspace(workspaceId);
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { text, id_workspace } = await req.json();
  const note = await notesService.create(text, id_workspace);
  return NextResponse.json(note);
}

export async function PUT(req: Request) {
  const { id, text } = await req.json();
  await notesService.update(id, text);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await notesService.remove(id);
  return NextResponse.json({ ok: true });
}
