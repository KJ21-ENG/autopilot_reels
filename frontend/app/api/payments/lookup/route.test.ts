import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const queryBuilder = {
    eq: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
};

const select = vi.fn();
const from = vi.fn();

vi.mock("../../../../lib/supabase/server", () => {
    return {
        getSupabaseServer: () => ({
            from,
        }),
    };
});

describe("POST /api/payments/lookup", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
        select.mockReset();
        from.mockReset();
        queryBuilder.eq.mockReset();
        queryBuilder.order.mockReset();
        queryBuilder.limit.mockReset();
    });

    it("returns payments for a session id lookup", async () => {
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";

        const payment = { email: "buyer@example.com" };

        queryBuilder.eq.mockReturnValue(queryBuilder);
        queryBuilder.order.mockReturnValue(queryBuilder);
        queryBuilder.limit.mockImplementation(() => ({
            then: (resolve: (value: unknown) => void) => resolve({ data: [payment], error: null }),
        }));

        select.mockReturnValue(queryBuilder);
        from.mockReturnValue({ select });

        const request = new Request("http://localhost/api/payments/lookup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ session_id: "cs_test_123" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({ data: { payments: [payment] }, error: null });
        expect(queryBuilder.eq).toHaveBeenCalledWith("stripe_session_id", "cs_test_123");
    });

    it("returns invalid_request when no identifiers provided", async () => {
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";

        const request = new Request("http://localhost/api/payments/lookup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: { code: "invalid_request", message: "Provide session ID or email." },
        });
    });

    it("returns forbidden when only email is provided without token", async () => {
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";
        process.env.PAYMENT_LOOKUP_TOKEN = "lookup_token";

        const request = new Request("http://localhost/api/payments/lookup", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: "buyer@example.com" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(403);
        expect(body).toEqual({
            data: null,
            error: { code: "forbidden", message: "Email lookup is not permitted." },
        });
    });

    it("returns payments for an email lookup with token", async () => {
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";
        process.env.PAYMENT_LOOKUP_TOKEN = "lookup_token";

        const payment = { email: "buyer@example.com" };

        queryBuilder.eq.mockReturnValue(queryBuilder);
        queryBuilder.order.mockReturnValue(queryBuilder);
        queryBuilder.limit.mockImplementation(() => ({
            then: (resolve: (value: unknown) => void) => resolve({ data: [payment], error: null }),
        }));

        select.mockReturnValue(queryBuilder);
        from.mockReturnValue({ select });

        const request = new Request("http://localhost/api/payments/lookup", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "x-payment-lookup-token": "lookup_token",
            },
            body: JSON.stringify({ email: "buyer@example.com" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({ data: { payments: [payment] }, error: null });
        expect(queryBuilder.eq).toHaveBeenCalledWith("email", "buyer@example.com");
    });
});
