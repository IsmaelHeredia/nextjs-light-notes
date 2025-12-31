import { describe, it, expect } from "vitest";
import { GET, POST, PUT, DELETE } from "@/app/api/workspaces/route";

describe("Workspaces API", () => {
  it("GET devuelve un array", async () => {
    const res = await GET();
    const data = await res.json();

    expect(Array.isArray(data)).toBe(true);
  });

  it("POST crea un workspace", async () => {
    const req = new Request("http://test/api/workspaces", {
      method: "POST",
      body: JSON.stringify({ name: "Test WS" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(data.name).toBe("Test WS");
    expect(data.id).toBeDefined();
  });

  it("PUT actualiza un workspace", async () => {
    const createReq = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({ name: "Old" }),
      headers: { "Content-Type": "application/json" },
    });

    const ws = await (await POST(createReq)).json();

    const updateReq = new Request("http://test", {
      method: "PUT",
      body: JSON.stringify({ id: ws.id, name: "New" }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await PUT(updateReq);
    const data = await res.json();

    expect(data.ok).toBe(true);
  });

  it("DELETE elimina un workspace", async () => {
    const createReq = new Request("http://test", {
      method: "POST",
      body: JSON.stringify({ name: "To Delete" }),
      headers: { "Content-Type": "application/json" },
    });

    const ws = await (await POST(createReq)).json();

    const deleteReq = new Request("http://test", {
      method: "DELETE",
      body: JSON.stringify({ id: ws.id }),
      headers: { "Content-Type": "application/json" },
    });

    const res = await DELETE(deleteReq);
    const data = await res.json();

    expect(data.ok).toBe(true);
  });
});
