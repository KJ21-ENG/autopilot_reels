import { NextResponse } from "next/server";

import { ANALYTICS_EVENT_NAMES } from "../../../../lib/analytics";
import { getSupabaseServer } from "../../../../lib/supabase/server";
import { getStripeServer } from "../../../../lib/stripe/server";
import { getDynamicPriceId, getDynamicProductId } from "../../../../lib/stripe/dynamic-plans";

type CheckoutRequest = {
    plan?: string;
    billing?: "monthly" | "yearly";
    source?: string;
};

function buildOrigin(request: Request) {
    const origin = request.headers.get("origin");
    if (origin) {
        return origin;
    }

    const host = request.headers.get("host");
    if (!host) {
        return null;
    }

    const forwardedProto = request.headers.get("x-forwarded-proto");
    const protocol = forwardedProto ?? "https";
    return `${protocol}://${host}`;
}

function resolveBaseUrl(request: Request) {
    const configuredBaseUrl =
        process.env.SITE_URL ?? process.env.NEXT_PUBLIC_SITE_URL;
    const requestOrigin = buildOrigin(request);

    if (configuredBaseUrl) {
        try {
            const configured = new URL(configuredBaseUrl);
            if (requestOrigin) {
                const requested = new URL(requestOrigin);
                if (requested.host !== configured.host) {
                    return { error: "invalid_origin" as const, baseUrl: null };
                }
            }

            return { error: null, baseUrl: configured.origin };
        } catch (error) {
            console.error("Invalid SITE_URL configuration.", error);
            return { error: "invalid_origin" as const, baseUrl: null };
        }
    }

    if (!requestOrigin) {
        return { error: "missing_origin" as const, baseUrl: null };
    }

    if (process.env.NODE_ENV === "production") {
        console.error(
            "SITE_URL is required in production to validate Stripe redirects.",
        );
        return { error: "missing_origin" as const, baseUrl: null };
    }

    return { error: null, baseUrl: requestOrigin };
}

export async function POST(request: Request) {
    let payload: CheckoutRequest = {};
    try {
        payload = await request.json();
    } catch (error) {
        console.warn("Invalid checkout request payload.", error);
    }

    const priceId = await getDynamicPriceId(
        payload.plan ?? "Starter",
        payload.billing ?? "monthly",
    );
    const productId = await getDynamicProductId(payload.plan ?? "Starter");

    if (!priceId || !productId) {
        console.error("Invalid plan configuration.", payload);
        return NextResponse.json(
            {
                data: null,
                error: {
                    code: "invalid_plan",
                    message: "Selected plan is invalid.",
                },
            },
            { status: 400 },
        );
    }

    const { baseUrl, error: originError } = resolveBaseUrl(request);
    if (!baseUrl) {
        const errorCode = originError ?? "missing_origin";
        const message =
            errorCode === "invalid_origin"
                ? "Request origin is not allowed."
                : "Unable to determine redirect URL.";
        console.error(
            "Unable to determine request origin for Stripe redirect URLs.",
        );
        return NextResponse.json(
            { data: null, error: { code: errorCode, message } },
            { status: 400 },
        );
    }

    let stripe: ReturnType<typeof getStripeServer> | null = null;
    try {
        stripe = getStripeServer();
    } catch (error) {
        console.error("Missing Stripe secret key configuration.", error);
        return NextResponse.json(
            {
                data: null,
                error: {
                    code: "missing_env",
                    message: "Stripe configuration is missing.",
                },
            },
            { status: 500 },
        );
    }

    try {
        const supabase = getSupabaseServer();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const session = await stripe.checkout.sessions.create({
            ui_mode: "embedded",
            mode: "subscription",
            allow_promotion_codes: true,
            line_items: [{ price: priceId, quantity: 1 }],
            return_url: `${baseUrl}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
            customer_email: user?.email,
            metadata: {
                plan: payload.plan ?? "default",
                billing: payload.billing ?? "monthly",
                source: payload.source ?? "unknown",
                price_id: priceId,
                product_id: productId,
                ...(user?.id ? { user_id: user.id } : {}),
            },
        });

        // Record checkout_start event
        try {
            // Reuse existing supabase instance
            await supabase.from("events").insert({
                event_name: ANALYTICS_EVENT_NAMES.checkoutStart,
                metadata: {
                    plan: payload.plan ?? "default",
                    billing: payload.billing ?? "monthly",
                    source: payload.source ?? "unknown",
                    price_id: priceId,
                    product_id: productId,
                },
            });
        } catch (eventError) {
            console.warn("Failed to record checkout_start event.", eventError);
        }

        if (process.env.NODE_ENV !== "production") {
            console.info("Stripe checkout session created.", {
                id: session.id,
                metadata: session.metadata,
            });
        }

        return NextResponse.json({
            data: { client_secret: session.client_secret },
            error: null,
        });
    } catch (error) {
        console.error("Stripe checkout session creation failed.", error);
        return NextResponse.json(
            {
                data: null,
                error: {
                    code: "stripe_error",
                    message: "Unable to start checkout right now.",
                },
            },
            { status: 500 },
        );
    }
}
