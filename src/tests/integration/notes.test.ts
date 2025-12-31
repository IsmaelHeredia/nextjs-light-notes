import { describe, it, expect } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/notes/route";
import { POST as POST_WS } from "@/app/api/workspaces/route";

describe("Notes API", () => {
  it("GET sin workspace devuelve []", async () => {
    const req = new Request("http://test/api/notes");
    const res = await GET(req);
    const data = await res.json();

    expect(data).toEqual([]);
  });

  it("POST crea una nota", async () => {
    const wsReq = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({ name: "WS" }),
      headers: { "Content-Type": "application/json" },
    });

    const ws = await (await POST_WS(wsReq)).json();

    const noteReq = new Request(
      `http://test/api/notes?workspaceId=${ws.id}`,
      {
        method: "POST",
        body: JSON.stringify({
          text: "Nota test",
          id_workspace: ws.id,
        }),
        headers: { "Content-Type": "application/json" },
      }
    );

    const res = await POST(noteReq);
    const data = await res.json();

    expect(data.text).toBe("Nota test");
    expect(data.id).toBeDefined();
  });

  it("PUT actualiza una nota", async () => {
    const ws = await (
      await POST_WS(
        new Request("http://test", {
          method: "POST",
          body: JSON.stringify({ name: "WS" }),
          headers: { "Content-Type": "application/json" },
        })
      )
    ).json();

    const note = await (
      await POST(
        new Request(`http://test/api/notes?workspaceId=${ws.id}`, {
          method: "POST",
          body: JSON.stringify({
            text: "Texto original",
            id_workspace: ws.id,
          }),
          headers: { "Content-Type": "application/json" },
        })
      )
    ).json();

    const updateReq = new Request("http://test/api/notes", {
      method: "PUT",
      body: JSON.stringify({
        id: note.id,
        text: "Texto actualizado",
      }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(updateReq);
    const data = await res.json();

    expect(data.ok).toBe(true);
  });

  it("DELETE elimina una nota", async () => {
    const ws = await (
      await POST_WS(
        new Request("http://test", {
          method: "POST",
          body: JSON.stringify({ name: "WS" }),
          headers: { "Content-Type": "application/json" },
        })
      )
    ).json();

    const note = await (
      await POST(
        new Request(`http://test/api/notes?workspaceId=${ws.id}`, {
          method: "POST",
          body: JSON.stringify({
            text: "Nota a borrar",
            id_workspace: ws.id,
          }),
          headers: { "Content-Type": "application/json" },
        })
      )
    ).json();

    const deleteReq = new Request("http://test/api/notes", {
      method: "DELETE",
      body: JSON.stringify({ id: note.id }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(deleteReq);
    const data = await res.json();

    expect(data.ok).toBe(true);
  });
});