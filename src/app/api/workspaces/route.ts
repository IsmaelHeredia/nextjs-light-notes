import { NextResponse } from "next/server";
import { workspacesService } from "@/services/workspaces.service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await workspacesService.getAll();
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  const ws = await workspacesService.create(name);
  return NextResponse.json(ws);
}

export async function PUT(req: Request) {
  const { id, name } = await req.json();
  await workspacesService.update(id, name);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  await workspacesService.remove(id);
  return NextResponse.json({ ok: true });
}
