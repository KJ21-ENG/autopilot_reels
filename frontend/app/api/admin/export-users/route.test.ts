import { describe, it, expect, vi, beforeEach } from "vitest";
import { GET } from "./route";

// Mock dependencies
vi.mock("next/headers", () => ({
    cookies: async () => ({
        get: () => ({ value: "mock-session-token" }),
        getAll: () => [],
    }),
}));

const mockSupabase = {
    auth: {
        getUser: vi.fn(),
        admin: {
            getUserById: vi.fn(),
        },
    },
    from: vi.fn((_table: string) => {
        void _table;
        return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            in: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
        };
    }),
};

vi.mock("@supabase/supabase-js", () => ({
    createClient: () => mockSupabase,
}));

describe("GET /api/admin/export-users", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.ADMIN_EMAILS = "admin@example.com";
        process.env.NEXT_PUBLIC_SUPABASE_URL = "http://mock-supabase";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "mock-key";
    });

    it("should return 401 if user is not authenticated", async () => {
        // Mock getUser to return error or no user
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: null },
            error: new Error("No session"),
        });

        const response = await GET();
        expect(response.status).toBe(401);
    });

    it("should return 403 if user is authenticated but not an admin", async () => {
        // 1. Mock valid session
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: "user-123" } },
            error: null,
        });

        // 2. Mock payment verification (needed for resolveVerifiedAuthState)
        mockSupabase.from.mockImplementation((table: string) => {
            if (table === "user_payment_links") {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockResolvedValue({
                        data: [{ id: "link-1" }],
                        error: null,
                    }),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            }
            return {
                select: vi.fn().mockReturnThis(), // Fallback
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any;
        });

        // 3. Mock admin.getUserById to return a non-admin email
        mockSupabase.auth.admin.getUserById.mockResolvedValue({
            data: { user: { id: "user-123", email: "user@example.com" } },
            error: null,
        });

        const response = await GET();
        expect(response.status).toBe(403);
    });

    it("should return CSV data if user is an admin", async () => {
        // 1. Mock valid session
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: "admin-123" } },
            error: null,
        });

        // 2. Mock payment verification
        mockSupabase.from.mockImplementation((table: string) => {
            if (table === "user_payment_links") {
                return {
                    select: vi.fn().mockReturnThis(),
                    eq: vi.fn().mockReturnThis(),
                    limit: vi.fn().mockResolvedValue({
                        data: [{ id: "link-1" }],
                        error: null,
                    }),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            }
            if (table === "payments") {
                return {
                    select: vi.fn().mockReturnThis(),
                    in: vi.fn().mockReturnThis(),
                    order: vi.fn().mockResolvedValue({
                        data: [
                            {
                                created_at: "2023-01-01",
                                price_id: "pro_plan",
                                email: "customer@example.com",
                                amount: 1000,
                                currency: "usd",
                                status: "paid",
                            },
                        ],
                        error: null,
                    }),
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                } as any;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return { select: vi.fn().mockReturnThis() } as any;
        });

        // 3. Mock admin.getUserById to return the admin email
        mockSupabase.auth.admin.getUserById.mockResolvedValue({
            data: { user: { id: "admin-123", email: "admin@example.com" } },
            error: null,
        });

        const response = await GET();
        expect(response.status).toBe(200);
        expect(response.headers.get("Content-Type")).toBe("text/csv");

        const text = await response.text();
        expect(text).toContain("Payment Date,Plan,Email,Amount,Currency");
        expect(text).toContain("customer@example.com");
        expect(text).toContain("pro_plan");
    });
});
