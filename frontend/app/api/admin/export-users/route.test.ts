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
    from: vi.fn(),
};

vi.mock("@supabase/supabase-js", () => ({
    createClient: vi.fn(() => mockSupabase),
}));

const createMockFrom = (options: {
    isAdmin: boolean;
    hasPaid: boolean;
    payments?: any[];
}) => {
    return (table: string) => {
        if (table === "user_roles") {
            const chain: any = {};
            chain.select = vi.fn().mockReturnValue(chain);
            chain.eq = vi.fn().mockReturnValue(chain);
            chain.single = vi.fn().mockResolvedValue({
                data: options.isAdmin ? { role: "admin" } : null,
                error: null,
            });
            return chain;
        }
        if (table === "user_payment_links") {
            const chain: any = {};
            chain.select = vi.fn().mockReturnValue(chain);
            chain.eq = vi.fn().mockReturnValue(chain);
            chain.limit = vi.fn().mockResolvedValue({
                data: options.hasPaid ? [{ id: "link-1" }] : [],
                error: null,
            });
            return chain;
        }
        if (table === "payments") {
            const chain: any = {};
            chain.select = vi.fn().mockReturnValue(chain);
            chain.in = vi.fn().mockReturnValue(chain);
            chain.order = vi.fn().mockResolvedValue({
                data: options.payments || [],
                error: null,
            });
            return chain;
        }
        return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            limit: vi.fn().mockReturnThis(),
            single: vi.fn().mockReturnThis(),
            csv: vi.fn(),
        };
    };
};

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

        // 2. Mock non-admin
        mockSupabase.from.mockImplementation(
            createMockFrom({ isAdmin: false, hasPaid: true }),
        );

        const response = await GET();
        expect(response.status).toBe(403);
    });

    it("should return CSV data if user is an admin", async () => {
        // 1. Mock valid session
        mockSupabase.auth.getUser.mockResolvedValue({
            data: { user: { id: "admin-123" } },
            error: null,
        });

        // 2. Mock admin and data
        mockSupabase.from.mockImplementation(
            createMockFrom({
                isAdmin: true,
                hasPaid: true,
                payments: [
                    {
                        created_at: "2023-01-01",
                        price_id: "pro_plan",
                        email: "customer@example.com",
                        amount: 1000,
                        currency: "usd",
                        status: "paid",
                    },
                ],
            }),
        );

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
