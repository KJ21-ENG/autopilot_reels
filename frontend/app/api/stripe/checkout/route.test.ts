import { afterEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const createSession = vi.fn();

vi.mock("stripe", () => {
    return {
        default: class StripeMock {
            checkout = { sessions: { create: createSession } };
        },
    };
});

describe("POST /api/stripe/checkout", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
        createSession.mockReset();
    });

    it("returns a checkout URL when Stripe session creation succeeds", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_PRICE_ID = "price_123";
        process.env.STRIPE_PRODUCT_ID = "prod_123";
        process.env.SITE_URL = "http://localhost:3000";

        createSession.mockResolvedValue({ url: "https://checkout.stripe.test/session" });

        const request = new Request("http://localhost/api/stripe/checkout", {
            method: "POST",
            headers: {
                "content-type": "application/json",
                origin: "http://localhost:3000",
            },
            body: JSON.stringify({ plan: "Starter", billing: "monthly", source: "pricing" }),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({
            data: { checkout_url: "https://checkout.stripe.test/session" },
            error: null,
        });
        expect(createSession).toHaveBeenCalledWith(
            expect.objectContaining({
                success_url: "http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}",
                cancel_url: "http://localhost:3000/checkout/cancel",
                metadata: expect.objectContaining({
                    plan: "Starter",
                    billing: "monthly",
                    source: "pricing",
                    price_id: "price_123",
                    product_id: "prod_123",
                }),
            })
        );
    });

    it("returns error envelope when Stripe session creation fails", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_PRICE_ID = "price_123";
        process.env.STRIPE_PRODUCT_ID = "prod_123";
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
            error: { code: "stripe_error", message: "Unable to start checkout right now." },
        });
    });

    it("returns missing_env when Stripe configuration is missing", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.SITE_URL = "http://localhost:3000";

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
            error: { code: "missing_env", message: "Stripe configuration is missing." },
        });
    });

    it("returns missing_env when Stripe secret key is missing", async () => {
        delete process.env.STRIPE_SECRET_KEY;
        process.env.STRIPE_PRICE_ID = "price_123";
        process.env.STRIPE_PRODUCT_ID = "prod_123";
        process.env.SITE_URL = "http://localhost:3000";

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
            error: { code: "missing_env", message: "Stripe configuration is missing." },
        });
    });

    it("returns missing_origin when no origin is available", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_PRICE_ID = "price_123";
        process.env.STRIPE_PRODUCT_ID = "prod_123";
        delete process.env.SITE_URL;
        delete process.env.NEXT_PUBLIC_SITE_URL;
        process.env.NODE_ENV = "production";

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
            error: { code: "missing_origin", message: "Unable to determine redirect URL." },
        });
    });

    it("returns invalid_origin when origin does not match SITE_URL", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_PRICE_ID = "price_123";
        process.env.STRIPE_PRODUCT_ID = "prod_123";
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
            error: { code: "invalid_origin", message: "Request origin is not allowed." },
        });
    });
});
