import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { POST } from "./route";

const constructEvent = vi.fn();
const listLineItems = vi.fn();
const insert = vi.fn();
const from = vi.fn();

vi.mock("stripe", () => {
    return {
        default: class StripeMock {
            webhooks = { constructEvent };
            checkout = { sessions: { listLineItems } };
        },
    };
});

vi.mock("../../../../lib/supabase/server", () => {
    return {
        getSupabaseServer: () => ({
            from,
        }),
    };
});

beforeEach(() => {
    from.mockImplementation(() => ({
        insert,
    }));
});

describe("POST /api/stripe/webhook", () => {
    const originalEnv = { ...process.env };

    afterEach(() => {
        process.env = { ...originalEnv };
        constructEvent.mockReset();
        listLineItems.mockReset();
        insert.mockReset();
        from.mockReset();
    });

    it("stores payment metadata for checkout.session.completed", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";

        constructEvent.mockReturnValue({
            type: "checkout.session.completed",
            data: {
                object: {
                    id: "cs_test_123",
                    customer: "cus_123",
                    customer_details: { email: "buyer@example.com" },
                    amount_total: 1200,
                    currency: "usd",
                    payment_status: "paid",
                    metadata: { price_id: "price_123" },
                },
            },
        });

        listLineItems.mockResolvedValue({
            data: [
                {
                    price: { id: "price_123" },
                    amount_total: 1200,
                    currency: "usd",
                },
            ],
        });

        insert.mockResolvedValue({ error: null });

        const request = new Request("http://localhost/api/stripe/webhook", {
            method: "POST",
            headers: { "stripe-signature": "sig_test" },
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({ data: { received: true }, error: null });
        expect(constructEvent).toHaveBeenCalledWith(
            "{}",
            "sig_test",
            "whsec_test",
        );
        expect(from).toHaveBeenCalledWith("payments");
        expect(insert).toHaveBeenCalledWith(
            expect.objectContaining({
                stripe_session_id: "cs_test_123",
                stripe_customer_id: "cus_123",
                email: "buyer@example.com",
                price_id: "price_123",
                amount: 1200,
                currency: "usd",
                status: "paid",
                created_at: expect.any(String),
            }),
        );
        expect(from).toHaveBeenCalledWith("events");
        expect(insert).toHaveBeenCalledWith(
            expect.objectContaining({
                event_name: "payment_success",
                session_id: "cs_test_123",
                metadata: expect.objectContaining({
                    stripe_session_id: "cs_test_123",
                    amount: 1200,
                    currency: "usd",
                    price_id: "price_123",
                }),
            }),
        );
    });

    it("returns missing_signature when header is absent", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

        const request = new Request("http://localhost/api/stripe/webhook", {
            method: "POST",
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: {
                code: "missing_signature",
                message: "Webhook signature is missing.",
            },
        });
    });

    it("returns invalid_signature when signature verification fails", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";

        constructEvent.mockImplementation(() => {
            throw new Error("invalid signature");
        });

        const request = new Request("http://localhost/api/stripe/webhook", {
            method: "POST",
            headers: { "stripe-signature": "sig_test" },
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(400);
        expect(body).toEqual({
            data: null,
            error: {
                code: "invalid_signature",
                message: "Webhook verification failed.",
            },
        });
        expect(listLineItems).not.toHaveBeenCalled();
        expect(insert).not.toHaveBeenCalled();
    });

    it("treats replayed events as idempotent when storage reports duplicate", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";

        constructEvent.mockReturnValue({
            type: "checkout.session.completed",
            data: {
                object: {
                    id: "cs_test_replay",
                    customer: "cus_456",
                    customer_details: { email: "replay@example.com" },
                    amount_total: 2500,
                    currency: "usd",
                    payment_status: "paid",
                    metadata: { price_id: "price_456" },
                },
            },
        });

        listLineItems.mockResolvedValue({
            data: [
                {
                    price: { id: "price_456" },
                    amount_total: 2500,
                    currency: "usd",
                },
            ],
        });

        insert.mockResolvedValue({ error: { code: "23505" } });

        const request = new Request("http://localhost/api/stripe/webhook", {
            method: "POST",
            headers: { "stripe-signature": "sig_test" },
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const body = await response.json();

        expect(response.status).toBe(200);
        expect(body).toEqual({ data: { received: true }, error: null });
        expect(from).toHaveBeenCalledWith("payments");
        expect(insert).toHaveBeenCalled();
    });

    it("scopes ingestion to payments and events tables", async () => {
        process.env.STRIPE_SECRET_KEY = "sk_test_123";
        process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
        process.env.SUPABASE_URL = "https://supabase.test";
        process.env.SUPABASE_SERVICE_ROLE_KEY = "service_role_key";

        constructEvent.mockReturnValue({
            type: "checkout.session.completed",
            data: {
                object: {
                    id: "cs_test_scope",
                    customer: "cus_scope",
                    customer_details: { email: "buyer@example.com" },
                    amount_total: 1200,
                    currency: "usd",
                    payment_status: "paid",
                    metadata: { price_id: "price_scope" },
                },
            },
        });
        listLineItems.mockResolvedValue({
            data: [
                {
                    price: { id: "price_scope" },
                    amount_total: 1200,
                    currency: "usd",
                },
            ],
        });
        insert.mockResolvedValue({ error: null });

        const request = new Request("http://localhost/api/stripe/webhook", {
            method: "POST",
            headers: { "stripe-signature": "sig_test" },
            body: JSON.stringify({}),
        });

        const response = await POST(request);

        expect(response.status).toBe(200);
        expect(from).toHaveBeenCalledWith("payments");
        expect(from).toHaveBeenCalledWith("events");
        expect(from).not.toHaveBeenCalledWith("user_payment_links");
    });
});
