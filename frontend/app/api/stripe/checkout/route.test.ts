/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const createSession = vi.fn();
const supabaseInsert = vi.fn();

vi.mock("stripe", () => {
    return {
        default: class StripeMock {
            checkout = { sessions: { create: createSession } };
        },
    };
});

vi.mock("../../../../lib/supabase/server", () => ({
    getSupabaseServer: () => ({
        from: () => ({
            insert: supabaseInsert,
        }),
    }),
}));

// Mock the plans module to return predictable IDs for testing
vi.mock("../../../../lib/stripe/plans", () => ({
    getPriceId: (plan: string, billing: string) => {
        if (plan === "Starter" && billing === "monthly")
            return "price_starter_mo";
        if (plan === "Starter" && billing === "yearly")
            return "price_starter_yr";
        return null; // Simulate invalid plan
    },
    getProductId: (plan: string) => {
        if (plan === "Starter") return "prod_starter";
        return null;
    },
}));

describe("POST /api/stripe/checkout", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
        createSession.mockReset();
        supabaseInsert.mockReset();
    });

    it("returns a checkout URL and emits checkout_start when session creation succeeds", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.SITE_URL = "http://localhost:3000";

        createSession.mockResolvedValue({
            id: "cs_test_123",
            client_secret: "cs_test_secret_123",
        });
        supabaseInsert.mockResolvedValue({ error: null });

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:3000",
            },
            body: JSON.stringify({
                plan: "Starter",
                billing: "monthly",
                source: "pricing",
            }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({
            data: { client_secret: "cs_test_secret_123" },
            error: null,
        });
        expect(createSession).toHaveBeenCalledWith(
            expect.objectContaining({
                ui_mode: "embedded",
                return_url:
                    "http://localhost:3000/checkout/return?session_id={CHECKOUT_SESSION_ID}",
                line_items: [{ price: "price_starter_mo", quantity: 1 }],
                metadata: expect.objectContaining({
                    plan: "Starter",
                    billing: "monthly",
                    source: "pricing",
                    price_id: "price_starter_mo",
                    product_id: "prod_starter",
                }),
            }),
        );

        expect(supabaseInsert).toHaveBeenCalledWith(
            expect.objectContaining({
                event_name: "checkout_start",
                metadata: expect.objectContaining({
                    plan: "Starter",
                    billing: "monthly",
                    source: "pricing",
                    price_id: "price_starter_mo",
                    product_id: "prod_starter",
                }),
            }),
        );
    });

    it("returns error envelope when Stripe session creation fails", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.SITE_URL = "http://localhost:3000";

        createSession.mockRejectedValue(new Error("Stripe failure"));

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:3000",
            },
            body: JSON.stringify({ plan: "Starter" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({
            data: null,
            error: {
                code: "stripe_error",
                message: "Unable to start checkout right now.",
            },
        });
    });

    it("returns invalid_plan when plan is invalid", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.SITE_URL = "http://localhost:3000";

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:3000",
            },
            body: JSON.stringify({ plan: "InvalidPlan" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: {
                code: "invalid_plan",
                message: "Selected plan is invalid.",
            },
        });
    });

    it("returns missing_env when Stripe secret key is missing", async () => {
        vi.stubEnv("SITE_URL", "http://localhost:3000");
        vi.stubEnv("STRIPE_SECRET_KEY", undefined as any);

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:3000",
            },
            body: JSON.stringify({ plan: "Starter" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(500);
        expect(body).toEqual({
            data: null,
            error: {
                code: "missing_env",
                message: "Stripe configuration is missing.",
            },
        });
    });

    it("returns missing_origin when no origin is available", async () => {
        vi.stubEnv("STRIPE_SECRET_KEY", "sk_test_123");
        vi.stubEnv("SITE_URL", undefined as any);
        vi.stubEnv("NEXT_PUBLIC_SITE_URL", undefined as any);
        vi.stubEnv("NODE_ENV", "production");

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ plan: "Starter" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: {
                code: "missing_origin",
                message: "Unable to determine redirect URL.",
            },
        });
    });

    it("returns invalid_origin when origin does not match SITE_URL", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.SITE_URL = "http://localhost:3000";

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://evil.example",
            },
            body: JSON.stringify({ plan: "Starter" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: {
                code: "invalid_origin",
                message: "Request origin is not allowed.",
            },
        });
    });
});
