import { describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const supabaseInsert = vi.fn();

vi.mock("../../../../lib/supabase/server", () => ({
    getSupabaseServer: () => ({
        from: () => ({
            insert: supabaseInsert,
        }),
    }),
}));

describe("POST /api/analytics/event", () => {
    it("returns recorded envelope for valid payloads and saves to DB", async () => {
        supabaseInsert.mockResolvedValue({ error: null });

        const request = new Request("http://localhost/api/analytics/event", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                event_name: "cta_click",
                metadata: { location: "hero" },
            }),
        });

        const infoSpy = vi
            .spyOn(console, "info")
            .mockImplementation(() => undefined);
        const response = await POST(request);
        const json = await response.json();

        expect(response.status).toBe(200);
        expect(json).toEqual({ data: { recorded: true }, error: null });
        expect(supabaseInsert).toHaveBeenCalledWith(
            expect.objectContaining({
                event_name: "cta_click",
                metadata: { location: "hero" },
            }),
        );

        infoSpy.mockRestore();
        supabaseInsert.mockReset();
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
