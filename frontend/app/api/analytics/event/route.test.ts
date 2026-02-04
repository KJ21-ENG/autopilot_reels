import { describe, expect, it, vi } from "vitest";

import { POST } from "./route";

describe("POST /api/analytics/event", () => {
  it("returns recorded envelope for valid payloads", async () => {
    const request = new Request("http://localhost/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event_name: "cta_click",
        metadata: { location: "hero" },
      }),
    });

    const infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json).toEqual({ data: { recorded: true }, error: null });

    infoSpy.mockRestore();
  });

  it("returns invalid_event for bad payloads", async () => {
    const request = new Request("http://localhost/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ event_name: "InvalidName" }),
    });

    const response = await POST(request);
    const json = await response.json();

    expect(response.status).toBe(400);
    expect(json.data).toBeNull();
    expect(json.error?.code).toBe("invalid_event");
  });
});
