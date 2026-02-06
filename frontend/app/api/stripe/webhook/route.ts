import Stripe from "stripe";

import { getStripeServer } from "../../../../lib/stripe/server";
import { getSupabaseServer } from "../../../../lib/supabase/server";

const jsonResponse = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: { "content-type": "application/json" },
    });

type PaymentInsert = {
    stripe_session_id: string;
    stripe_customer_id: string | null;
    email: string | null;
    price_id: string;
    amount: number;
    currency: string;
    status: string;
    created_at: string;
};

async function buildPaymentInsert({
    session,
    stripe,
}: {
    session: Stripe.Checkout.Session;
    stripe: Stripe;
}): Promise<{ data: PaymentInsert | null; error: string | null }> {
    const sessionId = session.id;
    const email = session.customer_details?.email ?? session.customer_email ?? null;
    const customerId =
        typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;

    let priceId = session.metadata?.price_id ?? null;
    let amount = session.amount_total ?? null;
    let currency = session.currency ?? null;

    try {
        const lineItems = await stripe.checkout.sessions.listLineItems(sessionId, { limit: 1 });
        const firstItem = lineItems.data[0];
        if (firstItem?.price?.id) {
            priceId = firstItem.price.id;
        }
        if (typeof firstItem?.amount_total === "number") {
            amount = firstItem.amount_total;
        }
        if (firstItem?.currency) {
            currency = firstItem.currency;
        }
    } catch (error) {
        console.warn("Unable to fetch Stripe line items for webhook.", error);
    }

    const status =
        session.payment_status ??
        session.status ??
        (session.metadata?.payment_status as string | undefined) ??
        "unknown";

    if (!sessionId || !priceId || amount === null || !currency) {
        return { data: null, error: "missing_fields" };
    }

    return {
        data: {
            stripe_session_id: sessionId,
            stripe_customer_id: customerId,
            email,
            price_id: priceId,
            amount,
            currency,
            status,
            created_at: new Date().toISOString(),
        },
        error: null,
    };
}

export async function POST(request: Request) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
        console.error("Missing Stripe webhook secret.");
        return jsonResponse(
            { data: null, error: { code: "missing_env", message: "Stripe configuration is missing." } },
            500
        );
    }

    const signature = request.headers.get("stripe-signature");
    if (!signature) {
        return jsonResponse(
            { data: null, error: { code: "missing_signature", message: "Webhook signature is missing." } },
            400
        );
    }

    let stripe: Stripe;
    try {
        stripe = getStripeServer();
    } catch (error) {
        console.error("Missing Stripe secret key configuration.", error);
        return jsonResponse(
            { data: null, error: { code: "missing_env", message: "Stripe configuration is missing." } },
            500
        );
    }

    let event: Stripe.Event;
    try {
        const payload = await request.text();
        event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
        console.error("Stripe webhook signature verification failed.", error);
        return jsonResponse(
            { data: null, error: { code: "invalid_signature", message: "Webhook verification failed." } },
            400
        );
    }

    if (event.type !== "checkout.session.completed") {
        return jsonResponse({ data: { received: true }, error: null });
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const paymentInsert = await buildPaymentInsert({ session, stripe });

    if (!paymentInsert.data) {
        console.warn("Stripe webhook missing required payment metadata.");
        return jsonResponse(
            { data: null, error: { code: "invalid_payload", message: "Payment metadata is incomplete." } },
            400
        );
    }

    let supabase: ReturnType<typeof getSupabaseServer>;
    try {
        supabase = getSupabaseServer();
    } catch (error) {
        console.error("Missing Supabase configuration.", error);
        return jsonResponse(
            { data: null, error: { code: "missing_env", message: "Payment storage is unavailable." } },
            500
        );
    }

    const { error } = await supabase.from("payments").insert(paymentInsert.data);
    if (error) {
        if (error.code === "23505") {
            return jsonResponse({ data: { received: true }, error: null });
        }

        console.error("Failed to persist Stripe payment metadata.", error);
        return jsonResponse(
            { data: null, error: { code: "storage_error", message: "Unable to store payment metadata." } },
            500
        );
    }

    console.info("Stored Stripe payment metadata.", {
        stripe_session_id: paymentInsert.data.stripe_session_id,
        email: paymentInsert.data.email,
    });

    return jsonResponse({ data: { received: true }, error: null });
}
