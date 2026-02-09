import { getStripeServer } from "@/lib/stripe/server";

const jsonResponse = (payload: unknown, status = 200) =>
    new Response(JSON.stringify(payload), {
        status,
        headers: {
            "content-type": "application/json",
            // Cache for 5 minutes to reduce Stripe API calls
            "cache-control": "public, s-maxage=300, stale-while-revalidate=600",
        },
    });

export type StripePlan = {
    id: string;
    name: string;
    description: string | null;
    features: string[];
    highlighted: boolean;
    badge: string | null;
    monthlyPrice: {
        id: string;
        amount: number;
        currency: string;
    } | null;
    yearlyPrice: {
        id: string;
        amount: number;
        currency: string;
    } | null;
};

export type StripeProductsResponse = {
    data: { plans: StripePlan[] } | null;
    error: { code: string; message: string } | null;
};

export async function GET(): Promise<Response> {
    let stripe;
    try {
        stripe = getStripeServer();
    } catch (error) {
        console.error("Missing Stripe configuration.", error);
        return jsonResponse(
            {
                data: null,
                error: {
                    code: "missing_env",
                    message: "Payment configuration is unavailable.",
                },
            },
            500,
        );
    }

    try {
        // Fetch all active products
        const products = await stripe.products.list({
            active: true,
            limit: 10,
        });

        // Fetch all active prices
        const prices = await stripe.prices.list({
            active: true,
            limit: 50,
            expand: ["data.product"],
        });

        // Build a map of product ID to prices
        const pricesByProduct = new Map<
            string,
            { monthly: typeof prices.data[0] | null; yearly: typeof prices.data[0] | null }
        >();

        for (const price of prices.data) {
            const productId =
                typeof price.product === "string"
                    ? price.product
                    : price.product?.id;
            if (!productId || price.type !== "recurring") continue;

            const interval = price.recurring?.interval;
            if (!interval) continue;

            const existing = pricesByProduct.get(productId) || {
                monthly: null,
                yearly: null,
            };

            if (interval === "month") {
                existing.monthly = price;
            } else if (interval === "year") {
                existing.yearly = price;
            }

            pricesByProduct.set(productId, existing);
        }

        // Internal type with sort order
        type InternalPlan = StripePlan & { _sortOrder: number };

        // Build plans array
        const plans: InternalPlan[] = [];

        for (const product of products.data) {
            const productPrices = pricesByProduct.get(product.id);
            if (!productPrices?.monthly && !productPrices?.yearly) continue;

            // Parse features from metadata (comma-separated) or marketing_features
            let features: string[] = [];
            if (product.metadata?.features) {
                features = product.metadata.features
                    .split(",")
                    .map((f) => f.trim())
                    .filter(Boolean);
            } else if (product.marketing_features?.length) {
                features = product.marketing_features
                    .map((f) => f.name)
                    .filter((name): name is string => Boolean(name));
            }

            // Parse highlighted and badge from metadata
            const highlighted = product.metadata?.highlighted === "true";
            const badge = product.metadata?.badge || null;

            // Determine sort order from metadata (default to 999)
            const sortOrder = parseInt(product.metadata?.sort_order || "999", 10);

            plans.push({
                id: product.id,
                name: product.name,
                description: product.description,
                features,
                highlighted,
                badge,
                monthlyPrice: productPrices?.monthly
                    ? {
                        id: productPrices.monthly.id,
                        amount: productPrices.monthly.unit_amount || 0,
                        currency: productPrices.monthly.currency,
                    }
                    : null,
                yearlyPrice: productPrices?.yearly
                    ? {
                        id: productPrices.yearly.id,
                        amount: productPrices.yearly.unit_amount || 0,
                        currency: productPrices.yearly.currency,
                    }
                    : null,
                _sortOrder: sortOrder,
            });
        }

        // Sort by sort_order metadata
        plans.sort((a, b) => a._sortOrder - b._sortOrder);

        // Remove internal sort order from response
        const cleanPlans: StripePlan[] = plans.map(
            ({ _sortOrder, ...plan }) => plan,
        );

        return jsonResponse({ data: { plans: cleanPlans }, error: null });
    } catch (error) {
        console.error("Failed to fetch Stripe products.", error);
        return jsonResponse(
            {
                data: null,
                error: {
                    code: "stripe_error",
                    message: "Unable to load pricing information.",
                },
            },
            500,
        );
    }
}
