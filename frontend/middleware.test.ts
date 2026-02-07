import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "./middleware";

// Mock @supabase/ssr
vi.mock("@supabase/ssr", () => ({
    createServerClient: vi.fn(() => ({
        auth: {
            getUser: vi.fn().mockResolvedValue({
                data: { user: null },
                error: { message: "Auth error" },
            }),
        },
        from: vi.fn(() => ({
            select: vi.fn(() => ({
                eq: vi.fn(() => ({
                    limit: vi
                        .fn()
                        .mockResolvedValue({ data: null, error: null }),
                    single: vi
                        .fn()
                        .mockResolvedValue({ data: null, error: null }),
                    eq: vi.fn(() => ({
                        single: vi
                            .fn()
                            .mockResolvedValue({ data: null, error: null }),
                    })),
                })),
                single: vi.fn().mockResolvedValue({ data: null, error: null }),
            })),
        })),
    })),
}));

describe("middleware auth redirects", () => {
    it("redirects unauthenticated users to auth flow", async () => {
        const request = new NextRequest("http://localhost/dashboard");
        const response = await middleware(request);

        expect(response.status).toBe(307);
        expect(response.headers.get("location")).toContain(
            "/auth?redirect=%2Fdashboard",
        );
    });
});
